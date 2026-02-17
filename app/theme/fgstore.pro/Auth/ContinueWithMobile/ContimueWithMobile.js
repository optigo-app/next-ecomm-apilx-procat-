import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { ContimueWithMobileAPI } from '@/app/(core)/utils/API/Auth/ContimueWithMobileAPI';
import './ContimueWithMobile.modul.scss'
import OTPContainer from '@/app/(core)/utils/Glob_Functions/Otpflow/App';
import ContinueMobile from '@/app/(core)/utils/Glob_Functions/CountryDropDown/ContinueMobile';
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
    useMediaQuery
} from "@mui/material";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function ContimueWithMobile({ params, searchParams, storeInit }) {
    const location = useNextRouterLikeRR();
    const [mobileNo, setMobileNo] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [buttonFocused, setButtonFocused] = useState(false);
    const navigation = location?.push;
    const [isOpen, setIsOpen] = useState(false)
    const [Countrycodestate, setCountrycodestate] = useState();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
    const securityKey = searchParams?.SK || searchParams?.SecurityKey || "";

    const updatedSearch = search?.replace('?LoginRedirect=', '');
    const redirectMobileUrl = `/LoginWithMobileCode?${updatedSearch}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;
    const redirectSignUpUrl = `/register?${updatedSearch}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;
    const cancelRedireactUrl = `/LoginOption?${search}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}`;

    const handleInputChange = (e, setter, fieldName) => {
        const { value } = e.target;
        const trimmedValue = value.trim();
        const formattedValue = trimmedValue.replace(/\s/g, '');

        setter(formattedValue);

    };

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        if (!mobileNo.trim()) {
            setErrors({ mobileNo: 'Mobile No. is required' });
            return;
        }
        const { AllCode } = (() => {
            try {
                const countryList = sessionStorage.getItem("CountryCodeListApi");
                return {
                    AllCode: countryList ? JSON.parse(countryList) : []
                };
            } catch {
                return { AllCode: [] };
            }
        })();

        const phonecode = AllCode?.find((val) => (val?.mobileprefix == Countrycodestate || val?.MobilePrefix == Countrycodestate));
        const requiredLength = phonecode?.PhoneLength || phonecode?.phonelength || 10;
        const isValid = new RegExp(`^\\d{${requiredLength}}$`).test(mobileNo.trim());
        if (!isValid) {
            setErrors({ mobileNo: `Mobile number must be ${requiredLength} digits.` });
            setIsSubmitting(false);
            setIsLoading(false);
            return;
        }
        setIsSubmitting(true);
        setIsLoading(true);
        ContimueWithMobileAPI(mobileNo, Countrycodestate).then((response) => {
            setIsLoading(false);
            if (response?.Status == 400) {
                toast.error(response?.Message)
                setIsSubmitting(false);
                return
            }
            if (response?.Data?.rd[0]?.stat === 1 && response?.Data?.rd[0]?.islead === 1) {
                toast.error('You are not a customer, contact to admin')
                setIsSubmitting(false);
            } else if (response?.Data?.rd[0]?.stat === 1 && response?.Data?.rd[0]?.islead === 0) {
                toast.success('OTP send Sucssessfully');
                navigation(redirectMobileUrl);
                sessionStorage.setItem('registerMobile', mobileNo)
                sessionStorage.setItem('Countrycodestate', Countrycodestate)
                setIsSubmitting(false);
            } else {
                // navigation(redirectSignUpUrl, { state: { mobileNo: mobileNo } });
                if (Countrycodestate != "91") {
                    navigation(redirectSignUpUrl);
                    sessionStorage.setItem('Countrycodestate', Countrycodestate)
                    sessionStorage.setItem('registerMobile', mobileNo)
                } else if (Countrycodestate == "91" && storeInit?.IsEcomOtpVerification == 1) {
                    navigation(redirectSignUpUrl);
                    sessionStorage.setItem('Countrycodestate', Countrycodestate)
                    sessionStorage.setItem('registerMobile', mobileNo)
                } else {
                    console.log("else part ")
                    sessionStorage.setItem('Countrycodestate', Countrycodestate)
                    sessionStorage.setItem('registerMobile', mobileNo)
                    setIsOpen(true)
                    setIsSubmitting(false);
                }
            }
        }).catch((err) => {
            console.log(err)
            setIsSubmitting(false);
        })

    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
                p: { xs: 0, sm: 0 },
                position: 'relative'
            }}
        >
            {/* Toast Notifications */}
            <ToastContainer
                limit={5}
                hideProgressBar={true}
                pauseOnHover={false}
                position="top-center"
                autoClose={3000}
            />

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
            {storeInit?.IsEcomOtpVerification === 0 && Countrycodestate === "91" && (
                <OTPContainer
                    mobileNo={mobileNo.trim()}
                    isOpen={isOpen}
                    type='mobile'
                    setIsOpen={() => setIsOpen(!isOpen)}
                    onClose={() => setIsOpen(false)}
                    navigation={navigation}
                    location={search}
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
                            className="btnColorProCat"
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
                                Continue with Mobile
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
                                We'll check if you have an account, and help create one if you don't.
                            </Typography>
                        </Box>

                        {/* Mobile Input Component */}
                        <Box
                            component="form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                            sx={{
                                width: '100%',
                                maxWidth: 400,
                                mx: 'auto',
                                mt: 2
                            }}
                        >
                            <ContinueMobile
                                Errors={errors}
                                mobileNo={mobileNo}
                                setErrors={setErrors}
                                handleInputChange={handleInputChange}
                                setMobileNo={setMobileNo}
                                Countrycodestate={Countrycodestate}
                                setCountrycodestate={setCountrycodestate}
                                onSubmit={handleSubmit}
                            />

                            <Stack spacing={2} sx={{ mt: 3 }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    color="secondary"
                                    disabled={isLoading || !mobileNo.trim()}
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
                                        } ,
                                         marginRight:1.5,
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
                        </Box>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    )

    return (
        <div className='proCat_continuMobile'>
            <ToastContainer limit={5} hideProgressBar={true} pauseOnHover={false} />
            {isLoading && (
                <div className="loader-overlay" style={{ zIndex: 99999999 }}>
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div>
                {(storeInit?.IsEcomOtpVerification === 0 && Countrycodestate == "91") ? (
                    <OTPContainer mobileNo={mobileNo.trim()} isOpen={isOpen} type='mobile' setIsOpen={() => setIsOpen(!isOpen)} onClose={() => setIsOpen(false)}
                        navigation={navigation}
                        location={search}
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
                    >Continue With Mobile</p>
                    <p style={{
                        textAlign: 'center',
                        marginTop: '-60px',
                        fontSize: '15px',
                        color: '#7d7f85',
                        fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif',
                        marginBottom: '20px'
                    }}
                        className='AuthScreenSubTitle'
                    >We'll check if you have an account, and help create one if you don't.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <ContinueMobile
                            Errors={errors}
                            mobileNo={mobileNo}
                            setErrors={setErrors}
                            handleInputChange={handleInputChange}
                            setMobileNo={setMobileNo}
                            Countrycodestate={Countrycodestate}
                            setCountrycodestate={setCountrycodestate}
                            onSubmit={handleSubmit}
                        />

                        <button className='submitBtnForgot btnColorProCat' onClick={handleSubmit}>
                            SUBMIT
                        </button>
                        <Button className='pro_cancleForgot' style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation(cancelRedireactUrl)}>CANCEL</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
