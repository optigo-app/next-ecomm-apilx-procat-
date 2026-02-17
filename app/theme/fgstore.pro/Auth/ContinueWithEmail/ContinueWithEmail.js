import React, { useEffect, useState } from 'react';
import './ContinueWithEmail.modul.scss';
import { toast } from 'react-toastify';
import { ContinueWithEmailAPI } from '@/app/(core)/utils/API/Auth/ContinueWithEmailAPI';
import OTPContainer from '@/app/(core)/utils/Glob_Functions/Otpflow/App';
import { useRouter } from 'next/navigation';

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
    useMediaQuery
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function ContinueWithEmail({ params, searchParams, storeInit }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const Router = useRouter();
    const navigation = (path) => {
        Router.push(path)
    }
    const paramsObj = searchParams || {};
    const search = paramsObj.LoginRedirect || paramsObj.loginRedirect || paramsObj.search || "";
    const securityKey = searchParams?.SK || searchParams?.SecurityKey || "";

    const redirectEmailUrl = `/LoginWithEmail?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;
    const redirectSignUpUrl = `/register?LoginRedirect=${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;
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
            setEmailError('Email is required.');
        } else if (!validateEmail(trimmedValue)) {
            setEmailError('Please enter a valid email');
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setEmailError('Email is required.');
            return;
        }
        if (!validateEmail(trimmedEmail)) {
            setEmailError('Please enter a valid email.');
            return;
        }

        setIsLoading(true);
        ContinueWithEmailAPI(trimmedEmail).then((response) => {
            setIsLoading(false);
            if (response.Data.rd[0].stat == 1 && response.Data.rd[0].islead == 1) {
                toast.error('You are not a customer, contact to admin')
            } else if (response.Data.rd[0].stat == 1 && response.Data.rd[0].islead == 0) {
                navigation(redirectEmailUrl);
                if (trimmedEmail) {
                    sessionStorage.setItem("registerEmail", trimmedEmail);
                }
            } else {
                if (storeInit?.IsEcomOtpVerification != 0) {
                    if (process.env.NODE_ENV === "development") {
                        alert(response.Data.rd[0].OTP)
                    }
                    setIsOpen(true)
                } else {
                    navigation(redirectSignUpUrl);
                    if (trimmedEmail) {
                        sessionStorage.setItem("registerEmail", trimmedEmail);
                    }
                }
            }
        }).catch((err) => console.log(err))
    };

    useEffect(() => {
        sessionStorage.removeItem("Countrycodestate")
    }, [])

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                minHeight: '70vh',
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

            {/* OTP Modal Container */}
            {storeInit?.IsEcomOtpVerification === 1 && (
                <OTPContainer
                    emailId={email.trim()}
                    isOpen={isOpen}
                    type='email'
                    setIsOpen={() => setIsOpen(!isOpen)}
                    onClose={() => setIsOpen(false)}
                    navigation={navigation}
                    location={location}
                    onResend={handleSubmit}
                    isLoading={isLoading}
                    searchParams={searchParams}
                />
            )}

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
                                Continue with Email
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    maxWidth: 400,
                                    mx: 'auto',
                                    lineHeight: 1.3,
                                    fontSize: '1rem'
                                }}
                            >
                               We'll check if you have an account, and help create one if you don't.
                            </Typography>
                        </Box>

                        {/* Form */}
                        <Stack
                            spacing={2}
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
                                id="email"
                                label="Email Address"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={handleEmailChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSubmit();
                                }}
                                error={!!emailError}
                                helperText={emailError}
                                disabled={isLoading}
                                InputProps={{
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

                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                variant="contained"
                                disabled={isLoading || !email.trim()}
                                sx={{
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    boxShadow: 'none',
                                    transition: 'all 0.2s ease-in-out',
                                }}
                                className='btnColorProCat'
                            >
                                {isLoading ? 'Processing...' : 'Continue'}
                            </Button>

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
        <div className='proCat_continuemail'>
            {isLoading && (
                <div className="loader-overlay" style={{ zIndex: 99999999 }}>
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div>
                {(storeInit?.IsEcomOtpVerification && storeInit?.IsEcomOtpVerification === 1) ? (
                    <OTPContainer emailId={email.trim()} isOpen={isOpen} type='email' setIsOpen={() => setIsOpen(!isOpen)} onClose={() => setIsOpen(false)}
                        navigation={navigation}
                        location={location}
                        onResend={handleSubmit}
                        isLoading={isLoading}
                    />
                ) : null}
                <div className='smling-forgot-main'>
                    <p style={{
                        textAlign: 'center',
                        paddingBlock: '60px',
                        marginTop: '0px',
                        fontSize: '40px',
                        color: '#7d7f85',
                        fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif'
                    }}
                        className='AuthScreenMainTitle'
                    >Continue With Email</p>
                    <p style={{
                        textAlign: 'center',
                        marginTop: '-40px',
                        fontSize: '15px',
                        color: '#7d7f85',
                        fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif',
                        marginBottom: '25px'
                    }}

                        className='AuthScreenSubTitle'
                    >We'll check if you have an account, and help create one if you don't.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                            autoFocus
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            className='smr_continuEmailBox'
                            style={{ margin: '15px' }}
                            value={email}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                            onChange={handleEmailChange}
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <button type='submit' className='submitBtnForgot btnColorProCat' onClick={handleSubmit}>SUBMIT</button>
                        <Button className='pro_cancleForgot' style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation(cancelRedireactUrl)}>CANCEL</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
