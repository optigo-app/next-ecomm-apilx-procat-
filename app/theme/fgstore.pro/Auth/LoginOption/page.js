'use client';
import "./LoginOption.modul.scss";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  useTheme,
  useMediaQuery
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";


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

   return <>
     <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'white',
        p: { xs: 0, sm: 0 },
        
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 5 },
            borderRadius: 3,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack spacing={3} alignItems="center">
            {/* Header */}
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 400,
                  color: 'text.primary',
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                Log in or sign up in seconds
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 400, mx: 'auto' }}
              >
                Use your email or mobile number to continue with the organization.
              </Typography>
            </Box>

            {/* Login Options */}
            <Stack spacing={2} width="100%" sx={{ mt: 2 }}>
              <Button
                component={Link}
                href={redirectEmailUrl}
                fullWidth
                size="large"
                startIcon={<EmailOutlinedIcon />}
                sx={{
                  py: 1.5,
                  px: 3,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: 'transparent',
                  textTransform: 'none',
                  fontSize: {
                    xs: '0.8rem',
                    sm: '1rem'
                  },
                  fontWeight: 400,
                  transition: 'all 0.2s ease-in-out',
                }}
                className="btnColorProCat"
              >
                Continue with email
              </Button>

              <Button
                component={Link}
                href={redirectMobileUrl}
                fullWidth
                size="large"
                startIcon={<SmartphoneOutlinedIcon />}
                sx={{
                  py: 1.5,
                  px: 3,
                  border: '2px solid',
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  bgcolor: 'transparent',
                  textTransform: 'none',
                  fontSize: {
                    xs: '0.8rem',
                    sm: '1rem'
                  },
                  fontWeight: 400,
                  transition: 'all 0.2s ease-in-out',
                }}
                 className="btnColorProCat"
              >
                Log in with mobile
              </Button>
            </Stack>

            {/* Footer */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 3,
                textAlign: 'center',
                maxWidth: 350,
                lineHeight: 1.6
              }}
            >
              By continuing, you agree to our{' '}
              <Box
                component={Link}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                href="/terms-and-conditions"
              >
                Terms of Use
              </Box>
              . Read our{' '}
              <Box
                component={Link}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                href="/privacyPolicy"
              >
                Privacy Policy
              </Box>
              .
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
   </>

};

export default LoginOption;



  // return (
  //   <div className="smr_Loginoption">
  //     <div className="loginDailog">
  //       <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
  //         <p className="loginDiTile">Log in or sign up in seconds</p>
  //         <p style={{ textAlign: "center", color: "#7d7f85" }}>Use your email or mobile number to continue with the organization.</p>

  //         <div className="smilingLoginOptionMain">
  //           <Box sx={{ textDecoration: "none", width: "25% !important" }} component={Link} href={redirectEmailUrl} className="loginMail btnColorProCat">
  //             <IoMdMail className="IoMdMail_fg" style={{ height: 25, width: 25 }} />
  //             <p style={{ margin: 0, fontSize: 20, fontWeight: 500, paddingLeft: 25 }}>Continue with email</p>
  //           </Box>

  //           <Box sx={{ textDecoration: "none", width: "25% !important" }} component={Link} href={redirectMobileUrl} className="loginMobile btnColorProCat">
  //             <FaMobileAlt className="FaMobileAlt_fg" style={{ height: 25, width: 25, marginRight: 10 }} />
  //             <p style={{ margin: 0, fontSize: 20, fontWeight: 500, paddingLeft: 25 }}>Log in with mobile</p>
  //           </Box>
  //         </div>

  //         <p style={{ marginTop: 40, fontSize: 14, color: "#7d7f85", textAlign: "center" }}>By continuing, you agree to our Terms of Use. Read our Privacy Policy.</p>
  //       </div>
  //     </div>
  //   </div>
  // );