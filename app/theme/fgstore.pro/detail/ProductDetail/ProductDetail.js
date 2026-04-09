"use client";
import React, { memo, useEffect, useRef, useState } from "react";
import "./Productdetail.scss";
import Pako from "pako";
import { SingleProdListAPI } from "@/app/(core)/utils/API/SingleProdListAPI/SingleProdListAPI";
import { SingleFullProdPriceAPI } from "@/app/(core)/utils/API/SingleFullProdPriceAPI/SingleFullProdPriceAPI";
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import { IoIosPlayCircle } from "react-icons/io";
import { getSizeData } from "@/app/(core)/utils/API/CartAPI/GetCategorySizeAPI";
import { StockItemApi } from "@/app/(core)/utils/API/StockItemAPI/StockItemApi";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";

import { Navigation, Pagination, Scrollbar, A11y, FreeMode, Keyboard } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import Cookies from "js-cookie";
import { DesignSetListAPI } from "@/app/(core)/utils/API/DesignSetListAPI/DesignSetListAPI";
import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import { IoArrowBack } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GoChevronLeft } from "react-icons/go";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import { formatRedirectTitleLine, formatTitleLine, storImagePath } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import { SaveLastViewDesign } from "@/app/(core)/utils/API/SaveLastViewDesign/SaveLastViewDesign";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useMaster } from "@/app/(core)/contexts/MasterProvider";
import SimilarDesigns from "./Blocks/SimilarDesigns";
import MoreProducts from "./Blocks/MoreProducts";
import StockBlock from "./Blocks/StockBlock";
import ProductDetailsSection from "./Blocks/ProductDetailsSection";
import DetailBlock from "./Blocks/DetailBlock";
import { getSession } from "@/app/(core)/utils/FetchSessionData";
import { updateQuantity } from "@/app/(core)/utils/API/CartAPI/QuantityAPI";
import { handleProductRemark } from "@/app/(core)/utils/API/CartAPI/ProductRemarkAPIData";

const imageNotFound = "/image-not-found.jpg";

