"use client";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "./LoginWithEmail.modul.scss";
import { LoginWithEmailAPI } from "@/app/(core)/utils/API/Auth/LoginWithEmailAPI";
import { ForgotPasswordEmailAPI } from "@/app/(core)/utils/API/Auth/ForgotPasswordEmailAPI";
import Cookies from "js-cookie";
import { CurrencyComboAPI } from "@/app/(core)/utils/API/Combo/CurrencyComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { GetCountAPI } from "@/app/(core)/utils/API/GetCount/GetCountAPI";
import { generateToken } from "@/app/(core)/utils/Glob_Functions/Tokenizer";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
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
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminStatusDialog from "../Register/components/AdminStatusDialog";
import { getEventMessage } from "@/app/(core)/constants/EventMessage";

export default function LoginWithEmail({ params, searchParams, storeInit }) {
  const { islogin, setislogin, setCartCountNum, setWishCountNum } = useStore();
  const [email, setEmail] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [adminStatusDialog, setAdminStatusDialog] = useState({
    open: false,
    type: "pending",
    message: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isOtpNewUi, setIsOtpNewUi] = useState(true);
  const { push } = useNextRouterLikeRR();
  const navigation = push;
  const location = useNextRouterLikeRR();

  const search =
    searchParams?.LoginRedirect ||
    searchParams?.loginRedirect ||
    searchParams?.search ||
    "";
  const securityKey =
    searchParams?.SK ||
    searchParams?.SecurityKey ||
    location?.state?.SecurityKey ||
    "";

  const redirectEmailUrl = search ? decodeURIComponent(search) : "/";
  const cancelRedireactUrl = `/LoginOption?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;

  useEffect(() => {
    const storedEmail = (() => {
      if (searchParams?.email) {
        try {
          const decoded = decodeURIComponent(searchParams.email);
          sessionStorage.setItem("registerEmail", decoded);
          return decoded;
        } catch (e) {
          console.error("Failed to decode email from searchParams", e);
        }
      }
      const raw = sessionStorage.getItem("registerEmail");
      if (!raw) return "";
      try {
        return raw.trim().startsWith("{") ||
          raw.trim().startsWith("[") ||
          raw.trim().startsWith('"')
          ? JSON.parse(raw)
          : raw;
      } catch {
        return raw;
      }
    })();
    if (storedEmail) setEmail(storedEmail);
  }, [searchParams?.email]);

  const handleInputChange = (e, setter, fieldName) => {
    const { value } = e.target;
    setter(value);
    if (fieldName === "confirmPassword") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Password is required",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      }
    }
  };
  const handleMouseDownConfirmPassword = (event) => {
    event?.preventDefault();
  };

  function hashPasswordSHA1(password) {
    const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
    return hashedPassword;
  }

  const handleSubmit = async () => {
    const visiterId = Cookies.get("visiterId");
    if (!confirmPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Password is required",
      }));
      return;
    }

    const hashedPassword = hashPasswordSHA1(confirmPassword);

    setIsLoading(true);
    LoginWithEmailAPI(email, "", hashedPassword, "", "", visiterId)
      .then((response) => {
        setIsLoading(false);
        const result = getEventMessage(response);
        if (result?.eventName && result?.status) {
          if (result.eventName === "IncorrectPassword") {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: result.message || "Incorrect password. Please try again.",
            }));
            return;
          }
          setAdminStatusDialog({
            open: true,
            type: result?.eventName,
            message: result?.message,
          });
          return;
        }
        if (response.Data.rd[0].stat === 1) {
          sessionStorage.removeItem("b2b_registered_email");
          sessionStorage.removeItem("b2b_registered_password");
          localStorage.removeItem("b2b_registered_email");
          localStorage.removeItem("b2b_registered_password");
          const visiterID = Cookies.get("visiterId");
          Cookies.set("userLoginCookie", response?.Data?.rd[0]?.Token);
          if (isOtpNewUi) {
            if (rememberMe) {
              const Token = generateToken(response?.Data?.rd[0]?.Token, 1);
              localStorage?.setItem("AuthToken", JSON?.stringify(Token));
            } else {
              const Token = generateToken(response?.Data?.rd[0]?.Token, 0);
              sessionStorage?.setItem("AuthToken", JSON?.stringify(Token));
            }
          }
          sessionStorage.setItem("registerEmail", email);
          setislogin(true);
          sessionStorage.setItem("LoginUser", true);
          sessionStorage.setItem(
            "loginUserDetail",
            JSON.stringify(response.Data.rd[0]),
          );

          GetCountAPI(visiterID)
            .then((res) => {
              if (res) {
                setCartCountNum(res?.cartcount);
                setWishCountNum(res?.wishcount);
              }
            })
            .catch((err) => {
              if (err) {
                console.log("getCountApiErr", err);
              }
            });

          CurrencyComboAPI(response?.Data?.rd[0]?.id)
            .then((response) => {
              if (response?.Data?.rd) {
                let data = JSON.stringify(response?.Data?.rd);
                sessionStorage.setItem("CurrencyCombo", data);
              }
            })
            .catch((err) => console.log(err));

          MetalColorCombo(response?.Data?.rd[0]?.id)
            .then((response) => {
              if (response?.Data?.rd) {
                let data = JSON.stringify(response?.Data?.rd);
                sessionStorage.setItem("MetalColorCombo", data);
              }
            })
            .catch((err) => console.log(err));

          MetalTypeComboAPI(response?.Data?.rd[0]?.id)
            .then((response) => {
              if (response?.Data?.rd) {
                let data = JSON.stringify(response?.Data?.rd);
                sessionStorage.setItem("metalTypeCombo", data);
              }
            })
            .catch((err) => console.log(err));

          if (redirectEmailUrl) {
            let finalRedirectUrl = redirectEmailUrl;
            if (securityKey) {
              const separator = finalRedirectUrl.includes("?") ? "&" : "?";
              finalRedirectUrl = `${finalRedirectUrl}${separator}SK=${encodeURIComponent(securityKey)}`;
            }

            window.location.href = finalRedirectUrl;
          } else {
            window.location.href = securityKey
              ? `/?SK=${encodeURIComponent(securityKey)}`
              : "/";
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: response.Data.rd[0].stat_msg || "Invalid password",
          }));
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleTogglePasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNavigation = () => {
    sessionStorage.setItem("LoginCodeEmail", "true");
    navigation(
      `/LoginWithEmailCode?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`,
    );
    sessionStorage.setItem("email", JSON.stringify(location.state?.email));
  };

  const handleForgotPassword = async () => {
    let Domian = `${window?.location?.protocol}//${storeInit?.domain}`;
    setIsLoading(true);
    ForgotPasswordEmailAPI(Domian, email)
      .then((response) => {
        setIsLoading(false);
        if (response.Data.rd[0].stat === 1) {
          toast.success("Reset Link Send On Your Email");
        } else {
          alert("Error");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const HandleCancel = () => {
    navigation(
      `/LoginOption?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`,
    );
  };

  const theme = useTheme();

  return (
    <>
      <AdminStatusDialog
        open={adminStatusDialog.open}
        type={adminStatusDialog.type}
        message={adminStatusDialog.message}
        onClose={() =>
          setAdminStatusDialog({ ...adminStatusDialog, open: false })
        }
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
                onClick={HandleCancel}
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
                {/* Title & Email Badge */}
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
                    Login with Password
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{
                      bgcolor: "#f3f4f6",
                      py: 0.5,
                      px: 1.25,
                      borderRadius: "4px",
                      width: "fit-content",
                      mt: 0.5,
                    }}
                  >
                    <EmailOutlinedIcon sx={{ fontSize: 16, color: "#6b7280" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#374151", fontSize: "0.85rem", fontWeight: 500 }}
                    >
                      {email}
                    </Typography>
                  </Stack>
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
                      id="password"
                      label="Password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={confirmPassword}
                      onChange={(e) =>
                        handleInputChange(e, setConfirmPassword, "confirmPassword")
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                      }}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      disabled={isLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              onMouseDown={handleMouseDownConfirmPassword}
                              edge="end"
                              sx={{ color: "#6b7280" }}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff sx={{ fontSize: 20 }} />
                              ) : (
                                <Visibility sx={{ fontSize: 20 }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
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
                      }}
                      FormHelperTextProps={{
                        sx: {
                          ml: 0,
                          fontSize: "0.8rem",
                          fontWeight: 500,
                        },
                      }}
                    />

                    {/* Remember Me & Forgot Password Row */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: 0.25 }}
                    >
                      {isOtpNewUi ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              size="small"
                              sx={{
                                color: "#9ca3af",
                                "&.Mui-checked": {
                                  color: "#111827",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#4b5563" }}>
                              Remember me
                            </Typography>
                          }
                          sx={{ m: 0 }}
                        />
                      ) : (
                        <Box />
                      )}

                      <Button
                        onClick={handleForgotPassword}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          p: 0,
                          minWidth: "auto",
                          color: "#111827",
                          fontSize: "0.85rem",
                          "&:hover": {
                            bgcolor: "transparent",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Forgot Password?
                      </Button>
                    </Stack>

                    <Button
                      type="submit"
                      fullWidth
                      size="large"
                      disabled={isLoading || !confirmPassword.trim()}
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
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>

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

                    {/* Login with Code Option */}
                    <Button
                      fullWidth
                      size="large"
                      onClick={handleNavigation}
                      startIcon={<EmailOutlinedIcon sx={{ fontSize: 18 }} />}
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
                        transition: "all 0.15s ease-in-out",
                        "&:hover": {
                          bgcolor: "#f9fafb",
                          borderColor: "#9ca3af",
                        },
                      }}
                    >
                      Login with Code Instead
                    </Button>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      textAlign="center"
                      sx={{ display: "block", fontSize: "11px", color: "#6b7280" }}
                    >
                      Go passwordless! We&apos;ll send you an email.
                    </Typography>

                    <Button
                      fullWidth
                      size="small"
                      variant="text"
                      onClick={HandleCancel}
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
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
}

