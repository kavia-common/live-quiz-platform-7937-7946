import React from "react";
import { useQuiz } from "../context/QuizContext";
import { useUI } from "../context/UIContext";

function Option({ opt, index, selected, onSelect, result }) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  const cls = ["option"];
  if (selected) cls.push("selected");
  if (result === "correct") cls.push("correct");
  if (result === "incorrect") cls.push("incorrect");
  return (
    <div className={cls.join(" ")} onClick={() => onSelect(opt.id)} role="button" tabIndex={0}>
      <div className="letter">{letters[index] || "?"}</div>
      <div style={{ fontWeight: 600 }}>{opt.text}</div>
    </div>
  );
}

export default function QuestionCard() {
  const { state, actions } = useQuiz();
  const { addToast, setLoading } = useUI();
  const q = state.question;

  if (!q) {
    return (
      <div className="card">
        <div className="card-header">
          <div style={{ fontWeight: 800 }}>No active question</div>
          <div className="badge">Waiting…</div>
        </div>
        <div className="card-body">
          Join a quiz to begin or wait for the next question.
        </div>
      </div>
    );
  }

  const submit = async () => {
    if (!state.selectedOptionId) {
      addToast("Please select an option before submitting.", "info");
      return;
    }
    setLoading(true);
    try {
      const res = await actions.submitAnswer();
      addToast("Answer submitted!", "success");
      return res;
    } catch (e) {
      addToast("Failed to submit answer", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="card-header" style={{ background: "var(--color-surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="badge" title="Progress">
            Q{q.index} / {q.total}
          </div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Current Question</div>
        </div>
        <button className="btn btn-primary" onClick={submit} aria-label="Submit answer">
          Submit
        </button>
      </div>
      <div className="card-body">
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{q.text}</div>
        <div style={{ display: "grid", gap: 10 }}>
          {q.options.map((opt, idx) => (
            <Option
              key={opt.id}
              opt={opt}
              index={idx}
              selected={state.selectedOptionId === opt.id}
              onSelect={(id) => actions.selectOption(id)}
            />
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <div className="helper">Choose the best answer, then press Submit.</div>
          <div className="progress" style={{ marginTop: 10 }}>
            <div style={{ width: `${(q.index / q.total) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
