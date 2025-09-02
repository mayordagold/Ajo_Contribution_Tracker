import React, { useEffect, useState } from "react";

function GroupList({ onSelect }) {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:5000/groups")
      .then(res => res.json())
      .then(setGroups);
  }, []);
  return (
    <div style={{ marginBottom: "32px" }}>
      <h2>Groups</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {groups.map(g => (
          <li key={g.id} style={{ marginBottom: "10px" }}>
            <button
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                background: "#2980b9",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => onSelect(g)}
            >
              {g.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupList;