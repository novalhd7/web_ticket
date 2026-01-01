import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        padding: "1rem 0",
        textAlign: "center",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        marginTop: "2rem",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p style={{ margin: 0, color: "#6b7280" }}>
          © {new Date().getFullYear()} Web Ticket — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
