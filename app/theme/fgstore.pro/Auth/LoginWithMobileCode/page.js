"use client";
import React, { useEffect, useState } from 'react';
import './LoginWithMobileCode.modul.scss';
import { ContimueWithMobileAPI } from '@/app/(core)/utils/API/Auth/ContimueWithMobileAPI';
import { toast } from 'react-toastify';
import { LoginWithEmailAPI } from '@/app/(core)/utils/API/Auth/LoginWithEmailAPI';
import Cookies from 'js-cookie';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import OTP from './OTP';
import AdminStatusDialog from '../Register/components/AdminStatusDialog';
import Link from 'next/link';

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Backdrop,
  useTheme,
  useMediaQuery,
  Link as MuiLink
} from "@mui/material";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getEventMessage } from '@/app/(core)/constants/EventMessage';

export default function LoginWithMobileCode({ params, searchParams }) {
  const location = useNextRouterLikeRR();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigation = location?.push;
  const [mobileNo, setMobileNo] = useState('');
  const [enterOTP, setEnterOTP] = useState('');
  const [resendTimer, setResendTimer] = useState(120);
  const [isLoginState, setIsLoginState] = useState(false);
  const [adminStatusDialog, setAdminStatusDialog] = useState({ open: false, type: "pending", message: "" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
  const updatedSearch = search?.replace('?LoginRedirect=', '');
  const redirectMobileUrl = `${decodeURIComponent(updatedSearch)}`;
  const cancelRedireactUrl = `/LoginOption?${search}`;

  useEffect(() => {
    const storedMobile = sessionStorage?.getItem('registerMobile') ?? '';
    if (storedMobile) setMobileNo(storedMobile);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prevTimer => {
          if (prevTimer === 0) {
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleSubmit = async () => {
    const visiterId = Cookies.get('visiterId');
    if (enterOTP.length < 5) {
      setErrors(prevErrors => ({ ...prevErrors, otp: 'Please complete the code.' }));
      return;
    }

    setIsLoading(true);
    LoginWithEmailAPI('', mobileNo, enterOTP, 'otp_mobile_login', '', visiterId).then((response) => {
      const result = getEventMessage(response);
      if (result?.eventName && result?.status) {
        setIsLoading(false);
        setAdminStatusDialog({
          open: true,
          type: result?.eventName,
          message: result?.message
        });
        return;
      }
      setIsLoading(false);
      if (response.Data.rd[0].stat === 1) {
        setIsLoginState(true);
        Cookies.set('LoginUser', true);
        sessionStorage.setItem('LoginUser', true);
        sessionStorage.setItem('loginUserDetail', JSON.stringify(response.Data.rd[0]));

        if (redirectMobileUrl) {
          const securityKey = searchParams?.SK || searchParams?.SecurityKey || "";
          let finalRedirectUrl = redirectMobileUrl;
          if (securityKey) {
            const separator = finalRedirectUrl.includes('?') ? '&' : '?';
            finalRedirectUrl = `${finalRedirectUrl}${separator}SK=${encodeURIComponent(securityKey)}`;
          }
          window.location.href = finalRedirectUrl;
        } else {
          const securityKey = searchParams?.SK || searchParams?.SecurityKey || "";
          window.location.href = securityKey ? `/?SK=${encodeURIComponent(securityKey)}` : '/';
        }
      } else {
        setErrors(prevErrors => ({ ...prevErrors, otp: response.Data.rd[0].stat_msg }));
      }
    }).catch((err) => {
      setIsLoading(false);
      console.log(err);
      setErrors(prevErrors => ({ ...prevErrors, otp: 'An error occurred while logging in. Please try again.' }));
    });
  };

  const handleResendCode = async () => {
    setResendTimer(120);
    const Countrycodestate = sessionStorage.getItem('Countrycodestate');
    ContimueWithMobileAPI(mobileNo, Countrycodestate).then((response) => {
      if (response.Data.rd[0].stat === '1') {
        toast.success('OTP resent successfully');
      } else {
        toast.error('OTP send error');
      }
    }).catch((err) => console.log(err));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <>
      <AdminStatusDialog
        open={adminStatusDialog.open}
        type={adminStatusDialog.type}
        message={adminStatusDialog.message}
        onClose={() => setAdminStatusDialog({ ...adminStatusDialog, open: false })}
      />
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

        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "stretch" },
              justifyContent: "center",
              gap: { xs: 3, md: 4, lg: 5 },
              width: "100%",
              maxWidth: "1040px",
              mx: "auto",
            }}
          >
            {/* Left Column - Fashion Visual Showcase (Large, Unrounded, Sharp) */}
            <Box
              sx={{
                flex: { xs: "none", md: "0 0 460px", lg: "0 0 490px" },
                width: { xs: "100%", sm: "400px", md: "460px", lg: "490px" },
                height: { xs: "260px", sm: "360px", md: "540px", lg: "580px" },
                borderRadius: "0px",
                overflow: "hidden",
                position: "relative",
                bgcolor: "#f1ede7",
                backgroundImage: "url('/Assets/auth_fashion_model.jpg')",
                backgroundSize: "cover",
                backgroundPosition: { xs: "center 20%", md: "center 15%" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
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
                  p: { xs: 2, sm: 2.5, md: 3 },
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

            {/* Right Column - Form Card */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                maxWidth: { xs: "100%", sm: "440px", md: "460px" },
                width: "100%",
                height: { md: "540px", lg: "580px" },
                minHeight: { md: "540px", lg: "580px" },
                bgcolor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: { xs: 3, sm: 4, md: 4.5 },
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              {/* Back Button */}
              <Button
                startIcon={<ArrowBackIcon sx={{ fontSize: "18px" }} />}
                onClick={() => navigation(cancelRedireactUrl)}
                sx={{
                  alignSelf: "flex-start",
                  mb: { xs: 1, sm: 1.5 },
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
                Back
              </Button>

              <Stack
                spacing={{ xs: 2.5, sm: 3 }}
                sx={{ maxWidth: "400px", mx: "auto", width: "100%" }}
              >
                {/* Title & Subtext */}
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
                    Login with Mobile Code
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4b5563",
                      fontSize: { xs: "0.85rem", sm: "0.92rem" },
                      lineHeight: 1.45,
                    }}
                  >
                    Last step! Enter the 6-digit code sent to{" "}
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {mobileNo}
                    </Box>
                  </Typography>
                </Box>

                {/* OTP Input Section */}
                <Box
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  sx={{ width: "100%" }}
                >
                  <Stack spacing={2.5}>
                    <Box sx={{ width: "100%" }}>
                      <OTP
                        separator={<span> </span>}
                        value={enterOTP}
                        onChange={setEnterOTP}
                        length={6}
                        onSubmit={handleSubmit}
                      />

                      {errors.otp && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            display: "block",
                            textAlign: "center",
                            mt: 1,
                            fontWeight: 500,
                          }}
                        >
                          {errors.otp}
                        </Typography>
                      )}
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      size="large"
                      disabled={isLoading || enterOTP.length !== 6}
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
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </Button>

                    {/* Resend Code Section */}
                    <Box textAlign="center">
                      <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#6b7280" }}>
                        Didn&apos;t get the code?{" "}
                        {resendTimer === 0 ? (
                          <MuiLink
                            component="button"
                            type="button"
                            onClick={handleResendCode}
                            sx={{
                              fontWeight: 600,
                              color: "#111827",
                              textDecoration: "underline",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                              p: 0,
                              fontSize: "0.85rem",
                              "&:hover": { color: "#000" },
                            }}
                          >
                            Resend Code
                          </MuiLink>
                        ) : (
                          <Box component="span" sx={{ color: "#111827", fontWeight: 600 }}>
                            Resend in {formatTime(resendTimer)}
                          </Box>
                        )}
                      </Typography>
                    </Box>

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
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
}
