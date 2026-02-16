import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AdminPanel() {
  // store all users from database
  const [users, setUsers] = useState([]);

  // store all divisions
  const [divisions, setDivisions] = useState([]);

  // which tab is open (users orr divisins)
  const [activeTab, setActiveTab] = useState("users");

  // runs once when page loads
  useEffect(() => {
    fetchUsers(); // get all users
    fetchDivisions(); // get all divisions
  }, []);

  // gets all users from backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      // api call to admin users route
      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // saves users into state so table updates
      setUsers(response.data);
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  // gets divisions from backend
  const fetchDivisions = async () => {
    try {
      const token = localStorage.getItem("token");

      // request divisions list
      const response = await axios.get(
        "http://localhost:5000/api/admin/divisions",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setDivisions(response.data);
    } catch (error) {
      toast.error("Error fetching divisions");
    }
  };

  // admin changes a user's role (normal -> admin ....)
  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");

      // PUT request updates role on server
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Role updated successfully");

      // reload users so UI refreshes
      fetchUsers();
    } catch (error) {
      toast.error("Error updating role");
    }
  };

  // assign a division to a user
  const handleAssignDivision = async (userId, divisionId) => {
    try {
      const token = localStorage.getItem("token");

      // creates relationship user <----> division
      await axios.post(
        `http://localhost:5000/api/admin/users/${userId}/divisions`,
        { divisionId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Division assigned successfully");

      // reload users so new division shows
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error assigning division");
    }
  };

  // remove a user from a division
  const handleRemoveDivision = async (userId, divisionId) => {
    try {
      const token = localStorage.getItem("token");

      // delete relation in backend
      await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}/divisions/${divisionId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Division removed successfully");

      // refresh list again
      fetchUsers();
    } catch (error) {
      toast.error("Error removing division");
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {/* buttons to switch between tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`tab-btn ${activeTab === "divisions" ? "active" : ""}`}
          onClick={() => setActiveTab("divisions")}
        >
          Divisions
        </button>
      </div>

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Divisions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* loop through users and build rows */}
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>

                  {/* shows role badge styling */}
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* divisions assigned to user */}
                  <td>
                    {user.divisions.map((div) => (
                      <div key={div._id} style={{ marginBottom: "5px" }}>
                        {div.name}

                        {/* remove division button */}
                        <button
                          className="btn-danger"
                          style={{
                            marginLeft: "10px",
                            padding: "2px 8px",
                            fontSize: "0.8rem",
                          }}
                          onClick={() =>
                            handleRemoveDivision(user._id, div._id)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {/* dropdown to add new division */}
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignDivision(user._id, e.target.value);
                          e.target.value = ""; // reset dropdown
                        }
                      }}
                      style={{ marginTop: "5px" }}
                    >
                      <option value="">Add Division...</option>

                      {/* list all divisions */}
                      {divisions.map((div) => (
                        <option key={div._id} value={div._id}>
                          {div.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* role changer dropdown */}
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option value="normal">Normal</option>
                      <option value="management">Management</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DIVISIONS TAB */}
      {activeTab === "divisions" && (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Division Name</th>
                <th>Organizational Unit</th>
              </tr>
            </thead>
            <tbody>
              {/* list all divisions */}
              {divisions.map((division) => (
                <tr key={division._id}>
                  <td>{division.name}</td>

                  {/* optional chaining in case no OU exists */}
                  <td>{division.ou?.name || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
