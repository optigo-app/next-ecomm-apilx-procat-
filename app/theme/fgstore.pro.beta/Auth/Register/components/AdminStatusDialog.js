import React from "react";
import { Dialog, Slide, Box, Typography, Button } from "@mui/material";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function AdminStatusDialog({ open, type, message, onClose }) {
  const isApproved = type?.toLowerCase() === "approved";
  const isPending = type?.toLowerCase() === "pending";
  const isRejected = type?.toLowerCase() === "rejected";

  const getStatusColor = () => {
    if (isApproved) return "success";
    if (isPending) return "warning";
    return "error";
  };

  const statusColor = getStatusColor();

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: { xs: 2.5, sm: 3 },
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
          bgcolor: "white"
        }
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${statusColor}.light`,
          }}
        >
          {isApproved && <CheckRoundedIcon sx={{ fontSize: 45, color: "white" }} />}
          {isPending && <AccessTimeRoundedIcon sx={{ fontSize: 45, color: "white" }} />}
          {isRejected && <PriorityHighRoundedIcon sx={{ fontSize: 45, color: "white" }} />}
        </Box>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "text.primary", fontSize: "1.25rem" }}>
        {isApproved && "Approved by Admin"}
        {isPending && "Approval Pending"}
        {isRejected && "Rejected by Admin"}
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, fontSize: "0.9rem", lineHeight: 1.5 }}>
        {message || (
          isApproved ? "Your account has been successfully approved by the admin. You can now login to your account." :
          isPending ? "Your account request is still under review by the admin. Please wait for the confirmation." :
          "Your account request has been rejected. Please contact support for more details."
        )}
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={onClose}
        sx={{
          py: 1.2,
          borderRadius: 2,
          fontSize: "1rem",
          fontWeight: 600,
          bgcolor: `${statusColor}.main`,
          "&:hover": {
            bgcolor: `${statusColor}.dark`,
          }
        }}
      >
        Okay
      </Button>
    </Dialog>
  );
}
