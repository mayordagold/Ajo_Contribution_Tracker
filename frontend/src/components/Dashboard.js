import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:5000";

function Dashboard() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/dashboard`)
      .then(res => setSummary(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{
      marginTop: "40px",
      padding: "24px",
      background: "linear-gradient(135deg, #6dd5fa 0%, #2980b9 100%)",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(44,62,80,0.10)",
      maxWidth: "700px",
      marginLeft: "auto",
      marginRight: "auto"
    }}>
      <h2 style={{ color: "#fff", marginBottom: "24px", textShadow: "0 2px 8px rgba(44,62,80,0.10)" }}>📊 Group Dashboard</h2>
      {loading ? (
        <p style={{ color: "#fff" }}>Loading...</p>
      ) : summary.length === 0 ? (
        <p style={{ color: "#fff" }}>No group data available.</p>
      ) : (
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(44,62,80,0.04)"
        }}>
          <thead style={{ background: "#2980b9", color: "#fff" }}>
            <tr>
              <th style={{ padding: "14px", fontSize: "16px" }}>Group ID</th>
              <th style={{ padding: "14px", fontSize: "16px" }}>Group Name</th>
              <th style={{ padding: "14px", fontSize: "16px" }}>Total Contributions (₦)</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row, idx) => (
              <tr key={row.group_id} style={{ background: idx % 2 === 0 ? "#f4f6f8" : "#fff" }}>
                <td style={{ padding: "12px", textAlign: "center" }}>{row.group_id}</td>
                <td style={{ padding: "12px" }}>{row.group_name}</td>
                <td style={{ padding: "12px", fontWeight: "bold", color: "#27ae60" }}>
                  ₦{row.total_contributions.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
