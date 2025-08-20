// src/components/IncidentCard.jsx
import React from "react";

function IncidentCard({ incident, onEdit, onDelete }) {
  return (
    <li className="incident-card">
      <strong>
        {incident.title}
        {incident.impact && (
          <span className={`impact-badge ${incident.impact.toLowerCase()}`}>
            {incident.impact}
          </span>
        )}
      </strong>

      <div>{incident.type}</div>
      <div>{incident.description}</div>
      <small>{incident.timestamp}</small>

      {incident.files && incident.files.length > 0 && (
        <div className="incident-files">
          {incident.files.map((file, index) =>
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
      )}

      <button className="edit-btn" onClick={() => onEdit(incident)}>
        ✏️ Edit
      </button>
      <button className="delete-btn" onClick={() => onDelete(incident.id)}>
        🗑️ Delete
      </button>
    </li>
  );
}

export default IncidentCard;
