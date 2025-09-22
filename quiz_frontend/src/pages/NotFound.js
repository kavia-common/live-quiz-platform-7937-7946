import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <div className="card" style={{ padding: 24, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 22 }}>404</div>
        <div className="helper" style={{ marginTop: 6 }}>The page you are looking for does not exist.</div>
        <div style={{ marginTop: 14 }}>
          <Link className="btn btn-primary" to="/">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
