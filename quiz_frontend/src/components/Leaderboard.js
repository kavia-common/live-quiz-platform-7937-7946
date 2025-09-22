import React, { useMemo } from "react";
import { useQuiz } from "../context/QuizContext";

export default function Leaderboard() {
  const { state } = useQuiz();
  const me = state.user;

  const list = useMemo(() => {
    return (state.leaderboard || []).slice().sort((a, b) => b.score - a.score).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }, [state.leaderboard]);

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ fontWeight: 800 }}>Leaderboard</div>
        <div className="badge">Live</div>
      </div>
      <div className="card-body">
        {list.length === 0 && <div className="helper">No scores yet. Be the first!</div>}
        {list.map(it => (
          <div key={it.userId} className={`leaderboard-item ${me && it.userId === me.id ? "me" : ""}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="badge" style={{ minWidth: 36, justifyContent: "center" }}>#{it.rank}</div>
              <div style={{ fontWeight: 700 }}>{it.name}</div>
            </div>
            <div style={{ fontWeight: 800 }}>{it.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
