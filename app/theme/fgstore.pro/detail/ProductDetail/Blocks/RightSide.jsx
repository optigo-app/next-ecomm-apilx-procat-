import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Select,
  MenuItem,
  Skeleton,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  TextField,
  Drawer,
  IconButton,
} from "@mui/material";

import Tooltip from "@mui/material/Tooltip";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { LableField, MenuItemSx, SelectSx } from "./CustomField";
import { formatter } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import QuantityInput from "../QuantityInput";
import CustomizerDrawer from "./Customiziation";
import ProductDetailsSection from "./ProductDetailsSection";
// import { getDeliveryInfo } from "./deliveryUtils";


const MotionButton = motion(Button);
const MotionCheckbox = motion(Checkbox);

const RightSide = ({
  TitleLine,
  DesignNo,
  collection,
  description,
  singleProd,
  singleProd1,
  stockItemArr,
  metalType,
  metalColor,
  storeInit,
  diaQcCombo,
  diaList,
  selectDiaQc,
  SizeSorting,
  handleCustomChange,
  SizeCombo,
  sizeData,
  metalTypeCombo,
  metalColorCombo,
  handleMetalWiseColorImg,
  handleMetalWiseColorImgWithFlag,
  selectCsQC,
  selectCsQc,
  csList,
  csQcCombo,
  loginData,
  loadingdata,
  isPriceloading,
  pdLoadImage,
  handleCart,
  addToCardFlag,
  handleWishList,
  wishListFlag,
  // quantity
  quantity = 1,
  handleCartQuantity,
  isQtyLoading,
  // remarks
  remarks,
  handleRemarkChange,
  isRemarkLoading,
  // Customizer drawer props
  rd1 = [],
  rd2 = [],
  defaultArticleId,
  customizationDetail,
  onCustomizerConfirm,
  rd1CartMap = {},
  // Navigation props
  handlePrev,
  handleNext,
  currentIndex = 0,
  totalDesigns = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const toggleText = () => {
    setIsExpanded((prevState) => !prevState);
  };
  const getCost = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const defaultArticle =
    rd1?.find((r) => r.ArticleId === defaultArticleId) || rd1?.[0] || null;

  // Prioritize active combination details from customizationDetail state
  const activeArticle = customizationDetail || defaultArticle;

  const isLoading = isPriceloading || pdLoadImage || loadingdata || !singleProd;
  const isPriceLoadingState =
    (isPriceloading || pdLoadImage || loadingdata || !singleProd) &&
    !activeArticle &&
    !singleProd?.UnitCostWithmarkup &&
    !singleProd?.UnitCostWithMarkUp &&
    !singleProd1?.UnitCostWithMarkUp;
  const isNetWeightLoadingState =
    isLoading &&
    !activeArticle?.NetWeight &&
    !singleProd?.NetWeight &&
    !singleProd?.Nwt &&
    !singleProd1?.NetWeight;

  // Derive default diamond quality from rd2 for the activeArticle ArticleId
  const defaultDiaStone =
    rd2?.find(
      (r) => r.ArticleId === activeArticle?.ArticleId && r.StoneTypeid === 1,
    ) || null;
  const defaultDiaQcLabel =
    activeArticle?.DiaQCLabel ||
    (defaultDiaStone
      ? `${defaultDiaStone.Quality?.toUpperCase()}-${defaultDiaStone.Color?.toUpperCase()}`
      : null);

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Per-article cart/wish status: check rd1CartMap first, then fall back to optimistic flags
  const activeArticleId = activeArticle?.ArticleId;
  const articleCartEntry = rd1CartMap[activeArticleId];

  // isAddedToCart: prefer rd1CartMap truth for active article, then optimistic addToCardFlag, then singleProd
  const isAddedToCart =
    articleCartEntry != null
      ? articleCartEntry.IsInCart === 1
      : addToCardFlag !== null
        ? addToCardFlag
        : singleProd?.IsInCart === 1;

  // wishlist checked: prefer rd1CartMap truth for active article, then optimistic wishListFlag, then singleProd
  const isInWishlist =
    articleCartEntry != null
      ? articleCartEntry.IsInWish === 1
      : wishListFlag !== null
        ? wishListFlag
        : singleProd?.IsInWish === 1;

  const CurrencyCode = loginData?.loginData ?? storeInit?.CurrencyCode;

  const priceBreakupItems = [
    {
      label: "Metal",
      cost: getCost(
        activeArticle
          ? activeArticle?.TotalMetalCost
          : singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost,
      ),
    },
    {
      label: "Diamond",
      cost: getCost(
        activeArticle
          ? activeArticle?.TotalDiamondCost
          : singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost,
      ),
    },
    {
      label: "Stone",
      cost: getCost(
        activeArticle
          ? activeArticle?.TotalColorStoneCost
          : singleProd1?.ColorStone_Cost ?? singleProd?.ColorStone_Cost,
      ),
    },
    {
      label: "MISC",
      cost: getCost(
        activeArticle
          ? activeArticle?.TotalMiscCost
          : singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost,
      ),
    },
    {
      label: "Labour",
      cost: getCost(
        activeArticle
          ? activeArticle?.TotalMakingCost
          : singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost,
      ),
    },
    {
      label: "Other",
      cost: activeArticle
        ? getCost(activeArticle?.TotalOtherCost) +
          getCost(activeArticle?.TotalSettingCost) +
          getCost(activeArticle?.TotalDiamondhandlingCost) +
          getCost(activeArticle?.TotalCSSettingCost) +
          getCost(activeArticle?.TotalDiaSettingCost)
        : getCost(singleProd1?.Other_Cost ?? singleProd?.Other_Cost) +
          getCost(singleProd1?.Size_MarkUp ?? singleProd?.Size_MarkUp) +
          getCost(
            singleProd1?.DesignMarkUpAmount ?? singleProd?.DesignMarkUpAmount,
          ) +
          getCost(
            singleProd1?.ColorStone_SettingCost ??
              singleProd?.ColorStone_SettingCost,
          ) +
          getCost(
            singleProd1?.Diamond_SettingCost ??
              singleProd?.Diamond_SettingCost,
          ) +
          getCost(
            singleProd1?.Misc_SettingCost ?? singleProd?.Misc_SettingCost,
          ),
    },
  ].filter((item) => isLoading || item.cost !== 0);

  return (
    <>
      <Grid
        item
        size={{
          xs: 12,
          md: 5,
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 150,
            height: "fit-content",
            width: "100%",
            px: {
              xs: 1,
              sm: 1.5,
              md: 1,
              lg: 2,
            },
            boxSizing: 'border-box'
          }}
        >
          {totalDesigns > 1 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#777777",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {singleProd?.CategoryName || singleProd?.collection || "Design Catalog"}
              </Typography>

              {/* Creative Split Pill Navigation Widget */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  bgcolor: "#F7F7F8",
                  borderRadius: "24px",
                  p: "3px 4px",
                  border: "1px solid #E5E5E8",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                  <IconButton
                    onClick={handlePrev}
                    size="small"
                    sx={{
                      width: 26,
                      height: 26,
                      bgcolor: "#FFFFFF",
                      color: "#111111",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "#000000",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    <NavigateBeforeIcon sx={{ fontSize: 18 }} />
                  </IconButton>

                <Typography
                  sx={{
                    px: 1.2,
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#333333",
                    userSelect: "none",
                    letterSpacing: "0.5px",
                  }}
                >
                  {String(currentIndex + 1).padStart(2, "0")} / {String(totalDesigns).padStart(2, "0")}
                </Typography>

                  <IconButton
                    onClick={handleNext}
                    size="small"
                    sx={{
                      width: 26,
                      height: 26,
                      bgcolor: "#FFFFFF",
                      color: "#111111",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "#000000",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    <NavigateNextIcon sx={{ fontSize: 18 }} />
                  </IconButton>
              </Box>
            </Box>
          )}

          {/* Title and Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 1,
              gap: 2
            }}
          >
            {isLoading || !singleProd?.designno ? (
              <>
                <Skeleton variant="rounded" width={110} height={32} />
                <Skeleton variant="rounded" width={95} height={24} sx={{ borderRadius: "12px" }} />
              </>
            ) : (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "22px", md: "26px" },
                    color: "#1a1a1a",
                    lineHeight: 1.3,
                  }}
                >
                  {singleProd?.designno}
                </Typography>
                <div className="db-design-row">
                  <span
                    className={`db-badge ${
                      singleProd?.StatusId === 1
                        ? "proCat_app_Deatil_instock"
                        : singleProd?.StatusId === 2
                        ? "proCat_app_deatil_MEMO"
                        : "proCat_app_Make_to_order"
                    }`}
                  >
                    {singleProd?.StatusId === 1
                      ? "In Stock"
                      : singleProd?.StatusId === 2
                      ? "In Memo"
                      : "Make To Order"}
                  </span>
                </div>
              </>
            )}
          </Box>

          {/* Material Description */}
          <Typography
            variant="body2"
            sx={{
              color: "#616161",
              fontSize: "13px",
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            {description?.length > 0 && (
              <>
                <div
                  className={`elv_prod_description ${isExpanded ? "show-more" : ""}`}
                >
                  <p className="description-text">{description}</p>
                  <Typography
                    className="toggle-text"
                    onClick={toggleText}
                    variant="body2"
                    sx={{
                      color: "#1976d2 !important",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontWeight: 500,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </Typography>
                </div>
              </>
            )}
          </Typography>

          {/* Price */}
          {storeInit?.IsPriceShow == 1 && (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: "28px",
                mb: 3,
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {isPriceloading ||
              isPriceLoadingState ||
              isLoading ||
              getCost(
                activeArticle?.UnitCostWithmarkup ??
                  activeArticle?.TotalUnitCost ??
                  singleProd1?.UnitCostWithMarkUp ??
                  singleProd?.UnitCostWithmarkup ??
                  singleProd?.UnitCostWithMarkUp,
              ) === 0 ? (
                <Skeleton
                  variant="rounded"
                  width={160}
                  height={34}
                  sx={{ display: "inline-block" }}
                />
              ) : (
                <>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: decodeEntities(CurrencyCode),
                    }}
                  />
                  <span>
                    {formatter(
                      activeArticle?.UnitCostWithmarkup ??
                        activeArticle?.TotalUnitCost ??
                        singleProd1?.UnitCostWithMarkUp ??
                        singleProd?.UnitCostWithmarkup ??
                        singleProd?.UnitCostWithMarkUp ??
                        0,
                    )}
                  </span>
                </>
              )}
            </Typography>
          )}

          {/* ── Quick info: static display ── */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {/* Metal Purity — always visible, updates reactively */}
              <Grid item size={{ xs: 6 }}>
                <Typography sx={{ fontSize: "14px", color: "#666" }}>
                  Metal Purity
                </Typography>
                <Typography sx={{ fontSize: "15px", fontWeight: 600, textTransform: "uppercase" }}>
                  {isLoading ? (
                    <Skeleton variant="text" width={60} />
                  ) : singleProd?.IsMrpBase === 1 ? (
                    singleProd?.MetalTypePurity || "-"
                  ) : (
                    metalType ||
                    activeArticle?.MetalType ||
                    singleProd1?.MetalTypePurity ||
                    singleProd?.MetalTypePurity ||
                    "-"
                  )}
                </Typography>
              </Grid>

              {/* Metal Color — always visible, shows name not colorcode */}
              <Grid item size={{ xs: 6 }}>
                <Typography sx={{ fontSize: "14px", color: "#666" }}>
                  Metal Color
                </Typography>
                <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                  {isLoading ? (
                    <Skeleton variant="text" width={60} />
                  ) : (
                    metalColorCombo?.find((e) => e?.colorcode === metalColor)?.metalcolorname ||
                    activeArticle?.MetalColor ||
                    singleProd1?.MetalColorName ||
                    singleProd?.MetalColorName ||
                    "-"
                  )}
                </Typography>
              </Grid>

              {/* Diamond QC */}
              {(isLoading || defaultDiaStone) && (
                <Grid item size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: "14px", color: "#666" }}>Diamond Quality</Typography>
                  <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                    {isLoading ? <Skeleton variant="text" width={80} /> : defaultDiaQcLabel || "-"}
                  </Typography>
                </Grid>
              )}

              {/* Diamond Origin */}
              {(isLoading || defaultDiaStone) && (
                <Grid item size={{ xs: 6 }}>
                  <Typography sx={{ fontSize: "14px", color: "#666" }}>Diamond Origin</Typography>
                  <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                    {isLoading ? (
                      <Skeleton variant="text" width={80} />
                    ) : defaultDiaStone?.MaterialTypeName &&
                      defaultDiaStone.MaterialTypeName.trim() !== "" ? (
                      defaultDiaStone.MaterialTypeName
                    ) : (
                      "Natural"
                    )}
                  </Typography>
                </Grid>
              )}

              {/* Net Weight — always visible */}
              <Grid item size={{ xs: 6 }}>
                <Typography sx={{ fontSize: "14px", color: "#666" }}>Net Wt</Typography>
                <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                  {isPriceloading ||
                  isLoading ||
                  !(
                    singleProd1?.NetWeight ??
                    singleProd1?.Nwt ??
                    singleProd?.NetWeight ??
                    singleProd?.Nwt
                  ) ? (
                    <Skeleton variant="text" width={50} />
                  ) : (
                    (
                      singleProd1?.NetWeight ??
                      singleProd1?.Nwt ??
                      singleProd?.NetWeight ??
                      singleProd?.Nwt
                    )?.toFixed(3) || "-"
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Box>




          {storeInit?.IsProductWebCustomization === 1 && (
            <Box sx={{ width: "100%", mt: 3, mb: 0 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsCustomizerOpen(true)}
                sx={{
                  height: 48,
                  borderRadius: "2px",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  textTransform: "none",
                  color: "#0B2F83",
                  borderColor: "#0B2F83",
                  borderWidth: "1.5px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  "&:hover": {
                    borderColor: "#082360",
                    backgroundColor: "#F0F4FC",
                    borderWidth: "1.5px",
                  },
                }}
              >
                Customize Design
              </Button>
            </Box>
          )}

          <CustomizerDrawer
            open={isCustomizerOpen}
            onClose={() => setIsCustomizerOpen(false)}
            rd1={rd1}
            rd2={rd2}
            defaultArticleId={defaultArticleId}
            onConfirm={onCustomizerConfirm}
            storeInit={storeInit}
            loginData={loginData}
            metalTypeCombo={metalTypeCombo}
            metalColorCombo={metalColorCombo}
            diaQcCombo={diaQcCombo}
            diaList={diaList}
            csQcCombo={csQcCombo}
            csList={csList}
            SizeCombo={SizeCombo}
            SizeSorting={SizeSorting}
            metalType={metalType}
            metalColor={metalColor}
            selectDiaQc={selectDiaQc}
            selectCsQc={selectCsQc || selectCsQC}
            sizeData={sizeData}
            handleCustomChange={handleCustomChange}
            handleMetalWiseColorImg={handleMetalWiseColorImg}
            singleProd={singleProd}
          />

          {/* Action Buttons & Product Info Section */}
          {loadingdata || isPriceloading ? (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
                mb: 3,
              }}
            >
              <Skeleton
                variant="rectangular"
                width="50%"
                height={50}
                sx={{
                  borderRadius: "2px",
                }}
              />
              <Skeleton
                variant="rectangular"
                width="50%"
                height={50}
                sx={{
                  borderRadius: "2px",
                }}
              />
            </Box>
          ) : (
            <Box sx={{ mt: 3, mb: 3 }}>
              {/* Remarks field — same logic as DetailBlock */}
              {storeInit?.IsRemarkOnProductDetail !== 1 && (
                <Box sx={{ mb: 2, width: "100%" }}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    variant="outlined"
                    color="secondary"
                    multiline
                    rows={2}
                    value={remarks || ""}
                    onKeyDown={(e) => e.stopPropagation()}
                    onChange={(e) => handleRemarkChange(e.target.value, e)}
                    placeholder="Add a remark to this item..."
                    inputProps={{ maxLength: 250 }}
                    error={(remarks || "").length > 250}
                    helperText={`${(remarks || "").length} / 250 characters`}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "2px",
                        paddingBottom: "40px",
                      },
                      "& .MuiFormHelperText-root": {
                        textAlign: "right",
                        color:
                          (remarks || "").length >= 250
                            ? "error.main"
                            : "text.secondary",
                      },
                    }}
                  />
                </Box>
              )}

              {/* Action Buttons Row */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                {/* ADD / REMOVE TO CART */}
                <MotionButton
                  fullWidth
                  variant="outlined"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCart(!isAddedToCart)}
                  sx={{
                    height: 48,
                    borderRadius: "2px",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    textTransform: "none",
                    backgroundColor: isAddedToCart ? "#000000" : "#ffffff",
                    color: isAddedToCart ? "#ffffff" : "#000000",
                    border: "1px solid #000000",
                    boxShadow: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: isAddedToCart ? "#222222" : "#f5f5f5",
                      borderColor: "#000000",
                    },
                  }}
                >
                  {isAddedToCart ? "Remove from cart" : "Add to cart"}
                </MotionButton>

                {/* Quantity Input */}
                <QuantityInput
                  singleProd={singleProd}
                  defaultValue={quantity}
                  onChange={handleCartQuantity}
                  disabled={isQtyLoading}
                  isLoading={isQtyLoading}
                />
              </Box>

              {/* Stock & Delivery Info Notice Box */}
              {/* {(() => {
                const deliveryInfo = getDeliveryInfo(
                  singleProd,
                  singleProd1,
                  stockItemArr
                );
                return (
                  <Box
                    sx={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "2px",
                      p: 2,
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "13px",
                        color: "#555555",
                        lineHeight: 1.65,
                      }}
                    >
                      {deliveryInfo.isInStock ? (
                        <>
                          This piece is in stock and will be delivered between{" "}
                          <strong style={{ color: "#111111", fontWeight: 700 }}>
                            {deliveryInfo.dateRangeStr}
                          </strong>
                          . Crafted in limited quantities to reduce waste and ensure
                          exceptional quality.
                        </>
                      ) : (
                        <>
                          This piece is made to order and will be delivered in 15 days (by{" "}
                          <strong style={{ color: "#111111", fontWeight: 700 }}>
                            {deliveryInfo.dateRangeStr}
                          </strong>
                          ). Crafted in limited quantities to reduce waste and ensure
                          exceptional quality.
                        </>
                      )}
                    </Typography>
                  </Box>
                );
              })()} */}

              {/* Trust Feature Badges List */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.6,
                  mb: 3.5,
                  pl: 0.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#222"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#222222",
                      fontWeight: 500,
                    }}
                  >
                    Anti Tarnish
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#222"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="21 8 21 21 3 21 3 8" />
                    <rect x="1" y="3" width="22" height="5" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                  </svg>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#222222",
                      fontWeight: 500,
                    }}
                  >
                    7 days Return / Exchange
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#222"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#222222",
                      fontWeight: 500,
                    }}
                  >
                    12 month warranty
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#222"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#222222",
                      fontWeight: 500,
                    }}
                  >
                    Hypoallergenic
                  </Typography>
                </Box>
              </Box>

              {/* Tabbed Product Details Container */}
              <Box
                sx={{
                  border: "1px solid #E5E5E5",
                  borderRadius: "2px",
                  overflow: "hidden",
                  mb: 3,
                }}
              >
                {/* Tab Header Bar */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    borderBottom: "1px solid #E5E5E5",
                    backgroundColor: "#F5F5F5",
                  }}
                >
                  <Button
                    disableRipple
                    onClick={() => setActiveTab("details")}
                    sx={{
                      py: 1.2,
                      px: 1,
                      borderRadius: 0,
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      backgroundColor:
                        activeTab === "details" ? "#000000" : "transparent",
                      color: activeTab === "details" ? "#ffffff" : "#000000",
                      "&:hover": {
                        backgroundColor:
                          activeTab === "details" ? "#000000" : "#e0e0e0",
                      },
                    }}
                  >
                    DESCRIPTION
                  </Button>
                  <Button
                    disableRipple
                    onClick={() => setActiveTab("care")}
                    sx={{
                      py: 1.2,
                      px: 1,
                      borderRadius: 0,
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      borderLeft: "1px solid #E5E5E5",
                      borderRight: "1px solid #E5E5E5",
                      backgroundColor:
                        activeTab === "care" ? "#000000" : "transparent",
                      color: activeTab === "care" ? "#ffffff" : "#000000",
                      "&:hover": {
                        backgroundColor:
                          activeTab === "care" ? "#000000" : "#e0e0e0",
                      },
                    }}
                  >
                    PRODUCT DETAILS
                  </Button>
                  <Button
                    disableRipple
                    onClick={() => setActiveTab("pricebreakup")}
                    sx={{
                      py: 1.2,
                      px: 1,
                      borderRadius: 0,
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      backgroundColor:
                        activeTab === "pricebreakup" || activeTab === "shipping"
                          ? "#000000"
                          : "transparent",
                      color:
                        activeTab === "pricebreakup" || activeTab === "shipping"
                          ? "#ffffff"
                          : "#000000",
                      "&:hover": {
                        backgroundColor:
                          activeTab === "pricebreakup" || activeTab === "shipping"
                            ? "#000000"
                            : "#e0e0e0",
                      },
                    }}
                  >
                    PRICE BREAKUP
                  </Button>
                </Box>

                {/* Tab Content Box */}
                <Box sx={{ p: 2.5, backgroundColor: "#ffffff" }}>
                  {activeTab === "details" && (
                    <Box>
                      {description ? (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#555555",
                            fontSize: "13px",
                            lineHeight: 1.6,
                          }}
                        >
                          {description}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "#aaa", fontSize: "13px", fontStyle: "italic" }}
                        >
                          No description available.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {activeTab === "care" && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 1 }}>
                      {/* Diamond Details Table */}
                      {diaList?.length > 0 && (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#111" }}>
                              Diamond Details
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Chip
                                label={`${diaList.reduce((acc, item) => acc + (item?.M || 0), 0)} Pcs`}
                                size="small"
                                sx={{ height: 22, fontSize: "11px", bgcolor: "#f0f0f0", fontWeight: 600 }}
                              />
                              <Chip
                                label={`${diaList.reduce((acc, item) => acc + (item?.N || 0), 0).toFixed(3)} ct`}
                                size="small"
                                sx={{ height: 22, fontSize: "11px", bgcolor: "#f0f0f0", fontWeight: 600 }}
                              />
                            </Box>
                          </Box>
                          <TableContainer sx={{ border: "1px solid #E5E5E5", borderRadius: 0, overflow: "hidden", bgcolor: "#FFFFFF" }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                                  <TableCell sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Shape</TableCell>
                                  <TableCell sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Clarity</TableCell>
                                  <TableCell sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Color</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Pcs</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Wt (ct)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {diaList.map((item, idx) => (
                                  <TableRow key={idx} sx={{ "&:hover": { bgcolor: "#FAF9F6" }, "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ color: "#333", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.A || "-"}</TableCell>
                                    <TableCell sx={{ color: "#333", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.B || "-"}</TableCell>
                                    <TableCell sx={{ color: "#333", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.C || "-"}</TableCell>
                                    <TableCell align="right" sx={{ color: "#111", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.M ?? "-"}</TableCell>
                                    <TableCell align="right" sx={{ color: "#111", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.N != null ? Number(item.N).toFixed(3) : "-"}</TableCell>
                                  </TableRow> 
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}

                      {/* Color Stone Details Table */}
                      {csList?.filter((e) => e?.D !== "MISC")?.length > 0 && (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#111" }}>
                              Color Stone Details
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Chip
                                label={`${csList.filter((e) => e?.D !== "MISC").reduce((acc, item) => acc + (item?.M || 0), 0)} Pcs`}
                                size="small"
                                sx={{ height: 22, fontSize: "11px", bgcolor: "#f0f0f0", fontWeight: 600 }}
                              />
                              <Chip
                                label={`${csList.filter((e) => e?.D !== "MISC").reduce((acc, item) => acc + (item?.N || 0), 0).toFixed(3)} ct`}
                                size="small"
                                sx={{ height: 22, fontSize: "11px", bgcolor: "#f0f0f0", fontWeight: 600 }}
                              />
                            </Box>
                          </Box>
                          <TableContainer sx={{ border: "1px solid #E5E5E5", borderRadius: 0, overflow: "hidden", bgcolor: "#FFFFFF" }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                                  <TableCell sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Shape</TableCell>
                                  <TableCell sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Clarity</TableCell>
                                  <TableCell sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Color</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Pcs</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Wt (ct)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {csList.filter((e) => e?.D !== "MISC").map((item, idx) => (
                                  <TableRow key={idx} sx={{ "&:hover": { bgcolor: "#FAF9F6" }, "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ color: "#333", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.A || "-"}</TableCell>
                                    <TableCell sx={{ color: "#333", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.B || "-"}</TableCell>
                                    <TableCell sx={{ color: "#333", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.C || "-"}</TableCell>
                                    <TableCell align="right" sx={{ color: "#111", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.M ?? "-"}</TableCell>
                                    <TableCell align="right" sx={{ color: "#111", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.N != null ? Number(item.N).toFixed(3) : "-"}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}

                      {/* MISC Details Table */}
                      {csList?.filter((e) => e?.D === "MISC")?.length > 0 && (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#111" }}>
                              MISC Details
                            </Typography>
                          </Box>
                          <TableContainer sx={{ border: "1px solid #E5E5E5", borderRadius: 0, overflow: "hidden", bgcolor: "#FFFFFF" }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                                  <TableCell sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Shape</TableCell>
                                  <TableCell sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Clarity</TableCell>
                                  <TableCell sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Color</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Pcs</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 700, color: "#666666", fontSize: "11px", py: 1, px: 1.5, textTransform: "uppercase" }}>Wt (ct)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {csList.filter((e) => e?.D === "MISC").map((item, idx) => (
                                  <TableRow key={idx} sx={{ "&:hover": { bgcolor: "#FAF9F6" }, "&:last-child td": { borderBottom: 0 } }}>
                                    <TableCell sx={{ color: "#333", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.A || "-"}</TableCell>
                                    <TableCell sx={{ color: "#333", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.B || "-"}</TableCell>
                                    <TableCell sx={{ color: "#333", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.C || "-"}</TableCell>
                                    <TableCell align="right" sx={{ color: "#111", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.M ?? "-"}</TableCell>
                                    <TableCell align="right" sx={{ color: "#111", fontSize: "12px", fontWeight: 600, py: 1, px: 1.5 }}>{item?.N != null ? Number(item.N).toFixed(3) : "-"}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}

                      {/* Fallback when no details exist */}
                      {!(diaList?.length > 0) && !(csList?.length > 0) && (
                        <Typography variant="body2" sx={{ color: "#aaa", fontSize: "13px", fontStyle: "italic" }}>
                          No product detail specifications available.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {(activeTab === "shipping" || activeTab === "pricebreakup") && (
                    <Box>
                      {storeInit?.IsPriceShow == 1 &&
                        storeInit?.IsPriceBreakUp == 1 &&
                        (activeArticle
                          ? activeArticle?.IsMrpBase != 1
                          : (singleProd ?? singleProd1)?.IsMrpBase != 1) &&
                        priceBreakupItems.length > 0 && (
                          <TableContainer
                            sx={{
                              border: "1px solid #E5E5E5",
                              borderRadius: 0,
                              overflow: "hidden",
                              bgcolor: "#FFFFFF",
                            }}
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                                  <TableCell
                                    sx={{
                                      fontWeight: 700,
                                      color: "#666666",
                                      fontSize: "11px",
                                      py: 1,
                                      px: 2,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Component
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      fontWeight: 700,
                                      color: "#666666",
                                      fontSize: "11px",
                                      py: 1,
                                      px: 2,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Amount
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {priceBreakupItems.map((item, index) => (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      "&:hover": { bgcolor: "#FAF9F6" },
                                      "&:last-child td": { borderBottom: 0 },
                                    }}
                                  >
                                    <TableCell
                                      sx={{
                                        color: "#333333",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        py: 1.2,
                                        px: 2,
                                      }}
                                    >
                                      {item.label}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{
                                        color: "#111111",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        py: 1.2,
                                        px: 2,
                                      }}
                                    >
                                      {isLoading ? (
                                        <Skeleton
                                          variant="rounded"
                                          width={80}
                                          height={18}
                                          sx={{ ml: "auto" }}
                                        />
                                      ) : (
                                        <>
                                          <span className="elv_currencyFont">
                                            {loginData?.CurrencyCode ??
                                              storeInit?.CurrencyCode}
                                          </span>{" "}
                                          {formatter(item.cost.toFixed(2))}
                                        </>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                    </Box>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 4,
                }}
              >
                {/* <ProductDetailsSection
                  diaList={diaList}
                  csList={csList}
                  rd1={rd1}
                  rd2={rd2}
                  defaultArticleId={defaultArticleId}
                  customizationDetail={customizationDetail}
                /> */}
              </Box>
            </Box>
          )}
        </Box>
      </Grid>
    </>
  );
};

export default RightSide;
