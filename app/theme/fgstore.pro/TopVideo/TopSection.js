"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import "./TopSection.modul.scss";

const TopSection = ({ assetBase }) => {
  const { storeinit } = useStore();
  const defaultImage = `${assetBase}/procat1.jpg`;

  // Check if storeinit is completely absent or empty
  const isStoreInitMissing = !storeinit || Object.keys(storeinit).length === 0;

  // Determine initial image:
  // - If banner exists, use it
  // - If storeinit is missing/failed, use default fallback
  // - If storeinit is present but no banner, use no image
  const getInitialImage = () => {
    if (storeinit?.ProCatLogbanner) return storeinit.ProCatLogbanner;
    if (isStoreInitMissing) return defaultImage;
    return "";
  };

  const [imageSrc, setImageSrc] = useState(getInitialImage());

  useEffect(() => {
    setImageSrc(getInitialImage());
  }, [storeinit, defaultImage]);

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
        />
      )}
    </div>
  );
};

export default TopSection;
