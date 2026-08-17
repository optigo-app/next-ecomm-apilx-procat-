"use client";
import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "swiper/css";
import "swiper/css/navigation";

const StockBlock = ({
  stockItemArr = [],
  storeInit,
  loginInfo,
  imageStates = {},
  imageNotFound,
  isPriceloading,
  formatter,
  cartArr = {},
  handleCartandWish,
}) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (
    !stockItemArr?.length ||
    stockItemArr?.[0]?.stat_code == 1005 ||
    storeInit?.IsStockWebsite !== 1
  ) {
    return null;
  }

  const formatPrice = (val) => {
    if (val == null) return "0";
    if (typeof formatter?.format === "function") {
      return formatter.format(val);
    }
    if (typeof formatter === "function") {
      return formatter(val);
    }
    return Number(val).toLocaleString();
  };

  const currencyCode = loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode ?? "INR";
  const showArrows = stockItemArr.length > 5;

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 6, width: "100%", mt: 4 }}>
      {/* Section Title */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#111111",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Stock Items
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#777777", fontSize: "13px", mt: 0.5, textAlign: "center" }}
        >
          Available pieces ready for instant delivery
        </Typography>
      </Box>

      {/* Stock Swiper Carousel */}
      <Box position="relative">
        {showArrows && (
          <IconButton
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous Stock Item"
            sx={{
              position: "absolute",
              left: { xs: -8, sm: -14, md: -22 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 40,
              height: 40,
              bgcolor: "#FFFFFF",
              color: "#111111",
              border: "1px solid #E8E8EC",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "#000000",
                color: "#FFFFFF",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                transform: "translateY(-50%) scale(1.06)",
              },
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
          {stockItemArr.map((ele, index) => {
            const isInCart = Boolean(cartArr[ele?.StockId] ?? ele?.IsInCart === 1);
            const imgSrc = imageStates[ele?.StockId] || imageNotFound;

            return (
              <SwiperSlide key={ele?.StockId || ele?.StockBarcode || index} style={{ height: "auto" }}>
                <Box sx={{ py: 1, px: 0.5, height: "100%" }}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "16px",
                      border: "1.5px solid #E5E5E5",
                      bgcolor: "#FFFFFF",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        border: "1.5px solid #000000",
                        boxShadow: "0 0 0 1px #000000, 0 8px 24px rgba(0, 0, 0, 0.08)",
                        transform: "translateY(-4px)",
                        "& .stock-card-img": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  >
                    {/* Product Image Container */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        pt: "100%", // 1:1 Aspect ratio
                        bgcolor: "#FAFAFA",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        className="stock-card-img"
                        src={imgSrc}
                        alt={ele?.designno || "Stock Item"}
                        onError={(e) => {
                          e.target.src = imageNotFound;
                        }}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                      />

                      {/* Quick Add To Cart Icon Badge */}
                      {/* <Tooltip title={isInCart ? "Remove from cart" : "Add to cart"}>
                        <IconButton
                          onClick={(e) => handleCartandWish?.(e, ele, "Cart")}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: isInCart ? "#000000" : "rgba(255, 255, 255, 0.9)",
                            color: isInCart ? "#FFFFFF" : "#111111",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            "&:hover": {
                              bgcolor: isInCart ? "#222222" : "#FFFFFF",
                            },
                          }}
                          size="small"
                        >
                          {isInCart ? (
                            <ShoppingBagIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>
                      </Tooltip> */}
                    </Box>

                    {/* Card Details Content */}
                    <Box
                      sx={{
                        p: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        gap: 0.8,
                      }}
                    >
                      {/* Design No & Stock Barcode */}
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#111111",
                            lineHeight: 1.2,
                          }}
                        >
                          {ele?.designno || "Job No."}
                        </Typography>
                        {ele?.StockBarcode && (
                          <Typography
                            sx={{
                              fontSize: "10px",
                              color: "#777777",
                              fontWeight: 500,
                              mt: 0.2,
                            }}
                          >
                            Barcode: {ele?.StockBarcode}
                          </Typography>
                        )}
                      </Box>

                      {/* Metal Purity & Color */}
                      {(ele?.metalPurity || ele?.MetalColorName) && (
                        <Box sx={{ mt: 0.2 }}>
                          <Chip
                            label={`${ele?.metalPurity || ""}${
                              ele?.metalPurity && ele?.MetalColorName ? " - " : ""
                            }${ele?.MetalColorName || ""}`}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "11px",
                              fontWeight: 600,
                              bgcolor: "#F4F4F6",
                              color: "#222222",
                              borderRadius: "6px",
                            }}
                          />
                        </Box>
                      )}

                      {/* Weight Details Row */}
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          width: "fit-content",
                          flexWrap: "wrap",
                          gap: 0.8,
                          fontSize: "11px",
                          color: "#444444",
                          fontWeight: 500,
                          bgcolor: "#F8F8FA",
                          border: "1px solid #ECECEE",
                          px: 1,
                          py: 0.4,
                          borderRadius: "6px",
                        }}
                      >
                        {ele?.NetWt != null && (
                          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.3 }}>
                            <strong style={{ color: "#111111", fontWeight: 600 }}>NWt:</strong> {ele?.NetWt}
                          </Box>
                        )}

                        {storeInit?.IsGrossWeight === 1 &&
                          Number(ele?.GrossWt) !== 0 && (
                            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.3 }}>
                              <span style={{ color: "#CCCCCC" }}>|</span>{" "}
                              <strong style={{ color: "#111111", fontWeight: 600 }}>GWt:</strong> {ele?.GrossWt}
                            </Box>
                          )}

                        {storeInit?.IsDiamondWeight === 1 &&
                          Number(ele?.DiaWt) !== 0 && (
                            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.3 }}>
                              <span style={{ color: "#CCCCCC" }}>|</span>{" "}
                              <strong style={{ color: "#111111", fontWeight: 600 }}>DWt:</strong> {ele?.DiaWt}
                              {storeInit?.IsDiamondPcs === 1 ? `/${ele?.DiaPcs}` : ""}
                            </Box>
                          )}

                        {storeInit?.IsStoneWeight === 1 &&
                          Number(ele?.CsWt) !== 0 && (
                            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.3 }}>
                              <span style={{ color: "#CCCCCC" }}>|</span>{" "}
                              <strong style={{ color: "#111111", fontWeight: 600 }}>CWt:</strong> {ele?.CsWt}
                              {storeInit?.IsStonePcs === 1 ? `/${ele?.CsPcs}` : ""}
                            </Box>
                          )}
                      </Box>

                      {/* Price Display */}
                      {storeInit?.IsPriceShow === 1 && (
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#000000",
                            mt: "auto",
                            pt: 0.3,
                          }}
                        >
                          <span className="elv_currencyFont">{currencyCode}</span>{" "}
                          {formatPrice(ele?.Amount)}
                        </Typography>
                      )}

                      {/* Action Button */}
                      <Button
                        fullWidth
                        className={
                          isInCart
                            ? "btnColorProCatProductRemoveCart"
                            : "btnColorProCatProduct"
                        }
                        onClick={(e) => handleCartandWish?.(e, ele, "Cart")}
                        sx={{
                          mt: 0.8,
                          height: 32,
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "none",
                        }}
                      >
                        {isInCart ? "Remove from cart" : "Add to cart"}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {showArrows && (
          <IconButton
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next Stock Item"
            sx={{
              position: "absolute",
              right: { xs: -8, sm: -14, md: -22 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 40,
              height: 40,
              bgcolor: "#FFFFFF",
              color: "#111111",
              border: "1px solid #E8E8EC",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "#000000",
                color: "#FFFFFF",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                transform: "translateY(-50%) scale(1.06)",
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default StockBlock;

