import React from 'react';
import { Skeleton, Card, Grid, Box } from '@mui/material';

// Helper component for a single Filter Section Skeleton
const FilterAccordionSkeleton = ({ titleWidth = "70%", itemCount = 3 }) => (
    <Box sx={{ pb: 1.5, mb: 1.5, borderBottom: "1px solid #F0F0F0" }}>
        <Skeleton animation="wave" variant="text" width={titleWidth} height={22} sx={{ mb: 1.2 }} />
        {Array.from({ length: itemCount }).map((_, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 0.4 }}>
                <Skeleton animation="wave" variant="circular" width={14} height={14} />
                <Skeleton animation="wave" variant="text" width={`${45 + (idx % 3) * 15}%`} height={16} />
            </Box>
        ))}
    </Box>
);

// Helper component for a single Product Card Skeleton (no explicit fixed height or width)
const ProductCardSkeleton = () => (
    <Card
        elevation={0}
        sx={{
            borderRadius: "8px",
            border: "1px solid #EDEDED",
            bgcolor: "#FFFFFF",
            p: 1.5,
        }}
    >
        {/* 1:1 Square Image Container Skeleton */}
        <Box sx={{ pt: "100%", position: "relative", borderRadius: "6px", overflow: "hidden", bgcolor: "#FAFAFA" }}>
            <Skeleton
                animation="wave"
                variant="rectangular"
                sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "6px" }}
            />
        </Box>

        {/* Card Details Skeleton */}
        <Box sx={{ pt: 1.5 }}>
            {/* Price line */}
            <Skeleton animation="wave" variant="text" width="55%" height={22} sx={{ mb: 0.5 }} />
            {/* Delivery date link */}
            <Skeleton animation="wave" variant="text" width="45%" height={16} sx={{ mb: 0.5 }} />
            {/* Title line */}
            <Skeleton animation="wave" variant="text" width="85%" height={16} sx={{ mb: 1.5 }} />
            {/* CTA Button */}
            <Skeleton animation="wave" variant="rounded" height={32} sx={{ borderRadius: "4px" }} />
        </Box>
    </Card>
);

// Unified Loading View for both Initial Page Load and Product Filter Loading
const SharedSkeletonLayout = () => {
    const cardsArray = Array.from({ length: 10 }, (_, index) => index);

    return (
        <Box sx={{ pt: 1, pb: { xs: 6, md: 10 }, mb: 4 }}>
            <Grid container spacing={2.5}>
                {/* Left Filter Sidebar Skeleton (2.8 columns) */}
                <Grid
                    size={{ xs: 12, md: 3, lg: 2.8 }}
                    sx={{ display: { xs: "none", md: "block" } }}
                >
                    <Box
                        sx={{
                            borderRadius: "12px",
                            bgcolor: "#FFFFFF",
                            p: 2.5,
                            border: "1px solid #EDEDED",
                        }}
                    >
                        {/* Header FILTERS */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1.2, mb: 1.5, borderBottom: "1px solid #ECECEC" }}>
                            <Skeleton animation="wave" variant="text" width="80px" height={20} />
                            <Skeleton animation="wave" variant="text" width="60px" height={16} />
                        </Box>
                        {/* Filter Categories Skeletons */}
                        <FilterAccordionSkeleton titleWidth="60%" itemCount={4} />
                        <FilterAccordionSkeleton titleWidth="75%" itemCount={3} />
                        <FilterAccordionSkeleton titleWidth="50%" itemCount={4} />
                        <FilterAccordionSkeleton titleWidth="65%" itemCount={3} />
                    </Box>
                </Grid>

                {/* Right Product Grid Skeleton (9.2 columns, 5 cards per row: lg: 2.4) */}
                <Grid size={{ xs: 12, md: 9, lg: 9.2 }}>
                    <Grid container spacing={2.5}>
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
