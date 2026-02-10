import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Backend endpoint base URL
const API_URL = "http://localhost:5000/api";

// --- COMPONENTS ---

// 1. Login Component
function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST user credentials to the login endpoint
      const res = await axios.post(`${API_URL}/login`, { username, password });

      // Save the returned JWT to local storage for persistence
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      alert("Login Successful!");
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div
      className="main-content"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={{ width: "100%" }}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. Dashboard Component
function Dashboard({ token }) {
  const [divisions, setDivisions] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [newCred, setNewCred] = useState({
    platformName: "",
    username: "",
    password: "",
  });

  // Decode the token to check the user's current role (normal, management, or admin)
  const userRole = jwtDecode(token).role;

  useEffect(() => {
    // Get all divisions from DB on component mount
    axios
      .get(`${API_URL}/divisions`, {
        headers: { Authorization: `Bearer ${token}` }, // Send JWT in header for auth
      })
      .then((res) => setDivisions(res.data));
  }, [token]);

  const loadCredentials = (divId) => {
    setSelectedDiv(divId);
    // Fetch specific credentials associated with the chosen division
    axios
      .get(`${API_URL}/credentials/${divId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCredentials(res.data))
      .catch(() => alert("Access Denied to this Division"));
  };

  const addCredential = async () => {
    // POST request to add a new set of login info to a specific repo
    await axios.post(
      `${API_URL}/credentials`,
      { ...newCred, divisionId: selectedDiv },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    loadCredentials(selectedDiv); // Re-fetch list to show the new entry
    setNewCred({ platformName: "", username: "", password: "" }); // Clear the form
    alert("Credential Added");
  };

  return (
    <div className="main-content">
      <div className="card">
        <h2>
          Dashboard{" "}
          <span
            style={{
              fontSize: "0.6em",
              color: "#6b7280",
              fontWeight: "normal",
            }}
          >
            ({userRole})
          </span>
        </h2>

        <h3>Select a Division:</h3>
        <div className="division-grid">
          {divisions.map((div) => (
            <button
              key={div._id}
              onClick={() => loadCredentials(div._id)}
              className={selectedDiv === div._id ? "" : "secondary"}
            >
              {div.ou} - {div.name}
            </button>
          ))}
        </div>
      </div>

      {selectedDiv && (
        <div className="card">
          <h3>Credentials Repository</h3>
          <div style={{ marginBottom: "2rem" }}>
            {credentials.map((cred) => (
              <div key={cred._id} className="credential-item">
                <div className="credential-details">
                  <strong>{cred.platformName}</strong>
                  <span>User: {cred.username}</span>
                  <span>Pass: {cred.password}</span>
                </div>
                {/* Task 2: Conditionally render Edit button only for management/admin roles */}
                {(userRole === "management" || userRole === "admin") && (
                  <button
                    className="secondary"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                    onClick={() => alert("Edit feature would open modal here")}
                  >
                    Edit
                  </button>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#f9fafb",
              padding: "1.5rem",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ marginTop: 0 }}>Add New Credential</h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr auto",
                gap: "10px",
              }}
            >
              {/* Updating state using the spread operator to preserve other field values */}
              <input
                placeholder="Platform"
                value={newCred.platformName}
                onChange={(e) =>
                  setNewCred({ ...newCred, platformName: e.target.value })
                }
                style={{ marginBottom: 0 }}
              />
              <input
                placeholder="Username"
                value={newCred.username}
                onChange={(e) =>
                  setNewCred({ ...newCred, username: e.target.value })
                }
                style={{ marginBottom: 0 }}
              />
              <input
                placeholder="Password"
                value={newCred.password}
                onChange={(e) =>
                  setNewCred({ ...newCred, password: e.target.value })
                }
                style={{ marginBottom: 0 }}
              />
              <button onClick={addCredential}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Admin Component
function AdminPanel({ token }) {
  const [username, setUsername] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [role, setRole] = useState("normal");
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/divisions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDivisions(res.data));
  }, [token]);

  const assignUser = () => {
    // Admin function to link a user to a specific division ID in the DB
    axios
      .post(
        `${API_URL}/assign`,
        { username, divisionId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => alert("User Assigned!"));
  };

  const changeRole = () => {
    // Admin function to update user permissions (PUT request to update existing record)
    axios
      .put(
        `${API_URL}/role`,
        { username, newRole: role },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => alert("Role Updated!"));
  };

  return (
    <div className="main-content">
      <div className="card" style={{ borderTop: "4px solid #4f46e5" }}>
        <h2>Admin Panel</h2>

        <div className="admin-controls-grid">
          <div>
            <h4>Assign User to Division</h4>
            <input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <select onChange={(e) => setDivisionId(e.target.value)}>
              <option>Select Division</option>
              {divisions.map((div) => (
                <option key={div._id} value={div._id}>
                  {div.name}
                </option>
              ))}
            </select>
            <button onClick={assignUser} style={{ width: "100%" }}>
              Assign
            </button>
          </div>

          <div>
            <h4>Change User Role</h4>
            <input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <select onChange={(e) => setRole(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="management">Management</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={changeRole} style={{ width: "100%" }}>
              Update Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP ---
function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = () => {
    // Remove session data and reset state to trigger redirect to Login
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="nav-bar">
          <div
            style={{ fontWeight: "800", fontSize: "1.4rem", color: "#111827" }}
          >
            CoolTech<span style={{ color: "#4f46e5" }}>.Auth</span>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            {/* Short-circuit evaluation: only show Logout if token exists */}
            {token && (
              <button
                onClick={logout}
                className="secondary"
                style={{ marginLeft: "1.5rem", padding: "0.5rem 1rem" }}
              >
                Logout
              </button>
            )}
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              // Routing logic: if no token, stay at login. Otherwise, go to dashboard.
              !token ? (
                <Login setToken={setToken} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              token ? (
                <>
                  <Dashboard token={token} />
                  {/* Task 3: Only mount the AdminPanel if the decoded JWT role is 'admin' */}
                  {jwtDecode(token).role === "admin" && (
                    <AdminPanel token={token} />
                  )}
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
