"use client"
import React, { useEffect, useState } from 'react';
import './LoginWithMobileCode.modul.scss';
import { ContimueWithMobileAPI } from '@/app/(core)/utils/API/Auth/ContimueWithMobileAPI';
import { toast } from 'react-toastify';
import { LoginWithEmailAPI } from '@/app/(core)/utils/API/Auth/LoginWithEmailAPI';
import Cookies from 'js-cookie';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import OTP from './OTP';
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
import RefreshIcon from "@mui/icons-material/Refresh";


export default function LoginWithMobileCode({ params, searchParams }) {
    const location = useNextRouterLikeRR();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigation = location?.push;
    const [mobileNo, setMobileNo] = useState('');
    const [enterOTP, setEnterOTP] = useState('');
    const [resendTimer, setResendTimer] = useState(120);
    const [isLoginState, setIsLoginState] = useState(false)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

    const handleInputChange = (e, setter, fieldName) => {
        const { value } = e.target;
        setter(value);
        if (fieldName === 'mobileNo') {
            if (!value.trim()) {
                setErrors(prevErrors => ({ ...prevErrors, otp: 'Code is required' }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, otp: '' }));
            }
        }
    };

    const handleSubmit = async () => {
        const visiterId = Cookies.get('visiterId');
        if (enterOTP.length < 5) {
            setErrors(prevErrors => ({ ...prevErrors, otp: 'Please complete the code.' }));
            return;
        }
        LoginWithEmailAPI('', mobileNo, enterOTP, 'otp_mobile_login', '', visiterId).then((response) => {
            if (response.Data.rd[0].stat === 1) {
                Cookies.set('LoginUser', true)
                sessionStorage.setItem('LoginUser', true)
                setIsLoginState(true)
                sessionStorage.setItem('loginUserDetail', JSON.stringify(response.Data.rd[0]));
                sessionStorage.setItem('registerMobile', mobileNo);

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
                setErrors(prevErrors => ({ ...prevErrors, otp: 'Invalid Code' }));
            }
        }).catch((err) => console.log(err))
    };


    const handleResendCode = async () => {
        setResendTimer(120);
        setIsLoading(true);
        ContimueWithMobileAPI(mobileNo).then((response) => {
            setIsLoading(false);
            if (response.Data.rd[0].stat === '1') {
                toast.success('OTP send Sucssessfully');
            } else {
                alert('Error..')
            }
        }).catch((err) => console.log(err))
    };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };


     return (
    <Box
      sx={{
        minHeight: '80vh',
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
          sx={{ p: { xs: 1.5, sm: 5 },
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
                bgcolor: 'secondary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}
              className='btnColorProCat'
            >
              <SmartphoneOutlinedIcon 
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
                  mb: 1.5,
                  fontSize: { xs: '1.75rem', sm: '2.25rem' }
                }}
              >
                Login with Code
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
                Last step! To secure your account, enter the code we just sent to{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    wordBreak: 'break-all'
                  }}
                >
                  {mobileNo}
                </Box>
              </Typography>
            </Box>

            {/* OTP Input Section */}
            <Stack 
              spacing={3} 
              width="100%" 
              alignItems="center"
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              sx={{ maxWidth: 400, mx: 'auto', mt: 2 }}
            >
              {/* OTP Component */}
              <Box sx={{ width: '100%' }}>
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
                      display: 'block',
                      textAlign: 'center',
                      mt: 1,
                      fontWeight: 500
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
                variant="contained"
                color="secondary"
                       className='btnColorProCat'
                disabled={isLoading || enterOTP.length !== 6}
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
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </Button>

              {/* Resend Code Section */}
              <Box textAlign="center" sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Didn't get the code?{' '}
                  {resendTimer === 0 ? (
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={handleResendCode}
                      sx={{
                        fontWeight: 600,
                        color: 'secondary.main',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: 'inherit',
                        fontFamily: 'inherit',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Resend Code
                    </MuiLink>
                  ) : (
                    <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      Resend in {formatTime(resendTimer)}
                    </Box>
                  )}
                </Typography>
              </Box>

              <Button
                fullWidth
                size="large"
                variant="text"
                onClick={() => navigation(cancelRedireactUrl)}
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
        <div className='smr_loginmobileCodeMain'>
            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div >
                {/* style={{ backgroundColor: '#c0bbb1' }} */}
                <div className='smling-forgot-main'>
                    <p style={{
                        textAlign: 'center',
                        paddingBlock: '60px',
                        marginTop: '0px',
                        fontSize: '40px',
                        color: '#7d7f85',
                        marginBottom: '10px'

                    }}
                        className='AuthScreenMainTitle'
                    >Login With Code</p>
                    <p style={{
                        textAlign: 'center',
                        marginTop: '-80px',
                        fontSize: '15px',
                        color: '#7d7f85',

                    }}
                        className='AuthScreenSubTitle'
                    >Last step! To secure your account, enter the code we just sent to {mobileNo}.</p>

                    <div className='fg_opt_div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                        <OTP separator={<span> </span>} value={enterOTP} onChange={setEnterOTP} length={6} onSubmit={handleSubmit} />

                        {errors.otp && (
                            <p style={{ color: 'red', marginTop: '5px' }}>{errors.otp}</p>
                        )}

                        <button className='submitBtnForgot_for btnColorProCat' style={{ marginTop: '20px' }} onClick={handleSubmit}>Login</button>
                        <p className='resend_msg' style={{ marginTop: '10px' }}>Didn't get the code ? {resendTimer === 0 ? <span style={{ fontWeight: 500, color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleResendCode}>Resend Code</span> : <span>Resend in {Math.floor(resendTimer / 60).toString().padStart(2, '0')}:{(resendTimer % 60).toString().padStart(2, '0')}</span>}</p>
                        <Button style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation(cancelRedireactUrl)}>CANCEL</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
