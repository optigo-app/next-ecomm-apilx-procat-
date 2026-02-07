"use client";
import React, { useEffect, useState } from "react";
import "./PromotionBanner2.modul.scss";
import { Get_Tren_BestS_NewAr_DesigSet_Album } from "@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album";
import Pako from "pako";
import Cookies from "js-cookie";
import { formatRedirectTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

const NewArrival = ({ storeData }) => {
  const { loginUserDetail, islogin } = useStore();
  const { push } = useNextRouterLikeRR();
  const [newArrivalData, setNewArrivalData] = useState("");
  const [imageUrl, setImageUrl] = useState();
  const navigation = push;
  const [storeInit, setStoreInit] = useState({});
  const [ring1ImageChange, setRing1ImageChange] = useState(false);
  const [ring2ImageChange, setRing2ImageChange] = useState(false);

  useEffect(() => {
    setStoreInit(storeData);
  }, [storeData]);

  useEffect(() => {
    const IsB2BWebsite = storeInit?.IsB2BWebsite;
    const visiterID = Cookies.get("visiterId");
    let finalID;
    if (IsB2BWebsite == 0) {
      finalID = islogin === false ? visiterID : loginUserDetail?.id || "0";
    } else {
      finalID = loginUserDetail?.id || "0";
    }

    setImageUrl(storeInit?.DesignImageFol);

    Get_Tren_BestS_NewAr_DesigSet_Album(storeData ,"GETNewArrival", finalID)
      .then((response) => {
        if (response?.Data?.rd) {
          setNewArrivalData(response?.Data?.rd);
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
      m: loginUserDetail?.MetalId,
      d: loginUserDetail?.cmboDiaQCid,
      c: loginUserDetail?.cmboCSQCid,
      f: {},
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
    navigation(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeURIComponent(encodeObj)}`);
  };

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handleMouseEnterRing1 = (data) => {
    if (data?.ImageCount > 1) {
      setRing1ImageChange(true);
    }
  };
  const handleMouseLeaveRing1 = () => {
    setRing1ImageChange(false);
  };

  const handleMouseEnterRing2 = (data) => {
    if (data?.ImageCount > 1) {
      setRing2ImageChange(true);
    }
  };
  const handleMouseLeaveRing2 = () => {
    setRing2ImageChange(false);
  };

  return (
    <div>
      {newArrivalData?.length != 0 && (
        <div className="smr_NewArrivalMain">
          <div className="smilingBridesMain">
            <img src={`${storImagePath()}/images/HomePage/NewArrival/banner.png`} loading="lazy" alt="New Arrival Banner" className="linkingLoveImageDesign" />
            <div className="smilingBrides">
              <p className="smilingBridesMainTitle">NEW ARRIVAL </p>
              <button className="enagementBtn" onClick={() => navigation(`/p/NewArrival/?N=${btoa("NewArrival")}`)}>
                NEW ARRIVAL COLLECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArrival;
