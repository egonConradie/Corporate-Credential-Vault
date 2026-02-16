import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function CredentialList({ divisionId, userRole, onEdit, refreshKey }) {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredentials();
  }, [divisionId, refreshKey]);

  const fetchCredentials = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/credentials/division/${divisionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCredentials(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching credentials");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading credentials...</div>;
  }

  if (credentials.length === 0) {
    return (
      <div className="no-data">No credentials found for this division.</div>
    );
  }

  return (
    <div className="credentials-grid">
      {credentials.map((credential) => (
        <div key={credential._id} className="credential-card">
          <h4>{credential.serviceName}</h4>
          <div className="credential-info">
            <strong>Username:</strong> {credential.username}
          </div>
          <div className="credential-info">
            <strong>Password:</strong> {credential.password}
          </div>
          <div className="credential-info">
            <strong>Division:</strong> {credential.division?.name}
          </div>
          {(userRole === "management" || userRole === "admin") && (
            <div className="credential-actions">
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
