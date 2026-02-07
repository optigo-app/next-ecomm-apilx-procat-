'use client';
import { Box } from "@mui/material";
import "./LoginOption.modul.scss";
import { FaMobileAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import Link from "next/link";

const LoginOption = ({ searchParams }) => {
  const { LoginRedirect = "", loginRedirect: loginRedirLow = "", search = "" } = searchParams || {};
  const loginRedirect = LoginRedirect || loginRedirLow || search || "";
  const getSecurityKeyFromUrl = () => {
    // 1. Check direct query param SK or SecurityKey
    if (searchParams?.SK) return searchParams.SK;
    if (searchParams?.SecurityKey) return searchParams.SecurityKey;

    // 2. Extract from LoginRedirect if present
    if (loginRedirect) {
      const urlText = decodeURIComponent(loginRedirect);

      // Try path segment K=
      const kMatch = urlText.match(/\/K=([^/?&#]+)/);
      if (kMatch) {
        try { return atob(kMatch[1]); } catch (e) { }
      }

      // Try query param SK= or SecurityKey= inside the redirect URL
      const skMatch = urlText.match(/[?&](SK|SecurityKey)=([^&]+)/);
      if (skMatch) return skMatch[2];
    }

    return "";
  };

  const securityKey = getSecurityKeyFromUrl();
  const redirectEmailUrl = `/ContinueWithEmail${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}` : (securityKey ? `?SK=${encodeURIComponent(securityKey)}` : "")}`;
  const redirectMobileUrl = `/ContinueWithMobile${loginRedirect ? `?LoginRedirect=${encodeURIComponent(loginRedirect)}${securityKey ? `&SK=${encodeURIComponent(securityKey)}` : ""}` : (securityKey ? `?SK=${encodeURIComponent(securityKey)}` : "")}`;

  return (
    <div className="smr_Loginoption">
      <div className="loginDailog">
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <p className="loginDiTile">Log in or sign up in seconds</p>
          <p style={{ textAlign: "center", color: "#7d7f85" }}>Use your email or mobile number to continue with the organization.</p>

          <div className="smilingLoginOptionMain">
            <Box sx={{ textDecoration: "none", width: "25% !important" }} component={Link} href={redirectEmailUrl} className="loginMail btnColorProCat">
              <IoMdMail className="IoMdMail_fg" style={{ height: 25, width: 25 }} />
              <p style={{ margin: 0, fontSize: 20, fontWeight: 500, paddingLeft: 25 }}>Continue with email</p>
            </Box>

            <Box sx={{ textDecoration: "none", width: "25% !important" }} component={Link} href={redirectMobileUrl} className="loginMobile btnColorProCat">
              <FaMobileAlt className="FaMobileAlt_fg" style={{ height: 25, width: 25, marginRight: 10 }} />
              <p style={{ margin: 0, fontSize: 20, fontWeight: 500, paddingLeft: 25 }}>Log in with mobile</p>
            </Box>
          </div>

          <p style={{ marginTop: 40, fontSize: 14, color: "#7d7f85", textAlign: "center" }}>By continuing, you agree to our Terms of Use. Read our Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginOption;
