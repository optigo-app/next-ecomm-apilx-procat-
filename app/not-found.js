import Link from "next/link";
import SquareAnimation from "@/app/components/SquareAnimation";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#111",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background squares */}
      <SquareAnimation />

      {/* Foreground content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: "0.875rem", color: "#999", marginBottom: "0.5rem" }}>404</p>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            marginBottom: "1rem",
            color: "#fff",
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#ccc",
            marginBottom: "2rem",
          }}
        >
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.25rem",
            backgroundColor: "#e93eff",
            color: "#111",
            fontWeight: 600,
            textDecoration: "none",
            transition: "background 0.2s ease",
          }}
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
