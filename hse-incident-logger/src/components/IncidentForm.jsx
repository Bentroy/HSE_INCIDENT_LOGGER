import React from "react";

const IncidentForm = ({
  title,
  setTitle,
  type,
  setType,
  description,
  setDescription,
  impact,
  setImpact,
  setFiles,
  handleSubmit,
  editingId,
  handleCancelEdit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="incident-form">
      <input
        type="text"
        placeholder="Incident Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="">Select Type</option>
        <option value="Fire">Fire</option>
        <option value="Accident">Slips</option>
        <option value="Electrical">Electrical</option>
        <option value="Injury">Injury/Medical</option>
        <option value="Other">Other</option>
      </select>

      <select
        value={impact}
        onChange={(e) => setImpact(e.target.value)}
        required
      >
        <option value="">Select Impact</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <textarea
        className="analysis"
        placeholder="Potential Root Cause Analysis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

        <textarea
        className="Location"
        placeholder="Location"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <textarea
        placeholder="Brief description of incident"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />

      {/* Submit and Cancel buttons */}
      <button type="submit">
        {editingId ? "💾 Save Changes" : "Log Incident"}
      </button>
      {editingId && (
        <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
          ❌ Cancel
        </button>
      )}
    </form>
  );
};

export default IncidentForm;
