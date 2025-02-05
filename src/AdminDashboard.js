import { useState, useEffect } from "react";

function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const res = await fetch("http://localhost:3000/candidates");
    const data = await res.json();
    setCandidates(data);
  };

  const addCandidate = async () => {
    await fetch("http://localhost:3000/admin/add-candidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCandidate, password: "securepassword" }),
    });
    fetchCandidates();
  };

  const removeCandidate = async (name) => {
    await fetch("http://localhost:3000/admin/remove-candidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password: "securepassword" }),
    });
    fetchCandidates();
  };

  return (
    <div>
      <h2>Manage Candidates</h2>
      <input type="text" value={newCandidate} onChange={(e) => setNewCandidate(e.target.value)} />
      <button onClick={addCandidate}>Add Candidate</button>

      <ul>
        {candidates.map((c) => (
          <li key={c}>
            {c} <button onClick={() => removeCandidate(c)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
