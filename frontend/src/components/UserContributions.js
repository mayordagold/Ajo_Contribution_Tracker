import React, { useEffect, useState } from "react";

function UserContributions({ userId, onClose }) {
  const [contributions, setContributions] = useState([]);
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/users/${userId}/contributions`)
      .then(res => res.json())
      .then(setContributions);
  }, [userId]);
  return (
    <div style={{
      background: "#fff",
      border: "2px solid #2980b9",
      borderRadius: "12px",
      padding: "16px",
      marginTop: "16px",
      boxShadow: "0 2px 8px rgba(44,62,80,0.10)"
    }}>
      <h4>User Contributions</h4>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#2980b9", color: "#fff" }}>
            <th style={{ padding: "8px" }}>S/N</th>
            <th style={{ padding: "8px" }}>Amount</th>
            <th style={{ padding: "8px" }}>Group</th>
            <th style={{ padding: "8px" }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {contributions.map((c, idx) => (
            <tr key={c.id}>
              <td style={{ padding: "8px" }}>{idx + 1}</td>
              <td style={{ padding: "8px" }}>₦{c.amount}</td>
              <td style={{ padding: "8px" }}>{c.group_name}</td>
              <td style={{ padding: "8px" }}>{c.timestamp ? c.timestamp : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        style={{
          marginTop: "12px",
          padding: "6px 12px",
          background: "#c0392b",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}

export default UserContributions;