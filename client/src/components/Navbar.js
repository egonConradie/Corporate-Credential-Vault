import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h2>🛡️ Cool Tech Vault</h2>
      <div className="navbar-right">
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          {user.role === "admin" && <Link to="/admin">Admin Panel</Link>}
        </div>
        <div className="user-info">
          <span>{user.username}</span>
          <span className="user-badge">{user.role}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
