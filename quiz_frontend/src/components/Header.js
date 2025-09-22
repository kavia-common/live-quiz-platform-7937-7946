import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavButton = ({ to, label }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className="btn btn-ghost" style={{
      borderColor: active ? "var(--color-primary)" : "var(--color-border)",
      color: active ? "var(--color-primary)" : "var(--color-text)"
    }}>
      {label}
    </Link>
  );
};

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <div className="brand-logo" aria-hidden="true" />
          Live Quiz
        </Link>
        <nav className="nav" aria-label="Primary">
          <NavButton to="/" label="Home" />
          <NavButton to="/join" label="Join" />
          <NavButton to="/results" label="Results" />
        </nav>
      </div>
    </header>
  );
}
