'use client'
import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography, CircularProgress, Divider, Fade, Alert, useTheme, useMediaQuery, InputAdornment, IconButton, Tooltip } from "@mui/material";
import { Business as BusinessIcon, Person as PersonIcon, Description as DocumentIcon, VerifiedUser as VerifiedIcon, CheckCircle as CheckIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import FileUploadField from "./B2bRegister/FileUpload";
import SectionHeader from "./B2bRegister/SectionHeader";
import HeaderStepper from "./B2bRegister/HeaderStepper";
import SidebarStepper from "./B2bRegister/SidebarStepper";
import getMasterOptions from "./B2bRegister/MasterParser";
import CryptoJS from "crypto-js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { WEBSignUpWithCompanyInfoAPI } from "@/app/(core)/utils/API/Auth/WEBSignUpWithCompanyInfoAPI";
import { toast } from "react-toastify";
import RegistrationSuccess from './B2bRegister/SuccessCard';
import CountryDropDown from "@/app/(core)/utils/Glob_Functions/CountryDropDown/CountryDropDown";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { getSession } from "@/app/(core)/utils/FetchSessionData";

const DOCUMENT_RULES = {
  "aadhar card": {
    regex: /^\d{12}$/,
    message: "Invalid Aadhaar format (must be 12 digits)",
    tooltip: (
      <span>
        Aadhaar format: <strong>12 digits only</strong><br />
        (e.g. <code style={{ fontWeight: "bold", color: "black" }}>123456789012</code>)
      </span>
    ),
  },
  "driving licence": {
    regex: /^[A-Z0-9]{10,14}$/,
    message: "Invalid Driving Licence format (10–14 uppercase letters or digits)",
    tooltip: (
      <span>
        DL format: <strong>10–14 alphanumeric (uppercase)</strong><br />
        (e.g. <code style={{ fontWeight: "bold", color: "black" }}>DL04A1234567890</code>)
      </span>
    ),
  },
  passport: {
    regex: /^[A-Z][0-9]{7}$/,
    message: "Invalid Passport format (1 letter + 7 digits)",
    tooltip: (
      <span>
        Passport format: <strong>1 letter + 7 digits</strong><br />
        (e.g. <code style={{ fontWeight: "bold", color: "black" }}>A1234567</code>)
      </span>
    ),
  },
  pan: {
    regex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: "Invalid PAN format (5 letters + 4 digits + 1 letter)",
    tooltip: (
      <span>
        PAN format: <strong>5 letters + 4 digits + 1 letter</strong><br />
        (e.g. <code style={{ fontWeight: "bold", color: "black" }}>ABCDE1234F</code>)
      </span>
    ),
  },
  gst: {
    regex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    message: "Invalid GST format (15 chars: state + PAN + suffix + Z + check)",
    tooltip: (
      <span>
        GST format: <strong>15 characters</strong> — 2 digits + PAN + 1 char + Z + 1 char<br />
        (e.g. <code style={{ fontWeight: "bold", color: "black" }}>27ABCDE1234F1Z5</code>)
      </span>
    ),
  },
};


const STEPS = [
  { label: "Business Information", icon: BusinessIcon },
  { label: "Personal Information", icon: PersonIcon },
  { label: "Business Documents", icon: DocumentIcon },
  { label: "Declarations & Consent", icon: VerifiedIcon },
];

function hashPasswordSHA1(password) {
  const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
  return hashedPassword;
}

const B2bRegister = ({ searchParams }) => {
  const { push } = useNextRouterLikeRR();
  const navigation = push;
  const location = useNextRouterLikeRR();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const sectionRefs = useRef([]);
  const mobileNoRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const MasterData = getMasterOptions();
  const CompanyType = MasterData?.CompanyType?.options || [];
  const DocumentType = MasterData?.DocumentType?.options || [];
  const TypeofEntityOptions = MasterData?.TypeOfEntity?.options || [];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [IsMobileThrough, setIsMobileThrough] = useState(false)

  const [formData, setFormData] = useState({
    company_name: "",
    entity_type: "",
    industry_category: "",
    gst_number: "",
    pan_number: "",
    iec_code: "",
    address_line: "",
    city: "",
    state: "",
    country: "",
    password: "",
    confirm_password: "",
    pincode: "",
    first_name: "",
    last_name: "",
    mobileNo: "",
    mobileCountry: "",
    email: "",
    documents: {},
    declaration: false,
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const search = searchParams?.LoginRedirect || searchParams?.loginRedirect || searchParams?.search || "";
  const cancelRedireactUrl = `/LoginOption?LoginRedirect=${search}`;
  const singupRedirectUrl = `/LoginOption?LoginRedirect=${search}`;

  useEffect(() => {
    const storedEmail = getSession("email");
    const routeMobileNo = getSession("registerMobile");
    const storedCountryCode = getSession("Countrycodestate");

    setFormData((prev) => {
      let updated = false;
      const nextState = { ...prev };

      if (routeMobileNo && storedCountryCode) {
        if (prev.mobileNo !== routeMobileNo || prev.mobileCountry !== storedCountryCode) {
          nextState.mobileNo = routeMobileNo;
          nextState.mobileCountry = storedCountryCode;
          updated = true;
        }
      }

      if (storedEmail) {
        if (prev.email !== storedEmail) {
          nextState.email = storedEmail;
          updated = true;
        }
      }

      return updated ? nextState : prev;
    });

    if (routeMobileNo && storedCountryCode) {
      setIsMobileThrough((prev) => (prev !== true ? true : prev));
      if (mobileNoRef.current) {
        mobileNoRef.current.disabled = true;
      }
    } else {
      setIsMobileThrough((prev) => (prev !== false ? false : prev));
      if (mobileNoRef.current) {
        mobileNoRef.current.disabled = false;
      }
    }
  }, [location.searchParams]);

  const canNavigateToStep = (targetStep) => {
    if (targetStep <= activeStep) return true;
    return [...completedSteps].includes(targetStep - 1);
  };


  const isStepFieldsComplete = (step) => {
    switch (step) {
      case 0:
        return formData.company_name.trim() !== "" && formData.entity_type && formData.industry_category && formData.gst_number.trim() !== "" && formData.pan_number.trim() !== "" && formData.address_line.trim() !== "" && formData.city.trim() !== "" && formData.state.trim() !== "" && formData.country.trim() !== "" && formData.pincode.trim() !== "";

      case 1: // Authorized Representative
        return formData.first_name.trim() !== "" && formData.last_name.trim() !== "" && formData.mobileNo.trim() !== "" && formData.email.trim() !== "" && formData.password !== "" && formData.confirm_password !== "" && formData.password === formData.confirm_password && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      // return formData.first_name.trim() !== "" && formData.last_name.trim() !== "" && formData.mobileNo.trim() !== "" && formData.email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 2: // Business Documents
        const docs = formData.documents || {};
        return DocumentType.every((doc) => {
          const docValue = docs[doc.id] || {};
          const number = docValue.number?.trim();
          const file = docValue.file;
          if (doc.IsMandatory === 1) {
            return number && number !== "" && file;
          }
          return true; // optional docs don't block
        });


      case 3:
        return formData.declaration === true && formData.consent === true;

      default:
        return false;
    }
  };

  const validateStep = (step) => {
    let newErrors = {};

    switch (step) {
      case 0:
        if (!formData.company_name.trim()) newErrors.company_name = "Company name is required";
        if (!formData.entity_type) newErrors.entity_type = "Select type of entity";
        if (!formData.industry_category) newErrors.industry_category = "Select industry category";
        if (!formData.gst_number?.trim()) newErrors.gst_number = "GST number is required";
        else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number))
          newErrors.gst_number = "Invalid GST number";
        if (!formData.pan_number?.trim()) newErrors.pan_number = "PAN is required";
        else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number))
          newErrors.pan_number = "Invalid PAN number";
        if (!formData.address_line.trim()) newErrors.address_line = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
        break;

      case 1:
        if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
        if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
        if (!formData.mobileNo.trim()) newErrors.mobileNo = "mobileNo number is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.confirm_password) newErrors.confirm_password = "Confirm password is required";
        if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) newErrors.confirm_password = "Passwords do not match";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
        break;
      case 2:
        DocumentType.forEach((doc) => {
          const docValue = formData.documents[doc.id] || {};
          const number = docValue.number?.trim() || "";
          const file = docValue.file || null;
          const isMandatory = doc.IsMandatory === 1;

          // Mandatory number check
          if (isMandatory && !number) {
            newErrors[`doc_${doc.id}_number`] = `${doc.DocumentTypeName} number is required`;
          }

          // Mandatory file check
          if (isMandatory && !file) {
            newErrors[`doc_${doc.id}_file`] = `${doc.DocumentTypeName} file is required`;
          }
        });
        break;




      case 3:
        if (!formData.declaration) newErrors.declaration = "You must accept the declaration";
        if (!formData.consent) newErrors.consent = "You must provide consent";
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      newErrors.step = "Please complete all required fields before proceeding.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const areAllStepsComplete = () => {
    for (let step = 0; step < STEPS.length; step++) {
      if (!isStepFieldsComplete(step)) return false;
    }
    return true;
  };

  const isStepComplete = (step) => {
    return completedSteps.has(step) || isStepFieldsComplete(step);
  };

  const handleDocRemove = (id) => {
    setFormData((prev) => {
      const updatedDocs = { ...prev.documents };
      delete updatedDocs[id];
      return { ...prev, documents: updatedDocs };
    });
  };

  const handleDocNumberChange = (id, value, type) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [id]: { ...(prev.documents[id] || {}), number: value, type },
      },
    }));
  };

  const handleDocFileChange = (id, file, type) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      toast.error("Only image files and PDFs are allowed.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [id]: { ...(prev.documents[id] || {}), file, type },
      },
    }));
  };

  const handleInputChange = (e, setter, field) => {
    const { name, value, type, checked } = e.target;

    if (setter && field) {
      setter(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }


    if (errors.step) setErrors((prev) => ({ ...prev, step: "" }));

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (name === "password") {
        if (!value) {
          newErrors.password = "Password cannot be empty";
        } else {
          newErrors.password = "";
        }

        if (formData.confirm_password && value !== formData.confirm_password) {
          newErrors.confirm_password = "Passwords do not match";
        } else {
          newErrors.confirm_password = "";
        }
      }

      if (name === "confirm_password") {
        if (!value) {
          newErrors.confirm_password = "Confirm Password cannot be empty";
        } else if (value !== formData.password) {
          newErrors.confirm_password = "Passwords do not match";
        } else {
          newErrors.confirm_password = "";
        }
      }

      return newErrors;
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors.step) setErrors((prev) => ({ ...prev, step: "" }));
  };

  const handleNext = () => {
    const isValid = validateStep(activeStep);
    if (!isValid) {
      return;
    }
    setCompletedSteps((prev) => {
      const updated = new Set(prev);
      updated.add(activeStep);
      return updated;
    });
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
    setErrors((prev) => ({ ...prev, step: "" }));
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
    setErrors((prev) => ({ ...prev, step: "" }));
  };

  const handleStepClick = (step) => {
    if (!canNavigateToStep(step)) return;
    setActiveStep(step);
    setErrors((prev) => ({ ...prev, step: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let allValid = true;
    for (let step = 0; step < STEPS.length; step++) {
      const valid = validateStep(step);
      if (!valid) allValid = false;
    }
    if (!allValid) return;

    setLoading(true);
    try {
      const hashedPassword = hashPasswordSHA1(formData?.password);
      // const response = await WEBSignUpWithCompanyInfoAPI(formData);
      const response = await WEBSignUpWithCompanyInfoAPI({ ...formData, password: hashedPassword });
      if (response.stat === 1) {
        setSubmitSuccess(true);
        setCompletedSteps(new Set([0, 1, 2, 3]));
        // navigation(singupRedirectUrl);
      } else {
        const newErrors = {};
        if (response.ismobileexists === 1) {
          newErrors.mobileNo = response.stat_msg;
          toast.error(response.stat_msg);
        }
        if (response.isemailexists === 1) {
          newErrors.email = response.stat_msg;
          toast.error(response.stat_msg);
        }
        setErrors((prev) => ({ ...prev, ...newErrors }));
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "Registration failed. Please try again." });
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);




  if (submitSuccess) {
    return (
      <Fade in={submitSuccess} timeout={500}>
        <Box>
          <RegistrationSuccess
            onHome={() => navigation("/")}
            onLogin={() => navigation("/LoginOption")}
          />
        </Box>
      </Fade>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 8,
        pt: 3,
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <Container maxWidth="lg">
        <HeaderStepper activeStep={activeStep} handleStepClick={handleStepClick} isStepComplete={isStepComplete} isMobile={isMobile} STEPS={STEPS} />
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#7e7e7e07",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: 0,
          }}
        >
          <Grid container>
            {/* Sidebar Navigation */}
            <SidebarStepper activeStep={activeStep} handleStepClick={handleStepClick} isStepComplete={isStepComplete} isMobile={isMobile} STEPS={STEPS} />
            <Grid size={{
              xs: 12, md: 8.5
            }} sx={{ p: 4 }}>
              {activeStep === 0 && (
                <Fade in={activeStep === 0}>
                  <Box>
                    <SectionHeader isStepComplete={isStepComplete} sectionRefs={sectionRefs} title="Business Information" icon={BusinessIcon} stepIndex={0} />
                    <Divider />
                    {errors.step && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        {errors.step}
                      </Alert>
                    )}
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth required label="Company / Firm Name" name="company_name" value={formData.company_name} onChange={handleInputChange} error={!!errors.company_name} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth required error={!!errors.entity_type}>
                          <InputLabel>Type of Entity</InputLabel>
                          <Select
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200, // control dropdown height
                                },
                              },
                            }}
                            name="entity_type"
                            value={formData.entity_type}
                            onChange={handleSelectChange}
                            label="Type of Entity"
                          >
                            {TypeofEntityOptions?.map((option) => (
                              <MenuItem key={option?.id} value={option?.id}>
                                {option?.TypeOfEntityName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth required error={!!errors.industry_category}>
                          <InputLabel>Industry Category</InputLabel>
                          <Select
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                },
                              },
                            }}
                            name="industry_category"
                            value={formData.industry_category}
                            onChange={handleSelectChange}
                            label="Industry Category"
                          >
                            {CompanyType?.map((option) => (
                              <MenuItem key={option?.id} value={option?.id}>
                                {option?.CompnayTypeName || option?.CompanyTypeName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Tooltip
                          title={
                            <span style={{ lineHeight: 1.5 }}>
                              <strong>GSTIN format:</strong> 15 characters<br />
                              <em>→ 2 digits (state code) + 10-char PAN + 1 entity + 1 Z + 1 check digit</em>
                              <br />
                              (e.g.{" "}
                              <code style={{ fontWeight: "bold", color: "black" }}>
                                27ABCDE1234F1Z5
                              </code>
                              )
                            </span>
                          }
                          arrow
                          placement="top-start"
                          enterTouchDelay={0}
                        >
                          <TextField fullWidth required error={!!errors.gst_number} label="GST Number" name="gst_number" value={formData.gst_number} onChange={handleInputChange} />
                        </Tooltip>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Tooltip
                          title={
                            <span>
                              PAN format: <strong>5 letters + 4 digits + 1 letter</strong><br />
                              (e.g. <code style={{ fontWeight: "bold", color: "black" }}>ABCDE1234F</code>)
                            </span>
                          }
                          arrow
                          placement="top-start"
                          enterTouchDelay={0}
                        >
                          <TextField
                            fullWidth
                            required
                            error={!!errors.pan_number}
                            label="PAN (Permanent Account Number)"
                            name="pan_number"
                            value={formData.pan_number}
                            onChange={handleInputChange}
                            inputProps={{
                              style: { textTransform: "uppercase" },
                            }}
                          />
                        </Tooltip>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField required error={!!errors.iec_code} fullWidth label="Import Export Code (if applicable)" name="iec_code" value={formData.iec_code} onChange={handleInputChange} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField required error={!!errors.address_line} fullWidth label="Address" name="address_line" value={formData.address_line} onChange={handleInputChange} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField required error={!!errors.city} fullWidth label="City" name="city" value={formData.city} onChange={handleInputChange} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField required error={!!errors.state} fullWidth label="State" name="state" value={formData.state} onChange={handleInputChange} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField required error={!!errors.pincode} fullWidth label="Pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField required error={!!errors.country} fullWidth label="Country" name="country" value={formData.country} onChange={handleInputChange} />
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* Step 1: Authorized Representative */}
              {activeStep === 1 && (
                <Fade in={activeStep === 1}>
                  <Box>
                    <SectionHeader isStepComplete={isStepComplete} sectionRefs={sectionRefs} title="Personal Information" icon={PersonIcon} stepIndex={1} />
                    <Divider />
                    {errors.step && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        {errors.step}
                      </Alert>
                    )}
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField required error={!!errors.first_name} fullWidth label="First Name" name="first_name" value={formData.first_name} onChange={handleInputChange} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField required error={!!errors.last_name} fullWidth label="Last Name" name="last_name" value={formData.last_name} onChange={handleInputChange} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        {/* <TextField fullWidth required error={!!errors.mobileNo} label="Mobile Number" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} type="tel" /> */}
                        {/* <CountryDropDown
                          emailRef={null}
                          Errors={errors}                  
                          setErrors={setErrors}            
                          mobileNo={formData.mobileNo}     
                          setMobileNo={(val) =>
                            setFormData((prev) => ({ ...prev, mobileNo: val }))
                          }
                          mobileNoRef={mobileNoRef}
                          IsMobileThrough={IsMobileThrough}
                          handleKeyDown={() => { }}
                          handleInputChange={(e) => {
                            const { value } = e.target;
                            setFormData((prev) => ({ ...prev, mobileNo: value }));
                          }}
                          Countrycodestate={formData.mobileCountry}
                          setCountrycodestate={(val) =>
                            setFormData((prev) => ({ ...prev, mobileCountry: val }))
                          }
                          isElvee={true}
                        /> */}
                        <CountryDropDown
                          emailRef={null}
                          Errors={errors}
                          setErrors={setErrors}
                          mobileNo={formData.mobileNo}
                          setMobileNo={(val) => setFormData(prev => ({ ...prev, mobileNo: val }))}
                          mobileNoRef={mobileNoRef}
                          IsMobileThrough={IsMobileThrough}
                          handleKeyDown={() => { }}
                          handleInputChange={handleInputChange} // <-- pass your form handler
                          Countrycodestate={formData.mobileCountry}
                          setCountrycodestate={(val) => setFormData(prev => ({ ...prev, mobileCountry: val }))}
                          isElvee={true}
                          activeStep={activeStep}
                        />


                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth required error={!!errors.email} label="Email Address" name="email" value={formData.email} onChange={handleInputChange} type="email" />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.password}
                          label="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          type={showPassword ? "text" : "password"}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          error={!!errors.confirm_password}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility" onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          fullWidth
                          required
                          label="Confirm Password"
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleInputChange}
                          type={showConfirmPassword ? "text" : "password"}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              )}

              {/* Step 2: Documents Upload */}
              {activeStep === 2 && (
                <Fade in={activeStep === 2}>
                  <Box>
                    <SectionHeader isStepComplete={isStepComplete} sectionRefs={sectionRefs} title="Business Documents Upload" icon={DocumentIcon} stepIndex={2} />
                    <Divider />

                    {errors.step && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        {errors.step}
                      </Alert>
                    )}

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      {DocumentType?.map((doc) => {
                        const isMandatory = doc.IsMandatory === 1;
                        return (
                          <Grid size={{ xs: 12, md: 6 }} key={doc.id}>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 1.5,
                                fontWeight: 500,
                                fontSize: "0.875rem",
                              }}
                            >
                              {doc?.DocumentTypeName} Number {isMandatory ? "*" : ""}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                              <TextField error={!!errors[`doc_${doc.id}_number`]} fullWidth value={formData.documents?.[doc.id]?.number || ""} onChange={(e) => handleDocNumberChange(doc.id, e.target.value, doc?.DocumentTypeName)} />
                              <FileUploadField error={!!errors[`doc_${doc.id}_file`]} handleDocRemove={() => handleDocRemove(doc?.id)} handleFileChange={(e) => handleDocFileChange(doc.id, e.target.files?.[0] || null, doc?.DocumentTypeName)} label="Upload" name={`doc_${doc.id}`} file={formData.documents?.[doc.id]?.file || null} compact />
                            </Box>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Box>
                </Fade>
              )}
              {/* Step 3: Declarations & Consent */}
              {activeStep === 3 && (
                <Fade in={activeStep === 3}>
                  <Box>
                    <SectionHeader isStepComplete={isStepComplete} sectionRefs={sectionRefs} title="Declarations & Consent" icon={VerifiedIcon} stepIndex={3} />
                    <Divider />
                    {errors.step && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        {errors.step}
                      </Alert>
                    )}
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: "12px",
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <FormControlLabel
                          control={<Checkbox name="declaration" checked={formData.declaration} onChange={handleInputChange} />}
                          label={
                            <Typography
                              sx={{
                                fontSize: "0.938rem",
                                lineHeight: 1.6,
                              }}
                            >
                              I/We hereby declare that the information and documents provided are true and correct. *
                            </Typography>
                          }
                          error={!!errors.declaration}
                          helperText={errors.declaration}
                        />
                      </Box>

                      <Box>
                        <FormControlLabel
                          control={<Checkbox name="consent" checked={formData.consent} onChange={handleInputChange} />}
                          label={
                            <Typography
                              sx={{
                                fontSize: "0.938rem",
                                lineHeight: 1.6,
                              }}
                            >
                              I/We consent to the use of my/our data in accordance with the Privacy Policy & Terms & Conditions. *
                            </Typography>
                          }
                          error={!!errors.consent}
                          helperText={errors.consent}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        mt: 3,
                        p: 2.5,
                        bgcolor: "rgba(251, 191, 36, 0.08)",
                        border: "1px solid rgba(251, 191, 36, 0.2)",
                        borderRadius: "12px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#fbbf24",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                        }}
                      >
                        <strong>Important:</strong> By submitting this form, you acknowledge that all information provided is accurate and complete. False information may result in application rejection.
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              )}
              {/* Navigation Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 5,
                  pt: 4,
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    px: 3,
                    py: 1.25,
                    fontSize: "0.938rem",
                    fontWeight: 600,
                    textTransform: "none",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 0.2,
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#505050ff",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      color: '#fff'
                    },
                    "&:disabled": {
                      color: "#4b5563",
                      borderColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  Back
                </Button>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    onClick={() => navigation("/LoginOption")}
                    sx={{
                      px: 3,
                      py: 1.25,
                      fontSize: "0.938rem",
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "none",
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 0.2,
                      bgcolor: "transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.03)",
                        borderColor: "#10264E",
                      },
                    }}
                  >
                    Back to Login
                  </Button>

                  {activeStep === STEPS.length - 1 ? (
                    <Button
                      variant="contained"
                      disabled={!areAllStepsComplete() || loading}
                      startIcon={loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <CheckIcon />}
                      sx={{
                        px: 4,
                        py: 1.25,
                        fontSize: "0.938rem",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "10px",
                        background: "#10264E",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "#10264E",
                          transform: "translateY(-1px)",
                        },
                        "&:disabled": {
                          background: "rgba(139, 92, 246, 0.3)",
                          color: "rgba(255, 255, 255, 0.5)",
                        },
                      }}
                      type="submit"
                      onClick={handleSubmit}
                    >
                      {loading ? "Submitting..." : "Submit Registration"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 4,
                        py: 1.25,
                        fontSize: "0.938rem",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 0.2,
                        background: "#505050ff",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "#505050ff",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Continue
                    </Button>
                  )}
                </Box>
              </Box>
              {errors.submit && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 3,
                    bgcolor: "rgba(239, 68, 68, 0.15)",
                    color: "#ef4444",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "12px",
                    "& .MuiAlert-icon": {
                      color: "#ef4444",
                    },
                  }}
                >
                  {errors.submit}
                </Alert>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default B2bRegister;
