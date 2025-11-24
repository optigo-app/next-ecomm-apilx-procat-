'use client'
import { useState, useRef, useEffect } from "react"
import { Modal, Box, Typography, TextField, Button, CircularProgress, Slide } from "@mui/material"
import { MdEmail, MdSmartphone, MdClose } from "react-icons/md"
import { Timer } from "./Timer"
import "./OTPVerificationModal.scss"


export const OTPVerificationModal = ({
  isOpen,
  onClose,
  type,
  contactInfo,
  buttonBgColor,
  onVerify,
  onResend,
  iconcolor,
  bgcolor,
  iconbgcolor ,
  otp,
setOtp ,
message ,
loading ,
setmessage ,
isLoading
}) => {
  const otpLength = 4;
  const [showResend, setShowResend] = useState(false)
  const inputRefs = useRef([])
  const [seconds, setSeconds] = useState(120);
  const [shouldStartTimer, setShouldStartTimer] = useState(true);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [isOpen])

  useEffect(() => {
    setOtp(new Array(otpLength).fill(""))
  }, [otpLength])



  useEffect(() => {
    if (isOpen) {
      setOtp(new Array(otpLength).fill(""))
      setShowResend(false)
      setSeconds(120)
       setShouldStartTimer(true)
      inputRefs.current[0]?.focus()
    }
  }, [isOpen]) 


  useEffect(() => {
    let timer
    if (isOpen && seconds > 0 && !isLoading && shouldStartTimer) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setShowResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isOpen, seconds, isLoading, shouldStartTimer])


  useEffect(() => {
    if (isLoading) {
      setShouldStartTimer(false)
    } else {
      setShouldStartTimer(true)
    }
  }, [isLoading])

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    if (element.value && index < otpLength - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    setmessage('')
       if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "Enter" && !otp.includes("") &&  otp.length === otpLength) {
      handleSubmit();
    }
  }

  const handleSubmit = () => {
    const otpString = otp.join("")
    if (otpString.length === otpLength) {
      onVerify(otpString)
    }
  }

  const handleResend = () => {
    setmessage('')
    setOtp(new Array(otpLength).fill(""))
    setShowResend(false)
    setSeconds(120)
    setShouldStartTimer(false)
    onResend()
  }


  return (
    <Modal
      
    
    open={isOpen} onClose={onClose} aria-labelledby="otp-modal-title" className="otp-verification-modal">
       <Slide direction="down" in={isOpen} mountOnEnter  unmountOnExit>
      <Box className="modal-content" sx={{
        bgcolor: `${bgcolor} !important`
      }}>
        <button className="close-button" onClick={onClose}>
          <MdClose />
        </button>

        <div className="icon-container" style={{
          backgroundColor: iconbgcolor
        }}>
          {type === "email" ? <MdEmail className="icon" color={iconcolor} /> : <MdSmartphone className="icon" color={iconcolor} />}
        </div>

        <Typography variant="h5" id="otp-modal-title" className="title">
          {`Verify Your ${type === "email" ? "Email Address" : "Mobile Number"}`}
        </Typography>

        <Typography variant="body2" className="description">
          {`We have sent a verification code to ${contactInfo}`}
        </Typography>

        <div className="otp-input-container" autoComplete="off" >
          {otp.map((digit, index) => (
           <TextField
           inputMode="none" 
           spellCheck="false" // Disable spell checking
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              name={`otp-input-${Math.random()}`} 
              variant="outlined"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoComplete="off" 
              autoFocus={index === 0}
              inputProps={{
                maxLength: 1,
                className: "otp-input",
                form: {
                  autocomplete: 'off',
                },
              }}
              
            />
          ))}
        </div>

        <div className="action-container">
      {message !== '' && 
      <> <small style={{fontWeight:"500",color:"red"}}>{message}</small> <br/></>}
          {showResend ? (
            <Button onClick={handleResend} className="resend-button">
              Resend Code
            </Button>
          ) : (
            <div className="timer-container">
              Resend code in <Timer seconds={seconds} onComplete={() => setShowResend(true)} />
            </div>
          )}
        </div>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={otp.some((digit) => digit === "")}
          className="verify-button"
          style={{ backgroundColor: buttonBgColor }}
        >
           {!loading ? `Verify ${type === "email" ? "Email" : "Mobile"}` : <CircularProgress size={20} />}
        </Button>
      </Box>
      </Slide>
    </Modal>
  )
}

