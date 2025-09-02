import React, { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import GroupList from "./components/GroupList";
import GroupDetails from "./components/GroupDetails";

const API = "http://127.0.0.1:5000";

function App() {
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    axios.get(`${API}/groups`).then((res) => setGroups(res.data));
  }, []);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !groupId) {
      alert("Please enter a user name and select a group.");
      return;
    }
    await axios.post(`${API}/users`, { name: userName, group_id: groupId });
    alert(`User created: ${userName}`);
    setUserName("");
    setGroupId(null);
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    if (!groupName) return;
    await fetch(`${API}/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: groupName })
    });
    setGroupName("");
    // Optionally refresh group list (can be handled in GroupList)
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
      padding: "40px 0"
    }}>
      <div style={{
        padding: "32px",
        maxWidth: "800px",
        margin: "auto",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(44,62,80,0.08)"
      }}>
        <h1 style={{ textAlign: "center", color: "#2c3e50", marginBottom: "32px" }}>
          Ajo Contribution Tracker
        </h1>

        {/* Create Group Input at the Top */}
        <form onSubmit={handleGroupSubmit} style={{
          marginBottom: "32px",
          background: "#f4f6f8",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 1px 4px rgba(44,62,80,0.04)",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <label htmlFor="groupName" style={{ fontWeight: "bold", color: "#2980b9" }}>
            Create Group:
          </label>
          <input
            id="groupName"
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #b2bec3",
              width: "60%"
            }}
          />
          <button type="submit" style={{
            padding: "10px 20px",
            background: "linear-gradient(90deg, #27ae60 0%, #6dd5fa 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(44,62,80,0.07)"
          }}>
            Add Group
          </button>
        </form>

        {/* User Form with Group Dropdown */}
        <form onSubmit={handleUserSubmit} style={{
          marginBottom: "24px",
          background: "#f4f6f8",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 1px 4px rgba(44,62,80,0.04)"
        }}>
          <h3 style={{ color: "#2980b9" }}>Create User</h3>
          <input
            type="text"
            placeholder="Enter user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #b2bec3",
              marginRight: "10px",
              width: "60%"
            }}
          />
          <select
            value={groupId || ""}
            onChange={(e) => setGroupId(Number(e.target.value))}
            required
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #b2bec3",
              marginRight: "10px",
              width: "30%"
            }}
          >
            <option value="" disabled>Select Group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <button type="submit" style={{
            padding: "10px 20px",
            background: "linear-gradient(90deg, #2980b9 0%, #6dd5fa 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(44,62,80,0.07)"
          }}>
            Add User
          </button>
        </form>

        {/* Group List and Details */}
        <GroupList onSelect={setSelectedGroup} />
        {selectedGroup && <GroupDetails group={selectedGroup} />}

        {/* Dashboard */}
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
