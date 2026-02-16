import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// shows all credentials inside a specific division
function CredentialList({ divisionId, userRole, onEdit, refreshKey }) {
  // stores credentials coming from backend
  const [credentials, setCredentials] = useState([]);

  // used so page shows loading first
  const [loading, setLoading] = useState(true);

  // runs when division changes orr after addding/editing (refreshKey changes)
  useEffect(() => {
    fetchCredentials();
  }, [divisionId, refreshKey]);

  // getss credentials for that division
  const fetchCredentials = async () => {
    try {
      const token = localStorage.getItem("token");

      // api request -----> backend returns all credentials linked to division
      const response = await axios.get(
        `http://localhost:5000/api/credentials/division/${divisionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // save into state so cards render
      setCredentials(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching credentials");
      setLoading(false);
    }
  };

  // while data still loading
  if (loading) {
    return <div>Loading credentials...</div>;
  }

  // if there are none in database
  if (credentials.length === 0) {
    return (
      <div className="no-data">No credentials found for this division.</div>
    );
  }

  return (
    <div className="credentials-grid">
      {/* loop through credentials and build cards */}
      {credentials.map((credential) => (
        <div key={credential._id} className="credential-card">
          {/* service name title */}
          <h4>{credential.serviceName}</h4>

          <div className="credential-info">
            <strong>Username:</strong> {credential.username}
          </div>

          {/* NOTE: password is shown plain text (////not encrypted on UI) */}
          <div className="credential-info">
            <strong>Password:</strong> {credential.password}
          </div>

          {/* optional chaining in case division missing */}
          <div className="credential-info">
            <strong>Division:</strong> {credential.division?.name}
          </div>

          {/* only management/admin can edit */}
          {(userRole === "management" || userRole === "admin") && (
            <div className="credential-actions">
              {/* calls parent edit modal and sends credential object */}
              <button className="btn-edit" onClick={() => onEdit(credential)}>
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CredentialList;
