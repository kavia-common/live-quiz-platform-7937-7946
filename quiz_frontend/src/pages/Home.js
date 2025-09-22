import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <section className="card" style={{
        padding: 28,
        background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(243,244,246,1))",
        borderColor: "rgba(147,197,253,0.6)"
      }}>
        <div style={{ display: "grid", gap: 10 }}>
          <div className="badge" style={{ width: "fit-content", background: "rgba(37,99,235,0.12)", borderColor: "#93C5FD", color: "#1E40AF" }}>
            Ocean Professional
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>
            Real-time Live Quiz
          </h1>
          <p style={{ margin: 0, color: "var(--color-muted)" }}>
            Join, answer, and compete on live leaderboards. Minimal, fast, and responsive.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <Link to="/join" className="btn btn-primary">Join a Quiz</Link>
            <a href="https://reactjs.org" target="_blank" rel="noreferrer" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 24, display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}>
        <Feature title="Real-time" desc="WebSocket-ready architecture for instant updates." />
        <Feature title="Fast UI" desc="Clean and modern Ocean Professional theme." />
        <Feature title="Scalable" desc="RESTful integration and Supabase support." />
      </section>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="badge" style={{ background: "rgba(245,158,11,0.12)", borderColor: "#FCD34D", color: "#92400E" }}>Feature</div>
      <div style={{ fontWeight: 800, fontSize: 18, marginTop: 8 }}>{title}</div>
      <div style={{ color: "var(--color-muted)", marginTop: 4 }}>{desc}</div>
    </div>
  );
}
