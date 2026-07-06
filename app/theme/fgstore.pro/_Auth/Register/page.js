"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Register.modul.scss";
import CryptoJS from "crypto-js";
import { RegisterAPI } from "@/app/(core)/utils/API/Auth/RegisterAPI";
import Autocomplete from "@mui/material/Autocomplete";
import { CountryCode } from "@/app/(core)/utils/assets/Countrylist";
import CountryDropDown from "@/app/(core)/utils/Glob_Functions/CountryDropDown/CountryDropDown";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
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
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Register({ searchParams }) {
  const { push } = useNextRouterLikeRR();
  const navigation = push;
  const location = useNextRouterLikeRR();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Errors, setErrors] = useState({});
  const [Countrycodestate, setCountrycodestate] = useState("");
  const [countryShortName, setCountryShortName] = useState("IND");
  const [isMobileThrough, setIsMobileThrough] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const mobileNoRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [open, setOpen] = useState(false); // Track dropdown open/close
  const [isOtpNewUi, setIsOtpNewUi] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
  const cancelRedireactUrl = `/LoginOption?LoginRedirect=${search}`;
  const singupRedirectUrl = `/LoginOption?LoginRedirect=${search}`;

  const handleKeyDown = (event, nextRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextRef.current.focus();
    }
  };

  const handleCountryChange = (event, value) => {
    if (value) {
      setCountrycodestate(value.phone); // Update country code
      setOpen(false); // Close the dropdown once a selection is made
    }
  };

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("registerEmail");
    const routeMobileNo = sessionStorage.getItem("registerMobile");
    const storedCountryCode = sessionStorage.getItem("Countrycodestate");

    if (routeMobileNo) {
      setMobileNo(routeMobileNo);
      setIsMobileThrough(true);
      if (mobileNoRef.current) mobileNoRef.current.disabled = true;
    } else {
      setIsMobileThrough(false);
      if (mobileNoRef.current) mobileNoRef.current.disabled = false;
    }

    if (storedCountryCode) {
      setCountrycodestate(storedCountryCode);
    }

    if (storedEmail) {
      setEmail(storedEmail);
      if (emailRef.current) emailRef.current.disabled = true;
    } else {
      if (emailRef.current) emailRef.current.disabled = false;
    }
  }, [location.searchParams]);

  const handleInputChange = (e, setter, fieldName) => {
    const { value } = e.target;
    setter(value);

    if (fieldName === "firstName") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "First Name is required" }));
      } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "Invalid First Name" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
      }
    } else if (fieldName === "lastName") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "Last Name is required" }));
      } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "Invalid Last Name" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
      }
    } else if (fieldName === "mobileNo") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, mobileNo: "Mobile No. is required" }));
      }
    } else if (fieldName === "email") {
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Email is required" }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Please enter a valid email address" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }
    } else if (fieldName === "confirmPassword") {
      // Handle confirm password validation
      if (!value.trim()) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Confirm Password is required" }));
      } else if (value !== password) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      }
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
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[^\w\d\s]).{8,}$/;
    return passwordRegex.test(value);
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    if (!value.trim()) {
      setPasswordError("Password is required");
    } else if (!validatePassword(value)) {
      setPasswordError("Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character!");
    } else if (value === confirmPassword) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      setPasswordError("");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!firstName.trim()) {
      errors.firstName = "First Name is required";
    } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(firstName)) {
      errors.firstName = "First Name should not start with a numeric, special character, or space";
    }
    if (!lastName.trim()) {
      errors.lastName = "Last Name is required";
    } else if (!/^(?![\d\s!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`])[^\s][^\n]+$/.test(lastName)) {
      errors.lastName = "Last Name should not start with a numeric, special character, or space";
    }
    if (!mobileNo.trim()) {
      errors.mobileNo = "Mobile No. is required";
    } else if (Errors.mobileNo) {
      errors.mobileNo = Errors.mobileNo;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      errors.password = "Password is required";
    } else if (!validatePassword(password)) {
      errors.password = "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character!";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length === 0 && passwordError.length === 0) {
      const hashedPassword = hashPasswordSHA1(password);

      setIsLoading(true);
      // try {
      //   const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
      //   const { FrontEnd_RegNo, IsB2BWebsite } = storeInit;
      //   const combinedValue = JSON.stringify({
      //     firstname: `${firstName}`, lastname: `${lastName}`, userid: `${(email).toLocaleLowerCase()}`, country_code: '91', mobile: `${mobileNo}`, pass: `${hashedPassword}`, IsB2BWebsite: `${IsB2BWebsite}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: '0'
      //   });
      //   const encodedCombinedValue = btoa(combinedValue);
      //   const body = {
      //     "con": "{\"id\":\"\",\"mode\":\"WEBSIGNUP\"}",
      //     "f": "Register (handleSubmit)",
      //     "p": encodedCombinedValue
      //   }
      //   const response = await CommonAPI(body);

      RegisterAPI(firstName, lastName, email, mobileNo, hashedPassword, Countrycodestate, countryShortName)
        .then((response) => {
          setIsLoading(false);
          if (response.Data.rd[0].stat === 1) {
            navigation(singupRedirectUrl);

            // sessionStorage.setItem('LoginUser', true)
            // sessionStorage.setItem('loginUserDetail', JSON.stringify(response.Data?.rd[0]));
            // setIsLoginState(true)
            // sessionStorage.setItem('registerEmail', email)

            // if (redirectEmailUrl) {
            //   navigation(redirectEmailUrl);
            // } else {
            //   navigation('/')
            // }
          } else {
            if (response.Data?.rd[0].ismobileexists === 1) {
              errors.mobileNo = response.Data.rd[0].stat_msg;
            }
            if (response.Data?.rd[0].isemailexists === 1) {
              errors.email = response.Data.rd[0].stat_msg;
            }
            setErrors(errors);
          }
        })
        .catch((err) => console.log(err));

      // } catch (error) {
      //   console.error('Error:', error);
      // } finally {
      //   setIsLoading(false);
      // }
    } else {
      setErrors(errors);
    }
  };

  return <>

    <Box
      sx={{
        minHeight: '110vh',
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
            onClick={() => navigation(cancelRedireactUrl)}
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
                bgcolor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}

              className="btnColorProCat"
            >
              <PersonAddOutlinedIcon
                sx={{
                  fontSize: 32,
                }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 400,
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                textAlign: 'center'
              }}
            >
              Create Account
            </Typography>

            {/* Form */}
            <Stack
              spacing={2.5}
              width="100%"
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ maxWidth: 400, mx: 'auto', mt: 2 }}
            >
              <TextField
                autoFocus
                name="user-firstName"
                id="firstName"
                label="First Name"
                variant="outlined"
                fullWidth
                value={firstName}
                inputRef={firstNameRef}
                onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
                onChange={(e) => handleInputChange(e, setFirstName, "firstName")}
                error={!!Errors.firstName}
                helperText={Errors.firstName}
                disabled={isLoading}

              />

              <TextField
                name="user-lastName"
                id="lastName"
                label="Last Name"
                variant="outlined"
                fullWidth
                value={lastName}
                inputRef={lastNameRef}
                onKeyDown={(e) => handleKeyDown(e, mobileNoRef)}
                onChange={(e) => handleInputChange(e, setLastName, "lastName")}
                error={!!Errors.lastName}
                helperText={Errors.lastName}
                disabled={isLoading}

              />

              {isOtpNewUi ? (
                <CountryDropDown
                  Errors={Errors}
                  handleInputChange={handleInputChange}
                  handleKeyDown={handleKeyDown}
                  Countrycodestate={Countrycodestate}
                  setCountrycodestate={setCountrycodestate}
                  setCountryShortName={setCountryShortName}
                  IsMobileThrough={isMobileThrough}
                  emailRef={emailRef}
                  mobileNo={mobileNo}
                  mobileNoRef={mobileNoRef}
                  setMobileNo={setMobileNo}
                  setErrors={setErrors}
                />
              ) : (
                <TextField
                  id="mobileNo"
                  label="Mobile No."
                  name="Mobile No."
                  autoComplete="tel"
                  variant="outlined"
                  fullWidth
                  value={mobileNo}
                  inputRef={mobileNoRef}
                  onKeyDown={(e) => handleKeyDown(e, emailRef)}
                  onChange={(e) => handleInputChange(e, setMobileNo, "mobileNo")}
                  error={!!Errors.mobileNo}
                  helperText={Errors.mobileNo}
                  disabled={isLoading}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              )}

              <TextField
                name="user-email"
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                variant="outlined"
                fullWidth
                value={email}
                inputRef={emailRef}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                onChange={(e) => handleInputChange(e, setEmail, "email")}
                error={!!Errors.email}
                helperText={Errors.email}
                disabled={isLoading}

              />

              <TextField
                name="user-password"
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                error={!!passwordError}
                helperText={passwordError}
                inputRef={passwordRef}
                onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
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
                  sx: { borderRadius: 2 }
                }}
              />

              <TextField
                name="user-confirmPassword"
                id="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                inputRef={confirmPasswordRef}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSubmit();
                  }
                }}
                onChange={(e) => handleInputChange(e, setConfirmPassword, "confirmPassword")}
                error={!!Errors.confirmPassword}
                helperText={Errors.confirmPassword}
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
                  sx: { borderRadius: 2 }
                }}
              />

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                color="success"
                disabled={isLoading}
                className="btnColorProCat"
                sx={{
                  mt: 2,
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
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Button
                fullWidth
                size="large"
                variant="text"
                onClick={() => navigation(cancelRedireactUrl)}
                disabled={isLoading}
                startIcon={<ArrowBackIcon />}
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
                Back to Login
              </Button>
            </Stack>

            {/* Terms Note */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                textAlign: 'center',
                maxWidth: 350,
                mt: 2,
                display: 'block'
              }}
            >
              By creating an account, you agree to our Terms of Use and Privacy Policy
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  </>

  return (
    <div className="smr_registerMain">
      {isLoading && (
        <div className="loader-overlay">
          <CircularProgress className="loadingBarManage" />
        </div>
      )}
      <div>
        {/* style={{ backgroundColor: '#c0bbb1' }} */}
        <div className="smling-register-main">
          <p
            style={{
              textAlign: "center",
              marginTop: "0px",
              paddingTop: "5%",
              fontSize: "40px",
              color: "#7d7f85",
            }}
            className="AuthScreenRegisterMainTitle"
          >
            Register
          </p>

          <form
            noValidate
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onSubmit={handleSubmit}
          >
            <TextField name="user-firstName" autoFocus id="outlined-basic firstName" label="First Name" variant="outlined" className="labgrowRegister" style={{ margin: "15px" }} value={firstName} inputRef={firstNameRef} onKeyDown={(e) => handleKeyDown(e, lastNameRef)} onChange={(e) => handleInputChange(e, setFirstName, "firstName")} error={!!Errors.firstName} helperText={Errors.firstName} />

            <TextField name="user-lastName" id="outlined-basic lastName" label="Last Name" variant="outlined" className="labgrowRegister" style={{ margin: "15px" }} value={lastName} inputRef={lastNameRef} onKeyDown={(e) => handleKeyDown(e, mobileNoRef)} onChange={(e) => handleInputChange(e, setLastName, "lastName")} error={!!Errors.lastName} helperText={Errors.lastName} />
            {isOtpNewUi ? <CountryDropDown Errors={Errors} handleInputChange={handleInputChange} handleKeyDown={handleKeyDown} Countrycodestate={Countrycodestate} setCountrycodestate={setCountrycodestate} setCountryShortName={setCountryShortName} IsMobileThrough={isMobileThrough} emailRef={emailRef} mobileNo={mobileNo} mobileNoRef={mobileNoRef} setMobileNo={setMobileNo} setErrors={setErrors} /> : <TextField id="outlined-basic" label="Mobile No." name="Mobile No." autoComplete="Mobile No." variant="outlined" className="labgrowRegister" style={{ margin: "15px" }} value={mobileNo} inputRef={mobileNoRef} onKeyDown={(e) => handleKeyDown(e, emailRef)} onChange={(e) => handleInputChange(e, setMobileNo, "mobileNo")} error={!!Errors.mobileNo} helperText={Errors.mobileNo} />}
            <TextField name="user-email" id="outlined-basic email" label="Email" autoComplete="smr_registerEmail" variant="outlined" className="labgrowRegister" style={{ margin: "15px" }} value={email} inputRef={emailRef} onKeyDown={(e) => handleKeyDown(e, passwordRef)} onChange={(e) => handleInputChange(e, setEmail, "email")} error={!!Errors.email} helperText={Errors.email} />

            <TextField
              name="user-password"
              id="outlined-password-input password"
              label="Password"
              type={showPassword ? "text" : "password"}
              className="labgrowRegister"
              autoComplete="new-password" // Explicitly telling the browser not to autocomplete this field
              style={{ margin: "15px" }}
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
              inputRef={passwordRef}
              onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
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
              name="user-confirmPassword"
              id="outlined-confirm-password-input  confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              className="labgrowRegister"
              style={{ margin: "15px" }}
              autoComplete="new-password" // Avoid autofill by browsers for password
              value={confirmPassword}
              inputRef={confirmPasswordRef}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit();
                }
              }}
              onChange={(e) => handleInputChange(e, setConfirmPassword, "confirmPassword")}
              error={!!Errors.confirmPassword}
              helperText={Errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => handleTogglePasswordVisibility("confirmPassword")} onMouseDown={handleMouseDownConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <button type="submit" className="createBtnRegister btnColorProCat">
              CREATE ACCOUNT
            </button>

            <Button style={{ marginTop: "10px", color: "gray" }} onClick={() => navigation(cancelRedireactUrl)}>
              BACK
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
