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
  // stores currently logged in user
  const [user, setUser] = useState(null);

  // app waits til localStorage check is done
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (saved inbrowser)
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    // if both exist -> user stays logged in after refresh
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // finished check
    setLoading(false);
  }, []);

  // runs after successful login
  const handleLogin = (userData, token) => {
    // save login info in browser storage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // update react state
    setUser(userData);
  };

  // logout button
  const handleLogout = () => {
    // remove saved login
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // user now null -> app redirects to login
    setUser(null);
  };

  // wait till we know if user exists or not
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {/* navbar only visible when logged in */}
        {user && <Navbar user={user} onLogout={handleLogout} />}

        {/* global toast popup messages */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* login page */}
          <Route
            path="/login"
            element={
              !user ? (
                <Login onLogin={handleLogin} />
              ) : (
                // if already logged in redirect to dashboard
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* register page */}
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />

          {/* main dashboard (protected route) */}
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />

          {/* admin panel only for admin role */}
          <Route
            path="/admin"
            element={
              user && user.role === "admin" ? (
                <AdminPanel />
              ) : (
                // non admins redirected
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* default route */}
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
