import React, { useState, useEffect } from "react";
import { Box, IconButton, InputBase } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const QuantityInput = ({
  defaultValue = 1,
  onChange,
  singleProd,
  disabled,
  isLoading,
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const updateValue = (newValue) => {
    let val = Number(newValue);

    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > 1000) val = 1000;

    setValue(val);
    onChange && onChange(singleProd?.CartId, val);
  };

  const handleDecrease = () => {
    if (disabled || isLoading) return;
    updateValue(value - 1);
  };

  const handleIncrease = () => {
    if (disabled || isLoading) return;
    updateValue(value + 1);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;

    // allow empty while typing
    if (val === "") {
      setValue("");
      return;
    }

    // only numbers
    if (/^\d+$/.test(val)) {
      setValue(Number(val));
    }
  };

  const handleBlur = () => {
    updateValue(value);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        height: "100%",
        justifyContent: "center",
        backgroundColor: "#F3F4F6",
        py: 0.5,
        borderRadius: 0.55,
        px: 0.5,
      }}
    >
      <IconButton
        sx={{
          bgcolor: "#FFFFFF",
          color: "#6B7280",
          borderRadius: 0.4,
        }}
        onClick={handleDecrease}
        disabled={disabled || isLoading || value <= 1}
      >
        <RemoveIcon />
      </IconButton>

      <InputBase
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled || isLoading}
        inputProps={{
          style: {
            textAlign: "center",
            width: "30px",
            fontWeight: 500,
            color: "#111827",
          },
          maxLength: 4, // 1000 max
        }}
      />

      <IconButton
        sx={{
          bgcolor: "#FFFFFF",
          color: "#6B7280",
          borderRadius: 0.4,
        }}
        onClick={handleIncrease}
        disabled={disabled || isLoading || value >= 1000}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default QuantityInput;

// import React, { useState, useEffect } from "react";
// import { Box, IconButton, Typography, InputBase } from "@mui/material";
// import RemoveIcon from "@mui/icons-material/Remove";
// import AddIcon from "@mui/icons-material/Add";

// const QuantityInput = ({ defaultValue = 1, onChange, singleProd, disabled, isLoading }) => {
//   const [value, setValue] = useState(defaultValue);

//   useEffect(() => {
//     setValue(defaultValue);
//   }, [defaultValue]);

//   const handleDecrease = () => {
//     if (disabled || isLoading) return;
//     const newValue = value > 1 ? value - 1 : 1;
//     setValue(newValue);
//     onChange && onChange(singleProd?.CartId, newValue);
//   };

//   const handleIncrease = () => {
//     if (disabled || isLoading) return;
//     const newValue = value + 1;
//     setValue(newValue);
//     onChange && onChange(singleProd?.CartId, newValue);
//   };

//   return (
//     <Box
//       display="flex"
//       alignItems="center"
//       gap={1}
//       sx={{
//         height: "100%",
//         justifyContent: "center",
//         backgroundColor: "#F3F4F6", // soft light grey
//         py: 0.5,
//         borderRadius: 0.55,
//         px: 0.5,
//       }}
//     >
//       <IconButton
//         sx={{
//           bgcolor: "#FFFFFF", // white button
//           color: "#6B7280", // soft dark icon
//           borderRadius: 0.4,
//         }}
//         onClick={handleDecrease}
//         disabled={disabled || isLoading || value <= 1}
//       >
//         <RemoveIcon />
//       </IconButton>

//       <Typography
//         variant="body1"
//         sx={{
//           color: "#111827", // strong dark number
//           fontWeight: 500,
//           px: 1,
//         }}
//       >
//         {value}
//       </Typography>

//       <IconButton
//         sx={{
//           bgcolor: "#FFFFFF", // white button
//           color: "#6B7280",
//           borderRadius: 0.4,
//         }}
//         onClick={handleIncrease}
//         disabled={disabled || isLoading}
//       >
//         <AddIcon />
//       </IconButton>
//     </Box>
//   );
// };

// export default QuantityInput;
