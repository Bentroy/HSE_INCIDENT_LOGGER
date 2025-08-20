import { useState, useEffect } from "react";
import "./App.css";
import { useRef } from "react";

function App() {
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem("incidents");
    return saved ? JSON.parse(saved) : [];
  });

  // Form state management
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [impact, setImpact] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const incidentsPerPage = 2; // you can change to 2, 10, etc.

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
              impact,
            }
          : incident
      );
      setIncidents(updatedIncidents);
      setEditingId(null);
      showToast("Incident updated successfully!");
    } else {
      const newIncident = {
        id: Date.now(),
        title,
        type,
        description,
        timestamp: new Date().toLocaleString(),
        files: fileArray,
        impact,
      };
      setIncidents([...incidents, newIncident]);
      showToast("Incident logged successfully!");
    }

    // Reset form
    setTitle("");
    setType("");
    setDescription("");
    setFiles([]);
    setImpact("");

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleEdit = (incident) => {
    setEditingId(incident.id);
    setTitle(incident.title);
    setType(incident.type);
    setDescription(incident.description);
    setImpact(incident.impact);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setType("");
    setDescription("");
    setImpact("");
  };

  const handleDelete = (id) => {
    const updated = incidents.filter((incident) => incident.id !== id);
    setIncidents(updated);
    showToast("Incident deleted successfully!");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const showToast = (message, duration = 3000) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  // Apply search filter
  const searchedIncidents = incidents.filter(
    (incident) =>
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.type.toLowerCase().includes(search.toLowerCase()) ||
      incident.description.toLowerCase().includes(search.toLowerCase())
  );

  // Apply type filter
  const filteredIncidents =
    filterType === "All"
      ? searchedIncidents
      : searchedIncidents.filter((incident) => incident.type === filterType);

  // Apply sorting
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    if (sortOption === "oldest") {
      return new Date(a.timestamp) - new Date(b.timestamp);
    }
    if (sortOption === "typeAsc") {
      return a.type.localeCompare(b.type);
    }
    if (sortOption === "typeDesc") {
      return b.type.localeCompare(a.type);
    }
    return 0;
  });

  //pagnation
  const indexOfLastIncident = currentPage * incidentsPerPage;
  const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
  const currentIncidents = sortedIncidents.slice(
    indexOfFirstIncident,
    indexOfLastIncident
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

    const csvRows = [["Title", "Type", "Description", "Date", "Files"]];

    incidents.forEach((incident) => {
      const files = incident.files?.map((file) => file.name).join(", ") || "";
      csvRows.push([
        `"${incident.title}"`,
        `"${incident.type}"`,
        `"${incident.description}"`,
        `"${incident.timestamp}"`,
        `"${files}"`,
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
      {toast && <div className="toast">{toast}</div>}
      <h1 className="title">
        HSE Incident Logger <span className="beta-badge">Beta</span>
      </h1>

      <form onSubmit={handleSubmit}>
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
          <option value="Electrical">Electrical</option>
          <option value="Injury">Injury</option>
          <option value="Spill">Spill</option>
          <option value="Other">Other</option>
        </select>

        <select value={impact} onChange={(e) => setImpact(e.target.value)}>
          <option value="">Select Impact</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        <div className="file-preview">
          {files.length > 0 &&
            files.map((file, index) => (
              <div key={index} className="file-item">
                {/* Show image preview if file is an image, otherwise show file name */}
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

        {/* Submit and Cancel buttons */}
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
      <div className="controls-row">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">Filter: All</option>
          {[...new Set(incidents.map((i) => i.type))].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="typeAsc">Sort: Type (A–Z)</option>
          <option value="typeDesc">Sort: Type (Z–A)</option>
        </select>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* === Incident Stats Summary === */}
      <div className="stats-container">
        <div className="stat-card high">
          <h3>High Impact</h3>
          <p>{sortedIncidents.filter((i) => i.impact === "High").length}</p>
        </div>
        <div className="stat-card medium">
          <h3>Medium Impact</h3>
          <p>{sortedIncidents.filter((i) => i.impact === "Medium").length}</p>
        </div>
        <div className="stat-card low">
          <h3>Low Impact</h3>
          <p>{sortedIncidents.filter((i) => i.impact === "Low").length}</p>
        </div>
                <div className="stat-card">
          <h3>Total</h3>
          <p>{sortedIncidents.length}</p>
        </div>
      </div>

      <ul>
        {sortedIncidents.length > 0 ? (
          currentIncidents.map((incident) => (
            <li key={incident.id} className="incident-card">
              <strong>
                {incident.title} — {incident.type}
                {incident.impact && (
                  <span
                    className={`impact-badge ${incident.impact.toLowerCase()}`}
                  >
                    {incident.impact}
                  </span>
                )}
              </strong>
              <br />
              x``
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

      {sortedIncidents.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of{" "}
            {Math.ceil(sortedIncidents.length / incidentsPerPage)}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(sortedIncidents.length / incidentsPerPage)
                )
              )
            }
            disabled={
              currentPage ===
              Math.ceil(sortedIncidents.length / incidentsPerPage)
            }
          >
            Next
          </button>
        </div>
      )}

      {/* Export Button Below List */}
      <div className="export-container">
        <button onClick={exportToCSV} className="export-btn small">
          📤 Export CSV
        </button>
      </div>
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
