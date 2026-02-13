"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Album.modul.scss";
import { Get_Procatalog } from "@/app/(core)/utils/API/Home/Get_Procatalog/Get_Procatalog";
import Cookies from "js-cookie";
import { Box, CardMedia, Modal, Skeleton } from "@mui/material";
import AlbumSkeleton from "./AlbumSkeleton/AlbumSkeleton";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useSearchParams } from "next/navigation";
import { GetCacheList, BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";

const normalizeStr = (v) => (v === null || v === undefined ? "" : String(v).trim());

const normalizePriceListName = (v) => normalizeStr(v).toLowerCase();

const normalizeALC = (value) => {
  if (value === null || value === undefined || value === "" || value === 0 || value === "0") {
    return "";
  }
  return value;
};

const buildAlbumCacheKey = (type, storeData, pricing, id, custom) => {
  const meta = {
    type,
    PackageId: pricing?.PackageId ?? "",
    Laboursetid: pricing?.Laboursetid ?? "",
    // Laboursetid:0,
    diamondpricelistname: normalizePriceListName(pricing?.diamondpricelistname ?? ""),
    colorstonepricelistname: normalizePriceListName(pricing?.colorstonepricelistname ?? ""),
    SettingPriceUniqueNo: pricing?.SettingPriceUniqueNo ?? "",
    ACL: normalizeALC(custom),
  };

  const key = [type, normalizeStr(pricing?.PackageId), normalizeStr(pricing?.Laboursetid), normalizePriceListName(pricing?.diamondpricelistname), normalizePriceListName(pricing?.colorstonepricelistname), normalizeALC(custom)].join("_");

  return {
    key,
    meta,
  };
};

// Find matching cache entry from server response based on pricing context
const findMatchingCacheEntry = (serverEntries, pricingContext, eventName, alcValue) => {
  if (!serverEntries || !Array.isArray(serverEntries)) return null;

  const normalizedALC = normalizeALC(alcValue);
  const normalizedDiamond = normalizePriceListName(pricingContext?.diamondpricelistname);
  const normalizedColor = normalizePriceListName(pricingContext?.colorstonepricelistname);

  return serverEntries.find((entry) => {
    const entryALC = normalizeALC(entry.ALC);
    const entryDiamond = normalizePriceListName(entry.diamondpricelistname);
    const entryColor = normalizePriceListName(entry.colorstonepricelistname);
    return entry.EventName === eventName && entry.PackageId == pricingContext?.PackageId && entry.LabourSetId == pricingContext?.Laboursetid && entryDiamond === normalizedDiamond && entryColor === normalizedColor && entryALC === normalizedALC;
  });
};

const Album = ({ storeinit }) => {
  const { islogin, loginUserDetail } = useStore();
  const [albumData, setAlbumData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageStatus, setImageStatus] = useState({});
  const [imageStatusModel, setImageStatusModel] = useState({});
  const [fallbackImages, setFallbackImages] = useState({});
  const [designSubData, setDesignSubData] = useState([]);
  const [openAlbumName, setOpenAlbumName] = useState("");
  const [isLoding, setIsLoding] = useState(true);
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
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef("");

  useEffect(() => {
    setMounted(true);
    setImageUrl(storeinit?.AlbumImageFol || "");
  }, []);

  const pricingContext = useMemo(() => {
    if (!mounted) return null;
    const loginInfo = loginUserDetail;

    return {
      PackageId: loginInfo?.PackageId ?? storeinit?.PackageId ?? "",
      Laboursetid: !islogin ? storeinit?.pricemanagement_laboursetid : loginInfo?.pricemanagement_laboursetid ?? "",
      diamondpricelistname: !islogin ? storeinit?.diamondpricelistname : loginInfo?.diamondpricelistname ?? "",
      colorstonepricelistname: !islogin ? storeinit?.colorstonepricelistname : loginInfo?.colorstonepricelistname ?? "",
      SettingPriceUniqueNo: !islogin ? storeinit?.SettingPriceUniqueNo : loginInfo?.SettingPriceUniqueNo ?? "",
    };
  }, [mounted, loginUserDetail, storeinit, islogin]);

  useEffect(() => {
    if (!mounted || !pricingContext) return;

    const fetchAlbumData = async () => {
      const visiterID = Cookies.get("visiterId");
      const userId = loginUserDetail?.id;
      const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

      const rawALC = ALCVAL ? ALCVAL : sessionStorage.getItem("ALCVALUE") ?? "";
      const keyALC = normalizeALC(rawALC);
      sessionStorage.setItem("ALCVALUE", String(rawALC));

      const { key } = buildAlbumCacheKey("procatalog_album_", storeinit, pricingContext, finalID, keyALC);

      if (isFetchingRef.current) return;
      if (lastRequestKeyRef.current === key) return;
      lastRequestKeyRef.current = key;

      await fetchAndSetAlbumData(rawALC, finalID, key);
    };

    fetchAlbumData();
  }, [islogin, mounted, pricingContext, storeinit?.IsB2BWebsite]);

  const fetchAndSetAlbumData = async (value, finalID, precomputedKey) => {
    const storeInit = storeinit;
    const apiALC = value;
    const keyALC = normalizeALC(value);
    const { key, meta } = buildAlbumCacheKey("procatalog_album", storeinit, pricingContext, finalID, keyALC);
    const effectiveKey = precomputedKey || key;
    const eventName = "procatalog_album";

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsFetching(true);

    try {
      // Step 1: Get server's CacheRebuildDate entries
      let serverCacheEntries = [];
      try {
        const serverRes = await GetCacheList(finalID);
        serverCacheEntries = serverRes?.Data?.rd ?? [];
        console.log("🚀 ~ fetchAndSetAlbumData ~ serverCacheEntries:", serverCacheEntries);
        console.log("📋 Server cache entries: key 2", serverCacheEntries);
      } catch (error) {
        console.warn("⚠️ Failed to fetch server cache list:", error);
      }

      // Step 2: Find matching server entry for current request
      const matchingServerEntry = findMatchingCacheEntry(serverCacheEntries, pricingContext, eventName, apiALC);
      console.log("🚀 ~ fetchAndSetAlbumData ~ matchingServerEntry: key 2", matchingServerEntry);
      const serverCacheRebuildDate = matchingServerEntry?.CacheRebuildDate ?? null;
      console.log("🔍 Matching server entry:", matchingServerEntry);
      console.log("📅 Server CacheRebuildDate:", serverCacheRebuildDate);

      // Step 3: Get local cache with metadata
      const localCacheRes = await fetch(`/api/cache?mode=meta&key=${effectiveKey}`);
      const localCacheMeta = await localCacheRes.json();
      const localCacheRebuildDate = localCacheMeta?.CacheRebuildDate ?? null;
      console.log("💾 Local CacheRebuildDate:", localCacheRebuildDate);

      // Step 4: Check if we should use cached data
      // Only use cache when we can validate against a matching server entry and dates match.
      if (localCacheMeta?.cached) {
        const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
        const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

        if (canValidate && datesMatch) {
          console.log("✅ Using cached data - dates match");
          const cachedRes = await fetch(`/api/cache?key=${effectiveKey}`);
          const cached = await cachedRes.json();
          if (cached.cached && Array.isArray(cached.data)) {
            setAlbumData(cached.data);
            setImagesReady(true);
            return cached.data;
          }
        }

        console.log("🧹 Cache not trusted (no matching server entry or date mismatch) - clearing local cache");
        console.log("   Server:", serverCacheRebuildDate, "vs Local:", localCacheRebuildDate);
        await fetch(`/api/cache?key=${effectiveKey}`, { method: "DELETE" }).catch(console.error);
      }

      if (!storeInit) {
        if (!isFetching) {
          setIsFetching(true);
          setTimeout(() => {
            setIsFetching(false);
            isFetchingRef.current = false;
            fetchAndSetAlbumData(value, finalID, effectiveKey);
          }, 500);
        }
        return;
      }

      const response = await Get_Procatalog("GET_Procatalog", finalID, apiALC);
      if (response?.Data?.rd) {
        const albums = response.Data.rd;
        setAlbumData(albums);
        setImagesReady(true);

        // Step 6: Call BookCache and extract CacheRebuildDate from response
        const bookCacheResult = await BookCache(finalID, eventName, pricingContext, apiALC);
        const newCacheRebuildDate = bookCacheResult?.CacheRebuildDate ?? null;
        console.log("📝 BookCache result - CacheRebuildDate:", newCacheRebuildDate);

        // Step 7: Store data with CacheRebuildDate in metadata
        const updatedMeta = {
          ...meta,
          CacheRebuildDate: newCacheRebuildDate,
        };

        fetch("/api/cache", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: effectiveKey, data: albums, meta: updatedMeta }),
        }).catch(console.error);

        const status = {};
        const fallbackImages = {};
        for (const data of albums) {
          const fullImageUrl = `${storeInit?.AlbumImageFol}${data?.AlbumImageFol}/${data?.AlbumImageName}`;

          if (![storeInit?.AlbumImageFol, data?.AlbumImageFol, data?.AlbumImageName].every(Boolean) && data?.AlbumDetail) {
            const albumDetails = JSON.parse(data.AlbumDetail);
            if (albumDetails?.length > 0) {
              const fallbackImage = `${storeInit?.CDNDesignImageFol}${albumDetails?.[0]?.Image_Name}`;
              fallbackImages[fullImageUrl] = fallbackImage;
            }
          }
          status[fullImageUrl] = fullImageUrl;
        }

        setImageStatus(status);
        setFallbackImages(fallbackImages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
      isFetchingRef.current = false;
    }
  };

  const handleNavigate = (data) => {
    const albumName = data?.AlbumName;
    const securityKey = data?.AlbumSecurityId;
    const url = `/p/${encodeURIComponent(data?.AlbumName)}/${securityKey && securityKey > 0 ? `K=${btoa(String(securityKey))}/` : ""}?A=${btoa(`AlbumName=${albumName}`)}`;
    const redirectUrl = `/LoginOption/?LoginRedirect=${encodeURIComponent(url)}`;
    const Newdata = data?.AlbumDetail ? JSON.parse(data?.AlbumDetail) : [];
    setSecurityKey(securityKey);
    const state = { SecurityKey: securityKey };
    if (data?.IsDual === 1 && Newdata?.length > 1) {
      const finalNewData = Newdata.map((item) => {
        let imgLink = item?.Image_Name ? `${storeinit?.CDNDesignImageFol}${item?.Image_Name}` : imageNotFound;
        return { ...item, imageKey: imgLink };
      });

      handleOpen();
      setDesignSubData(finalNewData);
    } else {
      sessionStorage.setItem("redirectURL", url);
      navigate(islogin || (data?.AlbumSecurityId == 0 && storeinit?.IsB2BWebsite === 0) ? url : redirectUrl);
    }
  };

  const handleNavigateSub = (data) => {
    const albumName = data?.AlbumName;
    const securityKey = data?.AlbumSecurityId;
    setSecurityKey(securityKey);
    const url = `/p/${encodeURIComponent(data?.AlbumName)}/${securityKey && securityKey > 0 ? `K=${btoa(String(securityKey))}/` : ""}?A=${btoa(`AlbumName=${albumName}`)}`;
    const redirectUrl = `/LoginOption/?LoginRedirect=${encodeURIComponent(url)}`;
    sessionStorage.setItem("redirectURL", url);
    navigate(islogin || (data?.AlbumSecurityId == 0 && storeinit?.IsB2BWebsite === 0) ? url : redirectUrl);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const ImageMaking = useCallback(
    async (data) => {
      if (data.AlbumImageName && data.AlbumImageFol) {
        const imgSrc = `${storeinit?.AlbumImageFol}${data?.AlbumImageFol}/${data?.AlbumImageName}`;
        return imgSrc;
      }

      if (![storeinit?.AlbumImageFol, data?.AlbumImageFol, data?.AlbumImageName].every(Boolean) && data?.AlbumDetail) {
        const albumDetails = JSON.parse(data.AlbumDetail);
        if (albumDetails?.length > 0) {
          const fallbackImage = `${storeinit?.CDNDesignImageFol}${albumDetails?.[0]?.Image_Name}`;
          return fallbackImage;
        }
      }

      return imageNotFound;
    },
    [storeinit]
  );

  useEffect(() => {
    const loadAllImages = async () => {
      const images = [];

      for (let index = 0; index < albumData.length; index++) {
        const data = albumData[index];
        const imgSrc = await ImageMaking(data);
        images.push({ id: index, src: imgSrc });
      }

      if (images.length > 0 && loadedProducts.length !== images.length) {
        setLoadedProducts(images);
      }
    };

    if (albumData.length > 0) {
      loadAllImages();
    }
  }, [albumData, ImageMaking]);

  useEffect(() => {
    if (albumData.length > 0 && !imagesReady) {
      setImagesReady(true);
    }
  }, [albumData]);

  if (!imagesReady) {
    return <AlbumSkeleton />;
  }

  return (
    <div className="proCat_alubmMainDiv">
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box className="proCat_album_box_main">
          <div className="proCat_modalHeader">
            <p className="proCat_modalTitle">{openAlbumName}</p>
            <IconButton onClick={handleClose} className="proCat_modalCloseBtn">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="proCat_model_overFlow">
            <div className="proCat_modalMasonry">
              {designSubData?.map((data, index) => {
                return (
                  <div key={index} className="proCat_modalCard" onClick={() => handleNavigateSub(data)}>
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000" className="proCat_AlbumLockIcone_popup lock_icon">
                          <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z" fill="#000000"></path>
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
        <>
          <p className="proCat_albumTitle">ALBUMS</p>
          <div className="proCat_albumALL_div">
            {albumData.map((data, index) => {
              const isLoading = loadedProducts[index]?.id !== index;
              const Newdata = data?.AlbumDetail ? JSON.parse(data?.AlbumDetail) : [];

              return (
                <div key={index} className="smr_AlbumImageMain" onClick={() => handleNavigate(data)}>
                  <div style={{ position: "relative" }}>
                    {isLoading ? (
                      <CardMedia style={{ width: "100%" }} className="cardMainSkeleton">
                        <Skeleton animation="wave" variant="rect" width={"100%"} height="280px" style={{ backgroundColor: "#e8e8e86e" }} />
                      </CardMedia>
                    ) : (
                      <img
                        src={loadedProducts[index]?.src}
                        data-src={loadedProducts[index]?.src}
                        className="smr_AlbumImageMain_img"
                        alt={data?.AlbumName}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = imageNotFound;
                        }}
                      />
                    )}
                    {data?.IsDual === 1 && Newdata?.length > 1 && <GridIcon />}
                    {islogin || data?.AlbumSecurityId === 0 ? (
                      ""
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000" className="proCat_AlbumLockIcone lock_icon">
                        <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z" fill="#000000"></path>
                      </svg>
                    )}
                  </div>
                  <div style={{ marginTop: "3px" }}>
                    <p className="proCat_albumName">{data?.AlbumName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
Album.displayName = "Album";
export default React.memo(Album);

const GridIcon = () => {
  return (
    <IconButton
      sx={{
        position: 'absolute',
        top: 5,
        left: 5,
        bgcolor: '#e6e6e6ed'

      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24">
        <path fill="#4b4b4b" d="M5 11h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2m0 10h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2m8-16v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2m2 16h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2"></path>
      </svg>
    </IconButton>
  );
};
