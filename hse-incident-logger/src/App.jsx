import { useState, useEffect} from "react";
import "./App.css";
import IncidentForm from "./components/IncidentForm";
import IncidentList from "./components/IncidentList";
import SummaryCard from "./components/SummaryCard";
import Login from "./components/Login";
import Auth from "./components/Auth";

function App() {
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem("incidents");
    return saved ? JSON.parse(saved) : [];
  });

  // Form state management
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
  const [currentUser, setCurrentUser] = useState(null);

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

    const newIncident = {
      id: Date.now(),
      title,
      type,
      description,
      impact,
      files,
      loggedBy: currentUser.username, // ✅ track who logged it
      timestamp: new Date().toISOString(),
    };

    setIncidents((prev) => [...prev, newIncident]);

    // reset fields
    setTitle("");
    setType("");
    setDescription("");
    setImpact("");
    setFiles([]);
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

  // pagination helpers used by IncidentList
  const totalPages = Math.ceil(sortedIncidents.length / incidentsPerPage);
  const visibleCount = currentIncidents.length;

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

  // Check if user is logged in
  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className="container">
      {currentUser ? (
        <div>
          {toast && <div className="toast">{toast}</div>}
          <h1 className="title">
            HSE Incident Log <span className="beta-badge">Beta</span>
          </h1>

          {/* Incident Form */}
          <IncidentForm
            title={title}
            setTitle={setTitle}
            type={type}
            setType={setType}
            description={description}
            setDescription={setDescription}
            impact={impact}
            setImpact={setImpact}
            setFiles={setFiles}
            handleSubmit={handleSubmit}
            editingId={editingId}
            handleCancelEdit={handleCancelEdit}
            currentUser={currentUser} // ✅ new prop (not yet used in form)
          />

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

          {/* Admin-only summary */}
          {currentUser.role === "admin" && (
            <SummaryCard incidents={sortedIncidents} />
          )}

          {/* Incident List */}
          <IncidentList
            incidents={
              currentUser.role === "admin"
                ? sortedIncidents
                : sortedIncidents.filter(
                    (incident) => incident.loggedBy === currentUser.username
                  )
            }
            sortedIncidents={sortedIncidents}
            search={search}
            visibleCount={visibleCount}
            handleEdit={handleEdit}
            setConfirmDeleteId={setConfirmDeleteId}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

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

          {/* Logout button */}
          <button onClick={() => setCurrentUser(null)}>Logout</button>
        </div>
      ) : (
        <Auth onLogin={setCurrentUser} />
      )}
    </div>
  );
}

export default App;
