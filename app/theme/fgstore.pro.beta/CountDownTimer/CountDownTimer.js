import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { proCat_loginState } from '../../Recoil/atom';
import { useSetRecoilState } from 'recoil';
import Cookies from 'js-cookie';

const useCountdown = () => {
    const isloginStatus = sessionStorage?.getItem('LoginUser');
    const [countDownStatus, setCountDownStatus] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
    const navigation = useNavigate();
    const setIsLoginState = useSetRecoilState(proCat_loginState);
    const [showTimer, setShowTimer] = useState(true);
    const storedData = JSON.parse(sessionStorage.getItem('loginUserDetail')) || {};
    const timerStatus = storedData?.IsTimeShow;
    const entryDate = storedData.adhoc_startdate1;
    const expiryDate = storedData.adhoc_enddate1;

    // const entryDate = "2024-09-19T10:27:01.95";  
    // const expiryDate = "2024-09-19T11:15:02.95";

    useEffect(() => {
        let timerID;

        if (timerStatus != 0 && isloginStatus === 'true') {
            timerID = setInterval(() => tick(entryDate, expiryDate), 1000);
            setCountDownStatus(true);
        }

        return () => clearInterval(timerID);
    }, [entryDate, expiryDate, timerStatus, isloginStatus]);

    function calculateCountdown(startDate, endDate) {
        const startTimestamp = new Date(startDate).getTime();
        const endTimestamp = new Date(endDate).getTime();
        const now = new Date().getTime();
        let timeDifference;

        if (now < startTimestamp) {
            timeDifference = startTimestamp - now;
        } else if (now > endTimestamp) {
            return { days: 0, hours: 0, minutes: 0 };
        } else {
            timeDifference = endTimestamp - now;
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        return {
            days,
            hours,
            minutes
        };
    }

    function tick(startDate, endDate) {
        const newCountdown = calculateCountdown(startDate, endDate);
        setCountdown(newCountdown);
            if (newCountdown.days === 0 && newCountdown.hours === 0 && newCountdown.minutes === 0) {
                handleLogout();
                setShowTimer(false);
            }
    }


    const handleLogout = () => {
        navigation("/");
        setIsLoginState(false);
        sessionStorage.setItem("LoginUser", false);
        window.location.reload();
        Cookies.remove("userLoginCookie");
        sessionStorage.removeItem("storeInit");
        sessionStorage.removeItem("loginUserDetail");
        sessionStorage.removeItem("remarks");
        sessionStorage.removeItem("selectedAddressId");
        sessionStorage.removeItem("orderNumber");
        sessionStorage.removeItem("registerEmail");
        sessionStorage.removeItem("UploadLogicalPath");
        sessionStorage.removeItem("remarks");
        sessionStorage.removeItem("registerMobile");
        sessionStorage.removeItem("allproductlist");
        sessionStorage.removeItem("AllFilter");
        sessionStorage.removeItem("ColorStoneQualityColorCombo");
        sessionStorage.removeItem("CompanyInfoData");
        sessionStorage.removeItem("MetalColorCombo");
        sessionStorage.removeItem("metalTypeCombo");
        sessionStorage.removeItem("myAccountFlags");
        sessionStorage.removeItem("registerEmail");
        sessionStorage.removeItem("selectedAddressId");
    };

    return {
        countdown,
        showTimer,
    }
};

export default useCountdown;
