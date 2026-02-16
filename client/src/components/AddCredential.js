import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Popup when user adds a new credential
function AddCredential({ divisionId, onClose, onSuccess }) {
  // storing the input values typed by the user
  const [serviceName, setServiceName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // runs when form submit button is pressed
  const handleSubmit = async (e) => {
    e.preventDefault(); // stops page from refreshing

    try {
      // GET login token saved after user logged in
      const token = localStorage.getItem("token");

      // send data to backend api
      // Creates new credential in database
      await axios.post(
        "http://localhost:5000/api/credentials",
        {
          serviceName,
          username,
          password,
          division: divisionId, // tells backend which division it belongs to
        },
        {
          // token used so server knows which user is making the request
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // popup success message 
      toast.success("Credential added successfully!");

      // refresh the parent list after adding
      onSuccess();
    } catch (error) {
      // if backend returns an error ----> show it
      toast.error(error.response?.data?.message || "Error adding credential");
    }
  };

  return (
    // modal background overlay
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Credential</h3>

          {/* close button (top right X) */}
          <button className="btn-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* form that triggers handleSubmit */}
        <form onSubmit={handleSubmit}>
          {/* service name input */}
          <div className="form-group">
            <label>Service Name</label>
            <input
              type="text"
              value={serviceName} // controlled input
              onChange={(e) => setServiceName(e.target.value)} // updates state when typing
              required
            />
          </div>

          {/* username input */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* password input (currently plain text) */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            {/* cancel just closes modal */}
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>

            {/* submit calls handleSubmit and sends to backend */}
            <button type="submit" className="btn-primary">
              Add Credential
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCredential;
