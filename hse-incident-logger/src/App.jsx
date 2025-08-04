import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem("incidents");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

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
        <input
          type="text"
          placeholder="Type (e.g. Fire, Electrical)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
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

      <ul>
        {incidents.map((incident) => (
          <li key={incident.id} className="incident-card">
            <strong>{incident.title}</strong> – {incident.type}
            <br />
            {incident.description}
            <br />
            <small>{incident.timestamp}</small>
            <br />
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => handleEdit(incident)}>
                ✏️ Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(incident.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
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
