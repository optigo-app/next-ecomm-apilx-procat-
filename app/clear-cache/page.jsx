"use client";

import React, { useState } from "react";

export default function ClearCachePage() {
  const [loading, setLoading] = useState(false);

  const handleClearCache = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1. Clear client storage & album caches
      if (typeof window !== "undefined") {
        try {
          localStorage.clear();
          sessionStorage.clear();
          if ("caches" in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
          }
        } catch (e) {
          console.warn("Client storage clear error:", e);
        }
      }

      // 2. Call server clear & rebuild API
      const res = await fetch("/api/clear-cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const data = await res.json();

      // 3. On success, notify iframe parent if embedded, then redirect to homepage
      if (res.ok && data?.success) {
        if (typeof window !== "undefined" && window.parent) {
          try {
            window.parent.postMessage(
              { type: "CACHE_CLEARED_AND_REBUILT", status: "success", timestamp: Date.now() },
              "*"
            );
          } catch (e) {}
        }

        // Immediately redirect/load homepage
        if (typeof window !== "undefined") {
          if (window.top && window.top !== window.self) {
            window.top.location.href = "/";
          } else {
            window.location.href = "/";
          }
        }
      } else {
        alert("Failed to clear cache. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Cache clear error:", err);
      alert("An error occurred while clearing cache.");
      setLoading(false);
    }
  };

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={styles.fullScreenWrapper}>
          <button
            onClick={handleClearCache}
            disabled={loading}
            style={styles.centerButton(loading)}
          >
            {loading ? "Clearing Cache..." : "Clear Cache & Rebuild"}
          </button>
      </div>
    </>
  );
}

const styles = {
  fullScreenWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#F8FAFC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999999,
    boxSizing: "border-box",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    padding: "48px 40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.03)",
    border: "1px solid #E2E8F0",
    textAlign: "center",
    maxWidth: "440px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  cardSubtitle: {
    fontSize: "14px",
    color: "#64748B",
    margin: "0 0 12px 0",
    lineHeight: "1.5",
  },
  centerButton: (loading) => ({ 
    backgroundColor: loading ? "#94A3B8" : "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "14px 36px",
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "0.2px",
    borderRadius: "8px",
    cursor: loading ? "not-allowed" : "pointer",
    boxShadow: loading ? "none" : "0 4px 14px rgba(37, 99, 235, 0.25)",
    transition: "all 0.2s ease-in-out",
    width: "20%",
  }),
};
