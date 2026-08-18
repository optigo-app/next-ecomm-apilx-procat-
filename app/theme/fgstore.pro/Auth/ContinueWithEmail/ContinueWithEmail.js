'use client';
import React, { useEffect, useState } from "react";
import "./ContinueWithEmail.modul.scss";
import { toast } from "react-toastify";
import { ContinueWithEmailAPI } from "@/app/(core)/utils/API/Auth/ContinueWithEmailAPI";
import OTPContainer from "@/app/(core)/utils/Glob_Functions/Otpflow/App";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Backdrop,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ContinueWithEmail({ params, searchParams, storeInit }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const Router = useRouter();
  const navigation = (path) => {
    Router.push(path);
  };
  const paramsObj = searchParams || {};
  const search =
    paramsObj.LoginRedirect ||
    paramsObj.loginRedirect ||
    paramsObj.search ||
    "";
  const securityKey = searchParams?.SK || searchParams?.SecurityKey || "";

  const redirectEmailUrl = `/LoginWithEmail?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}&email=${encodeURIComponent(email.trim())}`;
  const redirectSignUpUrl = `/register?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}&email=${encodeURIComponent(email.trim())}`;
  const cancelRedireactUrl = `/LoginOption?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    const trimmedValue = value.trim();
    setEmail(trimmedValue);
    if (!trimmedValue) {
      setEmailError("Email is required.");
    } else if (!validateEmail(trimmedValue)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError("Email is required.");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    setIsLoading(true);
    ContinueWithEmailAPI(trimmedEmail)
      .then((response) => {
        setIsLoading(false);
        if (response.Data.rd[0].stat == 1 && response.Data.rd[0].islead == 1) {
          toast.error("You are not a customer, contact to admin");
        } else if (
          response.Data.rd[0].stat == 1 &&
          response.Data.rd[0].islead == 0
        ) {
          navigation(redirectEmailUrl);
          if (trimmedEmail) {
            sessionStorage.setItem("registerEmail", trimmedEmail);
            sessionStorage.setItem("email", trimmedEmail);
            sessionStorage.removeItem("registerMobile");
          }
        } else {
          if (storeInit?.IsEcomOtpVerification != 0) {
            if (process.env.NODE_ENV === "development") {
              const otp = Number(response.Data.rd[0].OTP)
                ? response.Data.rd[0].OTP
                : 123456;
              alert(otp);
            }
            setIsOpen(true);
          } else {
            navigation(redirectSignUpUrl);
            if (trimmedEmail) {
              sessionStorage.setItem("registerEmail", trimmedEmail);
              sessionStorage.setItem("email", trimmedEmail);
              sessionStorage.removeItem("registerMobile");
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    sessionStorage.removeItem("Countrycodestate");
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        position: "relative",
      }}
    >
      {/* Loading Overlay */}
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: theme.zIndex.modal + 1,
          color: "#fff",
          bgcolor: "rgba(0,0,0,0.3)",
        }}
      >
        <CircularProgress size={45} thickness={4} sx={{ color: "#111827" }} />
      </Backdrop>

      {/* OTP Modal Container */}
      {storeInit?.IsEcomOtpVerification &&
      storeInit?.IsEcomOtpVerification === 1 ? (
        <OTPContainer
          emailId={email.trim()}
          isOpen={isOpen}
          type="email"
          setIsOpen={() => setIsOpen(!isOpen)}
          onClose={() => setIsOpen(false)}
          navigation={navigation}
          location={location}
          onResend={handleSubmit}
          isLoading={isLoading}
          searchParams={searchParams}
        />
      ) : null}

      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "4px",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)",
            bgcolor: "#ffffff",
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minHeight: { md: "520px" },
            p: { xs: 1.5, sm: 2, md: 2.5 },
            gap: { xs: 2.5, md: 3.5 },
            position: "relative",
          }}
        >
          {/* Left Column - Visual Showcase */}
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

          {/* Right Column - Continue with Email Form */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: { xs: 1, sm: 2.5, md: 3.5 },
              py: { xs: 1, sm: 2 },
              position: "relative",
            }}
          >
            {/* Back Button */}
            <Button
              startIcon={<ArrowBackIcon sx={{ fontSize: "18px" }} />}
              onClick={() => navigation(cancelRedireactUrl)}
              sx={{
                alignSelf: "flex-start",
                mb: { xs: 1, sm: 2 },
                color: "#6b7280",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.88rem",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#111827",
                },
              }}
            >
              Back to options
            </Button>

            <Stack
              spacing={{ xs: 2.5, sm: 3 }}
              sx={{ maxWidth: "400px", mx: "auto", width: "100%" }}
            >
              {/* Title & Subtitle */}
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
                  Continue with Email
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#4b5563",
                    fontSize: { xs: "0.85rem", sm: "0.92rem" },
                    lineHeight: 1.45,
                  }}
                >
                  We&apos;ll check if you have an account, and help create one if you don&apos;t.
                </Typography>
              </Box>

              {/* Form Input & Submission */}
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                sx={{ width: "100%" }}
              >
                <Stack spacing={2}>
                  <TextField
                    autoFocus
                    fullWidth
                    id="email"
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    error={!!emailError}
                    helperText={emailError}
                    disabled={isLoading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                        bgcolor: "#ffffff",
                        "& fieldset": {
                          borderColor: "#d1d5db",
                        },
                        "&:hover fieldset": {
                          borderColor: "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#111827",
                          borderWidth: "1.5px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "0.9rem",
                        color: "#6b7280",
                        "&.Mui-focused": {
                          color: "#111827",
                        },
                      },
                    }}
                    FormHelperTextProps={{
                      sx: {
                        ml: 0,
                        fontSize: "0.8rem",
                        fontWeight: 500,
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={isLoading || !email.trim()}
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
                      transition: "all 0.15s ease-in-out",
                      "&:hover": {
                        bgcolor: "#1f2937",
                        boxShadow: "none",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#e5e7eb",
                        color: "#9ca3af",
                      },
                    }}
                  >
                    {isLoading ? "Processing..." : "Continue"}
                  </Button>

                  <Button
                    fullWidth
                    size="small"
                    variant="text"
                    onClick={() => navigation(cancelRedireactUrl)}
                    disabled={isLoading}
                    sx={{
                      py: 1,
                      textTransform: "none",
                      fontSize: "0.88rem",
                      fontWeight: 500,
                      color: "#6b7280",
                      borderRadius: "4px",
                      "&:hover": {
                        bgcolor: "#f3f4f6",
                        color: "#111827",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
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
                  mt: 1,
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
}
