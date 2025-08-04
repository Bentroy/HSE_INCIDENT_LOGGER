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

    if (editingId) {
      const updatedIncidents = incidents.map((incident) =>
        incident.id === editingId
          ? {
              ...incident,
              title,
              type,
              description,
              timestamp: incident.timestamp,
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
      };
      setIncidents([...incidents, newIncident]);
    }

    setTitle("");
    setType("");
    setDescription("");
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


  const filteredIncidents = incidents.filter((incident) =>
  incident.title.toLowerCase().includes(search.toLowerCase()) ||
  incident.type.toLowerCase().includes(search.toLowerCase()) ||
  incident.description.toLowerCase().includes(search.toLowerCase())
);



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

      <ul>
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident) => (
            <li key={incident.id} className="incident-card">
              <strong>{incident.title}</strong> – {incident.type}
              <br />
              {incident.description}
              <br />
              <button className="edit-btn" onClick={() => handleEdit(incident)}>
                ✏️ Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(incident.id)}
              >
                🗑️ Delete
              </button>
            </li>
          ))
        ) : (
          <p className="no-results">No incidents match your search.</p>
        )}
      </ul>

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
