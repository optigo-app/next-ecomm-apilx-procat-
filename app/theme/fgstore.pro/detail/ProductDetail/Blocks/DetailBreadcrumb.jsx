"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Skeleton, useTheme, useMediaQuery, IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRightRounded";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { usePathname } from "next/navigation";
import { ParseAndDecodeSearchParams } from "@/app/(core)/utils/GlobalFunctions/Parser";
import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

const breadcrumbLinkStyle = {
  fontSize: "13px",
  fontWeight: 500,
  color: "#555",
  cursor: "pointer",
  textDecoration: "none",
  transition: "color 0.2s ease",
  "&:hover": {
    color: "#0a1f47",
    textDecoration: "underline",
  },
};

const breadcrumbActiveStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#0a1f47",
};

const DetailBreadcrumb = ({
  searchParams,
  singleProd,
  singleProd1,
  loadingdata = false,
  handlePrev,
  handleNext,
  currentIndex = 0,
  totalDesigns = 0,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNextRouterLikeRR();
  const pathname = usePathname();
  const [windowSearch, setWindowSearch] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSearch(window.location.search);
    }
  }, [pathname]);

  const product = singleProd1 && Object.keys(singleProd1).length > 0 ? singleProd1 : singleProd;
  const designNo = product?.designno || "";
  const titleLine = product?.TitleLine || "";
  const productLabel = designNo || (formatTitleLine(titleLine) ? titleLine : " ");

  // Parse menu decode parameters if present in searchParams / window.location.search
  const decodedMenuData = useMemo(() => {
    try {
      const decodedArray = ParseAndDecodeSearchParams(searchParams) || [];
      const menuEntry = decodedArray.find((item) => item.startsWith("M="));
      if (!menuEntry) return null;

      const navVal = menuEntry.split("=")[1];
      if (!navVal) return null;

      const rawDecoded = atob(navVal.replace(/ /g, "+"));
      if (!rawDecoded || !rawDecoded.includes("/")) return null;

      const parts = rawDecoded.split("/");
      const valArr = parts[0]?.split(",") || [];
      const keyArr = parts[1]?.split(",") || [];

      // Extract menu name from current pathname or first key/val
      let menuname = "product";
      if (pathname && pathname.startsWith("/p/")) {
        menuname = decodeURIComponent(pathname.split("/")[2] || "product");
      }

      return {
        menuname,
        valArr,
        keyArr,
        rawDecoded,
      };
    } catch (err) {
      return null;
    }
  }, [searchParams, pathname]);

  // Handle navigate back to filter list
  const handleBreadcrumbClick = (filterIndex, menuname) => {
    if (!decodedMenuData) return;
    const { keyArr, valArr } = decodedMenuData;

    let KeyObj = {};
    let ValObj = {};

    for (let i = 0; i <= filterIndex; i++) {
      if (keyArr[i] && valArr[i]) {
        let keyName = `FilterKey${i === 0 ? "" : i}`;
        let valName = `FilterVal${i === 0 ? "" : i}`;
        KeyObj[keyName] = keyArr[i];
        ValObj[valName] = valArr[i];
      }
    }

    let queryParameters1 = "";
    Object.keys(KeyObj).forEach((key, index) => {
      if (index === 0) {
        queryParameters1 += `${KeyObj[key]}=${ValObj[`FilterVal${index === 0 ? "" : index}`]}`;
      } else {
        queryParameters1 += `/${KeyObj[key]}=${ValObj[`FilterVal${index === 0 ? "" : index}`]}`;
      }
    });

    let queryParameters = "";
    Object.keys(KeyObj).forEach((key, index) => {
      if (index === 0) {
        queryParameters += `${KeyObj[key]}=${ValObj[`FilterVal${index === 0 ? "" : index}`]}`;
      } else {
        queryParameters += `,${KeyObj[key]}=${ValObj[`FilterVal${index === 0 ? "" : index}`]}`;
      }
    });

    let otherparamUrl = "";
    Object.keys(ValObj).forEach((key, index) => {
      if (index === 0) {
        otherparamUrl += `${ValObj[key]}`;
      } else {
        otherparamUrl += `,${ValObj[key]}`;
      }
    });

    let menuEncoded = `${queryParameters}/${otherparamUrl}`;
    const targetMenu = menuname || decodedMenuData.menuname || "product";
    const url = `/p/${targetMenu}/${queryParameters1}/?M=${btoa(menuEncoded)}`;

    navigate.push(url);
  };

  if (loadingdata) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Skeleton variant="text" width={50} height={20} />
          <ChevronRightIcon sx={{ fontSize: 16, color: "#ccc" }} />
          <Skeleton variant="text" width={80} height={20} />
          <ChevronRightIcon sx={{ fontSize: 16, color: "#ccc" }} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        mt: 1,
        mb: 2,
        gap: 1.5,
      }}
    >
      {/* Left: Breadcrumbs */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.5,
          minWidth: 0,
        }}
      >
        {/* Home Link */}
        <Typography
          component="span"
          sx={breadcrumbLinkStyle}
          onClick={() => navigate.push("/")}
        >
          Home
        </Typography>

        <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />

        {/* Active Product Name / SKU */}
        <Typography
          component="span"
          sx={{
            ...breadcrumbActiveStyle,
            maxWidth: isMobile ? 160 : 380,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={productLabel}
        >
          {productLabel}
        </Typography>
      </Box>

      {/* Right: Premium Navigation Bar with Box Shadow */}
      {totalDesigns > 1 && (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            bgcolor: "#FFFFFF",
            borderRadius: "28px",
            p: "4px 6px",
            border: "1px solid #E8E8EC",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            flexShrink: 0,
            "&:hover": {
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
              borderColor: "#D0D0D5",
            },
          }}
        >
          <IconButton
            onClick={handlePrev}
            size="small"
            aria-label="Previous Design"
            sx={{
              width: 28,
              height: 28,
              bgcolor: "#F4F4F6",
              color: "#222222",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#000000",
                color: "#FFFFFF",
                transform: "scale(1.05)",
              },
            }}
          >
            <NavigateBeforeIcon sx={{ fontSize: 18 }} />
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
            {String(currentIndex + 1).padStart(2, "0")} / {String(totalDesigns).padStart(2, "0")}
          </Typography>

          <IconButton
            onClick={handleNext}
            size="small"
            aria-label="Next Design"
            sx={{
              width: 28,
              height: 28,
              bgcolor: "#F4F4F6",
              color: "#222222",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#000000",
                color: "#FFFFFF",
                transform: "scale(1.05)",
              },
            }}
          >
            <NavigateNextIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default DetailBreadcrumb;




    // {decodedMenuData ? (
    //     <>
    //       {decodedMenuData.menuname && (
    //         <>
    //           <Typography
    //             component="span"
    //             sx={breadcrumbLinkStyle}
    //             onClick={() => handleBreadcrumbClick(0, decodedMenuData.menuname)}
    //           >
    //             {decodedMenuData.menuname}
    //           </Typography>
    //           <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
    //         </>
    //       )}

    //       {decodedMenuData.valArr?.map((val, idx) => {
    //         if (!val || idx === 0) return null;
    //         return (
    //           <React.Fragment key={idx}>
    //             <Typography
    //               component="span"
    //               sx={breadcrumbLinkStyle}
    //               onClick={() => handleBreadcrumbClick(idx, decodedMenuData.menuname)}
    //             >
    //               {val}
    //             </Typography>
    //             <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
    //           </React.Fragment>
    //         );
    //       })}
    //     </>
    //   ) : (
    //     /* Special Search / Type filter or Fallback Category */
    //     <>
    //       {firstChar === "N" && (
    //         <>
    //           <Typography
    //             component="span"
    //             sx={breadcrumbLinkStyle}
    //             onClick={() => navigate.push("/p/NewArrival/?N=1")}
    //           >
    //             New Arrival
    //           </Typography>
    //           <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
    //         </>
    //       )}

    //       {firstChar === "T" && (
    //         <>
    //           <Typography
    //             component="span"
    //             sx={breadcrumbLinkStyle}
    //             onClick={() => navigate.push("/p/Trending/?T=1")}
    //           >
    //             Trending
    //           </Typography>
    //           <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
    //         </>
    //       )}

    //       {firstChar === "B" && (
    //         <>
    //           <Typography
    //             component="span"
    //             sx={breadcrumbLinkStyle}
    //             onClick={() => navigate.push("/p/BestSeller/?B=1")}
    //           >
    //             Best Seller
    //           </Typography>
    //           <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
    //         </>
    //       )}

    //       {categoryFallback && !["N", "T", "B"].includes(firstChar) && (
    //         <>
    //           <Typography
    //             component="span"
    //             sx={breadcrumbLinkStyle}
    //             onClick={() => navigate.push(`/p/${encodeURIComponent(categoryFallback)}/`)}
    //           >
    //             {categoryFallback}
    //           </Typography>
    //           <ChevronRightIcon sx={{ fontSize: 16, color: "#999", mx: 0.2 }} />
    //         </>
    //       )}
    //     </>
    //   )}