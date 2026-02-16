import React, { useState, useEffect } from "react";
import CredentialList from "./CredentialList";
import AddCredential from "./AddCredential";
import EditCredential from "./EditCredential";

function Dashboard({ user }) {
  const [selectedDivision, setSelectedDivision] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (user.divisions && user.divisions.length > 0) {
      setSelectedDivision(user.divisions[0]._id);
    }
  }, [user]);

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedCredential(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditClick = (credential) => {
    setSelectedCredential(credential);
    setShowEditModal(true);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.username}!</h1>
        <p>Manage your credentials securely</p>
      </div>

      <div className="dashboard-content">
        {user.divisions && user.divisions.length > 0 ? (
          <>
            <div className="division-selector">
              <label>Select Division:</label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                {user.divisions.map((division) => (
                  <option key={division._id} value={division._id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="credentials-section">
              <div className="section-header">
                <h3>Credentials</h3>
                <button
                  className="btn-add"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add Credential
                </button>
              </div>

              <CredentialList
                divisionId={selectedDivision}
                userRole={user.role}
                onEdit={handleEditClick}
                refreshKey={refreshKey}
              />
            </div>
          </>
        ) : (
          <div className="no-data">
            <p>You are not assigned to any divisions yet.</p>
            <p>Please contact an administrator.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddCredential
          divisionId={selectedDivision}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {showEditModal && selectedCredential && (
        <EditCredential
          credential={selectedCredential}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCredential(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

export default Dashboard;
