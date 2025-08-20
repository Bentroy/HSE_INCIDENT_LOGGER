import React from "react";

function SummaryCard({ incidents }) {
  // Calculate stats
  const total = incidents.length;
  const high = incidents.filter((i) => i.impact === "High").length;
  const medium = incidents.filter((i) => i.impact === "Medium").length;
  const low = incidents.filter((i) => i.impact === "Low").length;

  return (
   <div className="stats-container">
        <div className="stat-card high">
          <h3>High Impact</h3>
          <p>{high}</p>
        </div>
        <div className="stat-card medium">
          <h3>Medium Impact</h3>
          <p>{medium}</p>
        </div>
        <div className="stat-card low">
          <h3>Low Impact</h3>
          <p>{low}</p>
        </div>
        <div className="stat-card">
          <h3>Total</h3>
          <p>{total}</p>
        </div>
      </div>
  );
}

export default SummaryCard;
