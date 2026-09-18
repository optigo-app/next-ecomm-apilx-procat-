import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Box, Typography, Card, CardActionArea, CardMedia, CardContent } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "swiper/css";
import "swiper/css/navigation";

const SWIPER_BREAKPOINTS = {
  0: { slidesPerView: 1.8, spaceBetween: 12 },
  480: { slidesPerView: 2.2, spaceBetween: 14 },
  768: { slidesPerView: 3, spaceBetween: 16 },
  1024: { slidesPerView: 4, spaceBetween: 18 },
  1280: { slidesPerView: 4.2, spaceBetween: 20 },
  1536: { slidesPerView: 4.5, spaceBetween: 20 },
};

const MoreProducts = forwardRef(({ imageData, handleMoveToDetail, singleProd, imageNotFound }, ref) => {
  const filteredImageData = (imageData || []).filter(
    (ele) => ele?.designno !== singleProd?.designno
  );

  if (!filteredImageData?.length) return null;

  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    swiper: swiperRef.current
  }));

  // 1. Condition to check if we should show the left/right arrows
  const showArrows = filteredImageData.length > 4;

  return (
    <>
      <Box sx={{ maxWidth: "1600px", mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: 3, width: "100%", boxSizing: "border-box" }}>
        {/* Section Header with Title on Left and Pill Navigation on Right */}
        <Box sx={{ mb: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#111111",
              fontSize: { xs: "18px", md: "22px" },
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            More Products
          </Typography>

          {/* Pill Navigation on Right */}
          {filteredImageData?.length > 1 && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                bgcolor: "#FFFFFF",
                borderRadius: "28px",
                p: "3px 6px",
                border: "1px solid #E8E8EC",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              <IconButton
                onClick={() => swiperRef.current?.slidePrev()}
                size="small"
                aria-label="Previous Products"
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: "#F4F4F6",
                  color: "#222222",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                  },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              </IconButton>

              <Typography
                sx={{
                  px: 1.5,
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#222222",
                  userSelect: "none",
                  letterSpacing: "0.5px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")} / {String(filteredImageData.length).padStart(2, "0")}
              </Typography>

              <IconButton
                onClick={() => swiperRef.current?.slideNext()}
                size="small"
                aria-label="Next Products"
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: "#F4F4F6",
                  color: "#222222",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                  },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          )}
        </Box>
        <Box position="relative">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            slidesPerView={5}
            spaceBetween={16}
            breakpoints={SWIPER_BREAKPOINTS}
            style={{ paddingBottom: "10px" }}
          >
            {filteredImageData.map((ele, index) => (
              <SwiperSlide key={ele?.autocode || index} style={{ height: "auto" }}>
                <Box sx={{ py: 0.5, px: 0.2, height: "100%" }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: "10px",
                      border: singleProd?.designno === ele?.designno ? "2px solid #000000" : "1px solid #EBEBEB",
                      bgcolor: "#FFFFFF",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#000000",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                        transform: "translateY(-2px)",
                        "& .more-product-img": {
                          transform: "scale(1.04)",
                        },
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => {
                        const originalIndex = imageData.findIndex((item) => item.designno === ele.designno);
                        handleMoveToDetail(ele, originalIndex !== -1 ? originalIndex : index);
                      }}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        alignItems: "stretch",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          pt: "100%",
                          bgcolor: "#F9F9F9",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component="img"
                          className="more-product-img"
                          src={ele?.imageSrc}
                          alt={ele?.TitleLine || ele?.designno}
                          loading="eager"
                          onError={(e) => {
                            e.target.src = imageNotFound;
                          }}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            p: 1.2,
                            mixBlendMode: "multiply",
                            transition: "transform 0.25s ease",
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          height: "48px",
                          minHeight: "48px",
                          maxHeight: "48px",
                          p: 1,
                          "&:last-child": { pb: 1 },
                          bgcolor: "#FFFFFF",
                          boxSizing: "border-box",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            fontSize: "12px",
                            color: "#111111",
                            letterSpacing: "0.3px",
                            textTransform: "uppercase",
                            lineHeight: 1.2,
                          }}
                        >
                          {ele?.designno}
                        </Typography>
                        {ele?.TitleLine && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: "#888888",
                              fontSize: "10px",
                              fontWeight: 500,
                              mt: 0.2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                              textAlign: "center",
                            }}
                          >
                            {ele?.TitleLine}
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
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
