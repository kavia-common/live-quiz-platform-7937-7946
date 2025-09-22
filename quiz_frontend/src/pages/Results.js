import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";

export default function Results() {
  const { state, actions } = useQuiz();

  const stats = useMemo(() => {
    const total = state.answers.length;
    const correct = state.answers.filter((a) => a?.correct).length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    return { total, correct, accuracy };
  }, [state.answers]);

  return (
    <div className="container" style={{ maxWidth: 840 }}>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Results</div>
        <div className="helper">Great job! Here is a summary of your performance.</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
          <Stat label="Answered" value={stats.total} />
          <Stat label="Correct" value={stats.correct} />
          <Stat label="Accuracy" value={`${stats.accuracy}%`} />
        </div>

        <div style={{ marginTop: 18 }}>
          <div className="helper" style={{ marginBottom: 8 }}>Accuracy</div>
          <div className="progress"><div style={{ width: `${stats.accuracy}%` }} /></div>
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <Link className="btn btn-primary" to="/join" onClick={() => actions.leaveQuiz()}>Join another quiz</Link>
          <Link className="btn btn-ghost" to="/">Home</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="helper">{label}</div>
      <div style={{ fontWeight: 800, fontSize: 20 }}>{value}</div>
    </div>
  );
}
