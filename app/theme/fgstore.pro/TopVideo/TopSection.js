"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import "./TopSection.modul.scss";

const BANNER_CACHE_KEY = "procat_top_banner";

const TopSection = ({ assetBase, initialBanner }) => {
  const { storeinit } = useStore();
  const defaultImage = `${assetBase}/procat1.jpg`;

  const getInitialImage = () => {
    if (initialBanner) return initialBanner;
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(BANNER_CACHE_KEY);
      if (cached) return cached;
    }
    if (storeinit?.ProCatLogbanner) return storeinit.ProCatLogbanner;
    return defaultImage;
  };

  const [imageSrc, setImageSrc] = useState(getInitialImage);

  useEffect(() => {
    const banner = initialBanner || storeinit?.ProCatLogbanner;
    if (banner) {
      setImageSrc(banner);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(BANNER_CACHE_KEY, banner);
      }
    } else if (storeinit && Object.keys(storeinit).length > 0) {
      setImageSrc(defaultImage);
    }
  }, [storeinit, initialBanner, defaultImage]);

  const handleImageError = () => {
    if (imageSrc !== defaultImage) {
      setImageSrc(defaultImage);
    }
  };

  return (
    <div>
      {imageSrc && (
        <img
          src={imageSrc}
          className="proCatTopBannerImg"
          alt="Top Banner"
          onError={handleImageError}
          loading="eager"
          fetchPriority="high"
        />
      )}
    </div>
  );
};

export default TopSection;
