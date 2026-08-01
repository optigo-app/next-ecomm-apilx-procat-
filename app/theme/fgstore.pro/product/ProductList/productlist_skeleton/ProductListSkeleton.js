import React from "react";
// Using individual deep imports instead of the barrel "@mui/material" to avoid
// Turbopack HMR "module factory not available" errors. When ProductList.js is
// hot-updated, the shared MUI barrel chunk can get invalidated; deep imports
// give each component its own stable chunk that survives HMR.
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

// Helper component for a single Filter Card Box Skeleton
const FilterCardBoxSkeleton = ({ itemCount = 4 }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.6,
      mb: 1.4,
      borderRadius: "12px",
      bgcolor: "#FFFFFF",
      border: "1px solid #EAEAEA",
    }}
  >
    <Skeleton animation="wave" variant="text" width="60%" height={22} sx={{ mb: 1.2 }} />
    {Array.from({ length: itemCount }).map((_, idx) => (
      <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.3 }}>
        <Skeleton animation="wave" variant="rectangular" width={16} height={16} sx={{ borderRadius: "3px" }} />
        <Skeleton animation="wave" variant="text" width={`${50 + (idx % 3) * 15}%`} height={18} />
      </Box>
    ))}
  </Paper>
);

// Helper component for a single Product Card Skeleton
const ProductCardSkeleton = () => (
  <Card
    elevation={0}
    sx={{
      borderRadius: "12px",
      border: "1px solid #EDEDED",
      bgcolor: "#FFFFFF",
      p: 1.5,
    }}
  >
    {/* 1:1 Square Image Container Skeleton */}
    <Box sx={{ pt: "100%", position: "relative", borderRadius: "8px", overflow: "hidden", bgcolor: "#FAFAFA" }}>
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />
    </Box>

    {/* Card Details Skeleton */}
    <Box sx={{ pt: 1.5 }}>
      <Skeleton animation="wave" variant="text" width="50%" height={22} sx={{ mb: 0.5 }} />
      <Skeleton animation="wave" variant="text" width="70%" height={16} sx={{ mb: 1.2 }} />
      <Skeleton animation="wave" variant="rounded" height={32} sx={{ borderRadius: "6px" }} />
    </Box>
  </Card>
);

// Unified Loading View for both Initial Page Load and Product Filter Loading
const SharedSkeletonLayout = () => {
  const cardsArray = Array.from({ length: 10 }, (_, index) => index);

  return (
    <Box sx={{ pt: 1, pb: { xs: 6, md: 10 }, mb: 4 }}>
      <Grid container spacing={2}>
        {/* Left Filter Sidebar Skeleton (2.2 / 2.6 columns - 100% matches ProductList.js) */}
        <Grid
          size={{ xs: 12, md: 2.6, lg: 2.2 }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <Box>
            {/* Header FILTERS Paper */}
            <Paper
              elevation={0}
              sx={{
                p: 1.6,
                mb: 1.4,
                borderRadius: "12px",
                bgcolor: "#FFFFFF",
                border: "1px solid #EAEAEA",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Skeleton animation="wave" variant="text" width="70px" height={22} />
              <Skeleton animation="wave" variant="text" width="55px" height={18} />
            </Paper>

            {/* Filter Categories Card Box Skeletons */}
            <FilterCardBoxSkeleton itemCount={4} />
            <FilterCardBoxSkeleton itemCount={3} />
            <FilterCardBoxSkeleton itemCount={4} />
            <FilterCardBoxSkeleton itemCount={3} />
          </Box>
        </Grid>

        {/* Right Product Grid Skeleton (9.8 / 9.4 columns - 100% matches ProductList.js) */}
        <Grid size={{ xs: 12, md: 9.4, lg: 9.8 }}>
          <Grid container spacing={2}>
            {cardsArray.map((item) => (
              <Grid
                key={item}
                size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}
              >
                <ProductCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const ProductListSkeleton = () => {
  return <SharedSkeletonLayout />;
};

export default ProductListSkeleton;

export function PageSkeleton() {
  return <SharedSkeletonLayout />;
}
