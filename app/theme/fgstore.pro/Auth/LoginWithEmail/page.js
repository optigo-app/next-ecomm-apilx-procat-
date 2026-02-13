'use client'
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import './LoginWithEmail.modul.scss'
import { LoginWithEmailAPI } from '@/app/(core)/utils/API/Auth/LoginWithEmailAPI';
import { ForgotPasswordEmailAPI } from '@/app/(core)/utils/API/Auth/ForgotPasswordEmailAPI';
import Cookies from 'js-cookie';
import { CurrencyComboAPI } from '@/app/(core)/utils/API/Combo/CurrencyComboAPI';
import { MetalColorCombo } from '@/app/(core)/utils/API/Combo/MetalColorCombo';
import { MetalTypeComboAPI } from '@/app/(core)/utils/API/Combo/MetalTypeComboAPI';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import { generateToken } from '@/app/(core)/utils/Glob_Functions/Tokenizer';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';


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
  useMediaQuery
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function LoginWithEmail({ params, searchParams, storeInit }) {
  const { islogin, setislogin, setCartCountNum, setWishCountNum } = useStore();
  const [email, setEmail] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isOtpNewUi, setIsOtpNewUi] = useState(true);
  const { push } = useNextRouterLikeRR();
  const navigation = push;
  const location = useNextRouterLikeRR();

  const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
  const securityKey = searchParams?.SK || searchParams?.SecurityKey || location?.state?.SecurityKey || "";

  const redirectEmailUrl = search ? decodeURIComponent(search) : "/";
  const cancelRedireactUrl = `/LoginOption?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;

  useEffect(() => {
    const storedEmail = (() => {
      const raw = sessionStorage.getItem("registerEmail");
      if (!raw) return "";
      try {
        return raw.trim().startsWith("{") || raw.trim().startsWith("[") || raw.trim().startsWith('"')
          ? JSON.parse(raw)
          : raw;
      } catch {
        return raw;
      }
    })();
    if (storedEmail) setEmail(storedEmail);
  }, []);



  const handleInputChange = (e, setter, fieldName) => {
    const { value } = e.target;
    setter(value);
    if (fieldName === 'confirmPassword') {
      if (!value.trim()) {
        setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Password is required' }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
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
    const visiterId = Cookies.get('visiterId');
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Password is required';
      return;
    }

    const hashedPassword = hashPasswordSHA1(confirmPassword);

    setIsLoading(true);
    LoginWithEmailAPI(email, '', hashedPassword, '', '', visiterId).then((response) => {
      setIsLoading(false);
      if (response.Data.rd[0].stat === 1) {
        const visiterID = Cookies.get('visiterId');
        Cookies.set('userLoginCookie', response?.Data?.rd[0]?.Token);
        // rememberMe 
        if (isOtpNewUi) {
          if (rememberMe) {
            const Token = generateToken(response?.Data?.rd[0]?.Token, 1);
            localStorage?.setItem('AuthToken', JSON?.stringify(Token));
          } else {
            const Token = generateToken(response?.Data?.rd[0]?.Token, 0);
            sessionStorage?.setItem('AuthToken', JSON?.stringify(Token));
          }
        }
        sessionStorage.setItem('registerEmail', email)
        setislogin(true)
        sessionStorage.setItem('LoginUser', true)
        sessionStorage.setItem('loginUserDetail', JSON.stringify(response.Data.rd[0]));

        GetCountAPI(visiterID).then((res) => {
          if (res) {
            setCartCountNum(res?.cartcount)
            setWishCountNum(res?.wishcount)
          }
        }).catch((err) => {
          if (err) {
            console.log("getCountApiErr", err);
          }
        })

        CurrencyComboAPI(response?.Data?.rd[0]?.id).then((response) => {
          if (response?.Data?.rd) {
            let data = JSON.stringify(response?.Data?.rd)
            sessionStorage.setItem('CurrencyCombo', data)
          }
        }).catch((err) => console.log(err))


        MetalColorCombo(response?.Data?.rd[0]?.id).then((response) => {
          if (response?.Data?.rd) {
            let data = JSON.stringify(response?.Data?.rd)
            sessionStorage.setItem('MetalColorCombo', data)
          }
        }).catch((err) => console.log(err))


        MetalTypeComboAPI(response?.Data?.rd[0]?.id).then((response) => {
          if (response?.Data?.rd) {
            let data = JSON.stringify(response?.Data?.rd)
            sessionStorage.setItem('metalTypeCombo', data)
          }
        }).catch((err) => console.log(err))

        if (redirectEmailUrl) {
          console.log("🚀 ~ handleSubmit ~ redirectEmailUrl:", redirectEmailUrl)

          let finalRedirectUrl = redirectEmailUrl;
          if (securityKey) {
            const separator = finalRedirectUrl.includes('?') ? '&' : '?';
            finalRedirectUrl = `${finalRedirectUrl}${separator}SK=${encodeURIComponent(securityKey)}`;
          }

          window.location.href = finalRedirectUrl;
        } else {
          console.log("🚀 ~ handleSubmit ~ else:")
          window.location.href = securityKey ? `/?SK=${encodeURIComponent(securityKey)}` : '/';
        }

      } else {
        if (response.Data.rd[0].stat_msg == "User Time Off") {
          errors.confirmPassword = 'User Time Off'
        } else if (response.Data.rd[0].stat_msg == 'User Login Off') {
          errors.confirmPassword = 'User Login Off'
        } else if (response.Data.rd[0].stat_msg == 'User Not Active') {
          errors.confirmPassword = 'User Not Active'
        } else {
          errors.confirmPassword = 'Password is Invalid'
        }
      }
    }).catch((err) => console.log(err))

  };



  const handleTogglePasswordVisibility = (fieldName) => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNavigation = () => {
    sessionStorage.setItem('LoginCodeEmail', 'true');
    navigation(`/LoginWithEmailCode?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`);
    sessionStorage.setItem('email', JSON.stringify(location.state?.email))
  }

  const handleForgotPassword = async () => {
    let Domian = `${window?.location?.protocol}//${storeInit?.domain}`
    setIsLoading(true);
    ForgotPasswordEmailAPI(Domian, email).then((response) => {
      setIsLoading(false);
      if (response.Data.rd[0].stat === 1) {
        toast.success('Reset Link Send On Your Email');
      } else {
        alert('Error')
      }
    }).catch((err) => console.log(err))

  }

  const HandleCancel = () => {
    navigation(`/LoginOption?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`)
  }

   const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
      <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'white',
         p: { xs: 0, sm: 0 },
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
            onClick={HandleCancel}
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
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}
                className='btnColorProCat'
            >
              <LockOutlinedIcon 
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
                Login with Password
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={1} 
                justifyContent="center" 
                alignItems="center"
                sx={{ color: 'text.secondary' }}
              >
               <IconButton>
                 <EmailOutlinedIcon sx={{ fontSize: 18 }} />
               </IconButton>
                <Typography variant="body1">
                  {email}
                </Typography>
              </Stack>
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
                fullWidth
                id="password"
                label="Password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={confirmPassword}
                onChange={(e) => handleInputChange(e, setConfirmPassword, 'confirmPassword')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: 'background.paper'
                  }
                }}
                FormHelperTextProps={{
                  sx: { 
                    ml: 0,
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }
                }}
              />

              {/* Remember Me & Forgot Password Row */}
              <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center"
                sx={{ mt: 0.5 }}
              >
                {isOtpNewUi ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
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
                    textTransform: 'none',
                    fontWeight: 500,
                    p: 0,
                    minWidth: 'auto',
                    color: 'primary.main',
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot Password?
                </Button>
              </Stack>

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                 className='btnColorProCat'
                disabled={isLoading || !confirmPassword.trim()}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500'
                  }
                }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              {/* Divider */}
              <Divider sx={{ my: 2 }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ px: 1 }}
                >
                  OR
                </Typography>
              </Divider>

              {/* Login with Code Option */}
              <Button
                fullWidth
                size="large"
                variant="outlined"
                onClick={handleNavigation}
                startIcon={<EmailOutlinedIcon />}
                className='btnColorProCat'
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Login with Code Instead
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                sx={{ display: 'block', mt: 1 }}
              >
                Go passwordless! We'll send you an email.
              </Typography>

              <Button
                fullWidth
                size="large"
                variant="text"
                onClick={HandleCancel}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  mt: 1,
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
  )

  return (
    <div className='proCat_loginEmail'>
      {isLoading && (
        <div className="loader-overlay">
          <CircularProgress className='loadingBarManage' />
        </div>
      )}
      <div>
        <div className='smr_loginEmailD'>
          <p style={{
            textAlign: 'center',
            paddingBlock: '60px',
            marginTop: '0px',
            fontSize: '40px',
            color: '#7d7f85',
            fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif'
          }}
            className='AuthScreenMainTitle'
          >Login With Password</p>
          <p style={{
            textAlign: 'center',
            marginTop: '-60px',
            fontSize: '15px',
            color: '#7d7f85',
            fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif'
          }}
            className='AuthScreenSubTitle'
          >using {email}</p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              autoFocus
              id="outlined-confirm-password-input"
              label="Password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className='smr_loginPasswordBox'
              style={{ margin: '15px' }}
              value={confirmPassword}
              onChange={(e) => handleInputChange(e, setConfirmPassword, 'confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                      onMouseDown={handleMouseDownConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {isOtpNewUi &&
              <FormControlLabel
                className='smr_loginPasswordBox'
                sx={{
                  height: '0px', padding: '0px', width: '0px', margin: '0px'
                }}
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember Me"
              />}

            <button className='submitBtnForgot btnColorProCat' onClick={handleSubmit}>Login</button>

            <button type='submit' className='pro_SmilingLoginCodeBtn btnColorProCat' onClick={handleNavigation}>Login With a Code instead on email</button>
            <p className='pro_loginText' style={{ textAlign: 'center', marginTop: '20px' }}>Go passwordless! we'll send you an email.</p>

            <p style={{ color: 'blue', cursor: 'pointer' }} onClick={handleForgotPassword}>Forgot Password ?</p>
            <Button className='pro_cancleForgot' style={{ marginTop: '10px', color: 'gray' }} onClick={HandleCancel}>CANCEL</Button>
          </div>
        </div>
      </div>
    </div >
  );
}
