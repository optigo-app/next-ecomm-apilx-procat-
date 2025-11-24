// import React from "react";
// import "./AlbumSkeleton.scss";
// import { Skeleton, Card, CardMedia, Box, useMediaQuery } from "@mui/material";
// import Masonry from "@mui/lab/Masonry";

// const AlbumSkeleton = ({ fromPage }) => {
//     // Responsive column setup
//     const isMobile = useMediaQuery("(max-width: 767px)");
//     const isTablet = useMediaQuery("(max-width: 1024px)");
//     const isSmallDesktop = useMediaQuery("(max-width: 1440px)");

//     const cardsArray = Array.from({ length: 20 }, (_, index) => index + 1);

//     // Determine columns dynamically
//     const columns = isMobile ? 2 : isTablet ? 3 : isSmallDesktop ? 4 : 5;

//     // Randomized heights for natural masonry look
//     const getRandomHeight = () => {
//         const heights = [230, 260, 290, 320, 350, 380];
//         return heights[Math.floor(Math.random() * heights.length)];
//     };

//     return (
//         <Box
//             className="album_SkeltenShow"
//             sx={{
//                 width: "100%",
//                 marginTop: "40px",
//                 display: "flex",
//                 justifyContent: "center",
//             }}
//         >
//             <Masonry
//                 columns={columns}
//                 spacing={2}
//                 sx={{
//                     width: "100%",
//                     maxWidth: "1600px",
//                     margin: "0 auto",
//                 }}
//             >
//                 {cardsArray.map((item) => (
//                     <Card
//                         key={item}
//                         className="proCat_album_skle_Main"
//                         sx={{
//                             overflow: "hidden",
//                             boxShadow: 'none',
//                             border: '1px solid #e8e8e8'
//                         }}
//                     >
//                         <CardMedia
//                             sx={{
//                                 width: "100%",
//                                 height: getRandomHeight(),
//                             }}
//                             className="cardMainSkeleton"
//                         >
//                             <Skeleton
//                                 animation="wave"
//                                 variant="rectangular"
//                                 width="100%"
//                                 height="100%"
//                                 sx={{
//                                     bgcolor: "rgba(240, 243, 246, 0.5)", // Soft cool white with transparency
//                                     "&::after": {
//                                         background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)", // smooth shimmer
//                                     },
//                                     boxShadow: 'none',
//                                 }}
//                             />

//                         </CardMedia>
//                     </Card>
//                 ))}
//             </Masonry>
//         </Box>
//     );
// };

// export default AlbumSkeleton;


import React from 'react';
import './AlbumSkeleton.scss';
import { Skeleton, Card, CardContent, Grid, CardMedia, useMediaQuery } from '@mui/material';

const AlbumSkeleton = ({ fromPage }) => {
    const cardsArray = Array.from({ length: 20 }, (_, index) => index + 1);
    const isMobile = useMediaQuery('(max-width: 767px)');
    const isDesktop = useMediaQuery('(max-width: 1440px)');

    return (
        <div className='album_SkeltenShow'>
            <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', width: '100% !important', marginTop: '40px' }}>
                {/* <CardMedia style={{ width: '100%', height: '30vh' }} className='cardMainSkeleton'>
                    <Skeleton animation="wave" variant="rect" width={'100%'} height='10vh' style={{ backgroundColor: '#e8e8e86e' }} />
                </CardMedia> */}
                {cardsArray.map((item) => (
                    <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        lg={2.4}
                        key={item}
                        className='proCat_album_skle_Main'
                    >
                        <Card className="proCat_lookbookcards_listpage">
                            <CardMedia style={{ width: '100%', height: '30vh' }} className='cardMainSkeleton'>
                                <Skeleton animation="wave" variant="rect" width={'100%'} height='40vh' style={{ backgroundColor: '#e8e8e86e' }} />
                            </CardMedia>
                            {/* <CardContent>
                                    <Skeleton animation="wave" variant="text" width={'80%'} height={20} style={{ marginBottom: '10px', backgroundColor: '#e8e8e86e' }} />
                                    <Skeleton animation="wave" variant="text" width={'60%'} height={20} style={{ backgroundColor: '#e8e8e86e' }} />
                                </CardContent> */}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default AlbumSkeleton;
