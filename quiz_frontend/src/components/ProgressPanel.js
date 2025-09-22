import React, { useMemo } from "react";
import { useQuiz } from "../context/QuizContext";

export default function ProgressPanel() {
  const { state } = useQuiz();
  const stats = useMemo(() => {
    const total = state.answers.length;
    const correct = state.answers.filter(a => a?.correct).length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    return { total, correct, accuracy };
  }, [state.answers]);

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ fontWeight: 800 }}>Your Progress</div>
        <div className="badge">Live</div>
      </div>
      <div className="card-body" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Stat label="Answered" value={stats.total} />
          <Stat label="Correct" value={stats.correct} />
          <Stat label="Accuracy" value={`${stats.accuracy}%`} />
        </div>
        <div>
          <div className="helper" style={{ marginBottom: 8 }}>Accuracy</div>
          <div className="progress"><div style={{ width: `${stats.accuracy}%` }} /></div>
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
