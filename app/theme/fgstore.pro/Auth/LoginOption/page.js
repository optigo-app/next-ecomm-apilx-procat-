'use client';
import React from "react";
import "./LoginOption.modul.scss";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const LoginOption = ({ searchParams }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    LoginRedirect = "",
    loginRedirect: loginRedirLow = "",
    search = "",
  } = searchParams || {};
  const loginRedirect = LoginRedirect || loginRedirLow || search || "";

  const getSecurityKeyFromUrl = () => {
    if (searchParams?.SK) return searchParams.SK;
    if (searchParams?.SecurityKey) return searchParams.SecurityKey;

    if (loginRedirect) {
      const urlText = decodeURIComponent(loginRedirect);
      const kMatch = urlText.match(/\/K=([^/?&#]+)/);
      if (kMatch) {
        try {
          return atob(kMatch[1]);
        } catch (e) {}
      }

      const skMatch = urlText.match(/[?&](SK|SecurityKey)=([^&]+)/);
      if (skMatch) return skMatch[2];
    }
    return "";
  };

  const securityKey = getSecurityKeyFromUrl();
  const queryParamStr = `${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}` : securityKey ? `?SK=${encodeURIComponent(securityKey)}` : ""}`;

  const redirectEmailUrl = `/ContinueWithEmail${queryParamStr}`;
  const redirectMobileUrl = `/ContinueWithMobile${queryParamStr}`;
  const redirectRegisterUrl = `/register${queryParamStr}`;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fbfbfc",
        py: { xs: 2, sm: 4, md: 6 },
        px: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "4px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)",
            bgcolor: "#ffffff",
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minHeight: { md: "520px" },
            p: { xs: 1.5, sm: 2, md: 2.5 },
            gap: { xs: 2.5, md: 3.5 },
          }}
        >
          {/* Left Column - Fashion Editorial Visual Showcase */}
          <Box
            sx={{
              flex: { xs: "none", md: "0 0 45%" },
              height: { xs: "160px", sm: "220px", md: "auto" },
              minHeight: { md: "480px" },
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
              bgcolor: "#f1ede7",
              backgroundImage: "url('/Assets/auth_fashion_model.jpg')",
              backgroundSize: "cover",
              backgroundPosition: { xs: "center 20%", md: "center 15%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Ambient Gradient Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                p: { xs: 1.5, sm: 2.5, md: 3 },
                color: "#ffffff",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  opacity: 0.9,
                  fontSize: { xs: "10px", sm: "11px" },
                  display: "block",
                  mb: 0.25,
                }}
              >
                Exclusive Fine Jewelry
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.2rem" },
                  lineHeight: 1.25,
                  textShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              >
                Elegance & Precision in Every Creation
              </Typography>
            </Box>
          </Box>

          {/* Right Column - Login Options Form Block */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: { xs: 1, sm: 2.5, md: 3.5 },
              py: { xs: 1, sm: 2 },
            }}
          >
            <Stack spacing={{ xs: 2.5, sm: 3 }} sx={{ maxWidth: "400px", mx: "auto", width: "100%" }}>
              {/* Header */}
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: { xs: "1.35rem", sm: "1.65rem", md: "1.85rem" },
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                    mb: 0.75,
                  }}
                >
                  Login to your account
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#4b5563",
                    fontSize: { xs: "0.85rem", sm: "0.92rem" },
                    lineHeight: 1.45,
                  }}
                >
                  Welcome back! Choose how you would like to sign in to your
                  account.
                </Typography>
              </Box>

              {/* Login Method Buttons */}
              <Stack spacing={1.5} width="100%">
                <Button
                  component={Link}
                  href={redirectEmailUrl}
                  fullWidth
                  size="large"
                  startIcon={<EmailOutlinedIcon sx={{ fontSize: { xs: "18px", sm: "20px" } }} />}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: "16px", sm: "18px" }, opacity: 0.6 }} />}
                  sx={{
                    py: { xs: 1.25, sm: 1.5 },
                    px: { xs: 2, sm: 2.5 },
                    bgcolor: "#111827",
                    color: "#ffffff",
                    borderRadius: "4px",
                    textTransform: "none",
                    fontSize: { xs: "0.88rem", sm: "0.95rem" },
                    fontWeight: 600,
                    boxShadow: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.15s ease-in-out",
                    "&:hover": {
                      bgcolor: "#1f2937",
                      boxShadow: "none",
                    },
                    "& .MuiButton-startIcon": {
                      marginRight: "8px",
                    },
                  }}
                >
                  <span style={{ flex: 1, textAlign: "left" }}>
                    Continue with Email
                  </span>
                </Button>

                <Button
                  component={Link}
                  href={redirectMobileUrl}
                  fullWidth
                  size="large"
                  startIcon={<SmartphoneOutlinedIcon sx={{ fontSize: { xs: "18px", sm: "20px" } }} />}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: "16px", sm: "18px" }, opacity: 0.6 }} />}
                  sx={{
                    py: { xs: 1.25, sm: 1.5 },
                    px: { xs: 2, sm: 2.5 },
                    bgcolor: "#ffffff",
                    color: "#111827",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    textTransform: "none",
                    fontSize: { xs: "0.88rem", sm: "0.95rem" },
                    fontWeight: 600,
                    boxShadow: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.15s ease-in-out",
                    "&:hover": {
                      bgcolor: "#f9fafb",
                      borderColor: "#9ca3af",
                    },
                    "& .MuiButton-startIcon": {
                      marginRight: "8px",
                    },
                  }}
                >
                  <span style={{ flex: 1, textAlign: "left" }}>
                    Log in with Mobile Number
                  </span>
                </Button>
              </Stack>

              {/* Divider */}
              <Box sx={{ display: "flex", alignItems: "center", my: 0.5 }}>
                <Divider sx={{ flex: 1, borderColor: "#e5e7eb" }} />
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    color: "#9ca3af",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    fontSize: "10px",
                    letterSpacing: "0.05em",
                  }}
                >
                  or
                </Typography>
                <Divider sx={{ flex: 1, borderColor: "#e5e7eb" }} />
              </Box>

              {/* Sign up prompt */}
              <Box textAlign="center">
                <Typography
                  variant="body2"
                  sx={{ color: "#4b5563", fontSize: { xs: "0.85rem", sm: "0.92rem" } }}
                >
                  Don&apos;t have an account?{" "}
                  <Box
                    component={Link}
                    href={redirectRegisterUrl}
                    sx={{
                      color: "#111827",
                      fontWeight: 700,
                      textDecoration: "none",
                      borderBottom: "1.5px solid #111827",
                      transition: "opacity 0.2s",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    Sign up now
                  </Box>
                </Typography>
              </Box>

              {/* Legal Footer */}
              <Typography
                variant="caption"
                sx={{
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: { xs: "11px", sm: "11.5px" },
                  lineHeight: 1.5,
                  display: "block",
                }}
              >
                By continuing, you agree to our{" "}
                <Box
                  component={Link}
                  href="/terms-and-conditions"
                  sx={{
                    color: "#374151",
                    fontWeight: 600,
                    textDecoration: "underline",
                    "&:hover": { color: "#111827" },
                  }}
                >
                  Terms of Use
                </Box>{" "}
                and{" "}
                <Box
                  component={Link}
                  href="/privacyPolicy"
                  sx={{
                    color: "#374151",
                    fontWeight: 600,
                    textDecoration: "underline",
                    "&:hover": { color: "#111827" },
                  }}
                >
                  Privacy Policy
                </Box>
                .
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginOption;
