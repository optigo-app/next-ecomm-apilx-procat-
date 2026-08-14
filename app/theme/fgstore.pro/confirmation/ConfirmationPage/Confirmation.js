"use client";

import React, { useEffect, useState } from "react";
import "./confirmation.scss";
import confetti from "canvas-confetti";
import { FaPrint } from "react-icons/fa";
import { handelOpenMenu } from "@/app/(core)/utils/Glob_Functions/Cart_Wishlist/handleOpenMenu";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

// MUI Components & Icons
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

const Confirmation = ({ storeinit }) => {
  const location = useNextRouterLikeRR();
  const navigate = location.push;

  const { setCartCountNum } = useStore();
  const [orderNo, setOrderNo] = useState("");
  const storeInit = storeinit;
  const setCartCountVal = setCartCountNum;

  // 1. Fetch updated cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartCount = await GetCountAPI();
        setCartCountVal(cartCount?.cartcount);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
  }, []);

  const setCSSVariable = () => {
    const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
    document.documentElement.style.setProperty(
      "--background-color",
      backgroundColor
    );
  };

  // 2. Set order number & trigger hardware-accelerated Canvas Confetti burst with Custom SVG shapes
  useEffect(() => {
    setCSSVariable();
    const savedOrderNo = sessionStorage.getItem("orderNumber");
    if (savedOrderNo) {
      setOrderNo(savedOrderNo);
    }

    try {
      // Define custom SVG particle shapes (Sparkle 4-point star, Diamond gem, Curved celebration ray)
      const sparkleStar = confetti.shapeFromPath({
        path: "M 12 0 C 12 6.6 6.6 12 0 12 C 6.6 12 12 17.4 12 24 C 12 17.4 17.4 12 24 12 C 17.4 12 12 6.6 12 0 Z",
      });

      const jewelryDiamond = confetti.shapeFromPath({
        path: "M 12 2 L 22 10 L 12 22 L 2 10 Z",
      });

      const curvedRay = confetti.shapeFromPath({
        path: "M 2 2 C 8 2 16 10 22 22 C 18 18 10 10 2 2 Z",
      });

      const count = 180;
      const customShapes = [sparkleStar, jewelryDiamond, curvedRay, "circle"];
      const colors = ["#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#3B82F6", "#FCD34D"];

      const defaults = {
        origin: { y: 0.55 },
        zIndex: 99999,
        shapes: customShapes,
        colors,
        disableForReducedMotion: true,
      };

      const fire = (particleRatio, opts) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      // Fast, snappy multi-angle custom SVG confetti blast
      fire(0.25, {
        spread: 30,
        startVelocity: 55,
        scalar: 1.2,
      });
      fire(0.2, {
        spread: 60,
        startVelocity: 45,
        scalar: 1.1,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 1.0,
      });
      fire(0.1, {
        spread: 130,
        startVelocity: 30,
        decay: 0.92,
        scalar: 1.3,
      });
      fire(0.1, {
        spread: 130,
        startVelocity: 48,
        scalar: 1.2,
      });
    } catch (e) {
      console.error("Confetti launch error:", e);
    }
  }, []);

  const handleNavigate = async () => {
    const url = await handelOpenMenu();
    if (url) {
      navigate(url);
    } else {
      navigate("/");
    }
    sessionStorage.removeItem("TotalPriceData");
  };

  return (
    <Box
      className="julsmr_confirMaindiv"
      sx={{
        position: "relative",
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: { xs: 2.5, sm: 4 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* Main Clean Luxury Card */}
        <Paper
          elevation={0}
          className="julsmr_confirSecondMaindiv"
          sx={{
            position: "relative",
            zIndex: 2,
            backgroundColor: "#ffffff",
            border: "1px solid #eaeaea",
            borderRadius: "4px",
            padding: { xs: 4, sm: 5.5 },
            textAlign: "center",
            maxWidth: 520,
            margin: "0 auto",
            boxShadow: "0 10px 35px rgba(0, 0, 0, 0.03)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Refined Check Icon with Smooth Pop Entrance */}
          <Box
            sx={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
              borderRadius: "50%",
              width: 64,
              height: 64,
              mb: 3,
              border: "1px solid #dcfce7",
              boxShadow: "0 4px 16px rgba(22, 163, 74, 0.08)",
              animation: "checkIconPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              "@keyframes checkIconPop": {
                "0%": { opacity: 0, transform: "scale(0.3)" },
                "70%": { opacity: 1, transform: "scale(1.1)" },
                "100%": { opacity: 1, transform: "scale(1)" },
              },
            }}
          >
            <CheckCircleOutlineRoundedIcon sx={{ fontSize: 36 }} />
          </Box>

          {/* Heading with Lightweight Elegant Font */}
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 400,
              letterSpacing: { xs: "1px", sm: "1.5px" },
              textTransform: "uppercase",
              color: "#111827",
              fontFamily: "inherit",
              fontSize: { xs: "1.35rem", sm: "1.65rem" },
              mb: 1.25,
            }}
          >
            Thank You For Your Order
          </Typography>

          {/* Reassuring Subtitle */}
          <Typography
            sx={{
              color: "#6b7280",
              fontSize: { xs: "0.85rem", sm: "0.92rem" },
              fontWeight: 300,
              lineHeight: 1.5,
              maxWidth: 380,
              mb: 2.5,
            }}
          >
            Your order has been placed successfully and is currently being processed.
          </Typography>

          {/* Clean Order Number Badge */}
          {orderNo && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2.5,
                py: 0.9,
                borderRadius: "6px",
                bgcolor: "#f9fafb",
                border: "1px solid #f3f4f6",
                mb: 3.5,
              }}
            >
              <Typography
                sx={{
                  color: "#6b7280",
                  fontSize: "0.85rem",
                  fontWeight: 400,
                  letterSpacing: "0.3px",
                }}
              >
                Order Number:
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#111827",
                  fontSize: "0.92rem",
                  letterSpacing: "0.5px",
                }}
              >
                {orderNo}
              </Typography>
            </Box>
          )}

          {/* Optional Print Action */}
          {storeInit?.IsPLW != 0 && (
            <Box
              className="julsmr_plwlPrintDiv"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                mb: 3,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<FaPrint />}
                className="julicon-button"
                sx={{
                  color: "#374151",
                  borderColor: "#d1d5db",
                  textTransform: "none",
                  fontWeight: 400,
                  fontSize: "0.82rem",
                  borderRadius: "6px",
                  "&:hover": {
                    borderColor: "#9ca3af",
                    bgcolor: "#f9fafb",
                  },
                }}
              >
                Print Invoice
              </Button>
            </Box>
          )}

          {/* Modern Sleek Continue Shopping Button */}
          <Button
            disableElevation
            variant="contained"
            className="julsmr_continueShoppingBtns"
            onClick={handleNavigate}
            sx={{
              backgroundColor: "#004d40",
              color: "#ffffff",
              borderRadius: "6px",
              px: 4.5,
              py: 1.25,
              fontWeight: 500,
              fontSize: "0.82rem",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#00332c",
                boxShadow: "0 4px 12px rgba(0, 77, 64, 0.15)",
              },
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Confirmation;