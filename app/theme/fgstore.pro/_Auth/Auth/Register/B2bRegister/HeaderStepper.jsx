import { Paper, Stepper, Step, StepButton } from "@mui/material";

const HeaderStepper = ({
  activeStep,
  handleStepClick,
  isStepComplete,
  isMobile,
  STEPS,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#7e7e7e07",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        p: 3,
        mb: 3,
        position: "sticky",
        top: "90px",
        zIndex: 1000,
        borderRadius: 0,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Stepper
        activeStep={activeStep}
        nonLinear
        alternativeLabel={!isMobile}
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{
          py: isMobile ? 2 : 0,
          px: isMobile ? 1 : 0,
        }}
      >
        {STEPS?.map((step, index) => (
          <Step key={step.label} completed={isStepComplete(index)}>
            <StepButton
              onClick={() => handleStepClick(index)}
              sx={{
                position: "relative",
                cursor: "pointer",
                "& .MuiStepLabel-root": {
                  cursor: "pointer",
                  flexDirection: isMobile ? "row" : "column",
                  alignItems: "center",
                },
                "& .MuiStepLabel-label": {
                  color: isStepComplete(index)
                    ? "#10b981 !important"
                    : activeStep === index
                      ? "#10264E !important"
                      : "#6b7280",
                  fontWeight: activeStep === index ? 600 : 500,
                  fontSize: isMobile ? "0.813rem" : "0.875rem",
                  transition: "color 0.2s ease",
                  ml: isMobile ? 1 : 0, // margin for label on mobile
                },
                "& .MuiStepIcon-root": {
                  color: isStepComplete(index)
                    ? "#10b981 !important"
                    : activeStep === index
                      ? "#10264E !important"
                      : "#374151",
                  fontSize: isMobile ? 24 : 28,
                  cursor: "pointer !important",
                  transition: "color 0.2s ease",
                },
                "& .MuiStepIcon-text": {
                  fill: "#fff",
                  fontWeight: 600,
                },
                "&:hover .MuiStepLabel-label": {
                  color:
                    activeStep === index
                      ? "#10264E"
                      : isStepComplete(index)
                        ? "#34d399"
                        : "#9ca3af",
                },
                "&:hover .MuiStepIcon-root": {
                  color:
                    activeStep === index
                      ? "#10264E"
                      : isStepComplete(index)
                        ? "#34d399"
                        : "#9ca3af",
                },
              }}
            >
              {step.label} <br />
              {step.optional && (
                <small
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  (Optional*)
                </small>
              )}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default HeaderStepper;
