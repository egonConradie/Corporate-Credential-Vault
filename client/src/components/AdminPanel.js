import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    fetchUsers();
    fetchDivisions();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUsers(response.data);
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  const fetchDivisions = async () => {
    try {
      const token = localStorage.getItem("token");
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

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Error updating role");
    }
  };

  const handleAssignDivision = async (userId, divisionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/admin/users/${userId}/divisions`,
        { divisionId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Division assigned successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error assigning division");
    }
  };

  const handleRemoveDivision = async (userId, divisionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}/divisions/${divisionId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Division removed successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Error removing division");
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

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
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.divisions.map((div) => (
                      <div key={div._id} style={{ marginBottom: "5px" }}>
                        {div.name}
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
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignDivision(user._id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      style={{ marginTop: "5px" }}
                    >
                      <option value="">Add Division...</option>
                      {divisions.map((div) => (
                        <option key={div._id} value={div._id}>
                          {div.name}
                        </option>
                      ))}
                    </select>
                  </td>
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
              {divisions.map((division) => (
                <tr key={division._id}>
                  <td>{division.name}</td>
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
