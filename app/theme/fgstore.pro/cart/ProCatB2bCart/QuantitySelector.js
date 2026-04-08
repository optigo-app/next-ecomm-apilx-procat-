import React, { useState, useEffect } from "react";
import { Box, IconButton, InputBase } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const QuantitySelector = ({
  selectedItem,
  handleIncrement,
  handleDecrement,
}) => {
  const [value, setValue] = useState(selectedItem?.Quantity || 1);

  useEffect(() => {
    setValue(selectedItem?.Quantity || 1);
  }, [selectedItem?.Quantity]);

  const updateValue = (newValue) => {
    let val = Number(newValue);

    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > 1000) val = 1000;

    setValue(val);

    // 🔥 sync with parent using existing handlers
    if (val > selectedItem?.Quantity) {
      handleIncrement(selectedItem, val);
    } else if (val < selectedItem?.Quantity) {
      handleDecrement(selectedItem, val);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;

    if (val === "") {
      setValue("");
      return;
    }

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
        backgroundColor: "#F3F4F6",
        py: 0.5,
        px: 0.5,
        borderRadius: 0.55,
      }}
    >
      <IconButton
        sx={{
          bgcolor: "#FFFFFF",
          color: "#6B7280",
          borderRadius: 0.4,
        }}
        onClick={() => handleDecrement(selectedItem)}
        disabled={value <= 1}
      >
        <RemoveIcon />
      </IconButton>

      <InputBase
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        inputProps={{
          style: {
            textAlign: "center",
            width: "30px",
            fontWeight: 500,
            color: "#111827",
          },
          maxLength: 4,
        }}
      />

      <IconButton
        sx={{
          bgcolor: "#FFFFFF",
          color: "#6B7280",
          borderRadius: 0.4,
        }}
        onClick={() => handleIncrement(selectedItem)}
        disabled={value >= 1000}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;

// import React, { useState } from 'react';
// import './proCat_cartPage.scss';

// const QuantitySelector = ({ selectedItem, qtyCount, handleIncrement, handleDecrement, }) => {

//   return (
//     <div className="proCat_cart-quantity">
//       <button className="bttn bttn-left" onClick={() => handleDecrement(selectedItem)}>
//         <span>-</span>
//       </button>
//       <input
//         type="number"
//         className="input"
//         id="input"
//         defaultValue={selectedItem?.Quantity}
//         value={selectedItem?.Quantity}
//         readOnly
//       />
//       <button className="bttn bttn-right" onClick={() => handleIncrement(selectedItem)}>
//         <span>+</span>
//       </button>
//     </div>
//   );
// };

// export default QuantitySelector;
