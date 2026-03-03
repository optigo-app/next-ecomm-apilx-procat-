import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "swiper/css";
import "swiper/css/navigation";

const SimilarDesigns = ({
  storeInit,
  SimilarBrandArr,
  handleMoveToDetail,
  imageNotFound,
  loginInfo,
  formatter,
}) => {
  if (
    storeInit?.IsProductDetailSimilarDesign !== 1 ||
    !SimilarBrandArr?.length ||
    SimilarBrandArr?.[0]?.stat_code === 1005
  ) {
    return null;
  }
  
  const swiperRef = useRef(null);

  // Check if we should show navigation based on item count
  const showNavigation = SimilarBrandArr.length > 5;
  
  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 6 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 4,
          textAlign: "center",
          color: "#7d7f85",
          fontSize: "30px",
          fontWeight: 400
        }}
      >
        Similar Designs
      </Typography>

      <Box position="relative">
        {/* Only show Left Arrow if more than 5 items */}
        {showNavigation && (
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
              "&:hover": { background: "#f5f5f5" }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)} // Connects the ref
          spaceBetween={10}
          centerInsufficientSlides={true} // Correctly centers items when < 5
          keyboard={{ enabled: true }}
          modules={[Keyboard]}
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
          {SimilarBrandArr.map((ele, index) => {
            const imageUrl =
              ele?.ImageCount > 0
                ? `${storeInit?.CDNDesignImageFol}${ele?.designno}~1.${ele?.ImageExtension}`
                : imageNotFound;

            return (
              <SwiperSlide
                key={index}
                style={{ height: "auto" }}
              >
                <Box sx={{ py: 1 }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      transition: "0.3s ease",
                      border: '1px solid #e6e6e6',
                      bgcolor: '#bebebe3b'
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleMoveToDetail(ele, index)}
                    >
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={ele?.designno}
                        onError={(e) => {
                          e.target.src = imageNotFound;
                        }}
                        sx={{
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                        }}
                      />

                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500 }}
                        >
                          {ele?.designno}
                        </Typography>

                        {storeInit?.IsPriceShow === 1 && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {loginInfo?.CurrencyCode ??
                              storeInit?.CurrencyCode}{" "}
                            {formatter.format(ele?.UnitCostWithMarkUp)}
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Only show Right Arrow if more than 5 items */}
        {showNavigation && (
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
              "&:hover": { background: "#f5f5f5" }
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  )
};

export default SimilarDesigns;
// import React, { useRef, useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardActionArea,
//   CardMedia,
//   CardContent,
// } from "@mui/material";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Keyboard } from "swiper/modules";
// import IconButton from "@mui/material/IconButton";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// import "swiper/css";
// import "swiper/css/navigation";


// const SimilarDesigns = ({
//   storeInit,
//   SimilarBrandArr,
//   handleMoveToDetail,
//   imageNotFound,
//   loginInfo,
//   formatter,
// }) => {
//   if (
//     storeInit?.IsProductDetailSimilarDesign !== 1 ||
//     !SimilarBrandArr?.length ||
//     SimilarBrandArr?.[0]?.stat_code === 1005
//   ) {
//     return null;
//   }
  
//   const swiperRef = useRef(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const shouldCenter = SimilarBrandArr.length <= 5;
  
//   return (
//     <Box sx={{ px: { xs: 2, sm: 4 }, py: 6 }}>

//       <Typography
//         variant="h6"
//         sx={{
//           mb: 4,
//           textAlign: "center",
//           color: "#7d7f85",
//           fontSize: "30px",
//           fontWeight: 400
//         }}
//       >
//         Similar Designs
//       </Typography>

//       <Box position="relative">
//         <IconButton
//           onClick={() => swiperRef.current?.slidePrev()}
//           sx={{
//             position: "absolute",
//             left: -20,
//             top: "50%",
//             transform: "translateY(-50%)",
//             zIndex: 10,
//             background: "#fff",
//             boxShadow: 2,
//             "&:hover": { background: "#f5f5f5" }
//           }}
//         >
//           <ChevronLeftIcon />
//         </IconButton>
//         <Swiper
//           spaceBetween={10}
//           centeredSlides={shouldCenter}
//           slidesPerView="auto"
//           breakpoints={{
//             0: { slidesPerView: 1 },      // Mobile → exactly 1 card
//             480: { slidesPerView: 2 },
//             600: { slidesPerView: 2 },    // Small tablets
//             900: { slidesPerView: 3 },    // Medium screens
//             1200: { slidesPerView: 4 },   // Desktop
//             1536: { slidesPerView: 5 },   // Large desktop
//           }}
//           style={{ paddingBottom: "20px" }}
//         >
//           {SimilarBrandArr.map((ele, index) => {
//             const imageUrl =
//               ele?.ImageCount > 0
//                 ? `${storeInit?.CDNDesignImageFol}${ele?.designno}~1.${ele?.ImageExtension}`
//                 : imageNotFound;

//             return (
//               <SwiperSlide
//                 key={index}
//                 style={{ height: "auto" }}
//               >
//                 <Box sx={{ py: 1 }}>
//                   <Card
//                     elevation={0}
//                     sx={{
//                       borderRadius: 3,
//                       transition: "0.3s ease",
//                       border: '1px solid #e6e6e6',
//                       bgcolor: '#bebebe3b'
//                     }}
//                   >
//                     <CardActionArea
//                       onClick={() => handleMoveToDetail(ele, index)}
//                     >
//                       <CardMedia
//                         component="img"
//                         image={imageUrl}
//                         alt={ele?.designno}
//                         onError={(e) => {
//                           e.target.src = imageNotFound;
//                         }}
//                         sx={{
//                           aspectRatio: "1 / 1",
//                           objectFit: "cover",
//                         }}
//                       />

//                       <CardContent sx={{ textAlign: "center", py: 2 }}>
//                         <Typography
//                           variant="body2"
//                           sx={{ fontWeight: 500 }}
//                         >
//                           {ele?.designno}
//                         </Typography>

//                         {storeInit?.IsPriceShow === 1 && (
//                           <Typography
//                             variant="body2"
//                             color="text.secondary"
//                             sx={{ mt: 0.5 }}
//                           >
//                             {loginInfo?.CurrencyCode ??
//                               storeInit?.CurrencyCode}{" "}
//                             {formatter.format(ele?.UnitCostWithMarkUp)}
//                           </Typography>
//                         )}
//                       </CardContent>
//                     </CardActionArea>
//                   </Card>
//                 </Box>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//         <IconButton
//           onClick={() => swiperRef.current?.slideNext()}
//           sx={{
//             position: "absolute",
//             right: -20,
//             top: "50%",
//             transform: "translateY(-50%)",
//             zIndex: 10,
//             background: "#fff",
//             boxShadow: 2,
//             "&:hover": { background: "#f5f5f5" }
//           }}
//         >
//           <ChevronRightIcon />
//         </IconButton>
//       </Box>
//     </Box>
//   )
// };

// export default SimilarDesigns;










// //  {storeInit?.IsProductDetailSimilarDesign == 1 && SimilarBrandArr?.length > 0 && SimilarBrandArr?.[0]?.stat_code != 1005 && (
// //                   <div className="proCat_stockItem_div">
// //                     <p className="proCat_details_title"
// //                       style={{ marginBottom: "25px" }}
// //                     > Similar Designs</p>
// //                     <div className="proCat_stockitem_container">
// //                       <div className="proCat_stock_item_card">
// //                         {SimilarBrandArr?.map((ele, index) => (
// //                           <div
// //                             className="proCat_stockItemCard"
// //                             onClick={
// //                               () =>
// //                                 // setTimeout(() =>
// //                                 handleMoveToDetail(ele, index)
// //                               // , 500)
// //                             }
// //                           >
// //                             <img
// //                               className="proCat_productCard_Image"
// //                               src={ele?.ImageCount > 0 ? storeInit?.CDNDesignImageFol + ele?.designno + "~" + "1" + "." + ele?.ImageExtension : imageNotFound}
// //                               alt={""}
// //                               onError={(e) => {
// //                                 e.target.src = imageNotFound;
// //                               }}
// //                             />
// //                             <div
// //                               className="proCat_stockutem_shortinfo"
// //                               style={{
// //                                 display: "flex",
// //                                 flexDirection: "column",
// //                                 gap: "5px",
// //                                 paddingBottom: "0px",
// //                               }}
// //                             >
// //                               <span className="proCat_prod_designno" style={{ fontSize: "14px" }}>
// //                                 {ele?.designno}
// //                               </span>

// //                               {storeInit?.IsPriceShow == 1 ? (
// //                                 <div
// //                                   style={{
// //                                     display: "flex",
// //                                     justifyContent: "center",
// //                                     alignItems: "center",
// //                                     width: "100%",
// //                                     fontSize: "16px",
// //                                   }}
// //                                   className="proCat_stockItem_price_type_mt"
// //                                 >
// //                                   <spam>
// //                                     <span className="proCat_currencyFont">{loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}</span>
// //                                     &nbsp;
// //                                   </spam>
// //                                   <span>{formatter.format(ele?.UnitCostWithMarkUp)}</span>
// //                                 </div>
// //                               ) : null}
// //                             </div>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}