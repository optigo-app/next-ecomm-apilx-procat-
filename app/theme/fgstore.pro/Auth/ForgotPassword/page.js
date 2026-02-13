"use client";
import React, { useEffect, useState } from "react";
import "./ForgotPass.modul.scss";
import CryptoJS from "crypto-js";
import { ResetPasswordAPI } from "@/app/(core)/utils/API/Auth/ResetPasswordAPI";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useSearchParams } from "next/navigation";
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
  useTheme,
  useMediaQuery
} from "@mui/material";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function ForgotPassword({ params, storeInit }) {
  const location = useNextRouterLikeRR();
  const navigation = location?.push;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams()
  const userid = searchParams.get('userid')
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setIsLoading(true);
    if (!userid) {
      setIsLoading(false);
      navigation("/");
    }

    const storedEmail = sessionStorage.getItem("userEmailForPdList");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [userid]); //

  const handleInputChange = (e, setter, fieldName) => {
    const { value } = e.target;
    setter(value);
    if (fieldName === "confirmPassword") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Password is required" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      }
    }
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError("Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number.");
    } else {
      setPasswordError("");
    }
  };

  const handleTogglePasswordVisibility = (fieldName) => {
    if (fieldName === "password") {
      setShowPassword(!showPassword);
    } else if (fieldName === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  function hashPasswordSHA1(password) {
    const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
    return hashedPassword;
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!password.trim()) {
      setPasswordError("Password is required");
      errors.password = "Password is required";
    }
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (Object.keys(errors).length === 0) {
      const hashedPassword = hashPasswordSHA1(password);
      setIsLoading(true);
      ResetPasswordAPI(userid, hashedPassword)
        .then((response) => {
          if (response.Data.rd[0].stat === 1) {
            navigation("/ContinueWithEmail");
          } else {
            setIsLoading(false);
            alert(response.Data.rd[0].stat_msg);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setErrors(errors);
    }
  };

  return <>
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'white',
        p: 0,
        position: 'relative'
      }}
    >
      {/* Loading Overlay */}
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: theme.zIndex.modal + 1,
          color: '#fff',
          bgcolor: 'rgba(0,0,0,0.3)'
        }}
      >
        <CircularProgress size={50} thickness={4} color="primary" />
      </Backdrop>

      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigation("/")}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'grey.100',
                color: 'text.primary'
              }
            }}
          >
            Back
          </Button>

          <Stack spacing={3} alignItems="center" sx={{ pt: 4 }}>
            {/* Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'warning.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}
              className="btnColorProCat"
            >
              <LockResetOutlinedIcon
                sx={{
                  fontSize: 32,
                }}
              />
            </Box>

            {/* Title */}
            <Box textAlign="center">
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 400,
                  color: 'text.primary',
                  mb: 1,
                  fontSize: { xs: '1.75rem', sm: '2.25rem' }
                }}
              >
                Forgot Your Password?
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 400,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: '1rem'
                }}
              >
                Enter your new password below to reset your account
              </Typography>
            </Box>

            {/* Form */}
            <Stack
              spacing={2.5}
              width="100%"
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              sx={{ maxWidth: 400, mx: 'auto', mt: 2 }}
            >
              <TextField
                autoFocus
                id="password"
                label="New Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSubmit();
                  }
                }}
                error={!!passwordError}
                helperText={passwordError}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleTogglePasswordVisibility("password")}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),

                }}
              />

              <TextField
                id="confirmPassword"
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => handleInputChange(e, setConfirmPassword, "confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleTogglePasswordVisibility("confirmPassword")}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),

                }}
              />

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                color="warning"
                disabled={isLoading || !password || !confirmPassword}
                sx={{
                  mt: 1,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 'none',
                  transition: 'all 0.2s ease-in-out',

                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500'
                  }
                }}
                className="btnColorProCat"
              >
                {isLoading ? 'Updating...' : 'Change Password'}
              </Button>

              <Button
                fullWidth
                size="large"
                variant="text"
                onClick={() => navigation("/")}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    color: 'text.primary'
                  }
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  </>

  return (
    <div className="smr_forgotMain">
      {isLoading && (
        <div className="loader-overlay">
          <CircularProgress className="loadingBarManage" />
        </div>
      )}
      <div>
        {/* style={{ backgroundColor: '#c0bbb1' }} */}
        <div className="smr_forgotSubDiv">
          <p
            style={{
              textAlign: "center",
              padding: "60px",
              margin: "0px",
              fontSize: "40px",
              color: "#7d7f85",
              marginBottom: '15px'
            }}
            className="AuthScreenMainTitle"
          >
            Forgot Your Password
          </p>
          <p
            style={{
              textAlign: "center",
              marginTop: "-60px",
              fontSize: "15px",
              color: "#7d7f85",
            }}
            className="AuthScreenSubTitle"
          >
            { }
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <TextField
              autoFocus
              id="outlined-password-input"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="smr_forgotBox"
              style={{ margin: "15px" }}
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit();
                }
              }}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => handleTogglePasswordVisibility("password")} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              id="outlined-confirm-password-input"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="current-password"
              className="smr_forgotBox"
              style={{ margin: "15px" }}
              value={confirmPassword}
              onChange={(e) => handleInputChange(e, setConfirmPassword, "confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                // Set InputProps for icon
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => handleTogglePasswordVisibility("confirmPassword")} onMouseDown={handleMouseDownConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <button className="createBtnRegister btnColorProCat" onClick={handleSubmit}>
              Change Password
            </button>
            <Button style={{ marginTop: "10px", color: "gray" }} onClick={() => navigation("/")}>
              CANCEL
            </Button>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}
