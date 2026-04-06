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
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import { useSearchParams } from "next/navigation";
import { GetCacheList, BookCache } from "@/app/(core)/utils/API/Cache/CacheApi";
import { normalizeALC, buildAlbumCacheKey, findMatchingCacheEntry, getPricingContext, processAlbumImages } from "./CacheBuilder";
import { getSession } from "@/app/(core)/utils/FetchSessionData";

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
  const MAX_RETRIES = 3;
  const RETRY_BASE_DELAY = 2000; // 2s, 4s, 8s exponential backoff

  useEffect(() => {
    setMounted(true);
    // Cleanup retry timer on unmount
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

  const pricingContext = useMemo(() => getPricingContext(loginUserDetail, storeinit, islogin), [loginUserDetail, storeinit, islogin]);

  const fetchAndSetAlbumData = useCallback(
    async (value, finalID, precomputedKey) => {
      if (!pricingContext || isFetchingRef.current) {
        console.log("██████ ALBUM FETCH BLOCKED ██████ pricingContext:", !!pricingContext, "isFetchingRef:", isFetchingRef.current);
        return;
      }

      const apiALC = value;
      const keyALC = normalizeALC(value);
      console.log("██████ ALBUM FETCH START ██████ ALC:", JSON.stringify(apiALC), "finalID:", finalID);

      const { key, meta } = buildAlbumCacheKey("procatalog_album", storeinit, pricingContext, finalID, keyALC);
      const effectiveKey = precomputedKey || key;
      const eventName = "procatalog_album";

      console.log("██████ ALBUM CACHE KEY ██████", effectiveKey);
      console.log("██████ ALBUM PRICING ██████ PackageId:", pricingContext?.PackageId, "Laboursetid:", pricingContext?.Laboursetid, "diamond:", pricingContext?.diamondpricelistname, "colorstone:", pricingContext?.colorstonepricelistname);

      isFetchingRef.current = true;
      setIsFetching(true);

      try {
        const [serverRes, localCacheRes] = await Promise.all([
          GetCacheList(finalID).catch((err) => {
            console.log("██████ ALBUM SERVER CACHE LIST FAILED ██████", err);
            return null;
          }),
          fetch(`/api/cache?mode=meta&key=${effectiveKey}`)
            .then((res) => res.json())
            .catch((err) => {
              console.log("██████ ALBUM LOCAL CACHE META FAILED ██████", err);
              return { cached: false };
            }),
        ]);

        const serverCacheEntries = serverRes?.Data?.rd ?? [];
        const matchingServerEntry = findMatchingCacheEntry(serverCacheEntries, pricingContext, eventName, apiALC);
        const serverCacheRebuildDate = matchingServerEntry?.CacheRebuildDate ?? null;

        const localCacheMeta = localCacheRes;
        const localCacheRebuildDate = localCacheMeta?.CacheRebuildDate ?? null;

        console.log("██████ ALBUM CACHE CHECK ██████ localCached:", localCacheMeta?.cached, "serverEntries:", serverCacheEntries?.length, "matchingEntry:", !!matchingServerEntry);
        console.log("██████ ALBUM CACHE DATES ██████ local:", localCacheRebuildDate, "server:", serverCacheRebuildDate);

        if (localCacheMeta?.cached) {
          const canValidate = Boolean(matchingServerEntry && serverCacheRebuildDate);
          const datesMatch = localCacheRebuildDate === serverCacheRebuildDate;

          console.log("██████ ALBUM CACHE VALIDATE ██████ canValidate:", canValidate, "datesMatch:", datesMatch);

          if (canValidate && datesMatch) {
            const cachedRes = await fetch(`/api/cache?key=${effectiveKey}`);
            const cached = await cachedRes.json();

            console.log("██████ ALBUM CACHE DATA ██████ cached.cached:", cached.cached, "isArray:", Array.isArray(cached.data), "length:", cached.data?.length);

            if (cached.cached && Array.isArray(cached.data) && cached.data.length > 0) {
              console.log("██████ ALBUM USING CACHE ██████ Setting", cached.data.length, "albums from cache");
              setAlbumData(cached.data);
              setFallbackImages(processAlbumImages(cached.data, storeinit));
              setImagesReady(true);
              setIsFetching(false);
              isFetchingRef.current = false;
              return cached.data;
            } else {
              console.log("██████ ALBUM CACHE EMPTY ██████ Cache exists but data is empty/invalid — DELETING cache and fetching from API");
            }
          } else {
            console.log("██████ ALBUM CACHE STALE ██████ canValidate:", canValidate, "datesMatch:", datesMatch, "— DELETING cache and fetching from API");
          }
          fetch(`/api/cache?key=${effectiveKey}`, { method: "DELETE" }).catch(() => { });
        } else {
          console.log("██████ ALBUM NO LOCAL CACHE ██████ Will fetch from API");
        }

        if (!storeinit) {
          console.log("██████ ALBUM STOREINIT MISSING ██████ Retrying in 500ms");
          setTimeout(() => {
            isFetchingRef.current = false;
            setIsFetching(false);
            fetchAndSetAlbumData(value, finalID, effectiveKey);
          }, 500);
          return;
        }

        console.log("██████ ALBUM API CALL ██████ finalID:", finalID, "apiALC:", JSON.stringify(apiALC));
        const response = await Get_Procatalog(storeinit, "GET_Procatalog", finalID, apiALC, islogin);
        console.log("██████ ALBUM API RESPONSE ██████ hasData:", !!response?.Data, "hasRd:", !!response?.Data?.rd, "rdLength:", response?.Data?.rd?.length);

        if (response?.Data?.rd) {
          const albums = response.Data.rd;

          if (albums.length === 0) {
            setIsFetching(false);
            isFetchingRef.current = false;

            if (retryCountRef.current < MAX_RETRIES) {
              retryCountRef.current += 1;
              const delay = RETRY_BASE_DELAY * Math.pow(2, retryCountRef.current - 1);
              console.log(`██████ ALBUM API RETURNED EMPTY ARRAY ██████ rd is [] — scheduling retry ${retryCountRef.current}/${MAX_RETRIES} in ${delay}ms`);
              // Reset lastRequestKeyRef so the useEffect or direct call can re-trigger
              lastRequestKeyRef.current = "";
              retryTimerRef.current = setTimeout(() => {
                console.log(`██████ ALBUM RETRY ${retryCountRef.current}/${MAX_RETRIES} ██████ Retrying fetch...`);
                fetchAndSetAlbumData(value, finalID, precomputedKey);
              }, delay);
            } else {
              console.log("██████ ALBUM API RETURNED EMPTY ARRAY ██████ rd is [] — max retries reached, giving up");
              // Reset so a future dependency change (e.g. islogin) can still trigger a fresh attempt
              lastRequestKeyRef.current = "";
              retryCountRef.current = 0;
              // Dismiss skeleton — we've exhausted retries
              setImagesReady(true);
            }
            return;
          }

          console.log("██████ ALBUM API SUCCESS ██████ Setting", albums.length, "albums from API");
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
            const bookCacheResult = await BookCache(finalID, eventName, pricingContext, apiALC);
            const newCacheRebuildDate = bookCacheResult?.CacheRebuildDate ?? null;

            const updatedMeta = { ...meta, CacheRebuildDate: newCacheRebuildDate };
            console.log("██████ ALBUM CACHING DATA ██████ key:", effectiveKey, "albums:", albums.length, "CacheRebuildDate:", newCacheRebuildDate);
            fetch("/api/cache", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key: effectiveKey, data: albums, meta: updatedMeta }),
            }).catch(console.error);
          } catch (cacheErr) {
            console.error("██████ ALBUM CACHE SAVE FAILED ██████", cacheErr);
          }
        } else {
          console.log("██████ ALBUM API NO DATA ██████ response.Data.rd is:", response?.Data?.rd, "— full response keys:", response ? Object.keys(response) : "null");
          setIsFetching(false);
          isFetchingRef.current = false;
          // Also retry for completely missing rd (not just empty array)
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current += 1;
            const delay = RETRY_BASE_DELAY * Math.pow(2, retryCountRef.current - 1);
            console.log(`██████ ALBUM API NO DATA — RETRY ██████ scheduling retry ${retryCountRef.current}/${MAX_RETRIES} in ${delay}ms`);
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
        // Retry on network/fetch errors too
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current += 1;
          const delay = RETRY_BASE_DELAY * Math.pow(2, retryCountRef.current - 1);
          console.log(`██████ ALBUM FETCH ERROR — RETRY ██████ scheduling retry ${retryCountRef.current}/${MAX_RETRIES} in ${delay}ms`);
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
    console.log("██████ ALBUM USEEFFECT ██████ pricingContext:", !!pricingContext, "storeinit:", !!storeinit, "comboReady:", comboReady, "ALCVAL:", JSON.stringify(ALCVAL), "islogin:", islogin);

    if (!pricingContext || !storeinit || !comboReady) {
      console.log("██████ ALBUM GUARDS FAILED ██████ pricingContext:", !!pricingContext, "storeinit:", !!storeinit, "comboReady:", comboReady);
      return;
    }

    const fetchAlbumData = async () => {
      const visiterID = Cookies.get("visiterId");
      const userId = loginUserDetail?.id;
      const finalID = storeinit?.IsB2BWebsite === 0 ? (islogin ? userId || "" : visiterID) : userId || "";

      console.log("██████ ALBUM IDENTITY ██████ IsB2BWebsite:", storeinit?.IsB2BWebsite, "islogin:", islogin, "visiterID:", visiterID, "userId:", userId, "finalID:", finalID);

      const rawALC = ALCVAL ? ALCVAL : (getSession("ALCVALUE") ?? "");
      const keyALC = normalizeALC(rawALC);
      if (rawALC) {
        sessionStorage.setItem("ALCVALUE", String(rawALC));
      }

      const { key } = buildAlbumCacheKey("procatalog_album", storeinit, pricingContext, finalID, keyALC);

      console.log("██████ ALBUM KEY CHECK ██████ isFetchingRef:", isFetchingRef.current, "lastKey:", lastRequestKeyRef.current, "newKey:", key, "keysMatch:", lastRequestKeyRef.current === key);

      if (isFetchingRef.current || lastRequestKeyRef.current === key) {
        console.log("██████ ALBUM FETCH SKIPPED ██████ reason:", isFetchingRef.current ? "ALREADY FETCHING" : "SAME KEY AS LAST REQUEST");
        return;
      }
      lastRequestKeyRef.current = key;

      console.log("██████ ALBUM CALLING FETCH ██████ rawALC:", JSON.stringify(rawALC), "finalID:", finalID, "key:", key);
      await fetchAndSetAlbumData(rawALC, finalID, key);
    };

    fetchAlbumData();

  }, [islogin, pricingContext, storeinit, comboReady, ALCVAL, fetchAndSetAlbumData, loginUserDetail?.id]);

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
    (data) => {
      if (data.AlbumImageName && data.AlbumImageFol) {
        return `${storeinit?.AlbumImageFol}${data?.AlbumImageFol}/${data?.AlbumImageName}`;
      }
      const fullImageUrl = `${storeinit?.AlbumImageFol}${data?.AlbumImageFol}/${data?.AlbumImageName}`;
      if (fallbackImages[fullImageUrl]) {
        return fallbackImages[fullImageUrl];
      }
      if (data?.AlbumDetail) {
        const albumDetails = typeof data.AlbumDetail === "string" ? JSON.parse(data.AlbumDetail) : data.AlbumDetail;
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
    if (albumData.length > 0 && !imagesReady) {
      setImagesReady(true);
    }
  }, [albumData]);

  if (!imagesReady) {
    console.log("██████ ALBUM RENDER SKELETON ██████ albumData.length:", albumData.length, "imagesReady:", imagesReady);
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
          {console.log("██████ ALBUM RENDERING ██████ count:", albumData.length)}
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
      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24">
        <path fill="#4b4b4b" d="M5 11h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2m0 10h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2m8-16v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2m2 16h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2"></path>
      </svg>
    </IconButton>
  );
};
