import React from "react";
import IncidentCard from "./IncidentCard";

// Impact badge renderer removed (was unused)

// Removed unused renderFiles helper to avoid linter warning.

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
          sortedIncidents
            .slice((currentPage - 1) * visibleCount, currentPage * visibleCount)
            .map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onEdit={handleEdit}
                onDelete={(id) => setConfirmDeleteId(id)}
              />
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
