"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { GetCountAPI } from "../utils/API/GetCount/GetCountAPI";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/customToast.css";
import { enhanceGlobalToast } from "../utils/toastNotification";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import CloseIcon from "@mui/icons-material/Close";

// Initialize global toast enhancement for rich notification UI
if (typeof window !== "undefined") {
  enhanceGlobalToast();
}

const StoreContext = createContext(null);

const CustomToastIcon = ({ type }) => {
  if (type === "success") {
    return (
      <div className="custom-toast-icon-badge success">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (type === "info") {
    return (
      <div className="custom-toast-icon-badge info">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3.5" />
        </svg>
      </div>
    );
  }
  if (type === "error") {
    return (
      <div className="custom-toast-icon-badge error">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    );
  }
  if (type === "warning") {
    return (
      <div className="custom-toast-icon-badge warning">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="8" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3.5" />
        </svg>
      </div>
    );
  }
  return null;
};

const CustomCloseButton = ({ closeToast }) => (
  <button
    type="button"
    className="custom-toast-close-btn"
    onClick={closeToast}
    aria-label="close"
  >
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
);

export function StoreProvider({ children, storeinit }) {
  if (typeof window !== "undefined") {
    window.__STORE_INIT__ = storeinit;
  }
  const [user, setUser] = useState(null);
  const [cartCountNum, setCartCountNum] = useState(0);
  const [wishCountNum, setWishCountNum] = useState(0);
  const [loginUserDetail, setLoginUserDetail] = useState(null);
  const [islogin, setislogin] = useState(false);
  const [cartOpenStateB2C, setCartOpenStateB2C] = useState(false);
  const [SoketData, setSoketData] = useState([])

  useEffect(() => {
    if (typeof window === "undefined") return;
    enhanceGlobalToast();
    const storedDetail = sessionStorage.getItem("loginUserDetail");
    if (storedDetail) {
      const parsed = JSON.parse(storedDetail);
      setLoginUserDetail(parsed);
      setislogin(true);
    }
  }, []);

  const refreshCount = useCallback(async () => {
    try {
      const visiterId = Cookies.get("visiterId");
      const res = await GetCountAPI(visiterId);
      if (res) {
        setCartCountNum(res.cartcount ?? 0);
        setWishCountNum(res.wishcount ?? 0);
      }
    } catch (err) {
      console.error("Error fetching count in StoreProvider:", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    refreshCount();
  }, [islogin, refreshCount, storeinit]);

  const value = {
    user,
    setUser,
    islogin,
    cartCountNum,
    setCartCountNum,
    wishCountNum,
    setWishCountNum,
    refreshCount,
    setislogin,
    loginUserDetail,
    setLoginUserDetail,
    cartOpenStateB2C,
    setCartOpenStateB2C,
    SoketData,
    setSoketData,
    storeinit
  };

  return (
    <StoreContext.Provider value={value}>
      <ToastContainer
        position="bottom-right"
        stacked={false}
        limit={4}
        hideProgressBar={true}
        autoClose={3500}
        transition={Slide}
        icon={CustomToastIcon}
        closeButton={CustomCloseButton}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />
      {children}
      <ExpirySnackbar loginUserDetail={loginUserDetail} />
    </StoreContext.Provider>
  );
}

function ExpirySnackbar({ loginUserDetail }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loginUserDetail) {
      setOpen(false);
      return;
    }

    const validTill = loginUserDetail.ValidTill || loginUserDetail.validTill;
    if (!validTill) {
      setOpen(false);
      return;
    }

    const expiryDate = new Date(validTill);
    const currentDate = new Date();

    if (isNaN(expiryDate.getTime())) {
      setOpen(false);
      return;
    }

    const diffTime = expiryDate.getTime() - currentDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // If account has expired or expiring in more than 7 days, don't show
    if (diffDays <= 0 || diffDays > 7) {
      setOpen(false);
      return;
    }

    // Check if dismissed in last 24 hours
    const dismissedTime = localStorage.getItem("expiry_reminder_dismissed");
    if (dismissedTime) {
      const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        setOpen(false);
        return;
      }
    }

    setOpen(true);
  }, [loginUserDetail]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    localStorage.setItem("expiry_reminder_dismissed", Date.now().toString());
  };

  const handleRenew = () => {
    window.location.href = "/account";
  };

  if (!open) return null;

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={handleClose}
      autoHideDuration={null}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#1e70e0", // Vibrant/premium blue
          color: "#ffffff",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.15)",
          maxWidth: "600px",
          width: "100%",
          gap: "16px",
          position: "relative",
          zIndex: 999999,
        }}
      >
        <NotificationsActiveOutlinedIcon sx={{ fontSize: "28px", flexShrink: 0 }} />
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "16px", lineHeight: 1.3 }}>
            Expiry Reminder
          </Typography>
          <Typography sx={{ fontSize: "14px", opacity: 0.9, lineHeight: 1.4, mt: 0.5 }}>
            Your account will expire soon. Please renew your subscription to avoid service interruption.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <Button
            onClick={handleRenew}
            variant="contained"
            sx={{
              backgroundColor: "#ffffff",
              color: "#1e70e0",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              padding: "6px 16px",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Renew Now
          </Button>
          
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: "#ffffff",
              opacity: 0.8,
              "&:hover": { opacity: 1 },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Snackbar>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
