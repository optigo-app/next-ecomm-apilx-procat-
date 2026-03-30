import React, { useState } from 'react';
import './ContinueWithEmail.modul.scss';
import { Button, CircularProgress, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { ContinueWithEmailAPI } from '@/app/(core)/utils/API/Auth/ContinueWithEmailAPI';
import { useRouter } from 'next/navigation';

export default function ContinueWithEmail({ params, searchParams, storeInit }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const Router = useRouter();
    const navigation = (path) => {
        Router.push(path)
    }
    const search = JSON.parse(searchParams?.value)?.LoginRedirect ?? "";
    const redirectEmailUrl = `/LoginWithEmail?LoginRedirect=${search}`;
    const redirectSignUpUrl = `/register?LoginRedirect=${search}`;
    const cancelRedireactUrl = `/LoginOption?LoginRedirect=${search}`;


    // const validateEmail = (email) => {
    //     const regex = /^[a-zA-Z][\w@$&#]*@[a-zA-Z]+\.[a-zA-Z]+(\.[a-zA-Z]+)?$/;
    //     return regex.test(email);
    // };

    const validateEmail = (email) => {
        // const regex = /^[a-zA-Z][\w@$&#]*@[a-zA-Z]+\.[a-zA-Z]+(\.[a-zA-Z]+)?$/;
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
        const encodedKeyFromStorage = JSON.parse(sessionStorage.getItem("keylogs"));
        const getSecKey = encodedKeyFromStorage ? decodeURIComponent(atob(encodedKeyFromStorage)) : "";
        const SecurityKey = JSON.parse(sessionStorage.getItem("SecurityKey")) ?? getSecKey;
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
                    sessionStorage.setItem("SecurityKey", SecurityKey);
                }
            } else {
                navigation(redirectSignUpUrl);
                if (trimmedEmail) {
                    sessionStorage.setItem("registerEmail", trimmedEmail);
                    // sessionStorage.setItem("SecurityKey", SecurityKey);
                }
            }
        }).catch((err) => console.log(err))


        // const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        // const { FrontEnd_RegNo } = storeInit;

        // const combinedValue = JSON.stringify({
        //     userid: `${(trimmedEmail).toLocaleLowerCase()}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`
        // });
        // const encodedCombinedValue = btoa(combinedValue);
        // const body = {
        //     "con": "{\"id\":\"\",\"mode\":\"WEBVALDNEMAIL\"}",
        //     "f": "emilValid (handleEmail)",
        //     p: encodedCombinedValue
        // };
        // const response = await CommonAPI(body);
        // console.log('ressssssss', response);
        // if (response.Data.rd[0].stat == 1 && response.Data.rd[0].islead == 1) {
        //     toast.error('You are not a customer, contact to admin')
        // } else if (response.Data.rd[0].stat == 1 && response.Data.rd[0].islead == 0) {
        //     navigation('/LoginWithEmail', { state: { email: trimmedEmail } });
        //     if (trimmedEmail) {
        //         sessionStorage.setItem("userEmailForPdList", trimmedEmail);
        //     }
        // } else {
        //     navigation('/register', { state: { email: trimmedEmail } });
        // }

        // setIsLoading(false);
    };

    return (
        <div className='proCat_continuemail'>
            {isLoading && (
                <div className="loader-overlay">
                    <CircularProgress className='loadingBarManage' />
                </div>
            )}
            <div>
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
                        marginTop: '-60px',
                        fontSize: '15px',
                        color: '#7d7f85',
                        fontFamily: 'FreightDispProBook-Regular,Times New Roman,serif'
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