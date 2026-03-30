import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Box, Typography, Card, CardActionArea, CardMedia, CardContent } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "swiper/css";
import "swiper/css/navigation";

const MoreProducts = forwardRef(({ imageData, handleMoveToDetail, singleProd, imageNotFound }, ref) => {
  if (!imageData?.length) return null;

  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    swiper: swiperRef.current
  }));

  // 1. Condition to check if we should show the left/right arrows
  const showArrows = imageData.length > 5;

  return (
    <>
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 6 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            textAlign: "center",
            color: "#7d7f85",
            fontSize: "30px",
            fontWeight: 400,
          }}
        >
          More Products
        </Typography>
        <Box position="relative">
          
          {/* 2. Conditionally render Left Chevron */}
          {showArrows && (
            <IconButton
              onClick={() => swiperRef.current?.slidePrev()}
              sx={{
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "#fff",
                boxShadow: 2,
                "&:hover": { background: "#f5f5f5" },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
          
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            spaceBetween={20}
            centerInsufficientSlides={true} 
            breakpoints={{
              0: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
              1536: { slidesPerView: 5 },
            }}
            style={{ paddingBottom: "20px" }}
          >
            {imageData.map((ele, index) => (
              <SwiperSlide key={ele?.autocode}>
                <Box sx={{ py: 1 }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      transition: "0.3s ease",
                      border: singleProd?.designno === ele?.designno ? "1px solid #d8a4a4" : "1px solid transparent",
                      bgcolor: "#bebebe3b",
                    }}
                  >
                    <CardActionArea onClick={() => handleMoveToDetail(ele, index)}>
                      <CardMedia
                        component="img"
                        image={ele?.imageSrc}
                        alt={ele?.TitleLine}
                        loading="eager"
                        onError={(e) => {
                          e.target.src = imageNotFound;
                        }}
                        sx={{
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                        }}
                      />

                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {ele?.designno}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 4. Conditionally render Right Chevron */}
          {showArrows && (
            <IconButton
              onClick={() => swiperRef.current?.slideNext()}
              sx={{
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "#fff",
                boxShadow: 2,
                "&:hover": { background: "#f5f5f5" },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}

        </Box>
      </Box>
    </>
  );
});

export default MoreProducts;
// import React, { useRef, useState } from "react";
// import { Box, Typography, Card, CardActionArea, CardMedia, CardContent } from "@mui/material";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Keyboard } from "swiper/modules";
// import IconButton from "@mui/material/IconButton";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// import "swiper/css";
// import "swiper/css/navigation";

// const MoreProducts = ({ imageData, handleMoveToDetail, singleProd, imageNotFound }) => {
//   if (!imageData?.length) return null;

//   const swiperRef = useRef(null);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const shouldCenter = imageData.length <= 5;

//   return (
//     <>
//       <Box sx={{ px: { xs: 2, sm: 4 }, py: 6 }}>
//         <Typography
//           variant="h6"
//           sx={{
//             mb: 4,
//             textAlign: "center",
//             color: "#7d7f85",
//             fontSize: "30px",
//             fontWeight: 400,
//           }}
//         >
//           More Products
//         </Typography>
//         <Box position="relative">
//           <IconButton
//             onClick={() => swiperRef.current?.slidePrev()}
//             sx={{
//               position: "absolute",
//               left: -20,
//               top: "50%",
//               transform: "translateY(-50%)",
//               zIndex: 10,
//               background: "#fff",
//               boxShadow: 2,
//               "&:hover": { background: "#f5f5f5" },
//             }}
//           >
//             <ChevronLeftIcon />
//           </IconButton>
          
//           <Swiper
//             onSwiper={(swiper) => (swiperRef.current = swiper)}
//             onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
//             spaceBetween={20}
//             centeredSlides={shouldCenter}
//             centerInsufficientSlides={true}
//             keyboard={{ enabled: true }}
//             modules={[Keyboard]}
//             breakpoints={{
//               0: { slidesPerView: 1 },
//                 480: { slidesPerView: 2 },
//               600: { slidesPerView: 2 },
//               900: { slidesPerView: 3 },
//               1200: { slidesPerView: 4 },
//               1536: { slidesPerView: 5 },
//             }}
//             style={{ paddingBottom: "20px" }}
//           >
//             {imageData.map((ele, index) => (
//               <SwiperSlide key={ele?.autocode}>
//                 <Box sx={{ py: 1 }}>
//                   <Card
//                     elevation={0}
//                     sx={{
//                       borderRadius: 3,
//                       transition: "0.3s ease",
//                       border: singleProd?.designno === ele?.designno ? "1px solid #d8a4a4" : "1px solid transparent",
//                       bgcolor: "#bebebe3b",
//                     }}
//                   >
//                     <CardActionArea onClick={() => handleMoveToDetail(ele, index)}>
//                       <CardMedia
//                         component="img"
//                         image={ele?.imageSrc}
//                         alt={ele?.TitleLine}
//                         loading="eager"
//                         onError={(e) => {
//                           e.target.src = imageNotFound;
//                         }}
//                         sx={{
//                           aspectRatio: "1 / 1",
//                           objectFit: "cover",
//                         }}
//                       />

//                       <CardContent sx={{ textAlign: "center", py: 2 }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                           {ele?.designno}
//                         </Typography>
//                       </CardContent>
//                     </CardActionArea>
//                   </Card>
//                 </Box>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//           <IconButton
//             onClick={() => swiperRef.current?.slideNext()}
//             sx={{
//               position: "absolute",
//               right: -20,
//               top: "50%",
//               transform: "translateY(-50%)",
//               zIndex: 10,
//               background: "#fff",
//               boxShadow: 2,
//               "&:hover": { background: "#f5f5f5" },
//             }}
//           >
//             <ChevronRightIcon />
//           </IconButton>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default MoreProducts;

// //   {imageData?.length > 0 && (
// //                   <>
// //                     {imageData?.length <= 5 && !maxwidth1023px ? (
// //                       <div className="proCat_moreProduct_cardContainer">
// //                         <p className="proCat_details_title">More Products</p>
// //                         <div className="proCat_swiper_container">
// //                           {imageData?.map((ele, index) => {
// //                             return (
// //                               <div
// //                                 key={ele?.autocode}
// //                                 className="procat_design_slide_detailpage_card"
// //                                 onClick={() => handleMoveToDetail(ele, index)}
// //                                 style={{
// //                                   border: singleProd?.designno === ele?.designno ? "1px solid #d8a4a4" : "",
// //                                 }}
// //                               >
// //                                 <img src={ele?.imageSrc} alt={ele?.TitleLine} loading="eager" onError={(e) => (e.target.src = imageNotFound)} />
// //                                 {/* <div className="procat_design_details_div procat_cart_btn "> */}
// //                                 <div className="procat_design_details_div ">
// //                                   <span>{ele?.designno}</span>
// //                                   {/* remove for all pro user by priyank bhai */}
// //                                   {/* <span>{ele?.TitleLine}</span> */}
// //                                 </div>
// //                               </div>
// //                             );
// //                           })}
// //                         </div>
// //                       </div>
// //                     ) : (
// //                       <div className="proCat_moreProduct_swiperMainDiv">
// //                         <p className="proCat_details_title">More Products</p>
// //                         <div className="proCat_swiper_container">
// //                           <Swiper
// //                             ref={innerSwiperRef}
// //                             style={{
// //                               width: "100%",
// //                             }}
// //                             spaceBetween={10}
// //                             lazy={true}
// //                             navigation={imageData?.length > 3}
// //                             breakpoints={{
// //                               1440: {
// //                                 slidesPerView: imageData?.length >= 6 ? 6 : imageData?.length,
// //                               },
// //                               1024: {
// //                                 slidesPerView: imageData?.length >= 4 ? 4 : imageData?.length,
// //                               },
// //                               768: {
// //                                 slidesPerView: imageData?.length >= 2 ? 2 : imageData?.length,
// //                               },
// //                               0: {
// //                                 slidesPerView: imageData?.length >= 2 ? 2 : imageData?.length,
// //                               },
// //                             }}
// //                             modules={[Keyboard, FreeMode, Navigation]}
// //                             keyboard={{ enabled: true }}
// //                             pagination={false}
// //                           >
// //                             {imageData?.map((ele, index) => (
// //                               <SwiperSlide
// //                                 style={{
// //                                   width: "100%",
// //                                 }}
// //                                 key={ele?.autocode}
// //                                 className="proCat_Swiper_slide_custom"
// //                                 onClick={() => handleMoveToDetail(ele, index)}
// //                               >
// //                                 <div
// //                                   className="procat_design_slide_detailpage"
// //                                   style={{
// //                                     border: singleProd?.designno === ele?.designno ? "1px solid #d8a4a4" : "",
// //                                   }}
// //                                 >
// //                                   <img src={ele?.imageSrc} alt={ele?.TitleLine} loading="eager" onError={(e) => (e.target.src = imageNotFound)} />
// //                                   <div className="procat_design_details_div">
// //                                     <span>{ele?.designno}</span>
// //                                   </div>
// //                                 </div>
// //                               </SwiperSlide>
// //                             ))}
// //                           </Swiper>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </>
// //                 )}
