import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Skeleton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const QuantityInput = ({ defaultValue = 1, onChange, singleProd, disabled, isLoading }) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleDecrease = () => {
    if (disabled || isLoading) return;
    const newValue = value > 1 ? value - 1 : 1;
    setValue(newValue);
    onChange && onChange(singleProd?.CartId, newValue);
  };

  const handleIncrease = () => {
    if (disabled || isLoading) return;
    const newValue = value + 1;
    setValue(newValue);
    onChange && onChange(singleProd?.CartId, newValue);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        height: "100%",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: '4px' }} />
      ) : (
        <>
          <IconButton onClick={handleDecrease} disabled={disabled || value <= 1}>
            <RemoveIcon />
          </IconButton>
          <Typography variant="body1">{value}</Typography>
          <IconButton onClick={handleIncrease} disabled={disabled}>
            <AddIcon />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default QuantityInput;
