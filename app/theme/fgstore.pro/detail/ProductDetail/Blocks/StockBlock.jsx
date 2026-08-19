"use client";
import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Card,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
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
  const showArrows = stockItemArr.length > 4;

  return (
    <Box sx={{ maxWidth: "1600px", mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: 3, width: "100%", boxSizing: "border-box" }}>
      {/* Section Header with Title on Left and Pill Navigation on Right */}
      <Box sx={{ mb: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "18px", md: "22px" },
              fontWeight: 700,
              color: "#111111",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Stock Items
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#888888", fontSize: "12px", mt: 0.3 }}
          >
            Available pieces ready for instant delivery
          </Typography>
        </Box>

        {/* Pill Navigation on Right */}
        {stockItemArr?.length > 1 && (
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
              aria-label="Previous Stock"
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
              {String(activeIndex + 1).padStart(2, "0")} / {String(stockItemArr.length).padStart(2, "0")}
            </Typography>

            <IconButton
              onClick={() => swiperRef.current?.slideNext()}
              size="small"
              aria-label="Next Stock"
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

      {/* Stock Swiper Carousel */}
      <Box position="relative">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          slidesPerView={5}
          spaceBetween={16}
          breakpoints={SWIPER_BREAKPOINTS}
          style={{ paddingBottom: "10px" }}
        >
          {stockItemArr.map((ele, index) => {
            const isInCart = Boolean(cartArr[ele?.StockId] ?? ele?.IsInCart === 1);
            const imgSrc = imageStates[ele?.StockId] || imageNotFound;

            const weightParts = [];
            if (ele?.NetWt != null) weightParts.push(`NW: ${ele?.NetWt}g`);
            if (storeInit?.IsGrossWeight === 1 && Number(ele?.GrossWt) !== 0) weightParts.push(`GW: ${ele?.GrossWt}g`);
            if (storeInit?.IsDiamondWeight === 1 && Number(ele?.DiaWt) !== 0) weightParts.push(`DW: ${ele?.DiaWt}ct`);
            if (storeInit?.IsStoneWeight === 1 && Number(ele?.CsWt) !== 0) weightParts.push(`CW: ${ele?.CsWt}ct`);

            return (
              <SwiperSlide key={ele?.StockId || ele?.StockBarcode || index} style={{ height: "auto" }}>
                <Box sx={{ py: 0.5, px: 0.2, height: "100%" }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: "10px",
                      border: "1px solid #EBEBEB",
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
                        "& .stock-card-img": {
                          transform: "scale(1.04)",
                        },
                      },
                    }}
                  >
                    {/* 1:1 Aspect Ratio Image Box */}
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
                          objectFit: "contain",
                          p: 1.2,
                          mixBlendMode: "multiply",
                          transition: "transform 0.25s ease",
                        }}
                      />

                      {/* Metal Badge (Top-Left) */}
                      {(ele?.metalPurity || ele?.MetalColorName) && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 6,
                            left: 6,
                            zIndex: 2,
                            bgcolor: "rgba(255, 255, 255, 0.92)",
                            border: "1px solid rgba(0,0,0,0.06)",
                            borderRadius: "4px",
                            px: 0.6,
                            py: 0.2,
                            fontSize: "9.5px",
                            fontWeight: 600,
                            color: "#333333",
                            lineHeight: 1.2,
                          }}
                        >
                          {`${ele?.metalPurity || ""}${
                            ele?.metalPurity && ele?.MetalColorName ? " · " : ""
                          }${ele?.MetalColorName || ""}`}
                        </Box>
                      )}

                      {/* Quick Add To Cart Button (Top-Right) */}
                      <Tooltip title={isInCart ? "Remove from cart" : "Add to cart"}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCartandWish?.(e, ele, "Cart");
                          }}
                          sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            zIndex: 3,
                            width: 26,
                            height: 26,
                            bgcolor: isInCart ? "#000000" : "rgba(255, 255, 255, 0.9)",
                            color: isInCart ? "#FFFFFF" : "#111111",
                            border: "1px solid rgba(0,0,0,0.08)",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: "#000000",
                              color: "#FFFFFF",
                            },
                          }}
                          size="small"
                        >
                          {isInCart ? (
                            <ShoppingBagIcon sx={{ fontSize: 13 }} />
                          ) : (
                            <ShoppingBagOutlinedIcon sx={{ fontSize: 13 }} />
                          )}
                        </IconButton>
                      </Tooltip>

                      {/* Weight Strip Overlay (Wrapped & Contained) */}
                      {weightParts.length > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 5,
                            left: 5,
                            right: 5,
                            zIndex: 2,
                            bgcolor: "rgba(255, 255, 255, 0.94)",
                            backdropFilter: "blur(4px)",
                            border: "1px solid rgba(0,0,0,0.06)",
                            borderRadius: "5px",
                            py: 0.3,
                            px: 0.6,
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "3px 6px",
                          }}
                        >
                          {weightParts.map((part, pIdx) => (
                            <Typography
                              key={pIdx}
                              sx={{
                                fontSize: "9px",
                                fontWeight: 500,
                                color: "#444444",
                                lineHeight: 1.2,
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              {part}
                              {pIdx < weightParts.length - 1 && (
                                <span style={{ color: "#D1D5DB", marginLeft: "6px" }}>|</span>
                              )}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>

                    {/* Card Footer (Exact 48px height) */}
                    <Box
                      sx={{
                        p: 1,
                        height: "48px",
                        minHeight: "48px",
                        maxHeight: "48px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        bgcolor: "#FFFFFF",
                        boxSizing: "border-box",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#111111",
                            lineHeight: 1.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {ele?.designno || "Job No."}
                        </Typography>

                        {storeInit?.IsPriceShow === 1 && (
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#111111",
                              textAlign: "right",
                              flexShrink: 0,
                              lineHeight: 1.2,
                            }}
                          >
                            <span className="elv_currencyFont">{currencyCode}</span>{" "}
                            {formatPrice(ele?.Amount)}
                          </Typography>
                        )}
                      </Box>

                      {ele?.StockBarcode && (
                        <Typography
                          sx={{
                            fontSize: "10px",
                            color: "#888888",
                            fontWeight: 500,
                            mt: 0.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Barcode: {ele?.StockBarcode}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </Box>
  );
};

export default StockBlock;
