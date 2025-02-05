import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css"; 

const socket = io("https://dolphin-app-day8d.ondigitalocean.app/");

function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [voteProgress, setVoteProgress] = useState({ totalApproved: 0, totalVotes: 0 });

  useEffect(() => {
    socket.on("voteProgress", (data) => {
      setVoteProgress(data);
    });

    return () => {
      socket.off("voteProgress");
    };
  }, []);

  const login = async () => {
    const res = await fetch("https://dolphin-app-day8d.ondigitalocean.app/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      setIsLoggedIn(true);
      fetchCandidates();
    } else {
      alert("Wrong password!");
    }
  };

  const fetchCandidates = async () => {
    const res = await fetch("https://dolphin-app-day8d.ondigitalocean.app/candidates");
    const data = await res.json();
    setCandidates(data);
  };

  const addCandidate = async () => {
    if (!candidateName) return alert("Enter a name!");
    await fetch("https://dolphin-app-day8d.ondigitalocean.app/admin/add-candidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: candidateName, password }),
    });
    setCandidateName("");
    fetchCandidates();
  };

  const removeCandidate = async (name) => {
    await fetch("https://dolphin-app-day8d.ondigitalocean.app/admin/remove-candidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    fetchCandidates();
  };

  const fetchResults = async () => {
    try {
      const res = await fetch("https://dolphin-app-day8d.ondigitalocean.app/admin/results");
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
      alert("Could not fetch results. Please try again.");
    }
  };

  const resetVotes = async () => {
    await fetch("https://dolphin-app-day8d.ondigitalocean.app/admin/reset-votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
  };

  return (
    <div className="container mt-4">
      {!isLoggedIn ? (
        <div className="card p-4">
          <h4 className="mb-3">Admin Login</h4>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary w-100" onClick={login}>
            Login
          </button>
        </div>
      ) : (
        <div>
          <div className="card p-4 mb-4">
            <h3 className="mb-4">Admin Panel</h3>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Candidate name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
            </div>
            <button className="btn btn-success w-100" onClick={addCandidate}>
              Add Candidate
            </button>
          </div>

          <div className="card p-4 mb-4">
            <h4>Current Candidates:</h4>
            {candidates.length > 0 ? (
                candidates.map((c) => (
                <div key={c} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{c}</span>
                    <button className="btn btn-danger btn-sm" onClick={() => removeCandidate(c)}>
                    Remove
                    </button>
                </div>
                ))
            ) : (
                <p>No candidates available.</p>
            )}
        </div>

          <div className="card p-4 mb-4">
            <h3>Voting Results</h3>
            <button className="btn btn-info mb-3" onClick={fetchResults}>
              Show Results
            </button>
            {results.length > 0 ? (
              results.map((r) => (
                <div key={r.candidate}>
                  <strong>{r.candidate}:</strong> {r.votes} votes
                </div>
              ))
            ) : (
              <p>No votes yet.</p>
            )}
          </div>

          <div className="card p-4 mb-4">
            <h3>Vote Progress</h3>
            <p>
              {voteProgress.totalVotes} out of {voteProgress.totalApproved} people have voted.
            </p>
          </div>

          <div className="card p-4">
            <button className="btn btn-warning w-100" onClick={resetVotes}>
              Reset Votes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
