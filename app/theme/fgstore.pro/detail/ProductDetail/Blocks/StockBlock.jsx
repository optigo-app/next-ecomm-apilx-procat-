"use client";
import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

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

  return (
    <Box sx={{ mt: 6, mb: 4, width: "100%" }}>
      {/* Section Title */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111111",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Stock Items
        </Typography>
        <Typography variant="body2" sx={{ color: "#777777", fontSize: "13px", mt: 0.5 }}>
          Available pieces ready for instant delivery
        </Typography>
      </Box>

      {/* Stock Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.5,
        }}
      >
        {stockItemArr.map((ele) => {
          const isInCart = Boolean(cartArr[ele?.StockId] ?? ele?.IsInCart === 1);
          const imgSrc = imageStates[ele?.StockId] || imageNotFound;

          return (
            <Box
              key={ele?.StockId || ele?.StockBarcode}
              sx={{
                position: "relative",
                borderRadius: "16px",
                border: "1.5px solid #E5E5E5",
                bgcolor: "#FFFFFF",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
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
                <Tooltip title={isInCart ? "Remove from cart" : "Add to cart"}>
                  <IconButton
                    onClick={(e) => handleCartandWish?.(e, ele, "Cart")}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: isInCart ? "#000000" : "rgba(255, 255, 255, 0.9)",
                      color: isInCart ? "#FFFFFF" : "#111111",
                      backdropFilter: "blur(4px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      "&:hover": {
                        bgcolor: isInCart ? "#222222" : "#FFFFFF",
                      },
                    }}
                    size="small"
                  >
                    {isInCart ? (
                      <ShoppingBagIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Card Details Content */}
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  gap: 1.2,
                }}
              >
                {/* Design No & Stock Barcode */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
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
                        fontSize: "11px",
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
                  <Chip
                    label={`${ele?.metalPurity || ""}${
                      ele?.metalPurity && ele?.MetalColorName ? " - " : ""
                    }${ele?.MetalColorName || ""}`}
                    size="small"
                    sx={{
                      alignSelf: "flex-start",
                      height: 22,
                      fontSize: "11px",
                      fontWeight: 600,
                      bgcolor: "#F2F4F7",
                      color: "#344054",
                      borderRadius: "6px",
                    }}
                  />
                )}

                {/* Weight Details Row */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.8,
                    fontSize: "11px",
                    color: "#555555",
                    fontWeight: 500,
                    bgcolor: "#FAF9F6",
                    p: 1,
                    borderRadius: "8px",
                  }}
                >
                  {ele?.NetWt != null && (
                    <Box>
                      <strong style={{ color: "#111" }}>NWT:</strong> {ele?.NetWt}
                    </Box>
                  )}

                  {storeInit?.IsGrossWeight === 1 &&
                    Number(ele?.GrossWt) !== 0 && (
                      <Box>
                        | <strong style={{ color: "#111" }}>GWT:</strong> {ele?.GrossWt}
                      </Box>
                    )}

                  {storeInit?.IsDiamondWeight === 1 &&
                    Number(ele?.DiaWt) !== 0 && (
                      <Box>
                        | <strong style={{ color: "#111" }}>DWT:</strong> {ele?.DiaWt}
                        {storeInit?.IsDiamondPcs === 1 ? `/${ele?.DiaPcs}` : ""}
                      </Box>
                    )}

                  {storeInit?.IsStoneWeight === 1 &&
                    Number(ele?.CsWt) !== 0 && (
                      <Box>
                        | <strong style={{ color: "#111" }}>CWT:</strong> {ele?.CsWt}
                        {storeInit?.IsStonePcs === 1 ? `/${ele?.CsPcs}` : ""}
                      </Box>
                    )}
                </Box>

                {/* Price Display */}
                {storeInit?.IsPriceShow === 1 && (
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#000000",
                      mt: "auto",
                      pt: 0.5,
                    }}
                  >
                    <span className="elv_currencyFont">{currencyCode}</span>{" "}
                    {formatPrice(ele?.Amount)}
                  </Typography>
                )}

                {/* Action Button */}
                <Button
                  fullWidth
                  variant={isInCart ? "contained" : "outlined"}
                  onClick={(e) => handleCartandWish?.(e, ele, "Cart")}
                  sx={{
                    mt: 1,
                    height: 38,
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "none",
                    bgcolor: isInCart ? "#000000" : "transparent",
                    color: isInCart ? "#FFFFFF" : "#000000",
                    borderColor: "#000000",
                    "&:hover": {
                      bgcolor: isInCart ? "#222222" : "#F5F5F5",
                      borderColor: "#000000",
                    },
                  }}
                >
                  {isInCart ? "Remove from cart" : "Add to cart"}
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default StockBlock;
