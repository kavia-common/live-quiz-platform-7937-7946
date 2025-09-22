import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { useUI } from "../context/UIContext";

// PUBLIC_INTERFACE
export default function JoinQuiz() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const { actions } = useQuiz();
  const { addToast, setLoading } = useUI();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!code || !name) {
      addToast("Enter quiz code and your name.", "info");
      return;
    }
    setLoading(true);
    try {
      await actions.joinQuiz(code.trim(), name.trim());
      addToast("Joined quiz successfully!", "success");
      navigate(`/quiz/${encodeURIComponent(code.trim())}`);
    } catch (e) {
      addToast("Failed to join quiz", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: "grid", gap: 16, maxWidth: 760 }}>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>Join a Quiz</div>
        <div className="helper" style={{ marginBottom: 16 }}>
          Enter the quiz code provided by the host, and your display name.
        </div>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label className="helper">Quiz Code</label>
            <input className="input" placeholder="e.g., OCEAN-1234" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div>
            <label className="helper">Your Name</label>
            <input className="input" placeholder="e.g., Alex" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" type="submit">Join</button>
            <button className="btn btn-ghost" type="button" onClick={() => { setCode(""); setName(""); }}>Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}
