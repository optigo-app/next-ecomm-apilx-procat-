import { Box,  Typography, Chip } from "@mui/material";
import { CheckCircle as CheckIcon } from "@mui/icons-material";
import { Business as BusinessIcon, Person as PersonIcon, Description as DocumentIcon, VerifiedUser as VerifiedIcon } from "@mui/icons-material";

const STEPS = [
  { label: "Business Information", icon: BusinessIcon },
  { label: "Authorized Representative", icon: PersonIcon },
  { label: "Business Documents", icon: DocumentIcon },
  { label: "Declarations & Consent", icon: VerifiedIcon },
];

  const SectionHeader = ({ title, icon: Icon, stepIndex, isStepComplete, sectionRefs }) => (
    <Box
      ref={(el) => (sectionRefs.current[stepIndex] = el)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2,
        pb: 2,
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          borderRadius: "12px",
          bgcolor: isStepComplete(stepIndex) ? "rgba(16, 185, 129, 0.15)" : "rgba(139, 92, 246, 0.15)",
          border: "1px solid",
          borderColor: isStepComplete(stepIndex) ? "rgba(16, 185, 129, 0.3)" : "rgba(139, 92, 246, 0.3)",
        }}
      >
        {isStepComplete(stepIndex) ? <CheckIcon sx={{ fontSize: 24, color: "#10b981" }} /> : <Icon sx={{ fontSize: 24, color: "#8b5cf6" }} />}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#9ca3af",
            fontSize: "0.813rem",
          }}
        >
          Step {stepIndex + 1} of {STEPS.length}
        </Typography>
      </Box>
      {isStepComplete(stepIndex) && (
        <Chip
          label="Completed"
          size="small"
          sx={{
            bgcolor: "rgba(16, 185, 129, 0.15)",
            color: "#10b981",
            fontWeight: 600,
            fontSize: "0.75rem",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        />
      )}
    </Box>
  );


  export default SectionHeader;