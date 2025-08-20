import React from "react";

// Renders the impact badge
const renderImpactBadge = (impact) => {
  if (!impact) return null;
  return (
    <span className={`impact-badge ${impact.toLowerCase()}`}>{impact}</span>
  );
};

// Renders attached files (images / docs)
const renderFiles = (files) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="incident-files">
      {files.map((file, index) =>
        file.type && file.type.startsWith("image/") ? (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt={file.name}
            width="80"
            height="80"
          />
        ) : (
          <p key={index}>{file.name}</p>
        )
      )}
    </div>
  );
};

function IncidentList({
  sortedIncidents,
  search,
  visibleCount,
  handleEdit,
  setConfirmDeleteId,
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="incident-list-container">
      <ul>
        {sortedIncidents.length > 0 ? (
          sortedIncidents.slice(0, visibleCount).map((incident) => (
            <li key={incident.id} className="incident-card">
              {/* Title + Badge */}
              <strong>
                {incident.title}
                {renderImpactBadge(incident.impact)}
              </strong>

              {/* Incident details */}
              <p>{incident.type}</p>
              <p>{incident.description}</p>
              <small>{incident.timestamp}</small>

              {/* Files */}
              {renderFiles(incident.files)}

              {/* Action buttons */}
              <div className="incident-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(incident)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => setConfirmDeleteId(incident.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))
        ) : search.trim() !== "" ? (
          <p className="no-results">No incidents match your search.</p>
        ) : null}
      </ul>

      {/* Pagination */}
      {sortedIncidents.length > 0 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default IncidentList;