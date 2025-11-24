"use client";

import { useEffect, useRef } from "react";

export default function SquareGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const cellSize = 16; 
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    const grid = Array.from({ length: rows }, () =>
      Array(cols).fill(0)
    );

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const col = Math.floor(e.clientX / cellSize);
      const row = Math.floor(e.clientY / cellSize);
      if (grid[row] && grid[row][col] !== undefined) {
        grid[row][col] = 1; 
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] > 0) {
            ctx.fillStyle = `rgba(138, 92, 246, ${grid[r][c]})`; 
            ctx.fillRect(c * cellSize, r * cellSize, cellSize - 2, cellSize - 2);
            grid[r][c] = Math.max(0, grid[r][c] - 0.02);
          } else {
            ctx.fillStyle = "#111";
            ctx.fillRect(c * cellSize, r * cellSize, cellSize - 2, cellSize - 2);
          }
        }
      }

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