const ProductDetail = ({ params, searchParams, storeInit }) => {
  const { islogin, setCartCountNum, setWishCountNum, SoketData, loginUserDetail } = useStore();
  const { comboReady } = useMaster();
  let location = useNextRouterLikeRR();
  let navigate = useNextRouterLikeRR();
  const Almacarino = true;
  const [singleProd, setSingleProd] = useState({});
  const [singleProd1, setSingleProd1] = useState({});
  // const [singleProdPrice, setSingleProdPrice] = useState();
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [diaQcCombo, setDiaQcCombo] = useState([]);
  const [csQcCombo, setCsQcCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [selectMtType, setSelectMtType] = useState();
  const [selectDiaQc, setSelectDiaQc] = useState();
  const [selectCsQc, setSelectCsQc] = useState();
  const [selectMtColor, setSelectMtColor] = useState();
  const [selectMtColorName, setSelectMtColorName] = useState();
  const [pdThumbImg, setPdThumbImg] = useState([]);
  const [isImageload, setIsImageLoad] = useState(true);
  const [selectedThumbImg, setSelectedThumbImg] = useState({});
  const [decodeUrl, setDecodeUrl] = useState({});
  // const [finalprice, setFinalprice] = useState(0);
  const [addToCartFlag, setAddToCartFlag] = useState(null);
  const [wishListFlag, setWishListFlag] = useState(null);
  const [loginInfo, setLoginInfo] = useState();
  const [SizeCombo, setSizeCombo] = useState();
  const [sizeData, setSizeData] = useState();
  const [saveLastView, setSaveLastView] = useState();
  const [isPriceloading, setisPriceLoading] = useState(false);
  const [isDataFound, setIsDataFound] = useState(false);
  const [metalWiseColorImg, setMetalWiseColorImg] = useState();
  const [designSetList, setDesignSetList] = useState();
  const [thumbImgIndex, setThumbImgIndex] = useState();
  const [diaList, setDiaList] = useState([]);
  const [csList, setCsList] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [albumView, setAlbumView] = useState([]);
  const [pdVideoArr, setPdVideoArr] = useState([]);
  const [allListDataSlide, setAllListDataSlide] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [imageStates, setImageStates] = useState({});
  const [imageSrc, setImageSrc] = useState();
  const [selectedMetalColor, setSelectedMetalColor] = useState();
  const [remarks, setRemarks] = useState("");
  const [isRemarkLoading, setIsRemarkLoading] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [isQtyLoading, setIsQtyLoading] = useState(false);
  const [stockItemArr, setStockItemArr] = useState([]);
  const [SimilarBrandArr, setSimilarBrandArr] = useState([]);
  const [cartArr, setCartArr] = useState({});
  let cookie = Cookies.get("visiterId");
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  const decodeAndDecompress = (encodedString) => {
    try {
      if (!encodedString) return null;

      // Decode any URL-encoded characters first (%2B → +, %2F → /, %3D → =)
      let decoded = encodedString;
      try {
        decoded = decodeURIComponent(decoded);
      } catch (e) {
        // If decodeURIComponent fails, use the original string
      }

      const base64 = decoded.replace(/-/g, "+").replace(/_/g, "/");

      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

      const binaryString = atob(padded);

      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      const decompressed = Pako.inflate(uint8Array, { to: "string" });

      const jsonObject = JSON.parse(decompressed);

      return jsonObject;
    } catch (error) {
      console.error("Error decoding and decompressing:", error);
      return null;
    }
  };

  const parseSearchParams = () => {
    let result = [];
    try {
      // Path 1: Next.js 15 resolved searchParams object — direct key access
      if (searchParams && typeof searchParams === "object" && !searchParams.value) {
        let pValue = searchParams?.p;
        if (pValue) {
          pValue = String(pValue).replace(/ /g, "+");
          return [`p=${pValue}`];
        }
      }

      // Path 2: Legacy searchParams.value (JSON string)
      if (!searchParams?.value) return result;
      let parsed;
      try {
        parsed = JSON.parse(searchParams.value);
      } catch (jsonError) {
        console.error("❌ Invalid JSON in searchParams.value:", searchParams.value, jsonError);
        return result;
      }
      if (!parsed || typeof parsed !== "object") return result;
      result = Object.entries(parsed)
        .filter(([key, value]) => value !== undefined && value !== null && value !== "undefined" && value !== "null")
        .map(([key, rawValue]) => {
          try {
            let fixed = String(rawValue).replace(/ /g, "+");
            fixed = decodeURIComponent(fixed);
            fixed = fixed.replace(/-/g, "+").replace(/_/g, "/");
            const paddingNeeded = fixed.length % 4;
            if (paddingNeeded !== 0) {
              fixed = fixed.padEnd(fixed.length + (4 - paddingNeeded), "=");
            }
            const decoded = atob(fixed);
            const reEncoded = btoa(decoded);
            return `${key}=${reEncoded}`;
          } catch (err) {
            console.error(`❌ Error decoding key "${key}" with value "${rawValue}":`, err);
            return null;
          }
        })
        .filter(item => item !== null);
    } catch (err) {
      console.error("❌ parseSearchParams failed:", err);
    }

    return result;
  };

  const result = parseSearchParams();
  let navVal = result[0] ? result[0].substring(result[0].indexOf("=") + 1) : undefined;
  let decodeobj = decodeAndDecompress(navVal);

  const innerSwiperRef = useRef(null);

  const maxwidth1023px = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "auto",
    });
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  // let navVal = location?.search.split("?p=")[1];
  // let decodeobj = decodeAndDecompress(navVal);

  const [nextindex, setNextIndex] = useState(decodeobj?.in || 0);
  const [prevIndex, setPrevIndex] = useState();

  const descriptionRef = useRef(null); // Using useRef instead of document.querySelector
  const descriptionText = singleProd1?.description ?? singleProd?.description;

  useEffect(() => {
    setIsClamped(false);
    setIsExpanded(false);

    const checkTextOverflow = () => {
      const descriptionElement = descriptionRef.current;
      if (descriptionElement) {
        const isOverflowing = descriptionElement.scrollHeight > descriptionElement.clientHeight;
        setIsClamped(isOverflowing);
      }
    };

    checkTextOverflow();

    window.addEventListener("resize", checkTextOverflow);
    return () => {
      window.removeEventListener("resize", checkTextOverflow);
    };
  }, [descriptionText, descriptionRef]);

  useEffect(() => {
    setIsClamped(false);
    setIsExpanded(false);
  }, [params]);

  const toggleText = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    if (!pdVideoArr || !selectedMetalColor) return;

    const colorMatched = pdVideoArr.filter((url) => {
      const parts = url.split("~");
      const colorPart = parts[2]?.split(".")[0];
      return colorPart === selectedMetalColor;
    });

    if (colorMatched.length > 0) {
      setFilteredVideos(colorMatched);
    } else {
      // Fallback: videos without any color in the filename
      const noColorVideos = pdVideoArr.filter((url) => {
        const parts = url.split("~");
        return parts.length === 2; // means format is like MCJ66~1.mp4
      });
      setFilteredVideos(noColorVideos);
    }
  }, [pdVideoArr, selectedMetalColor]);

  useEffect(() => {
    const fetchData = async () => {
      let allListData = sessionStorage.getItem("deatilSliderData");

      if (!allListData) {
        const result = parseSearchParams();
        let navVal = result[0] ? result[0].substring(result[0].indexOf("=") + 1) : undefined;
        let decodeobj = decodeAndDecompress(navVal);
        let obj = { mt: decodeobj?.m, dia: decodeobj?.d, cs: decodeobj?.c };

        try {
          const res = await ProductListApi(decodeobj?.f, 1, obj, decodeobj?.pl, cookie, decodeobj?.sb, decodeobj?.di, decodeobj?.ne, decodeobj?.gr);
          console.log(res, "266 detail alldata")
          let data = sessionStorage.setItem("deatilSliderData", JSON.stringify(res?.pdList));
          if (data) {
            allListData = sessionStorage.getItem("deatilSliderData");
          }
        } catch (error) {
          console.error("Error fetching product list:", error);
        }
      }

      if (allListData) {
        try {
          allListData = JSON.parse(allListData);
          console.log(allListData, "266 detail alldata")

          if (Array.isArray(allListData) && allListData.length > 0) {
            // console.log("Valid array data:", allListData);
          } else if (typeof allListData === "object" && allListData !== null) {
            // console.log("Valid object data:", allListData);
          } else {
            console.error("Invalid data format in sessionStorage");
            return;
          }
        } catch (error) {
          console.error("Error parsing JSON data from sessionStorage:", error);
          return;
        }
      } else {
        console.error("No data found in sessionStorage for 'deatilSliderData'");
        return;
      }

      const finalProdWithPrice = allListData.map((product) => {
        const pdImgList = [];

        if (product?.ImageCount > 0) {
          for (let i = 1; i <= product?.ImageCount; i++) {
            pdImgList.push(`${storeInit?.CDNDesignImageFol}${product?.designno}~${i}.${product?.ImageExtension}`);
          }
        } else {
          pdImgList.push(imageNotFound);
        }

        let StatusId = product?.StatusId ?? 0;

        if (SoketData && SoketData?.length !== 0) {
          const filterdata = SoketData?.find((ele) => ele?.designno === product?.designno);
          StatusId = filterdata?.StatusId ?? 0;
        }

        return {
          ...product,
          images: pdImgList,
          StatusId,
        };
      });

      // Process image data asynchronously
      const fetchImageData = async () => {
        if (!Array.isArray(finalProdWithPrice) || finalProdWithPrice.length === 0) {
          console.error("finalProdWithPrice is not a valid array or is empty");
          return;
        }

        try {
          const processedData = await Promise.all(
            finalProdWithPrice.map(async (ele) => {
              // const src = `${storeInit?.CDNDesignImageFol}${ele?.designno}~1.${ele?.ImageExtension}`;
              const src = `${storeInit?.CDNDesignImageFolThumb}${ele?.designno}~1.jpg`;
              // const isImageAvailable = await checkImageAvailability(src);
              return {
                ...ele,
                imageSrc: src,
                // imageSrc: isImageAvailable ? src : imageNotFound,
              };
            }),
          );

          setAllListDataSlide(finalProdWithPrice); // State update for final product data
          setImageData(processedData); // State update for image data
        } catch (error) {
          console.error("Error processing image data:", error);
        }
      };

      fetchImageData(); // Invoke image processing after final data processing

      // Update cart status based on singleProd
      const isInCart = singleProd?.IsInCart !== 0; // Simplified check
      const qty = singleProd?.CartQuantity;
      setQuantity(qty && qty > 0 ? qty : 1);
      setAddToCartFlag(isInCart);
    };

    // Call the fetchData function within useEffect
    fetchData();
  }, [singleProd?.autocode]);

  useEffect(() => {
    // Check if the `singleProd?.designno` matches any slide's designno
    const matchingIndex = imageData.findIndex((ele) => ele?.designno === singleProd?.designno);

    // If there's a match, programmatically slide to that slide
    if (matchingIndex !== -1) {
      setNextIndex(matchingIndex);
      if (innerSwiperRef.current?.swiper) {
        innerSwiperRef.current.swiper.slideTo(matchingIndex, 0); // 0 delay for instant navigation
      }
    }
  }, [singleProd?.designno, imageData]);

  const handleCart = (cartflag) => {
    let storeinitInside = storeInit;
    let logininfoInside = loginUserDetail;

    let metal = metalTypeCombo?.filter((ele) => ele?.metaltype == selectMtType)[0];
    // ??
    // metalTypeCombo[0];
    let dia = diaQcCombo?.filter((ele) => ele?.Quality == selectDiaQc?.split(",")[0] && ele?.color == selectDiaQc?.split(",")[1]);
    // ??
    // diaQcCombo[0];
    let cs = csQcCombo?.filter((ele) => ele?.Quality == selectCsQc?.split(",")[0] && ele?.color == selectCsQc?.split(",")[1]);
    // ??
    // csQcCombo[0];

    // let mcArr = metalColorCombo?.filter(
    //   (ele) => ele?.id == (singleProd1?.MetalColorid ?? singleProd?.MetalColorid)
    // )[0];

    let mcArr = metalColorCombo?.filter((ele) => {
      if (selectMtColor) {
        return ele?.colorcode == selectMtColor;
      } else {
        return ele?.id == (singleProd1?.MetalColorid ?? singleProd?.MetalColorid);
      }
    })[0];

    let prodObj = {
      autocode: singleProd1?.autocode ?? singleProd?.autocode,
      Metalid: metal?.Metalid ? metal?.Metalid : (logininfoInside?.MetalId ?? storeinitInside?.MetalId),
      MetalColorId: mcArr?.id ?? singleProd?.MetalColorid,
      DiaQCid: dia?.length ? `${dia[0]?.QualityId},${dia[0]?.ColorId}` : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid),
      CsQCid: cs?.length ? `${cs[0]?.QualityId},${cs[0]?.ColorId}` : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid),
      Size: sizeData ?? singleProd1?.DefaultSize ?? singleProd?.DefaultSize,
      Unitcost: singleProd1?.UnitCost ?? singleProd?.UnitCost,
      markup: singleProd1?.DesignMarkUp ?? singleProd?.DesignMarkUp,
      UnitCostWithmarkup: singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp,
      Remark: remarks,
      AlbumName: decodeUrl?.n ?? "",
      Quantity: quantity,
    };

    if (cartflag) {
      CartAndWishListAPI("Cart", prodObj, cookie)
        .then((res) => {
          console.log(res, "res")
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          let cartId = res?.Data?.rd[0]?.CartId;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          if (cartId) {
            setSingleProd(prev => ({ ...prev, CartId: cartId, IsInCart: 1 }));
            setSingleProd1(prev => ({ ...prev, CartId: cartId, IsInCart: 1 }));
          }
        })
        .catch((err) => console.log("err", err))
        .finally(() => {
          // console.log("addtocart re", cartflag);
          setAddToCartFlag(cartflag);
        });
    } else {
      RemoveCartAndWishAPI("Cart", singleProd?.autocode, cookie)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
          setSingleProd(prev => ({ ...prev, IsInCart: 0, CartId: null }));
          setSingleProd1(prev => ({ ...prev, IsInCart: 0, CartId: null }));
        })
        .catch((err) => console.log("err", err))
        .finally(() => {
          // console.log("rremovve add", cartflag);
          setAddToCartFlag(cartflag);
        });
    }
  };

  const handleWishList = (e, ele) => {
    setWishListFlag(e?.target?.checked);

    let metal = metalTypeCombo?.filter((ele) => ele?.metaltype == selectMtType)[0] ?? metalTypeCombo[0];
    let dia = diaQcCombo?.filter((ele) => ele?.Quality == selectDiaQc?.split(",")[0] && ele?.color == selectDiaQc?.split(",")[1])[0] ?? diaQcCombo[0];
    let cs = csQcCombo?.filter((ele) => ele?.Quality == selectCsQc?.split(",")[0] && ele?.color == selectCsQc?.split(",")[1])[0] ?? csQcCombo[0];
    let mcArr = metalColorCombo?.filter((ele) => ele?.id == (singleProd1?.MetalColorid ?? singleProd?.MetalColorid))[0];

    let prodObj = {
      autocode: singleProd?.autocode,
      Metalid: metal?.Metalid,
      MetalColorId: mcArr?.id ?? singleProd?.MetalColorid,
      DiaQCid: `${dia?.QualityId},${dia?.ColorId}`,
      CsQCid: `${cs?.QualityId},${cs?.ColorId}`,
      Size: sizeData ?? singleProd1?.DefaultSize ?? singleProd?.DefaultSize,
      Unitcost: singleProd1?.UnitCost ?? singleProd?.UnitCost,
      markup: singleProd1?.DesignMarkUp ?? singleProd?.DesignMarkUp,
      UnitCostWithmarkup: singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp,
      Remark: "",
      AlbumName: decodeUrl?.n ?? "",
    };

    if (e?.target?.checked == true) {
      CartAndWishListAPI("Wish", prodObj, cookie)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
        })
        .catch((err) => console.log("err", err));
    } else {
      RemoveCartAndWishAPI("Wish", singleProd?.autocode, cookie)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
        })
        .catch((err) => console.log("err", err));
    }
  };

  // const [mtrd, setMtrd] = useState([]);
  // const [diard1, setDiard1] = useState([]);
  // const [csrd2, setCsrd2] = useState([]);

  // const PriceWithMarkupFunction = (pmu, pPrice, curr, swp = 0) => {
  //   if (pPrice <= 0) {
  //     return 0
  //   }
  //   else if (pmu <= 0) {
  //     return (pPrice + swp).toFixed(2)
  //   }
  //   else {
  //     let percentPMU = ((pmu / 100) / curr)
  //     return (Number(pPrice * percentPMU ?? 0) + Number(pPrice ?? 0) + (swp ?? 0)).toFixed(2)
  //   }
  // }

  useEffect(() => {
    // let navVal = location?.search.split("?p=")[1];
    // let decodeobj = decodeAndDecompress(navVal);
    const result = parseSearchParams();
    let navVal = result[0] ? result[0].substring(result[0].indexOf("=") + 1) : undefined;
    let decodeobj = decodeAndDecompress(navVal);
    let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));

    let diaQcLocal = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo"));

    let csQcLocal = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo"));

    setTimeout(() => {
      if (decodeUrl) {
        let metalArr;
        let diaArr;
        let csArr;

        let storeinitInside = storeInit;
        let logininfoInside = loginUserDetail;

        if (mtTypeLocal?.length) {
          metalArr = mtTypeLocal?.filter((ele) => ele?.Metalid == (decodeUrl?.m ? decodeUrl?.m : (logininfoInside?.MetalId ?? storeinitInside?.MetalId)))[0];
        }

        if (diaQcLocal?.length) {
          diaArr = diaQcLocal?.filter((ele) => ele?.QualityId == (decodeUrl?.d ? decodeUrl?.d?.split(",")[0] : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid).split(",")[0]) && ele?.ColorId == (decodeUrl?.d ? decodeUrl?.d?.split(",")[1] : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid).split(",")[1]))[0];
        }

        if (csQcLocal?.length) {
          csArr = csQcLocal?.filter((ele) => ele?.QualityId == (decodeUrl?.c ? decodeUrl?.c?.split(",")[0] : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid).split(",")[0]) && ele?.ColorId == (decodeUrl?.c ? decodeUrl?.c?.split(",")[1] : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid).split(",")[1]))[0];
        }

        if (metalArr) setSelectMtType(metalArr?.metaltype);
        if (diaArr) setSelectDiaQc(`${diaArr?.Quality},${diaArr?.color}`);
        if (csArr) setSelectCsQc(`${csArr?.Quality},${csArr?.color}`);

        if (decodeUrl?.s) {
          setSizeData(decodeUrl?.s);
        }
      }
    }, 500);
  }, [singleProd?.autocode]);

  useEffect(() => {
    const result = parseSearchParams();
    let navVal = result[0] ? result[0].substring(result[0].indexOf("=") + 1) : undefined;
    const mtColorLocal = getSession("MetalColorCombo");
    let decodeobj = decodeAndDecompress(navVal);
    if (!Array.isArray(mtColorLocal) || mtColorLocal.length === 0) {
      setSelectMtColor(null);
      setSelectMtColorName(null)
      return;
    }

    const metalColorId = decodeobj?.i || singleProd?.MetalColorid || singleProd1?.MetalColorid;

    const matchedColor = mtColorLocal.find(
      (ele) => String(ele?.id) === String(metalColorId)
    );
    const finalColor = matchedColor || mtColorLocal[0];

    setSelectMtColor(finalColor?.colorcode ?? null);
    setSelectMtColorName(finalColor?.colorname ?? null);
    console.log("finalColor", finalColor);
  }, [singleProd?.autocode]);


  const callAllApi = () => {
    let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
    let diaQcLocal = JSON.parse(sessionStorage.getItem("diamondQualityColorCombo"));
    let csQcLocal = JSON.parse(sessionStorage.getItem("ColorStoneQualityColorCombo"));
    let mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo"));

    if (!mtTypeLocal || mtTypeLocal?.length === 0) {
      MetalTypeComboAPI(cookie)
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            sessionStorage.setItem("metalTypeCombo", JSON.stringify(data));
            setMetalTypeCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setMetalTypeCombo(mtTypeLocal);
    }

    if (!diaQcLocal || diaQcLocal?.length === 0) {
      DiamondQualityColorComboAPI()
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            sessionStorage.setItem("diamondQualityColorCombo", JSON.stringify(data));
            setDiaQcCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setDiaQcCombo(diaQcLocal);
    }

    if (!csQcLocal || csQcLocal?.length === 0) {
      ColorStoneQualityColorComboAPI()
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            sessionStorage.setItem("ColorStoneQualityColorCombo", JSON.stringify(data));
            setCsQcCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setCsQcCombo(csQcLocal);
    }

    if (!mtColorLocal || mtColorLocal?.length === 0) {
      MetalColorCombo(cookie)
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            sessionStorage.setItem("MetalColorCombo", JSON.stringify(data));
            setMetalColorCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setMetalColorCombo(mtColorLocal);
    }
  };

  useEffect(() => {
    const logininfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    setLoginInfo(logininfo);
  }, []);


  useEffect(() => {
    callAllApi();
  }, [storeInit]);

  const generateThumbnails = (designNo, count, extension) => {
    const thumbBase = storeInit?.CDNDesignImageFolThumb || "";
    return Array.from({ length: count }, (_, i) => {
      const index = i + 1;
      const fileName = `${designNo}~${index}`;
      return {
        thumbImageUrl: `${thumbBase}${fileName}.jpg`,
        originalImageExtension: extension,
        originalImageUrl: `${storeInit?.CDNDesignImageFol}${fileName}.${extension}`,
      };
    });
  };

  useEffect(() => {
    const result = parseSearchParams();
    let navVal = result[0] ? result[0].substring(result[0].indexOf("=") + 1) : undefined;
    let decodeobj = decodeAndDecompress(navVal);

    if (decodeobj) {
      const { b, l, count } = decodeobj;
      const imageUrl = storeInit?.CDNDesignImageFol;
      const urlPath = `${imageUrl}${b}~1.${!!l ? l : "jpg"}`;

      setDecodeUrl(decodeobj);

      setSelectedThumbImg({
        link: { imageUrl: urlPath, extension: l },
        type: "img",
      });

      if (count > 0) {
        const thumbs = generateThumbnails(b, count, l);
        setPdThumbImg(thumbs);
      }
    }
    setIsImageLoaded(false);
    setImagePromise(false);
    setIsImageLoad(false);
  }, []);

  useEffect(() => {
    let url = `${location?.pathname}${location?.search}`;

    const result = parseSearchParams();
    let navVal = result[0] ? result[0].substring(result[0].indexOf("=") + 1) : undefined;

    let decodeobj = decodeAndDecompress(navVal);

    const securityKey = decodeobj?.sk || searchParams?.SK || searchParams?.SecurityKey || location?.state?.SecurityKey || "";
    const state = { SecurityKey: securityKey };

    if (state?.SecurityKey > 0) {
      if (islogin !== true) {
        navigate.push(`/LoginOption/?LoginRedirect=${url}`, { state });
      }
    }
  }, [params]);

  useEffect(() => {
    // ✅ Guard: wait for MasterProvider to finish populating sessionStorage
    // (storeInit, loginUserDetail, metalTypeCombo, etc.) before making the API call.
    // Without this, SingleProdListAPI reads undefined values and passes them as the
    // string "undefined" to the backend.
    if (!comboReady || !storeInit) {
      return;
    }

    let logininfoInside = loginUserDetail;

    let storeinitInside = storeInit;
    const result = parseSearchParams();
    let navVal = result[0] ? result[0].substring(result[0].indexOf("=") + 1) : undefined;
    let decodeobj = decodeAndDecompress(navVal);

    if (decodeobj) {
      setDecodeUrl(decodeobj);
    }

    let alName = "";

    if (decodeobj) {
      setDecodeUrl(decodeobj);
      alName = decodeobj?.n;
    }


    let mtTypeLocal = getSession("metalTypeCombo");

    let diaQcLocal = getSession("diamondQualityColorCombo");

    let csQcLocal = getSession("ColorStoneQualityColorCombo");

    let MetalColorLocal = getSession("MetalColorCombo");

    let metalArr;
    let diaArr;
    let csArr;
    let MetalColorArr;

    if (mtTypeLocal?.length) {
      metalArr = mtTypeLocal?.filter((ele) => ele?.Metalid == decodeobj?.m)[0]?.Metalid;
    }

    if (diaQcLocal) {
      diaArr = diaQcLocal?.filter((ele) => ele?.QualityId == decodeobj?.d?.split(",")[0] && ele?.ColorId == decodeobj?.d?.split(",")[1])[0];
    }

    if (csQcLocal) {
      csArr = csQcLocal?.filter((ele) => ele?.QualityId == decodeobj?.c?.split(",")[0] && ele?.ColorId == decodeobj?.c?.split(",")[1])[0];
    }


    if (MetalColorLocal) {
      MetalColorArr = MetalColorLocal?.filter((ele) => ele?.id == decodeobj?.i)[0];
    }
    // console.log(JSON.stringify(decodeobj, null, 2));

    if (decodeobj?.s) {
      setSizeData(decodeobj?.s);
    }

    const FetchProductData = async () => {
      // let obj={
      //   mt: metalArr,
      //   diaQc: `${diaArr?.QualityId},${diaArr?.ColorId}`,
      //   csQc: `${csArr?.QualityId},${csArr?.ColorId}`,
      // }

      let obj1 = {
        mt: logininfoInside?.MetalId ?? storeinitInside?.MetalId,
        diaQc: diaArr ? `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}` : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid),
        csQc: csArr ? `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}` : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid),
      };

      let obj = {
        mt: metalArr ? metalArr : (logininfoInside?.MetalId ?? storeinitInside?.MetalId),
        diaQc: diaArr ? `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}` : (logininfoInside?.cmboDiaQCid ?? storeinitInside?.cmboDiaQCid),
        csQc: csArr ? `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}` : (logininfoInside?.cmboCSQCid ?? storeinitInside?.cmboCSQCid),
        MetalColorId: MetalColorArr ? MetalColorArr?.id : ''
      };

      setProdLoading(true);

      setisPriceLoading(true);
      setQuantity(1);

      await SingleProdListAPI(decodeobj, decodeobj?.s ?? sizeData, obj, cookie, alName)
        .then(async (res) => {
          if (res) {
            setSingleProd(res?.pdList[0]);

            if (res?.pdList?.length > 0) {
              setisPriceLoading(false);
              const qty = res?.pdList[0]?.CartQuantity;
              setQuantity(qty && qty > 0 ? qty : 1);
              setRemarks(res?.pdList[0]?.Remarks ?? "");
              // setIsImageLoad(false)
              // setSelectedThumbImg({
              //   link: "",
              //   type: "img",
              // });
              setProdLoading(false);
            }

            if (!res?.pdList[0]) {
              setisPriceLoading(false);
              setProdLoading(false);
              setIsDataFound(true);
            } else {
              setIsDataFound(false);
            }

            setDiaList(res?.pdResp?.rd3);
            setCsList(res?.pdResp?.rd4);

            let prod = res?.pdList[0];

            let initialsize = prod && prod.DefaultSize !== "" ? prod?.DefaultSize : SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)?.sizename === undefined ? SizeCombo?.rd[0]?.sizename : SizeCombo?.rd?.find((size) => size.IsDefaultSize === 1)?.sizename;
            setSizeData(initialsize);

            // await SingleFullProdPriceAPI(decodeobj).then((res) => {
            //   setSingleProdPrice(res);
            //   console.log("singlePrice", res);
            // });
          }
          return res;
        })
        .then(async (resp) => {
          if (resp) {
            await getSizeData(resp?.pdList[0], cookie)
              .then((res) => {
                // console.log("Sizeres",res)
                console.log(res?.Data, "res?.Data")
                setSizeCombo(res?.Data);
              })
              .catch((err) => console.log("SizeErr", err));

            if (storeinitInside?.IsStockWebsite === 1) {
              await StockItemApi(resp?.pdList[0]?.autocode, "stockitem", cookie)
                .then((res) => {
                  setStockItemArr(res?.Data?.rd);
                })
                .catch((err) => console.log("stockItemErr", err));
            }

            if (storeinitInside?.IsProductDetailSimilarDesign === 1) {
              await StockItemApi(resp?.pdList[0]?.autocode, "similarbrand", obj, cookie)
                .then((res) => {
                  setSimilarBrandArr(res?.Data?.rd);
                })
                .catch((err) => console.log("similarbrandErr", err));
            }

            // if (storeinitInside?.IsProductDetailDesignSet === 1) {
            //   await DesignSetListAPI(obj1, resp?.pdList[0]?.designno, cookie)
            //     .then((res) => {
            //       // console.log("designsetList",res?.Data?.rd[0])
            //       setDesignSetList(res?.Data?.rd);
            //     })
            //     .catch((err) => console.log("designsetErr", err));
            // }

            await SaveLastViewDesign(cookie, resp?.pdList[0]?.autocode, resp?.pdList[0]?.designno)
              .then((res) => {
                setSaveLastView(res?.Data?.rd);
              })
              .catch((err) => console.log("saveLastView", err));
          }
        })
        .catch((err) => console.log("err", err))
        .finally(() => {
          // setIsImageLoad(false);
          setProdLoading(false);
        });
    };

    FetchProductData();

    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [params, comboReady, storeInit]);

  function checkImageAvailability(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  }

  const [imagePromise, setImagePromise] = useState(true);

  const imageCache = {}; // Caching object to store checked images

  const loadAndCheckImages = async (img) => {
    if (imageCache[img] !== undefined) {
      // If the image result is already cached, return the cached result
      return imageCache[img];
    }

    try {
      const result = await checkImage(img);
      imageCache[img] = result; // Cache the result for future reference
      if (!isImageload) {
        setTimeout(() => {
          // setImagePromise(false);
        }, 500);
      }
      return result;
    } catch (error) {
      imageCache[img] = imageNotFound;
      return imageNotFound;
    }
  };

  const checkImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve(imageUrl); // Image loaded successfully
      };

      img.onerror = () => {
        reject(new Error("Image not found")); // Image not found
      };

      img.src = imageUrl;
    });
  };

  const ProdCardImageFunc = async () => {
    const mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo")) || [];
    const imageVideoDetail = singleProd?.ImageVideoDetail;
    const pd = singleProd;

    let parsedData = [];
    try {
      parsedData = imageVideoDetail === "0" ? [] : JSON.parse(imageVideoDetail || "[]");
    } catch (err) {
      console.error("Invalid JSON in ImageVideoDetail:", err);
      return;
    }

    // Filter categorized media
    const normalImages = [],
      colorImages = [],
      normalVideos = [],
      colorVideos = [];
    parsedData.forEach((item) => {
      if (item?.TI === 1 && !item?.CN) normalImages.push(item);
      else if (item?.TI === 2 && item?.CN) colorImages.push(item);
      else if (item?.TI === 4 && item?.CN) colorVideos.push(item);
      else if (item?.TI === 3 && !item?.CN) normalVideos.push(item);
    });

    const getMaxCountByColor = (list) => {
      return list.reduce((acc, curr) => {
        const color = curr.CN;
        acc[color] = (acc[color] || 0) + 1;
        return acc;
      }, {});
    };

    const maxColorCount = Math.max(...Object.values(getMaxCountByColor(colorImages)), 0);
    const normalImageCount = normalImages.length ? Math.max(...normalImages.map((i) => i.Nm)) : 0;

    // Get metal color code
    const mcArr = mtColorLocal.find((ele) => ele.id === singleProd?.MetalColorid);
    setSelectedMetalColor(mcArr?.colorcode);

    const buildImageURL = (i, isColor = false) => {
      const base = storeInit?.CDNDesignImageFol;
      const extension = isColor ? colorImages[i - 1]?.Ex : normalImages[i - 1]?.Ex;

      const imageUrl = isColor ? `${base}${pd.designno}~${i}~${mcArr?.colorcode}.${colorImages[i - 1]?.Ex}` : `${base}${pd.designno}~${i}.${normalImages[i - 1]?.Ex}`;

      return { imageUrl, extension };
    };

    const pdImgList = [];

    if (maxColorCount > 0) {
      // Asynchronously populate pdImgList with color images
      for (let i = 1; i <= maxColorCount; i++) {
        const colorImageUrl = buildImageURL(i, true);
        const isColorImageAvailable = await checkImageAvailability(colorImageUrl?.imageUrl);

        // Only push the image if it is available
        if (isColorImageAvailable) {
          pdImgList.push(colorImageUrl);
        }
      }
    }

    // If no color image was added, push normal images
    if (pdImgList.length === 0 && normalImageCount > 0) {
      for (let i = 1; i <= normalImageCount; i++) {
        pdImgList.push(buildImageURL(i));
      }
    }

    // Now check if pdImgList is populated and set finalprodListimg after that
    let finalprodListimg = {};
    if (pdImgList.length > 0) {
      finalprodListimg = pdImgList[0];

      // Set the selected thumbnail image if we have a valid image
      if (Object.keys(finalprodListimg).length > 0) {
        setSelectedThumbImg({
          link: {
            imageUrl: finalprodListimg?.imageUrl,
            extension: finalprodListimg?.extension,
          },
          type: "img",
        });
      }
    } else {
      console.warn("noimage not erro", "No images found, pdImgList is empty.");
    }

    if (pdImgList.length) {
      const thumbImagePath = pdImgList.map((url) => {
        const fileName = url?.imageUrl?.split("Design_Image/")[1];
        const thumbImageUrl = `${storeInit?.CDNDesignImageFolThumb}${fileName?.split(".")[0]}.jpg`;
        const originalImageExtension = url?.extension;
        return { thumbImageUrl, originalImageExtension };
      });
      setPdThumbImg(thumbImagePath);
      setThumbImgIndex(0);
    } else {
      setThumbImgIndex();
    }

    // Video processing
    const buildVideoURL = (video, isColor = false) => {
      const base = storeInit?.CDNVPath;
      return isColor ? `${base}${pd.designno}~${video.Nm}~${video.CN}.${video.Ex}` : `${base}${pd.designno}~${video.Nm}.${video.Ex}`;
    };

    const pdvideoList = [...colorVideos.map((v) => buildVideoURL(v, true)), ...normalVideos.map((v) => buildVideoURL(v))];

    setPdVideoArr(pdvideoList.length ? pdvideoList : []);

    // setIsImageLoaded(false)

    const img = await loadAndCheckImages(finalprodListimg);
    return img;
  };

  useEffect(() => {
    ProdCardImageFunc();
  }, [singleProd?.autocode, singleProd1?.autocode]);

  // useEffect(() => {
  //   if (isImageload === false) {
  //     if (!(pdThumbImg?.length !== 0 || pdVideoArr?.length !== 0)) {
  //       setSelectedThumbImg({ "link": { "imageUrl": imageNotFound, "extension": "" }, "type": 'img' });
  //     }
  //   }
  // }, [isImageload, pdThumbImg, pdVideoArr])

  const decodeEntities = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const metalColorName = () => {
    if (typeof window === "undefined") return null;

    try {
      const mtColorLocal = getSession("MetalColorCombo");
      if (!Array.isArray(mtColorLocal) || !selectMtColor) return null;

      const selectedColor = mtColorLocal.find(
        (item) => String(item?.colorcode) === String(selectMtColor)
      );

      return selectedColor?.metalcolorname ?? null;
    } catch (error) {
      console.error("metalColorName error:", error);
      return null;
    }
  };


  useEffect(() => {
    try {
      if (selectedThumbImg == undefined) return;

      if (selectedThumbImg) {
        setImageSrc(selectedThumbImg?.link?.imageUrl);
      } else {
        // Set a default image if no thumbnail is selected
        setImageSrc(pdVideoArr?.length > 0 ? imageNotFound : "p.png");
      }
    } catch (error) {
      console.log("Error in fetching image", error);
    }
  }, [selectedThumbImg, pdVideoArr]);

  const handleMetalWiseColorImg = async (e) => {
    const selectedColorCode = e.target.value;
    const mtColorLocal = JSON.parse(sessionStorage.getItem("MetalColorCombo") || "[]");
    const mcArr = mtColorLocal.find((ele) => ele?.colorcode === selectedColorCode);

    const prod = singleProd ?? singleProd1;
    const { designno, ImageExtension } = prod || {};
    const baseCDN = storeInit?.CDNDesignImageFol;
    const thumbCDN = storeInit?.CDNDesignImageFolThumb;

    setPdThumbImg([]);

    setSelectedMetalColor(mcArr?.colorcode);
    setSelectMtColor(selectedColorCode);
    setSelectMtColorName(mcArr?.colorname);

    // Parse image/video data
    let parsedData = [];
    try {
      parsedData = prod?.ImageVideoDetail && prod.ImageVideoDetail !== "0" ? JSON.parse(prod.ImageVideoDetail) : [];
    } catch (err) {
      console.error("Invalid JSON in ImageVideoDetail:", err);
      return;
    }

    // Filter categorized media
    const normalImages = [],
      colorImages = [],
      normalVideos = [],
      colorVideos = [];
    parsedData.forEach((item) => {
      if (item?.TI === 1 && !item?.CN) normalImages.push(item);
      else if (item?.TI === 2 && item?.CN) colorImages.push(item);
      else if (item?.TI === 4 && item?.CN) colorVideos.push(item);
      else if (item?.TI === 3 && !item?.CN) normalVideos.push(item);
    });

    // Filter color and normal images
    const colorImgs = parsedData.filter((ele) => ele?.CN && ele?.TI === 2);
    const normalImgs = parsedData.filter((ele) => !ele?.CN && ele?.TI === 1);

    const maxColorImgCount = Math.max(
      0,
      ...Object.values(
        colorImgs.reduce((acc, { CN }) => {
          acc[CN] = (acc[CN] || 0) + 1;
          return acc;
        }, {}),
      ),
    );

    const normalImageCount = normalImgs.length > 0 ? Math.max(...normalImgs.map((item) => item.Nm)) : 0;

    // Build image URLs
    const buildColorImageList = () =>
      Array.from({ length: maxColorImgCount }, (_, i) => {
        const extension = colorImages[i]?.Ex;
        const imageUrl = `${baseCDN}${designno}~${i + 1}~${mcArr?.colorcode}.${colorImages[i]?.Ex}`;
        return { imageUrl, extension };
      });

    const buildNormalImageList = () =>
      Array.from({ length: normalImageCount }, (_, i) => {
        const extension = normalImages[i]?.Ex;
        const imageUrl = `${baseCDN}${designno}~${i + 1}.${normalImages[i]?.Ex}`;

        return { imageUrl, extension };
      });

    let pdImgListCol = [];
    let pdImgList = [];
    let colorImagesAvailable = false;

    // Check color image availability dynamically
    if (colorImgs.length > 0) {
      const tempColorList = buildColorImageList().filter(Boolean);

      const checkImages =
        tempColorList.length > 3
          ? tempColorList.slice(0, 3) // Optional cap for performance
          : tempColorList;

      const availabilityChecks = await Promise.all(checkImages.map((url) => checkImageAvailability(url?.imageUrl)));

      colorImagesAvailable = availabilityChecks.some(Boolean);
      if (colorImagesAvailable) {
        pdImgListCol = tempColorList;
      }
    }

    // Fallback to normal images if no color images are available
    if (!colorImagesAvailable && normalImgs.length > 0) {
      pdImgList = buildNormalImageList();
    }

    // Set images to UI
    if (colorImagesAvailable && pdImgListCol.length > 0) {
      const thumbImagePath = pdImgListCol.map((url) => {
        const fileName = url?.imageUrl.split("Design_Image/")[1]?.split(".")[0];
        const thumbImageUrl = `${thumbCDN}${fileName}.jpg`;
        const originalImageExtension = url?.extension;
        return { thumbImageUrl, originalImageExtension };
      });

      setPdThumbImg(thumbImagePath);

      const safeIndex = thumbImgIndex < pdImgListCol.length ? thumbImgIndex : pdImgListCol.length - 1;
      const mainImg = pdImgListCol[safeIndex];
      console.log("TCL: ProductDetail -> mainImg", mainImg);
      // setSelectedThumbImg({ link: mainImg, type: 'img' });
      setSelectedThumbImg({
        link: {
          imageUrl: mainImg?.imageUrl,
          extension: mainImg?.originalImageExtension,
        },
        type: "img",
      });
      setThumbImgIndex(safeIndex);

      const defaultMainImg = `${baseCDN}${designno}~${safeIndex + 1}~${mcArr?.colorcode}.${ImageExtension}`;
      setMetalWiseColorImg(defaultMainImg);
    } else if (pdImgList.length > 0) {
      const thumbImagePath = pdImgList.map((url) => {
        const fileName = url?.imageUrl?.split("Design_Image/")[1]?.split(".")[0];
        const thumbImageUrl = `${thumbCDN}${fileName}.jpg`;
        const originalImageExtension = url?.extension;
        return { thumbImageUrl, originalImageExtension };
      });

      setPdThumbImg(thumbImagePath);

      const safeIndex = thumbImgIndex < pdImgList.length ? thumbImgIndex : pdImgListCol.length - 1;
      const fallbackImg = pdImgList[safeIndex];
      // setSelectedThumbImg({ link: fallbackImg, type: 'img' });
      setSelectedThumbImg({
        link: {
          imageUrl: fallbackImg?.imageUrl,
          extension: fallbackImg?.originalImageExtension,
        },
        type: "img",
      });
      setThumbImgIndex(safeIndex);
    }
  };

  // useEffect(()=>{

  //  StockItemApi(singleProd?.autocode,"stockitem").then((res)=>{

  //   setStockItemArr(res?.Data?.rd)

  // }).catch((err)=>console.log("stockItemErr",err))

  // },[singleProd])

  // useEffect(()=>{

  //  StockItemApi(singleProd?.autocode,"similarbrand").then((res)=>{

  //   setSimilarBrandArr(res?.Data?.rd)

  // }).catch((err)=>console.log("similarbrandErr",err))

  // },[singleProd])

  // console.log("stock",stockItemArr,SimilarBrandArr);

  const handleCartandWish = (e, ele, type) => {
    // console.log("event", e.target.checked, ele, type);
    let loginInfo = loginUserDetail;

    let prodObj = {
      StockId: ele?.StockId,
      // "autocode": ele?.autocode,
      // "Metalid": ele?.MetalPurityid,
      // "MetalColorId": ele?.MetalColorid,
      // "DiaQCid": loginInfo?.cmboDiaQCid,
      // "CsQCid": loginInfo?.cmboCSQCid,
      // "Size": ele?.Size,
      Unitcost: ele?.Amount,
      // "UnitCostWithmarkup": ele?.Amount,
      // "Remark": ""
    };

    if (e.target.checked == true) {
      CartAndWishListAPI(type, prodObj, cookie)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
        })
        .catch((err) => console.log("err", err));
    } else {
      RemoveCartAndWishAPI(type, ele?.StockId, cookie, true)
        .then((res) => {
          let cartC = res?.Data?.rd[0]?.Cartlistcount;
          let wishC = res?.Data?.rd[0]?.Wishlistcount;
          setWishCountNum(wishC);
          setCartCountNum(cartC);
        })
        .catch((err) => console.log("err", err));
    }

    if (type === "Cart") {
      setCartArr((prev) => ({
        ...prev,
        [ele?.StockId]: e.target.checked,
      }));
    }
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

  const handleMoveToDetail = (productData, index) => {
    console.log(productData, "mian obj for router")
    setNextIndex(index);
    const logininfoDetail = JSON.parse(sessionStorage.getItem("loginUserDetail"));

    let obj = {
      a: productData?.autocode,
      b: productData?.designno,
      m: decodeobj?.m,
      d: decodeobj?.d,
      c: decodeobj?.c,
      f: decodeobj?.f,
      // n: decodeURI(extractedPart)
      n: decodeobj?.n,
      pl: decodeobj?.pl,
      sb: decodeobj?.sb,
      sk: decodeobj?.sk,
      di: decodeobj?.di,
      ne: decodeobj?.ne,
      gr: decodeobj?.gr,
      in: index,
      i: productData?.MetalColorid,
      l: productData?.ImageExtension,
      count: productData?.ImageCount,
      s: productData?.DefaultSize || ""
    };
    let encodeObj = compressAndEncode(JSON.stringify(obj));
    navigate.push(`/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`);
    setProdLoading(true);
    setImagePromise(true);
    // setIsImageLoad(true)
    setPdThumbImg([]);
  };

  const handleCustomChange = async (e, type) => {
    let metalArr;
    let diaArr;
    let csArr;
    let size;
    let mtColor;

    let mtTypeLocal = getSession("metalTypeCombo");

    let diaQcLocal = getSession("diamondQualityColorCombo");

    let csQcLocal = getSession("ColorStoneQualityColorCombo");

    let MetalColorLocal = getSession("MetalColorCombo");

    if (type === "mt") {
      metalArr = mtTypeLocal?.filter((ele) => ele?.metaltype == e.target.value)[0]?.Metalid;
      setSelectMtType(e.target.value);
    }
    if (type === "dia") {
      setSelectDiaQc(e.target.value);
      diaArr = diaQcLocal?.filter((ele) => ele?.Quality == e.target.value?.split(",")[0] && ele?.color == e.target.value?.split(",")[1])[0];
    }
    if (type === "cs") {
      setSelectCsQc(e.target.value);
      csArr = csQcLocal?.filter((ele) => ele?.Quality == e.target.value?.split(",")[0] && ele?.color == e.target.value?.split(",")[1])[0];
    }
    if (type === "sz") {
      setSizeData(e.target.value);
      size = e.target.value;
    }
    if (type === "mtc") {
      const Value = e.target.value;
      mtColor = MetalColorLocal?.filter((ele) => {
        return ele?.colorcode == Value;
      })
    }


    if (metalArr == undefined) {
      metalArr = mtTypeLocal?.filter((ele) => ele?.metaltype == selectMtType)[0]?.Metalid;
    }

    if (diaArr == undefined) {
      diaArr = diaQcLocal?.filter((ele) => ele?.Quality == selectDiaQc?.split(",")[0] && ele?.color == selectDiaQc?.split(",")[1])[0];
    }

    if (csArr == undefined) {
      csArr = csQcLocal?.filter((ele) => ele?.Quality == selectCsQc?.split(",")[0] && ele?.color == selectCsQc?.split(",")[1])[0];
    }
    if (mtColor == undefined) {
      mtColor = MetalColorLocal?.filter((ele) => {
        return ele?.colorcode?.toLowerCase() == selectMtColor?.toLowerCase();
      })
    }

    let obj = {
      mt: metalArr ?? 0,
      diaQc: `${diaArr?.QualityId ?? 0},${diaArr?.ColorId ?? 0}`,
      csQc: `${csArr?.QualityId ?? 0},${csArr?.ColorId ?? 0}`,
      MetalColorId: mtColor?.[0]?.id ?? singleProd?.MetalColorid,
    };

    let prod = {
      a: singleProd?.autocode,
      b: singleProd?.designno,
    };

    // console.log("eeee",obj)
    setisPriceLoading(true);
    await SingleProdListAPI(prod, size ?? sizeData, obj, cookie)
      .then((res) => {
        setSingleProd1(res?.pdList[0]);

        if (res?.pdList?.length > 0) {
          console.log(res, "res")
          setisPriceLoading(false);
          setAddToCartFlag(res?.pdList[0]?.IsInCart !== 0);
          const qty = res?.pdList?.[0]?.CartQuantity;
          const remarks = res?.pdList?.[0]?.Remarks;
          setQuantity(qty && qty > 0 ? qty : 1);
          setRemarks(remarks ?? "");

        }
        setDiaList(res?.pdResp?.rd3);
        setCsList(res?.pdResp?.rd4);
        // console.log("res123",res)
      })
      .catch((err) => {
        console.log("customProdDetailErr", err);
      });
  };

  const debounceTimeoutRef = useRef(null);

  const handleCartQuantity = async (id, value) => {
    setQuantity(value);

    if (addToCartFlag) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        setIsQtyLoading(true);
        try {
          const response = await updateQuantity(id, value, cookie);
          console.log("🚀 ~ handleCartQuantity ~ response:", response)
        } catch (error) {
          console.error("Error updating quantity:", error);
        } finally {
          setIsQtyLoading(false);
        }
      }, 500);
    }
  };

  const countWords = (str) => {
    if (!str || typeof str !== 'string') return 0;
    return str.match(/\S+/g)?.length || 0;
  };

  const handleRemarkChange = async (value) => {
    if (value.length > 250 && value.length > (remarks?.length || 0)) {
      return;
    }

    setRemarks(value);
    if (addToCartFlag) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(async () => {
        setIsRemarkLoading(true);
        try {
          const prodObj = {
            id: singleProd1?.CartId ?? singleProd?.CartId,
            autocode: singleProd1?.autocode ?? singleProd?.autocode
          }
          const response = await handleProductRemark(prodObj, value, cookie);
          console.log("🚀 ~ handleRemarkChange ~ response:", response)
        } catch (error) {
          console.error("Error updating remarks:", error);
        } finally {
          setIsRemarkLoading(false);
        }
      }, 500);
    }
  };

  const formatter = new Intl.NumberFormat("en-IN");

  const SizeSorting = (SizeArr) => {
    let SizeSorted = SizeArr?.sort((a, b) => {
      const nameA = parseInt(a?.sizename?.toUpperCase()?.slice(0, -2), 10);
      const nameB = parseInt(b?.sizename?.toUpperCase()?.slice(0, -2), 10);

      return nameA - nameB;
    });

    return SizeSorted;
  };

  const swiperMainRef = useRef(null);

  const handleProductDetail = (index) => {
    handleMoveToDetail(allListDataSlide[index], index);
  };

  const onSlideChange = (swiper) => {
    // setNextIndex(swiper.activeIndex);
    // handleProductDetail(swiper.activeIndex);
  };

  const fetchImageData = async (index) => {
    const selectedData = allListDataSlide[index];

    if (!selectedData) return;

    const imageLink = await checkImageAvailability(selectedData?.images?.[0]);

    if (imageLink === undefined || imageLink === false) {
      setSelectedThumbImg({ link: { imageUrl: imageNotFound, extension: "" }, type: "img" });
    } else {
      setSelectedThumbImg({ link: { imageUrl: imageLink, extension: "" }, type: "img" });
    }
  };

  const handleNext = async () => {
    console.log(allListDataSlide, "allListDataSlide")
    const nextIndex = (nextindex + 1) % allListDataSlide?.length;
    setNextIndex(nextIndex);
    swiperMainRef?.current.swiper.slideTo(nextIndex);

    const innerSwiper = innerSwiperRef?.current?.swiper;
    if (innerSwiper && imageData?.length) {
      console.log("inn", innerSwiper);
      const slidesPerView = innerSwiper.params.slidesPerView;
      const currentSlide = innerSwiper.activeIndex;

      if (nextIndex >= currentSlide + slidesPerView) {
        innerSwiper.slideTo(nextIndex - slidesPerView + 1);
      } else if (nextIndex < currentSlide) {
        innerSwiper.slideTo(nextIndex);
      }
    }

    // Fetch image data only if it's a new index
    if (nextIndex !== nextindex) {
      await fetchImageData(nextIndex);
      handleProductDetail(nextIndex);
      setProdLoading(true);
      // setIsImageLoad(true);
    }
  };

  const handlePrev = async () => {
    const prevIndex = (nextindex - 1 + allListDataSlide?.length) % allListDataSlide?.length;
    setPrevIndex(prevIndex);
    swiperMainRef?.current.swiper.slideTo(prevIndex);

    const innerSwiper = innerSwiperRef?.current?.swiper;
    if (innerSwiper && imageData?.length) {
      const slidesPerView = innerSwiper.params.slidesPerView;
      const currentSlide = innerSwiper.activeIndex;

      if (prevIndex < currentSlide) {
        innerSwiper.slideTo(prevIndex);
      } else if (prevIndex >= currentSlide + slidesPerView) {
        innerSwiper.slideTo(prevIndex - slidesPerView + 1);
      }
    }

    // Fetch image data only if it's a new index
    if (prevIndex !== nextindex) {
      await fetchImageData(prevIndex);
      handleProductDetail(prevIndex);
      setProdLoading(true);
      // setIsImageLoad(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        if (allListDataSlide.length) handleNext();
      } else if (event.key === "ArrowLeft") {
        if (allListDataSlide.length) handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [allListDataSlide, nextindex]);

  useEffect(() => {
    const checkImages = async () => {
      const updatedStates = {};

      for (const ele of stockItemArr) {
        const imageUrl = `${storeInit?.CDNDesignImageFol}${ele?.designno}~1.${ele?.ImageExtension}`;
        const available = await checkImageAvailability(imageUrl);
        updatedStates[ele.StockId] = available ? imageUrl : imageNotFound;
      }

      setImageStates(updatedStates);
    };

    if (stockItemArr?.length) {
      checkImages();
    }
  }, [stockItemArr]);

  return (
    <>
      <title>{formatTitleLine(singleProd?.TitleLine) ? `${singleProd.TitleLine} - ${singleProd?.designno ?? ""}` : singleProd?.TitleLine || singleProd?.designno ? `${singleProd?.designno ?? ""}` : "loading..."}</title>
      <div
        className="proCat_prodDetail_bodyContain"
        style={{
          height: "100%",
        }}
      >
        <div className="proCat_prodDetail_outerContain">
          <div className="proCat_prodDetail_whiteInnerContain">
            {isDataFound ? (
              <div
                style={{
                  height: "90vh",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
                className="proCat_prodd_datanotfound"
              >
                Data not Found!!
              </div>
            ) : (
              <>

                <DetailBlock
                  swiperMainRef={swiperMainRef}
                  onSlideChange={onSlideChange}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  navigate={navigate}

                  selectedThumbImg={selectedThumbImg}
                  pdThumbImg={pdThumbImg}
                  pdVideoArr={pdVideoArr}
                  filteredVideos={filteredVideos}
                  imageNotFound={imageNotFound}
                  isImageload={isImageload}
                  imagePromise={imagePromise}
                  setImagePromise={setImagePromise}
                  setSelectedThumbImg={setSelectedThumbImg}
                  setThumbImgIndex={setThumbImgIndex}

                  setProdLoading={setProdLoading}
                  nextindex={nextindex}

                  singleProd={singleProd1?.autocode ? singleProd1 : singleProd}
                  singleProd1={singleProd1}
                  storeInit={storeInit}

                  selectMtColorName={selectMtColorName}
                  metalTypeCombo={metalTypeCombo}
                  metalColorCombo={metalColorCombo}
                  diaQcCombo={diaQcCombo}
                  csQcCombo={csQcCombo}
                  diaList={diaList}
                  csList={csList}
                  SizeCombo={SizeCombo}
                  sizeData={sizeData}
                  selectMtType={selectMtType}
                  selectMtColor={selectMtColor}
                  selectDiaQc={selectDiaQc}
                  selectCsQc={selectCsQc}
                  handleCustomChange={handleCustomChange}
                  handleMetalWiseColorImg={handleMetalWiseColorImg}
                  metalColorName={metalColorName}
                  SizeSorting={SizeSorting}
                  Almacarino={Almacarino}

                  descriptionText={descriptionText}
                  isExpanded={isExpanded}
                  isClamped={isClamped}
                  toggleText={toggleText}
                  descriptionRef={descriptionRef}

                  formatter={formatter}
                  isPriceloading={isPriceloading}
                  loginInfo={loginInfo}

                  quantity={quantity}
                  handleCartQuantity={handleCartQuantity}
                  isQtyLoading={isQtyLoading}
                  prodLoading={prodLoading}

                  remarks={remarks}
                  handleRemarkChange={handleRemarkChange}
                  isRemarkLoading={isRemarkLoading}

                  addToCartFlag={addToCartFlag}
                  handleCart={handleCart}
                />

                <ProductDetailsSection
                  diaList={diaList}
                  csList={csList}
                />

                <StockBlock
                  stockItemArr={stockItemArr}
                  storeInit={storeInit}
                  loginInfo={loginInfo}
                  imageStates={imageStates}
                  imageNotFound={imageNotFound}
                  isPriceloading={isPriceloading}
                  formatter={formatter}
                  cartArr={cartArr}
                  handleCartandWish={handleCartandWish}
                />

                <MoreProducts
                  ref={innerSwiperRef}
                  imageData={imageData}
                  handleMoveToDetail={handleMoveToDetail}
                  singleProd={singleProd}
                  imageNotFound={imageNotFound}
                />

                <SimilarDesigns
                  storeInit={storeInit}
                  SimilarBrandArr={SimilarBrandArr}
                  handleMoveToDetail={handleMoveToDetail}
                  imageNotFound={imageNotFound}
                  loginInfo={loginInfo}
                  formatter={formatter}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ProductDetail);
