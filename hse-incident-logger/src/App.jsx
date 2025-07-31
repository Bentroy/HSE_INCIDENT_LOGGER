import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  // Load incidents from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("incidents");
    if (stored) {
      setIncidents(JSON.parse(stored));
    }
  }, []);

  // Save incidents to localStorage when list changes
  useEffect(() => {
    localStorage.setItem("incidents", JSON.stringify(incidents));
  }, [incidents]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIncident = { title, type, description };
    setIncidents([...incidents, newIncident]);
    setTitle("");
    setType("");
    setDescription("");
  };

  return (
    <div className="container">
      <h1>HSE Incident Logger</h1>
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
          placeholder="Type (e.g. Fire, Slip)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <textarea
          placeholder="Incident Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Log Incident</button>
      </form>

      <h2>Logged Incidents</h2>
      <ul>
        {incidents.map((item, index) => (
          <li key={index}>
            <strong>{item.title}</strong> ({item.type})<br />
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
