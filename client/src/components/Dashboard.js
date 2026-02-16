import React, { useState, useEffect } from "react";
import CredentialList from "./CredentialList";
import AddCredential from "./AddCredential";
import EditCredential from "./EditCredential";

// main page after login
function Dashboard({ user }) {
  // which division user is currently viewing
  const [selectedDivision, setSelectedDivision] = useState("");

  // controls add credential popup
  const [showAddModal, setShowAddModal] = useState(false);

  // controls edit credential popup
  const [showEditModal, setShowEditModal] = useState(false);

  // stores credential to be able to edit
  const [selectedCredential, setSelectedCredential] = useState(null);

  // Force CredentialList to reload
  const [refreshKey, setRefreshKey] = useState(0);

  // when user loads, auto select first division they belong to
  useEffect(() => {
    if (user.divisions && user.divisions.length > 0) {
      setSelectedDivision(user.divisions[0]._id);
    }
  }, [user]);

  // after successfully adding a credential
  const handleAddSuccess = () => {
    setShowAddModal(false); // close modal
    setRefreshKey((prev) => prev + 1); // triggers refetch in CredentialList
  };

  // after editing a credential
  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedCredential(null);
    setRefreshKey((prev) => prev + 1); // refresh list again
  };

  // user clicks edit button on a credential card
  const handleEditClick = (credential) => {
    setSelectedCredential(credential); // send credential into edit modal
    setShowEditModal(true);
  };

  return (
    <div className="dashboard-container">
      {/* welcome header */}
      <div className="dashboard-header">
        <h1>Welcome, {user.username}!</h1>
        <p>Manage your credentials securely</p>
      </div>

      <div className="dashboard-content">
        {/* if user has at least one division */}
        {user.divisions && user.divisions.length > 0 ? (
          <>
            {/* dropdown to switch divisions */}
            <div className="division-selector">
              <label>Select Division:</label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                {/* load all divisions assigned to the user */}
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

                {/* opens add credential modal */}
                <button
                  className="btn-add"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add Credential
                </button>
              </div>

              {/* shows credentials for selected division */}
              <CredentialList
                divisionId={selectedDivision}
                userRole={user.role}
                onEdit={handleEditClick}
                refreshKey={refreshKey}
              />
            </div>
          </>
        ) : (
          // user has no divisions assigned
          <div className="no-data">
            <p>You are not assigned to any divisions yet.</p>
            <p>Please contact an administrator.</p>
          </div>
        )}
      </div>

      {/* add credential popup */}
      {showAddModal && (
        <AddCredential
          divisionId={selectedDivision}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* edit credential popup (only if something selected) */}
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
