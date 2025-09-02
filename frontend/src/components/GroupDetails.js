import React, { useEffect, useState } from "react";
import UserContributions from "./UserContributions";

function GroupDetails({ group }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [amounts, setAmounts] = useState({});
  const [showUser, setShowUser] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/groups/${group.id}/users`)
      .then(res => res.json())
      .then(data => setUsers(data.users));
    fetch("http://127.0.0.1:5000/dashboard")
      .then(res => res.json())
      .then(data => {
        const found = data.find(d => d.group_id === group.id);
        setTotal(found ? found.total_contributions : 0);
      });
  }, [group]);

  const handleContribute = (userId) => {
    const amount = parseFloat(amounts[userId]);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid positive amount.");
      return;
    }
    fetch(`http://127.0.0.1:5000/groups/${group.id}/users/${userId}/contribute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    })
      .then(res => res.json())
      .then(() => {
        setAmounts({ ...amounts, [userId]: "" });
        // Optionally refresh group details
        fetch(`http://127.0.0.1:5000/groups/${group.id}/users`)
          .then(res => res.json())
          .then(data => setUsers(data.users));
        fetch("http://127.0.0.1:5000/dashboard")
          .then(res => res.json())
          .then(data => {
            const found = data.find(d => d.group_id === group.id);
            setTotal(found ? found.total_contributions : 0);
          });
      });
  };

  return (
    <div style={{
      background: "#f8f9fa",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 2px 8px rgba(44,62,80,0.10)",
      marginBottom: "32px"
    }}>
      <h2 style={{ color: "#2980b9" }}>{group.name} Details</h2>
      <p><strong>Total Group Contributions:</strong> ₦{total.toLocaleString()}</p>
      <h3>Users</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
        <thead>
          <tr style={{ background: "#2980b9", color: "#fff" }}>
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Contribute</th>
            <th style={{ padding: "10px" }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ background: "#fff" }}>
              <td style={{ padding: "10px" }}>{u.name}</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="number"
                  min="1"
                  value={amounts[u.id] || ""}
                  onChange={e => setAmounts({ ...amounts, [u.id]: e.target.value })}
                  style={{
                    padding: "6px",
                    borderRadius: "6px",
                    border: "1px solid #b2bec3",
                    marginRight: "8px",
                    width: "80px"
                  }}
                  placeholder="Amount"
                />
                <button
                  style={{
                    padding: "6px 12px",
                    background: "#27ae60",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                  onClick={() => handleContribute(u.id)}
                >
                  Save
                </button>
              </td>
              <td style={{ padding: "10px" }}>
                <button
                  style={{
                    padding: "6px 12px",
                    background: "#e67e22",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                  onClick={() => setShowUser(u.id)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showUser && (
        <UserContributions userId={showUser} onClose={() => setShowUser(null)} />
      )}
    </div>
  );
}

export default GroupDetails;