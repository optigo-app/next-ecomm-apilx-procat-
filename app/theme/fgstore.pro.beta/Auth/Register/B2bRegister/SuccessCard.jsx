import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { styled } from "@mui/material/styles";

const GlassContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 480,
  margin: "100px auto",
  padding: theme.spacing(6),
  borderRadius: 24,
  textAlign: "center",
  background: "rgba(255, 255, 255, 0.6)", // glass
  backdropFilter: "blur(16px) saturate(180%)",
  WebkitBackdropFilter: "blur(16px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow:
    "0 4px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.4) inset",
}));

const IconWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  "& svg": {
    fontSize: 72,
    color: theme.palette.success.main,
    filter: "drop-shadow(0 4px 12px rgba(76, 175, 80, 0.4))",
  },
}));

export default function RegistrationSuccess({ onHome, onLogin }) {
  return (
    <GlassContainer elevation={0}>
      <IconWrapper>
        <CheckCircleRoundedIcon />
      </IconWrapper>

      <Typography
        variant="h5"
        fontWeight={600}
        sx={{ mb: 1, color: "rgba(0,0,0,0.85)" }}
      >
        Thanks for registering!
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          lineHeight: 1.6,
          color: "rgba(0,0,0,0.65)",
          fontSize: "0.95rem",
        }}
      >
        Your request is under review. <br />
        You’ll get a confirmation on Email/WhatsApp once approved.
      </Typography>

      <Box display="flex" gap={2} justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={onHome}
          sx={{
            borderRadius: 3,
            px: 3.5,
            py: 1.2,
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        >
          Go to Home
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={onLogin}
          sx={{
            borderRadius: 3,
            px: 3.5,
            py: 1.2,
            fontWeight: 500,
            textTransform: "none",
            borderColor: "rgba(0,0,0,0.2)",
            "&:hover": {
              borderColor: theme => theme.palette.primary.main,
              background: "rgba(0,0,0,0.02)",
            },
          }}
        >
          Login
        </Button>
      </Box>
    </GlassContainer>
  );
}
