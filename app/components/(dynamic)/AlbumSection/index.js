import React from "react";
import { Box, Typography } from "@mui/material";
import Main from "./Main";

const Index = ({ storeData }) => {
  return (
    <Box className="smr_alubmMainDiv">
      <Typography
        variant="h4"
        fontWeight={700}
        color="text.primary"
        gutterBottom
        sx={{
          mb: 3,
          textAlign: "center",
          letterSpacing: "-0.5px",
          mt: 3,
        }}
      >
        Infinitely Inspiring
      </Typography>

      <Main key={storeData?.IsHomeAlbum} storeData={storeData} />
    </Box>
  );
};

export default Index;
