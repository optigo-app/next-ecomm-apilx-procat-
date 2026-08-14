"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Album.modul.scss";
import { Get_Procatalog } from "@/app/(core)/utils/API/Home/Get_Procatalog/Get_Procatalog";
import Cookies from "js-cookie";
import {
  Box,
  CardMedia,
  Modal,
  Skeleton,
  Grid,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import AlbumSkeleton from "./AlbumSkeleton/AlbumSkeleton";
import CloseIcon from "@mui/icons-material/Close";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import { useSearchParams } from "next/navigation";
import {
  normalizeALC,
  buildAlbumCacheKey,
  getPricingContext,
  processAlbumImages,
} from "./CacheBuilder";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { readCache, writeCache } from "@/app/(core)/cache_utility/cacheActions";

const Album = () => {
  const { islogin, loginUserDetail, storeinit } = useStore();
  const { comboReady } = useMaster();
  const [albumData, setAlbumData] = useState([]);
  const [fallbackImages, setFallbackImages] = useState({});
  const [designSubData, setDesignSubData] = useState([]);
  const [openAlbumName, setOpenAlbumName] = useState("");
  const [imagesReady, setImagesReady] = useState(false);
  const imageNotFound = "/Assets/image-not-found.jpg";
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const ALCVAL = searchParams.get("ALC") || "";

  const navigation = useNextRouterLikeRR();

  const navigate = (link) => {
    navigation.push(link);
  };

  const [securityKey, setSecurityKey] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);
  const MAX_RETRIES = 2;
  const RETRY_BASE_DELAY = 1500;

  useEffect(() => {
    setMounted(true);
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

  const pricingContext = useMemo(
    () => getPricingContext(loginUserDetail, storeinit, islogin),
    [loginUserDetail, storeinit, islogin],
  );

  const fetchAndSetAlbumData = useCallback(
    async (value, finalID, precomputedKey) => {
      if (!pricingContext || isFetchingRef.current) {
        console.log(
          "██████ ALBUM FETCH BLOCKED ██████ pricingContext:",
          !!pricingContext,
          "isFetchingRef:",
          isFetchingRef.current,
        );
        return;
      }

      const apiALC = value;
      const keyALC = normalizeALC(value);
      console.log(
        "██████ ALBUM FETCH START ██████ ALC:",
        JSON.stringify(apiALC),
        "finalID:",
        finalID,
      );

      const { key, meta } = buildAlbumCacheKey(
        "procatalog_album",
        storeinit,
        pricingContext,
        finalID,
        keyALC,
      );
      const effectiveKey = precomputedKey || key;
      const eventName = "procatalog_album";
      // console.log("██████ ALBUM CACHE KEY ██████", effectiveKey);
      // console.log(
      //   "██████ ALBUM PRICING ██████ PackageId:",
      //   pricingContext?.PackageId,
      //   "Laboursetid:",
      //   pricingContext?.Laboursetid,
      //   "diamond:",
      //   pricingContext?.diamondpricelistname,
      //   "colorstone:",
      //   pricingContext?.colorstonepricelistname,
      // );

      isFetchingRef.current = true;
      setIsFetching(true);

      try {
        const localCacheRes = await readCache(effectiveKey);

        if (localCacheRes?.cached && Array.isArray(localCacheRes.data) && localCacheRes.data.length > 0) {
          console.log(
            "██████ ALBUM USING SERVER ACTION CACHE ██████ Setting",
            localCacheRes.data.length,
            "albums from cache",
          );
          console.log('localCacheRes.data', localCacheRes.data)
          setAlbumData(localCacheRes.data);
          setFallbackImages(
            processAlbumImages(localCacheRes.data, storeinit),
          );
          setImagesReady(true);
          setIsFetching(false);
          isFetchingRef.current = false;
          return localCacheRes.data;
        } else {
          console.log("██████ ALBUM NO LOCAL CACHE ██████ Will fetch from API");
        }

        if (!storeinit) {
          console.log(
            "██████ ALBUM STOREINIT MISSING ██████ Retrying in 500ms",
          );
          setTimeout(() => {
            isFetchingRef.current = false;
            setIsFetching(false);
            fetchAndSetAlbumData(value, finalID, effectiveKey);
          }, 500);
          return;
        }

        console.log(
          "██████ ALBUM API CALL ██████ finalID:",
          finalID,
          "apiALC:",
          JSON.stringify(apiALC),
        );
        const response = await Get_Procatalog(
          storeinit,
          finalID,
          apiALC,
          islogin,
        );
        console.log(
          "██████ ALBUM API RESPONSE ██████ hasData:",
          !!response?.Data,
          "hasRd:",
          !!response?.Data?.rd,
          "rdLength:",
          response?.Data?.rd?.length,
        );

        if (response?.Data?.rd) {
          const albums = response.Data.rd;

          if (albums.length === 0) {
            setIsFetching(false);
            isFetchingRef.current = false;

            if (retryCountRef.current < MAX_RETRIES) {
              retryCountRef.current += 1;
              const delay =
                RETRY_BASE_DELAY * Math.pow(2, retryCountRef.current - 1);
              console.log(
                `██████ ALBUM API RETURNED EMPTY ARRAY ██████ rd is [] — scheduling retry ${retryCountRef.current}/${MAX_RETRIES} in ${delay}ms`,
              );
              lastRequestKeyRef.current = "";
              retryTimerRef.current = setTimeout(() => {
                console.log(
                  `██████ ALBUM RETRY ${retryCountRef.current}/${MAX_RETRIES} ██████ Retrying fetch...`,
                );
                fetchAndSetAlbumData(value, finalID, precomputedKey);
              }, delay);
            } else {
              console.log(
                "██████ ALBUM API RETURNED EMPTY ARRAY ██████ rd is [] — max retries reached, giving up",
              );
              lastRequestKeyRef.current = "";
              retryCountRef.current = 0;
              // Dismiss skeleton — we've exhausted retries
              setImagesReady(true);
            }
            return;
          }

          console.log(
            "██████ ALBUM API SUCCESS ██████ Setting",
            albums.length,
            "albums from API",
          );
          // Reset retry counter on success
          retryCountRef.current = 0;
          if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current);
            retryTimerRef.current = null;
          }
          setAlbumData(albums);

          const fallbacks = processAlbumImages(albums, storeinit);
          setFallbackImages(fallbacks);
          setImagesReady(true);
          setIsFetching(false);
          isFetchingRef.current = false;

          try {
            console.log(
              "██████ ALBUM CACHING DATA VIA SERVER ACTION ██████ key:",
              effectiveKey,
              "albums:",
              albums.length,
            );
            writeCache(effectiveKey, albums).catch((err) =>
              console.error("██████ ALBUM CACHE SAVE FAILED ██████", err)
            );
          } catch (cacheErr) {
            console.error("██████ ALBUM CACHE SAVE FAILED ██████", cacheErr);
          }
        } else {
          console.log(
            "██████ ALBUM API NO DATA ██████ response.Data.rd is:",
            response?.Data?.rd,
            "— full response keys:",
            response ? Object.keys(response) : "null",
          );
          setIsFetching(false);
          isFetchingRef.current = false;
          // Also retry for completely missing rd (not just empty array)
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current += 1;
            const delay =
              RETRY_BASE_DELAY * Math.pow(2, retryCountRef.current - 1);
            console.log(
              `██████ ALBUM API NO DATA — RETRY ██████ scheduling retry ${retryCountRef.current}/${MAX_RETRIES} in ${delay}ms`,
            );
            lastRequestKeyRef.current = "";
            retryTimerRef.current = setTimeout(() => {
              fetchAndSetAlbumData(value, finalID, precomputedKey);
            }, delay);
          } else {
            lastRequestKeyRef.current = "";
            retryCountRef.current = 0;
            setImagesReady(true);
          }
        }
      } catch (err) {
        console.log("██████ ALBUM FETCH ERROR ██████", err);
        console.error(err);
        setIsFetching(false);
        isFetchingRef.current = false;
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current += 1;
          const delay =
            RETRY_BASE_DELAY * Math.pow(2, retryCountRef.current - 1);
          console.log(
            `██████ ALBUM FETCH ERROR — RETRY ██████ scheduling retry ${retryCountRef.current}/${MAX_RETRIES} in ${delay}ms`,
          );
          lastRequestKeyRef.current = "";
          retryTimerRef.current = setTimeout(() => {
            fetchAndSetAlbumData(value, finalID, precomputedKey);
          }, delay);
        } else {
          lastRequestKeyRef.current = "";
          retryCountRef.current = 0;
          setImagesReady(true);
        }
      }
    },
    [pricingContext, storeinit],
  );

  useEffect(() => {
    if (!pricingContext || !storeinit || !comboReady) {
      return;
    }

    const fetchAlbumData = async () => {
      const visiterID = Cookies.get("visiterId");
      const userId = loginUserDetail?.id;
      const finalID =
        storeinit?.IsB2BWebsite === 0
          ? islogin
            ? userId || ""
            : visiterID
          : userId || "";
      const rawALC = ALCVAL ? ALCVAL : (getSession("ALCVALUE") ?? "");
      const keyALC = normalizeALC(rawALC);
      if (rawALC) {
        sessionStorage.setItem("ALCVALUE", String(rawALC));
      }
      const { key } = buildAlbumCacheKey(
        "procatalog_album",
        storeinit,
        pricingContext,
        finalID,
        keyALC,
      );
      if (isFetchingRef.current || lastRequestKeyRef.current === key) {
        return;
      }
      lastRequestKeyRef.current = key;
      await fetchAndSetAlbumData(rawALC, finalID, key);
    };

    fetchAlbumData();
  }, [
    islogin,
    pricingContext,
    storeinit,
    comboReady,
    ALCVAL,
    fetchAndSetAlbumData,
    loginUserDetail?.id,
  ]);

  const handlePreview = (data) => {
    const albumName = data?.AlbumName;
    const securityKey = data?.AlbumSecurityId;
    const url = `/p/${encodeURIComponent(data?.AlbumName)}/${securityKey && Number(securityKey) > 0 ? `K=${btoa(String(securityKey))}/` : ""}?A=${btoa(`AlbumName=${albumName}`)}`;
    const Newdata = data?.AlbumDetail ? JSON.parse(data?.AlbumDetail) : [];
    setSecurityKey(securityKey);

    const isB2B = storeinit?.IsB2BWebsite === 1;
    const isSecurityKeyProtected = securityKey && Number(securityKey) > 0;
    if (!islogin && (isB2B || isSecurityKeyProtected)) {
      const redirectUrl = `/LoginOption/?LoginRedirect=${encodeURIComponent(url)}`;
      sessionStorage.setItem("redirectURL", url);
      navigate(redirectUrl);
      return;
    }

    if (data?.IsDual === 1 && Newdata?.length > 1) {
      const finalNewData = Newdata.map((item) => {
        let imgLink = item?.Image_Name
          ? `${storeinit?.CDNDesignImageFol}${item?.Image_Name}`
          : imageNotFound;
        return { ...item, imageKey: imgLink };
      });

      setOpenAlbumName(albumName);
      handleOpen();
      setDesignSubData(finalNewData);
    } else {
      sessionStorage.setItem("redirectURL", url);
      navigate(url);
    }
  };

  const handleRequestAccess = (data) => {
    const albumName = data?.AlbumName;
    const securityKey = data?.AlbumSecurityId;
    const url = `/p/${encodeURIComponent(data?.AlbumName)}/${securityKey && Number(securityKey) > 0 ? `K=${btoa(String(securityKey))}/` : ""}?A=${btoa(`AlbumName=${albumName}`)}`;
    const redirectUrl = `/LoginOption/?LoginRedirect=${encodeURIComponent(url)}`;
    sessionStorage.setItem("redirectURL", url);
    navigate(redirectUrl);
  };

  const handleNavigate = (data) => {
    handlePreview(data);
  };

  const handleNavigateSub = (data) => {
    const albumName = data?.AlbumName || openAlbumName;
    const secKey = securityKey || data?.AlbumSecurityId;
    setSecurityKey(secKey);
    const url = `/p/${encodeURIComponent(albumName)}/${secKey && Number(secKey) > 0 ? `K=${btoa(String(secKey))}/` : ""}?A=${btoa(`AlbumName=${albumName}`)}`;

    const isB2B = storeinit?.IsB2BWebsite === 1;
    const isSecurityKeyProtected = secKey && Number(secKey) > 0;
    if (!islogin && (isB2B || isSecurityKeyProtected)) {
      const redirectUrl = `/LoginOption/?LoginRedirect=${encodeURIComponent(url)}`;
      sessionStorage.setItem("redirectURL", url);
      navigate(redirectUrl);
      return;
    }

    sessionStorage.setItem("redirectURL", url);
    navigate(url);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const ImageMaking = useCallback(
    (data) => {
      if (data.AlbumImageName && data.AlbumImageFol) {
        return `${storeinit?.AlbumImageFol}${data?.AlbumImageFol}/${data?.AlbumImageName}`;
      }
      const fullImageUrl = `${storeinit?.AlbumImageFol}${data?.AlbumImageFol}/${data?.AlbumImageName}`;
      if (fallbackImages[fullImageUrl]) {
        return fallbackImages[fullImageUrl];
      }
      if (data?.AlbumDetail) {
        const albumDetails =
          typeof data.AlbumDetail === "string"
            ? JSON.parse(data.AlbumDetail)
            : data.AlbumDetail;
        if (albumDetails?.length > 0) {
          return `${storeinit?.CDNDesignImageFol}${albumDetails?.[0]?.Image_Name}`;
        }
      }
      return imageNotFound;
    },
    [storeinit, fallbackImages],
  );

  const loadedProducts = useMemo(() => {
    return albumData.map((data, index) => ({
      id: index,
      src: ImageMaking(data),
    }));
  }, [albumData, ImageMaking]);

  useEffect(() => {
    if (albumData.length > 0) {
      if (!imagesReady) {
        setImagesReady(true);
      }
      try {
        const firstAlbum = albumData[0];
        if (firstAlbum) {
          const albumName = firstAlbum?.AlbumName;
          const securityKey = firstAlbum?.AlbumSecurityId;
          const firstUrl = `/p/${encodeURIComponent(albumName || "")}/${securityKey && Number(securityKey) > 0 ? `K=${btoa(String(securityKey))}/` : ""}?A=${btoa(`AlbumName=${albumName || ""}`)}`;
          if (typeof window !== "undefined") {
            sessionStorage.setItem("firstAlbumUrl", firstUrl);
          }
        }
      } catch (err) {
        console.error("Error setting firstAlbumUrl:", err);
      }
    }
  }, [albumData, imagesReady]);

  if (!imagesReady) {
    return <AlbumSkeleton />;
  }

  const isB2B = storeinit?.IsB2BWebsite === 1;

  return (
    <div className="proCat_alubmMainDiv">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="proCat_album_box_main">
          <div className="proCat_modalHeader">
            <p className="proCat_modalTitle">
              {openAlbumName}{" "}
              {designSubData?.length > 0 &&
                `(${designSubData.length} ${
                  designSubData.length === 1 ? "Design" : "Designs"
                })`}
            </p>
            <IconButton onClick={handleClose} className="proCat_modalCloseBtn">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="proCat_model_overFlow">
            <div className="proCat_modalMasonry">
              {designSubData?.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="proCat_modalCard"
                    onClick={() => handleNavigateSub(data)}
                  >
                    <div className="proCat_modalCardMedia">
                      <img
                        src={data?.imageKey}
                        className="proCat_modalCardImg"
                        alt={openAlbumName}
                        onError={(e) => {
                          e.target.src = imageNotFound;
                        }}
                      />
                      {islogin || data?.AlbumSecurityId === 0 ? (
                        ""
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#000000"
                          className="proCat_AlbumLockIcone_popup lock_icon"
                        >
                          <path
                            d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"
                            fill="#000000"
                          ></path>
                        </svg>
                      )}
                    </div>
                    <p className="proCat_modalCardTitle">{data?.AlbumName}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="pro_pressESCClose">Press ESC To Close</p>
        </Box>
      </Modal>

      {albumData?.length !== 0 && (
        <Box
          sx={{
            width: "100%",
            maxWidth: isB2B ? 2000 : 1300,
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            py: 3,
          }}
        >
          {isB2B ? (
            <Grid container spacing={2.5}>
              {albumData.map((data, index) => {
                const isLoading = loadedProducts[index]?.id !== index;
                const Icount = data?.TotalDesignCnt || 0;
                const Newdata = data?.AlbumDetail
                  ? JSON.parse(data?.AlbumDetail)
                  : [];

                return (
                  <Grid
                    item
                    size={{
                      xs: 12,
                      sm: 4,
                      md: 3,
                    }}

                    key={index}
                  >
                    <Box
                      sx={{
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid rgba(226, 232, 240, 0.9)",
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        boxShadow:
                          "0 8px 24px -4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      {/* Image Container */}
                      <Box
                        onClick={() => handleNavigate(data)}
                        sx={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "1 / 1",
                          backgroundColor: "#f8f9fa",
                          cursor: "pointer",
                          overflow: "hidden",
                        }}
                      >
                        {isLoading ? (
                          <Skeleton
                            animation="wave"
                            variant="rectangular"
                            width="100%"
                            height="100%"
                          />
                        ) : (
                          <img
                            src={loadedProducts[index]?.src}
                            data-src={loadedProducts[index]?.src}
                            alt={data?.AlbumName}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = imageNotFound;
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        )}

                        {/* Overlays */}
                        {data?.IsDual === 1 && Newdata?.length > 1 && (
                          <GridIcon />
                        )}
                        {islogin || data?.AlbumSecurityId === 0 ? null : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#000000"
                            className="proCat_AlbumLockIcone lock_icon"
                          >
                            <path
                              d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"
                              fill="#000000"
                            ></path>
                          </svg>
                        )}
                      </Box>
                      <Box
                        sx={{
                          px: 2,
                          py: islogin ? 2 : 3,
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 500,
                            fontSize: "1.05rem",
                            color: "#0F3D4C",
                            mb: islogin ? 0 : 0.8,
                            lineHeight: 1.3,
                            textAlign: "center",
                          }}
                        >
                          {data?.AlbumName}
                        </Typography>

                        {/* Action Buttons */}
                        {!islogin && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1.5,
                              mt: "auto",
                              pt: 1,
                            }}
                          >
                            <Box
                              sx={{
                                borderRadius: "6px",
                                border: "1.5px solid #0F3D4C",
                                color: "#0F3D4C",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                py: 0.9,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexGrow: 1,
                                width: "100%",
                                userSelect: "none",
                              }}
                            >
                              {/* {data?.IsDual === 1 && Newdata?.length > 1
                                ? `${Newdata?.length} Designs`
                                : "View Album"} */}
                                {Icount} Designs
                            </Box>
                            <Button
                              variant="contained"
                              fullWidth
                              className="btnColorProCat"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRequestAccess(data);
                              }}
                              sx={{
                                borderRadius: "6px",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                py: 0.9,
                                boxShadow: "none",
                              }}
                            >
                              ACCESS
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Grid container spacing={2.5}>
              {albumData.map((data, index) => {
                const isLoading = loadedProducts[index]?.id !== index;
                const Newdata = data?.AlbumDetail
                  ? JSON.parse(data?.AlbumDetail)
                  : [];

                return (
                  <Grid
                    item
                    size={{
                      xs: 12,
                      sm: 4,
                      md: 3,
                    }}
                    key={index}
                  >
                    <Box
                      onClick={() => handleNavigate(data)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        height: "100%",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      {/* Image Box Container */}
                      <Box
                        sx={{
                          position: "relative",
                          boxShadow:
                            " rgba(99, 99, 99, 0.2) 0px 2px 8px 0px                          ",
                          WebkitBackdropFilter: "blur(12px)",
                          width: "100%",
                          overflow: "hidden",
                          backgroundColor: "#F8FAFC",
                          aspectRatio: "1 / 1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "14px",
                        }}
                      >
                        {isLoading ? (
                          <Skeleton
                            animation="wave"
                            variant="rectangular"
                            width="100%"
                            height="100%"
                          />
                        ) : (
                          <img
                            src={loadedProducts[index]?.src}
                            data-src={loadedProducts[index]?.src}
                            alt={data?.AlbumName}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = imageNotFound;
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        )}

                        {data?.IsDual === 1 && Newdata?.length > 1 && (
                          <GridIcon />
                        )}
                        {islogin || data?.AlbumSecurityId === 0 ? null : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#000000"
                            className="proCat_AlbumLockIcone lock_icon"
                          >
                            <path
                              d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"
                              fill="#000000"
                            ></path>
                          </svg>
                        )}
                      </Box>

                      {/* Category Title */}
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.8rem", sm: "0.88rem" },
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textAlign: "center",
                          color: "#1E293B",
                          py: 2,
                          px: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {data?.AlbumName}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}
    </div>
  );
};
Album.displayName = "Album";
export default Album;

const GridIcon = () => {
  return (
    <IconButton
      sx={{
        position: "absolute",
        top: 5,
        left: 5,
        bgcolor: "#e6e6e6ed",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={22}
        viewBox="0 0 24 24"
      >
        <path
          fill="#4b4b4b"
          d="M5 11h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2m0 10h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2m8-16v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2m2 16h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2"
        ></path>
      </svg>
    </IconButton>
  );
};
