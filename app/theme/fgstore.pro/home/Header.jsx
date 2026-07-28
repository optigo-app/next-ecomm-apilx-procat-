"use client";

import React from "react";
import { Box, CssBaseline, Typography } from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import { Playfair } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-playfair), serif !important",
  },
});

// Client Configurable Theme Object (Easily update colors, gradients, and fonts per client)
export const clientThemeConfig = {
  // Metallic Gold Color Palette
  goldLight: "#FAF0C5",
  goldMedium: "#9E7429",
  goldDark: "#9E7429",
  goldAccent: "#F3E5AB",

  // Gradient stops
  gradientStops: {
    stop0: "#000000ff",
    stop20: "#000000ff",
    stop50: "#000000ff",
    stop80: "#000000ff",
    stop100: "#000000ff",
  },

  // Ambient Glow Shadow
  glowShadow: "drop-shadow(0 3px 14px rgba(212, 178, 111, 0.35))",
};

const MainContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4, 2),
  margin: "0 auto",
}));

export default function JewelryHeader({
  text = "Catalogs & Lookbooks",
  subtitle = "",
  config = clientThemeConfig,
  sx,
}) {
  const mergedConfig = { ...clientThemeConfig, ...config };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <MainContainer sx={sx} className={`${playfair.variable} ${playfair.className}`}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            maxWidth: 820,
            margin: "0 auto",
            py: 1,
            px: { xs: 5, sm: 6.5 },
          }}
        >
          {/* Left Decorative Wing End Cap */}
          <svg
            width="48"
            height="100%"
            viewBox="0 0 48 64"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "48px",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <defs>
              <linearGradient
                id="gold-wing-left"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={mergedConfig.gradientStops.stop0}
                />
                <stop
                  offset="50%"
                  stopColor={mergedConfig.gradientStops.stop50}
                />
                <stop
                  offset="100%"
                  stopColor={mergedConfig.gradientStops.stop100}
                />
              </linearGradient>
            </defs>
            <path
              d="M 48 0 L 30 0 C 20 0 14 18 10 25 C 6 30 0 32 0 32 C 0 32 6 34 10 39 C 14 46 20 64 30 64 L 48 64"
              stroke="url(#gold-wing-left)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <polygon
              points="0,32 5,28 10,32 5,36"
              fill="url(#gold-wing-left)"
            />
          </svg>

          {/* Top Border Line */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "30px",
              right: "30px",
              height: "1.5px",
              background: `linear-gradient(90deg, ${mergedConfig.gradientStops.stop0} 0%, ${mergedConfig.gradientStops.stop20} 25%, ${mergedConfig.gradientStops.stop50} 50%, ${mergedConfig.gradientStops.stop80} 75%, ${mergedConfig.gradientStops.stop100} 100%)`,
            }}
          />
          {/* Top Center Diamond Notch */}
          <Box
            sx={{
              position: "absolute",
              top: "-3.5px",
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: "8px",
              height: "8px",
              backgroundColor: mergedConfig.goldMedium,
              border: `1px solid ${mergedConfig.goldLight}`,
              zIndex: 1,
            }}
          />

          {/* Header Title */}
          <Typography
            component="h2"
            className={playfair.className}
            sx={{
              fontFamily: `${playfair.style.fontFamily}, "Playfair Display", serif !important`,
              fontWeight: 800,
              fontSize: { xs: "1.15rem", sm: "1.55rem", md: "2.25rem" },
              letterSpacing: "0.10rem",
              textTransform: "capitalize",
              color: mergedConfig.goldMedium,
              backgroundImage: `linear-gradient(135deg, ${mergedConfig.gradientStops.stop0} 0%, ${mergedConfig.gradientStops.stop20} 25%, ${mergedConfig.gradientStops.stop50} 50%, ${mergedConfig.gradientStops.stop80} 75%, ${mergedConfig.gradientStops.stop100} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              lineHeight: 1.3,
              whiteSpace: { xs: "normal", sm: "nowrap" },
              my: 0.5,
            }}
          >
            {text}
          </Typography>

          {subtitle && (
            <Typography
              component="p"
              className={playfair.className}
              sx={{
                fontFamily: `${playfair.style.fontFamily}, "Playfair Display", serif !important`,
                fontWeight: 500,
                fontSize: { xs: "0.6rem", sm: "0.7rem" },
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "rgba(212, 178, 111, 0.85)",
                marginTop: "4px",
                textAlign: "center",
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Bottom Center Diamond Notch */}
          <Box
            sx={{
              position: "absolute",
              bottom: "-3.5px",
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: "8px",
              height: "8px",
              backgroundColor: mergedConfig.goldMedium,
              border: `1px solid ${mergedConfig.goldLight}`,
              zIndex: 1,
            }}
          />
          {/* Bottom Border Line */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: "30px",
              right: "30px",
              height: "1.5px",
              background: `linear-gradient(90deg, ${mergedConfig.gradientStops.stop0} 0%, ${mergedConfig.gradientStops.stop20} 25%, ${mergedConfig.gradientStops.stop50} 50%, ${mergedConfig.gradientStops.stop80} 75%, ${mergedConfig.gradientStops.stop100} 100%)`,
            }}
          />

          {/* Right Decorative Wing End Cap */}
          <svg
            width="48"
            height="100%"
            viewBox="0 0 48 64"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "48px",
              height: "100%",
              transform: "scaleX(-1)",
              pointerEvents: "none",
            }}
          >
            <defs>
              <linearGradient
                id="gold-wing-right"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={mergedConfig.gradientStops.stop0}
                />
                <stop
                  offset="50%"
                  stopColor={mergedConfig.gradientStops.stop50}
                />
                <stop
                  offset="100%"
                  stopColor={mergedConfig.gradientStops.stop100}
                />
              </linearGradient>
            </defs>
            <path
              d="M 48 0 L 30 0 C 20 0 14 18 10 25 C 6 30 0 32 0 32 C 0 32 6 34 10 39 C 14 46 20 64 30 64 L 48 64"
              stroke="url(#gold-wing-right)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <polygon
              points="0,32 5,28 10,32 5,36"
              fill="url(#gold-wing-right)"
            />
          </svg>
        </Box>
      </MainContainer>
    </ThemeProvider>
  );
}
