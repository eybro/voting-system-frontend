import { useState, useEffect } from "react";

function VotingPage() {
  const [email, setEmail] = useState("");
  const [approved, setApproved] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [voted, setVoted] = useState(false);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetch("https://dolphin-app-day8d.ondigitalocean.app/candidates")
      .then((res) => res.json())
      .then((data) => setCandidates(data));
  }, []);

  const checkEmail = async () => {
    const res = await fetch("https://dolphin-app-day8d.ondigitalocean.app/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!data.approved) {
      return alert("Email not approved!");
    }
    setApproved(data.approved);
  };

  const submitVote = async () => {
    if (!selectedCandidate) return alert("Please select a candidate!");

    const res = await fetch("https://dolphin-app-day8d.ondigitalocean.app/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, candidate: selectedCandidate }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "An error occurred!");
      return;
    }

    setVoted(true);
  };

  return (
    <div className="container mt-5">
      <div className="card p-4">
        {!approved ? (
          <>
            <h3 className="mb-3">Enter your email to verify:</h3>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-primary" onClick={checkEmail}>
                Check Email
              </button>
            </div>
          </>
        ) : voted ? (
          <div className="alert alert-success" role="alert">
            Thank you for voting!
          </div>
        ) : (
          <>
            <h3 className="mb-3">Select a Candidate:</h3>
            <div className="list-group mb-3">
              {candidates.map((c) => (
                <button
                  key={c}
                  className={`list-group-item list-group-item-action ${
                    selectedCandidate === c ? "active" : ""
                  }`}
                  onClick={() => setSelectedCandidate(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              className="btn btn-success"
              onClick={submitVote}
              disabled={!selectedCandidate}
            >
              Submit Vote
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VotingPage;
