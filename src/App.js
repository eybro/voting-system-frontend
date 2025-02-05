import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VotingPage from "./VotingPage";
import AdminPage from "./AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VotingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
