import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const QuantityInput = ({ defaultValue = 1, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  const handleDecrease = () => {
    const newValue = Math.max(0, value - 1);
    setValue(newValue);
    onChange && onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = value + 1;
    setValue(newValue);
    onChange && onChange(newValue);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}
    sx={{
        height:'100%',
        justifyContent:'center'
    }}
    >
      <IconButton onClick={handleDecrease}>
        <RemoveIcon />
      </IconButton>

      <Typography variant="h6">{value}</Typography>

      <IconButton onClick={handleIncrease}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default QuantityInput;
