import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem("incidents");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

    // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Apply theme to document body class
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
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
    };
    setIncidents([...incidents, newIncident]);
    setTitle("");
    setType("");
    setDescription("");
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="container">
      <h3 className="naming">HSE Incident Logger</h3>

       <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>


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
        <button type="submit">Log Incident</button>
      </form>

      <ul>
        {incidents.map((incident) => (
          <li key={incident.id}>
            <strong>{incident.title}</strong> – {incident.type}
            <br />
            {incident.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
