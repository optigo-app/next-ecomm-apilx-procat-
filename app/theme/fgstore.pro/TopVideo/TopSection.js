"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import "./TopSection.modul.scss";

const TopSection = ({ assetBase }) => {
  const { storeinit } = useStore();
  const defaultImage = `${assetBase}/procat1.jpg`;
  const isStoreInitMissing = !storeinit || Object.keys(storeinit).length === 0;
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
