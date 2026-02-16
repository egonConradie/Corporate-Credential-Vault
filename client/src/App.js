import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin"
            element={
              user && user.role === "admin" ? (
                <AdminPanel />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
