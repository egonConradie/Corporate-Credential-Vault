import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function EditCredential({ credential, onClose, onSuccess }) {
  const [serviceName, setServiceName] = useState(credential.serviceName);
  const [username, setUsername] = useState(credential.username);
  const [password, setPassword] = useState(credential.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/credentials/${credential._id}`,
        {
          serviceName,
          username,
          password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Credential updated successfully!");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating credential");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Credential</h3>
          <button className="btn-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Service Name</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Credential
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCredential;
