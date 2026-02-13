"use client";
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { LoginWithEmailCodeAPI } from '@/app/(core)/utils/API/Auth/LoginWithEmailCodeAPI';
import { LoginWithEmailAPI } from '@/app/(core)/utils/API/Auth/LoginWithEmailAPI';
import Cookies from 'js-cookie';
import OTP from './OTP'; // Make sure the path is correct
import './LoginWithEmailCode.modul.scss'
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
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
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function LoginWithEmailCode({ params, searchParams }) {
    const location = useNextRouterLikeRR();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(120);
    const navigation = location.push;
    const [isLoginState, setIsLoginState] = useState(false);
    const inputsRef = useRef([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
    const updatedSearch = search?.replace('?LoginRedirect=', '');
    const redirectEmailUrl = `${decodeURIComponent(updatedSearch)}`;
    const cancelRedireactUrl = `/LoginOption?${search}`;

    useEffect(() => {
        const fetchData = async () => {
            const storedEmail = sessionStorage.getItem('registerEmail');
            if (storedEmail) {
                setEmail(storedEmail);
                const value = sessionStorage.getItem('LoginCodeEmail');
                if (value === 'true') {
                    sessionStorage.setItem('LoginCodeEmail', 'false');
                    LoginWithEmailCodeAPI(storedEmail).then((response) => {
                        if (response.Data.rd[0].stat === '1') {
                            toast.success('OTP sent successfully');
                        } else {
                            toast.error('OTP send error');
                        }
                    }).catch((err) => console.log(err));
                }
            }
        };
        fetchData();
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
        if (otp.length < 5) {
            setErrors({ otp: 'Please complete the code.' });
            return;
        }

        setIsLoading(true);
        LoginWithEmailAPI(email, '', otp, 'otp_email_login', '', visiterId).then((response) => {
            setIsLoading(false);
            if (response?.Data?.rd[0]?.stat === 1) {
                setIsLoginState(true);
                Cookies.set('LoginUser', true)
                sessionStorage.setItem('LoginUser', true);
                sessionStorage.setItem('loginUserDetail', JSON.stringify(response.Data.rd[0]));

                if (redirectEmailUrl) {
                    const securityKey = searchParams?.SK || searchParams?.SecurityKey || "";
                    let finalRedirectUrl = redirectEmailUrl;
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
                setErrors({ otp: 'The code you entered is invalid.' });
            }
        }).catch((err) => {
            setIsLoading(false);
            console.log(err);
            setErrors({ otp: 'An error occurred while logging in. Please try again.' });
        });
    };

    const handleResendCode = async () => {
        setResendTimer(120);
        LoginWithEmailCodeAPI(email).then((response) => {
            if (response.Data.rd[0].stat === '1') {
                sessionStorage.setItem('LoginCodeEmail', 'false');
                toast.success('OTP sent successfully');
            } else {
                toast.error('OTP send error');
            }
        }).catch((err) => console.log(err));
    };


    // Format timer as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };


    return <>

        <Box
            sx={{
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
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
                        p: { xs: 1.5, sm: 5 },
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
                                bgcolor: 'primary.light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1
                            }}
                            className="btnColorProCat"
                        >
                            <EmailOutlinedIcon
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
                                    {email}
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
                                    value={otp}
                                    onChange={setOtp}
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
                                disabled={isLoading || otp.length !== 6}
                                className="btnColorProCat"
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
                                                color: 'primary.main',
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
    </>

    return (
        <div className='smr_loginwithemailCode' style={{ paddingTop: '10px' }}>
            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div >
                <div className='smling-forgot-main' >
                    <p style={{
                        textAlign: 'center',
                        paddingBlock: '60px',
                        marginTop: '15px',
                        fontSize: '40px',
                        color: '#7d7f85',
                        marginBottom: '15px',

                    }}
                        className='AuthScreenMainTitle'
                    >Login With Code</p>
                    <p style={{
                        textAlign: 'center',
                        marginTop: '-70px',
                        fontSize: '15px',
                        color: '#7d7f85',

                    }}
                        className='AuthScreenSubTitle'
                    >Last step! To secure your account, enter the code we just sent to {email}.</p>

                    <div className='fg_opt_div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                        <OTP separator={<span> </span>} value={otp} onChange={setOtp} length={6} onSubmit={handleSubmit} />
                        {errors.otp && (
                            <p style={{ color: 'red', marginTop: '5px' }}>{errors.otp}</p>
                        )}
                        <button className='submitBtnForgot btnColorProCat' style={{
                            marginTop: '20px'
                        }} onClick={handleSubmit}>Login</button>
                        <p className='fg_resnd_msg' style={{ marginTop: '10px' }}>Didn't get the code? {resendTimer === 0 ? <span style={{ fontWeight: 500, color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleResendCode}>Resend Code</span> : <span>Resend in {Math.floor(resendTimer / 60).toString().padStart(2, '0')}:{(resendTimer % 60).toString().padStart(2, '0')}</span>}</p>
                        <Button style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation(cancelRedireactUrl)}>CANCEL</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}


