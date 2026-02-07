'use client'
import { useEffect, useState } from "react"
import { OTPVerificationModal } from "./OTPModal"
import { WebSignUpOTPVerify } from "../../API/Auth/WebSignUpOTPVerify"


const App = ({ isLoading=false , onResend =()=>{} , btncolor, iconcolor, bgcolor, iconbgcolor, isOpen, setIsOpen = false, type = "email", mobileNo = '', emailId = '', onClose = () => { }, navigation, location }) => {
  const otpLength = 4;
  const [otp, setOtp] = useState(new Array(otpLength).fill(""));
  const [message, setmessage] = useState("");
  const [loading, setloading] = useState(false);

  const handleVerify = async (otp) => {
    setloading(true)
    setmessage("")
    const userid = type === "email" ? emailId : '';
    const mobileno = type === "mobile" ? mobileNo : '';
    const mobilenoCode = sessionStorage?.getItem('Countrycodestate');
    const search = location;
    const redirectSignUpUrl = `/register/${search}`;

    try {
      const response = await WebSignUpOTPVerify(userid, mobileno, otp);
      if (response?.Data?.rd[0]?.stat == 1 || response?.Data?.rd[0]?.stat == "success") {
        setmessage("Verification Successfull")
        if(type === "email"){
          navigation(redirectSignUpUrl);
          sessionStorage?.setItem('email', emailId)
        }else{
          navigation(redirectSignUpUrl);
          sessionStorage?.setItem('mobileNo', mobileNo)
          sessionStorage?.setItem('code', mobilenoCode)
        }
        onClose();
      } else {
        console.log("OTP Verification Failed:", response);
        setmessage("Invalid OTP");
        setloading(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setmessage("something went wrong")
      setloading(false)
    }
  };

  const handleResend = async () => {
    const contact = type === "email" ? emailId : mobileNo;
    onResend()
  }
  useEffect(()=>{
    setmessage("")
  },[isOpen])

  return (
    <div style={{ padding: "20px" }}>
      <OTPVerificationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type={type}
        contactInfo={type === "email" ? emailId : mobileNo}
        buttonBgColor={btncolor}
        onVerify={handleVerify}
        onResend={handleResend}
        iconcolor={iconcolor}
        bgcolor={bgcolor}
        iconbgcolor={iconbgcolor}
        otp={otp}
        setOtp={setOtp}
        message={message}
        loading={loading}
        setmessage={setmessage}
        isLoading={isLoading}
        />
    </div>
  )
}

export default App
