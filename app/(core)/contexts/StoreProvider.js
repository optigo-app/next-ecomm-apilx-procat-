"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { GetCountAPI } from "../utils/API/GetCount/GetCountAPI";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import CloseIcon from "@mui/icons-material/Close";

const StoreContext = createContext(null);

const toastStyle = {
  borderRadius: "6px",
  boxShadow: `  rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px`,
  minWidth: "0px",
  width: "fit-content !important",
  padding: "12px 6px !important",
  borderLeft: `8px solid teal`,
  fontSize: "18px",
};
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
      <ToastContainer position="bottom-right" toastStyle={toastStyle} stacked={true} hideProgressBar={true} autoClose={1400} transition={Zoom} style={{ zIndex: "9999999999999999", fontFamily: "inherit" }} />
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
