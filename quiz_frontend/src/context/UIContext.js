import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

// PUBLIC_INTERFACE
export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const addToast = useCallback((msg, kind = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const value = useMemo(() => ({
    loading, setLoading, addToast, toasts
  }), [loading, addToast, toasts]);

  return (
    <UIContext.Provider value={value}>
      {children}
      <div style={{ position: "fixed", top: 12, right: 12, display: "grid", gap: 8, zIndex: 50 }}>
        {toasts.map(t => (
          <div key={t.id} className="badge" style={{
            background: t.kind === "error" ? "rgba(239,68,68,0.1)" :
                        t.kind === "success" ? "rgba(16,185,129,0.12)" : "rgba(37,99,235,0.08)",
            borderColor: t.kind === "error" ? "#EF4444" :
                        t.kind === "success" ? "#10B981" : "#93C5FD",
            color: t.kind === "error" ? "#991B1B" :
                   t.kind === "success" ? "#065F46" : "#1E40AF",
            boxShadow: "var(--shadow-sm)"
          }}>
            {t.msg}
          </div>
        ))}
      </div>
      {loading && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(17,24,39,0.28)", display: "grid",
          placeItems: "center", zIndex: 40
        }}>
          <div className="card" style={{ padding: 22, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 14, height: 14, borderRadius: "999px",
              border: "3px solid #93C5FD", borderTopColor: "transparent", animation: "spin 1s linear infinite"
            }} />
            <div style={{ fontWeight: 600 }}>Working…</div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg);} }`}</style>
    </UIContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
