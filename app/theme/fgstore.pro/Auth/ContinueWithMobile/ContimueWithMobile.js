import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { ContimueWithMobileAPI } from '@/app/(core)/utils/API/Auth/ContimueWithMobileAPI';
import './ContimueWithMobile.modul.scss'
import OTPContainer from '@/app/(core)/utils/Glob_Functions/Otpflow/App';
import ContinueMobile from '@/app/(core)/utils/Glob_Functions/CountryDropDown/ContinueMobile';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';

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



    const search = JSON.parse(searchParams?.value)?.LoginRedirect ?? "";
    const updatedSearch = search?.replace('?LoginRedirect=', '');
    const redirectMobileUrl = `/LoginWithMobileCode/${updatedSearch}`;
    const redirectSignUpUrl = `/register/${updatedSearch}`;
    const cancelRedireactUrl = `/LoginOption/${search}`;

    const handleInputChange = (e, setter, fieldName) => {
        const { value } = e.target;
        const trimmedValue = value.trim();
        const formattedValue = trimmedValue.replace(/\s/g, '');

        setter(formattedValue);

        // if (fieldName === 'mobileNo') {
        //     if (!formattedValue) {
        //         setErrors(prevErrors => ({ ...prevErrors, mobileNo: 'Mobile No. is required' }));
        //     } else if (!/^\d{10}$/.test(formattedValue)) {
        //         setErrors(prevErrors => ({ ...prevErrors, mobileNo: 'Enter Valid mobile number' }));
        //     } else {
        //         setErrors(prevErrors => ({ ...prevErrors, mobileNo: '' }));
        //     }
        // }
    };
    
    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        if (!mobileNo.trim()) {
            setErrors({ mobileNo: 'Mobile No. is required' });
            return;
        }
        const { SecurityKey, AllCode } = (() => {
            try {
                const keylogs = sessionStorage.getItem("keylogs");
                const secKeyRaw = sessionStorage.getItem("SecurityKey");
                const countryList = sessionStorage.getItem("CountryCodeListApi");
                const decodedKey = keylogs ? decodeURIComponent(atob(JSON.parse(keylogs))) : "";
                return {
                    SecurityKey: secKeyRaw ? JSON.parse(secKeyRaw) : decodedKey,
                    AllCode: countryList ? JSON.parse(countryList) : []
                };
            } catch {
                return { SecurityKey: "", AllCode: [] };
            }
        })();

        const phonecode = AllCode?.find((val) => val?.mobileprefix == Countrycodestate);
        const requiredLength = phonecode?.PhoneLength;
        const isValid = new RegExp(`^\\d{${requiredLength}}$`).test(mobileNo.trim());
        if (!isValid) {
            setErrors({ mobileNo: `Mobile number must be  ${requiredLength} digits.` });
            return { mobileNo: `Enter a valid ${requiredLength}-digit mobile number` };
        }
        // else if (!/^\d{10}$/.test(mobileNo.trim())) {
        //     setErrors({ mobileNo: 'Enter Valid mobile number' });
        //     return;
        // }

        // try {
        //     const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
        //     const { FrontEnd_RegNo } = storeInit;
        //     const combinedValue = JSON.stringify({
        //         country_code: '91', mobile: `${mobileNo}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`
        //     });
        //     const encodedCombinedValue = btoa(combinedValue);
        //     const body = {
        //         "con": "{\"id\":\"\",\"mode\":\"WEBVALDNMOBILE\"}",
        //         "f": "continueWithMobile (handleSubmit)",
        //         p: encodedCombinedValue
        //     };

        //     const response = await CommonAPI(body);
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
                sessionStorage.setItem('SecurityKey', SecurityKey)
                sessionStorage.setItem('Countrycodestate', Countrycodestate)
                setIsSubmitting(false);
            } else {
                // navigation(redirectSignUpUrl, { state: { mobileNo: mobileNo } });
                if (Countrycodestate != "91") {
                    navigation(redirectSignUpUrl);
                    sessionStorage.setItem('SecurityKey', SecurityKey)
                    sessionStorage.setItem('Countrycodestate', Countrycodestate)
                    sessionStorage.setItem('registerMobile', mobileNo)
                } else if (Countrycodestate == "91" && storeInit?.IsEcomOtpVerification == 1) {
                    navigation(redirectSignUpUrl);
                    sessionStorage.setItem('SecurityKey', SecurityKey)
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



        // } catch (error) {
        //     console.error('Error:', error);
        // } finally {
        //     setIsSubmitting(false);
        //     setIsLoading(false);
        // }
    };

    useEffect(() => {
        sessionStorage.removeItem("Countrycodestate")
    }, [])

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
                        {/* <TextField
                            autoFocus
                            id="outlined-basic"
                            label="Enter Mobile No"
                            variant="outlined"
                            className='smr_loginmobileBox'
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                            style={{ margin: '15px' }}
                            value={mobileNo}
                            onChange={(e) => handleInputChange(e, setMobileNo, 'mobileNo')}
                            error={!!errors.mobileNo}
                            helperText={errors.mobileNo}
                        /> */}
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
