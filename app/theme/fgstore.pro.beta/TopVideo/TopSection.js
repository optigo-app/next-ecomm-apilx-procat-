"use client";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import "./TopSection.modul.scss";

const TopSection = ({ assetBase }) => {
  const { storeinit } = useStore();
  const defaultImage = `${assetBase}/procat1.jpg`;

  const imageSrc =
    storeinit?.ProCatLogbanner || defaultImage;

  return (
    <div>
      <img
        src={imageSrc}
        className="proCatTopBannerImg"
        alt="Top Banner"
        loading="eager"
        onError={(e) => {
          e.currentTarget.src = defaultImage;
        }}
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
