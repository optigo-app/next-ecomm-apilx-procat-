"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { Skeleton } from "@mui/material";
import "./TopSection.modul.scss";

const TopSection = ({ assetBase }) => {
  const { storeinit } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const defaultImage = `${assetBase}/procat1.jpg`;

  const imageSrc = storeinit?.ProCatLogbanner || defaultImage;

  useEffect(() => {
    setImageLoaded(false);
  }, [imageSrc]);

  return (
    <div>
      {!imageLoaded && (
        <Skeleton
          variant="rectangular"
          className="proCatTopBannerImg"
          animation="wave"
        />
      )}
      <img
        src={imageSrc}
        className="proCatTopBannerImg"
        alt="Top Banner"
        loading="eager"
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          if (e.currentTarget.src !== defaultImage) {
            e.currentTarget.src = defaultImage;
          }
          setImageLoaded(true);
        }}
        style={{ display: imageLoaded ? "block" : "none" }}
      />
    </div>
  );
};

export default TopSection;


// "use client";
// import { useState, useEffect } from "react";
// import { useStore } from "@/app/(core)/contexts/StoreProvider";
// import "./TopSection.modul.scss";

// const TopSection = ({ assetBase }) => {
//   const { storeinit } = useStore();
//   const defaultImage = `${assetBase}/procat1.jpg`;
//   const [imageSrc, setImageSrc] = useState(defaultImage);

//   useEffect(() => {
//     if (storeinit?.ProCatLogbanner) {
//       setImageSrc(storeinit.ProCatLogbanner);
//     } else {
//       setImageSrc(defaultImage);
//     }
//   }, [storeinit?.ProCatLogbanner, defaultImage]);

//   const handleImageError = () => {
//     if (imageSrc !== defaultImage) {
//       setImageSrc(defaultImage);
//     }
//   };

//   return (
//     <div>
//       <img
//         src={imageSrc}
//         className="proCatTopBannerImg"
//         alt="Top Banner"
//         onError={handleImageError}
//         loading="eager"
//       />
//     </div>
//   );
// };

// export default TopSection;
