import React, { useEffect, useState } from 'react';
import './ContinueWithEmail.modul.scss';
import { Button, CircularProgress, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { ContinueWithEmailAPI } from '@/app/(core)/utils/API/Auth/ContinueWithEmailAPI';
import OTPContainer from '@/app/(core)/utils/Glob_Functions/Otpflow/App';
import { useRouter } from 'next/navigation';


export default function ContinueWithEmail({ params, searchParams, storeInit }) {
    console.log("🚀 ~ ContinueWithEmail ~ storeInit:", storeInit)
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
                if (storeInit?.IsEcomOtpVerification == 0) {
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


    return (
        <div className='proCat_continuemail'>
            {isLoading && (
                <div className="loader-overlay" style={{ zIndex: 99999999 }}>
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div>
                {storeInit?.IsEcomOtpVerification === 1 ? (
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

                        {/* <button
                            className={`submitBtnForgot ${buttonFocused ? 'focused' : ''}`}
                            onClick={handleSubmit}
                            onFocus={() => setButtonFocused(true)}
                            onBlur={() => setButtonFocused(false)}
                            style={{borderColor: 'red'}}
                        >

                        </button> */}

                        <button type='submit' className='submitBtnForgot btnColorProCat' onClick={handleSubmit}>SUBMIT</button>
                        <Button className='pro_cancleForgot' style={{ marginTop: '10px', color: 'gray' }} onClick={() => navigation(cancelRedireactUrl)}>CANCEL</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
