import {
    Box,
    Card,
    CardContent,
    Skeleton,
    Grid
} from '@mui/material';
import './index.scss';

const ProductSkeleton = () => (
    <Card
        sx={{
            transition: "all 0.3s ease",
            border: 'none',
            boxShadow: 'none',
            outline: 'none'
        }}
    >
        <Box sx={{ position: "relative", paddingTop: "120%" }}>
            <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "#eeeeee80",
                    borderRadius: 4,
                    border: 'none',
                    boxShadow: 'none',
                    outline: 'none'
                }}
            />
        </Box>
        <CardContent sx={{ px: 1, py: 1.5 }}>
            <Skeleton
                width="40%"
                height={20}
                animation="wave"
                sx={{ bgcolor: "#eeeeee80", mb: 1 }}
            />
            <Skeleton
                width="85%"
                height={20}
                animation="wave"
                sx={{ bgcolor: "#eeeeee80", mb: 1 }}
            />
            <Skeleton
                width="60%"
                height={20}
                animation="wave"
                sx={{ bgcolor: "#eeeeee80", mb: 1 }}
            />
            <Skeleton
                width="75%"
                height={20}
                animation="wave"
                sx={{ bgcolor: "#eeeeee80" }}
            />
        </CardContent>
    </Card>
);

export default ProductSkeleton;

export const DetailSkeleton = () => {
    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: "520px", md: "540px" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mx: "auto",
            }}
        >
            {/* Main Featured Image Skeleton */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    pt: "100%",
                    mb: 1.5,
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: 2,
                        bgcolor: "#eeeeee80",
                    }}
                />
            </Box>
            {/* Thumbnails Row Skeleton */}
            <Box sx={{ display: "flex", gap: 1.2, overflow: "hidden" }}>
                {Array(4)
                    .fill(null)
                    .map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rectangular"
                            animation="wave"
                            sx={{
                                width: { xs: "65px", sm: "76px", md: "84px" },
                                height: { xs: "65px", sm: "76px", md: "84px" },
                                flexShrink: 0,
                                borderRadius: 1.5,
                                bgcolor: "#eeeeee80",
                            }}
                        />
                    ))}
            </Box>
        </Box>
    );
};