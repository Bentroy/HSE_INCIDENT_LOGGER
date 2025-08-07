import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem("incidents");
    return saved ? JSON.parse(saved) : [];
  });

  // Form state management
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectFocused, setSelectFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Theme management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("incidents", JSON.stringify(incidents));
  }, [incidents]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const fileArray = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    if (editingId) {
      const updatedIncidents = incidents.map((incident) =>
        incident.id === editingId
          ? {
              ...incident,
              title,
              type,
              description,
              timestamp: incident.timestamp,
              files: fileArray,
            }
          : incident
      );
      setIncidents(updatedIncidents);
      setEditingId(null);
    } else {
      const newIncident = {
        id: Date.now(),
        title,
        type,
        description,
        timestamp: new Date().toLocaleString(),
        files: fileArray,
      };
      setIncidents([...incidents, newIncident]);
    }

    // Reset form
    setTitle("");
    setType("");
    setDescription("");
    setFiles([]);
  };

  const handleEdit = (incident) => {
    setEditingId(incident.id);
    setTitle(incident.title);
    setType(incident.type);
    setDescription(incident.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setType("");
    setDescription("");
  };

  const handleDelete = (id) => {
    const updated = incidents.filter((incident) => incident.id !== id);
    setIncidents(updated);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.type.toLowerCase().includes(search.toLowerCase()) ||
      incident.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // store as array
  };

  // Export to CSV function

  const exportToCSV = () => {
  if (incidents.length === 0) {
    alert("No incidents to export.");
    return;
  }

  const csvRows = [
    ["Title", "Type", "Description", "Date", "Files"]
  ];

  incidents.forEach((incident) => {
    const files = incident.files?.map((file) => file.name).join(", ") || "";
    csvRows.push([
      `"${incident.title}"`,
      `"${incident.type}"`,
      `"${incident.description}"`,
      `"${incident.timestamp}"`,
      `"${files}"`
    ]);
  });

  const csvContent = csvRows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "incidents.csv";
  link.click();

  URL.revokeObjectURL(url);
};


  return (
    <div className="container">
      <h3 className="naming">HSE Incident Logger</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Incident Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="dropdown-container">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            onFocus={() => setSelectFocused(true)}
            onBlur={() => setSelectFocused(false)}
            required
          >
            <option value="">Select Type</option>
            <option value="Fire">Fire</option>
            <option value="Electrical">Electrical</option>
            <option value="Injury">Injury</option>
            <option value="Spill">Spill</option>
            <option value="Other">Other</option>
          </select>
          <span className={`dropdown-icon ${selectFocused ? "flipped" : ""}`}>
            ▼
          </span>
        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <input type="file" multiple onChange={handleFileChange} />

        {/* Preview selected files */}
        <div className="file-preview">
          {files.length > 0 &&
            files.map((file, index) => (
              <div key={index} className="file-item">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width="80"
                    height="80"
                  />
                ) : (
                  <p>{file.name}</p>
                )}
              </div>
            ))}
        </div>

        <button type="submit">
          {editingId ? "💾 Save Changes" : "Log Incident"}
        </button>
        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancelEdit}
          >
            ❌ Cancel
          </button>
        )}
      </form>


      <div className="filter-container">
        <label htmlFor="filter">Filter by Type:</label>
        <select
          id="filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All</option>
          {[...new Set(incidents.map((i) => i.type))].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search incidents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      
      <button onClick={exportToCSV} className="export-btn">
        📤 Export CSV
      </button>

      <ul>
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident) => (
            <li key={incident.id} className="incident-card">
              <strong>{incident.title}</strong> – {incident.type}
              <br />
              {incident.description}
              <br />
              <small>{incident.timestamp}</small>
              <br />
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
              <button className="edit-btn" onClick={() => handleEdit(incident)}>
                ✏️ Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => setConfirmDeleteId(incident.id)}
              >
                🗑️ Delete
              </button>
            </li>
          ))
        ) : search.trim() !== "" ? (
          <p className="no-results">No incidents match your search.</p>
        ) : null}
      </ul>

      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this incident?</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={() => {
                  handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2025 HSE Logger</p>
        <button onClick={toggleTheme} className="theme-toggle">
          <span className="icon-wrapper" aria-hidden="true">
            {theme === "light" ? "🌙" : "☀️"}
          </span>
          {theme === "light" ? " Dark Mode" : " Light Mode"}
        </button>
      </footer>
    </div>
  );
}

export default App;
