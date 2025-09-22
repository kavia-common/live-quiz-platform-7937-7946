import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import QuestionCard from "../components/QuestionCard";
import Leaderboard from "../components/Leaderboard";
import ProgressPanel from "../components/ProgressPanel";
import { useUI } from "../context/UIContext";

// PUBLIC_INTERFACE
export default function QuizRoom() {
  const { code } = useParams();
  const { state, actions } = useQuiz();
  const { addToast } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.status === "finished") {
      addToast("Quiz finished! See results.", "success");
      navigate("/results");
    }
  }, [state.status, navigate, addToast]);

  return (
    <div className="container" style={{ paddingTop: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="badge" style={{ background: "rgba(37,99,235,0.12)", borderColor: "#93C5FD", color: "#1E40AF" }}>
            Code: {code}
          </div>
          {state.user && <div className="badge">You: {state.user.name}</div>}
        </div>
        <button className="btn btn-ghost" onClick={() => { actions.leaveQuiz(); navigate("/"); }}>
          Leave
        </button>
      </div>

      <section className="main">
        <div style={{ display: "grid", gap: 16 }}>
          <QuestionCard />
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <Leaderboard />
          <ProgressPanel />
        </div>
      </section>
    </div>
  );
}
