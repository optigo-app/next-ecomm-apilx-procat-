"use client";
import React, { useEffect, useState } from "react";
import "./DesignSet1.scss";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Pako from "pako";
import Cookies from "js-cookie";
import { Link } from "@mui/material";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

const DesignSet = ({ data, storeInit }) => {
  const location = useNextRouterLikeRR();
  const { islogin, loginUserDetail } = useStore();
  const navigate = location.push;
  const [imageUrl, setImageUrl] = useState();
  const [designSetList, setDesignSetList] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const imageNotFound = `./Assets/image-not-found.jpg`;

  useEffect(() => {
    const visiterID = Cookies.get("visiterId");
    let finalID;
    if (storeInit?.IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalID = loginUserDetail?.id || "0";
    }

    setImageUrl(storeInit?.DesignSetImageFol);

    Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETDesignSet", finalID)
      .then((response) => {
        if (response?.Data?.rd) {
          setDesignSetList(response?.Data?.rd);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const ProdCardImageFunc = (pd) => {
    let finalprodListimg;
    if (pd?.DefaultImageName) {
      finalprodListimg = imageUrl + pd?.designsetuniqueno + "/" + pd?.DefaultImageName;
    } else {
      finalprodListimg = imageNotFound;
    }
    return finalprodListimg;
  };

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);
      const compressed = Pako.deflate(uint8Array, { to: "string" });
      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const handleNavigation = (designNo, autoCode, titleLine) => {
    let obj = {
      a: autoCode,
      b: designNo,
      m: loginUserDetail?.MetalId ?? storeInit?.MetalId,
      d: loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: {},
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    navigate(`/d/${titleLine?.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeURIComponent(encodeObj)}`);
  };

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const onSwiperInit = (swiper) => {
    setSwiper(swiper);
  };

  const [showAll, setShowAll] = useState(false);

  const handleViewAll = () => {
    setShowAll(true);
  };

  const itemsToShow = showAll ? designSetList.slice(1) : designSetList.slice(1, 4);

  const handleNavigate = () => {
    navigate("/Lookbook");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="smr_DesignSetTitleDiv">
        <p className="smr_desognSetTitle">
          Complete Your Look
          <Link href="/Lookbook" className="smr_designSetViewmoreBtn" onClick={handleNavigate}>
            View more
          </Link>
        </p>
      </div>
      <div className="collection-container">
        {itemsToShow?.map((slide, index) => (
          <div className="collection-card" key={index}>
            <img className="image" loading="lazy"  src={ProdCardImageFunc(slide)} alt={`Slide ${index}`} onClick={() => handleNavigation(slide?.designno, slide?.autocode, slide?.TitleLine ? slide?.TitleLine : "")} />
            <div className="collection-info">
              <h3>{slide?.designsetno}</h3>
              {/* <button onClick={handleNavigate}>View More</button> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DesignSet;
