import React from "react";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <footer className="footer">© {new Date().getFullYear()} Live Quiz — Ocean Professional</footer>
    </>
  );
}
