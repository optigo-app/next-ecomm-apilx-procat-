"use client";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import "./productlist.scss";
import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import { FilterListAPI } from "@/app/(core)/utils/API/FilterAPI/FilterListAPI";
import {
  findMetalColor,
  findMetalType,
  formatRedirectTitleLine,
  formatTitleLine,
} from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import ProductListSkeleton, {
  PageSkeleton,
} from "./productlist_skeleton/ProductListSkeleton";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Container,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Pagination,
  PaginationItem,
  Paper,
  Select,
  Skeleton,
  Slider,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { CartAndWishListAPI } from "@/app/(core)/utils/API/CartAndWishList/CartAndWishListAPI";
import { RemoveCartAndWishAPI } from "@/app/(core)/utils/API/RemoveCartandWishAPI/RemoveCartAndWishAPI";
import pako from "pako";
import { MetalTypeComboAPI } from "@/app/(core)/utils/API/Combo/MetalTypeComboAPI";
import { DiamondQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/DiamondQualityColorComboAPI";
import { ColorStoneQualityColorComboAPI } from "@/app/(core)/utils/API/Combo/ColorStoneQualityColorComboAPI";
import { MetalColorCombo } from "@/app/(core)/utils/API/Combo/MetalColorCombo";
import Cookies from "js-cookie";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import EditablePagination from "@/app/components/EditablePagination/EditablePagination";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { ParseAndDecodeSearchParams } from "@/app/(core)/utils/GlobalFunctions/Parser";

const imageNotFound = "/image-not-found.jpg";

const ProductList = ({ params, searchParams, storeinit }) => {
  const storeInit = storeinit;
  const {
    islogin,
    setCartCountNum,
    setWishCountNum,
    SoketData,
    loginUserDetail,
  } = useStore();

  useEffect(() => {
    let mtCombo = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
    setMetalTypeCombo(mtCombo);

    let diaQcCombo = JSON.parse(
      sessionStorage.getItem("diamondQualityColorCombo"),
    );
    setDiaQcCombo(diaQcCombo);

    let CsQcCombo = JSON.parse(
      sessionStorage.getItem("ColorStoneQualityColorCombo"),
    );
    setCsQcCombo(CsQcCombo);
  }, []);

  let location = useNextRouterLikeRR();
  let navigate = useNextRouterLikeRR();
  let minwidth1201px = useMediaQuery("(min-width:1201px)");
  let maxwidth1674px = useMediaQuery("(max-width:1674px)");
  let maxwidth590px = useMediaQuery("(max-width:590px)");
  let maxwidth464px = useMediaQuery("(max-width:464px)");

  const [productListData, setProductListData] = useState([]);
  // const setSliderData = useSetRecoilState(sliderData);
  const [priceListData, setPriceListData] = useState([]);
  const [finalProductListData, setFinalProductListData] = useState([]);
  const [isProdLoading, setIsProdLoading] = useState(true);
  const [isOnlyProdLoading, setIsOnlyProdLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [filterChecked, setFilterChecked] = useState({});
  const [afterFilterCount, setAfterFilterCount] = useState();
  const [accExpanded, setAccExpanded] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [cartArr, setCartArr] = useState({});
  const [wishArr, setWishArr] = useState({});
  const [menuParams, setMenuParams] = useState({});
  const [filterProdListEmpty, setFilterProdListEmpty] = useState(false);
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [diaQcCombo, setDiaQcCombo] = useState([]);
  const [csQcCombo, setCsQcCombo] = useState([]);
  const [selectedMetalId, setSelectedMetalId] = useState(
    loginUserDetail?.MetalId,
  );
  const [selectedDiaId, setSelectedDiaId] = useState(
    loginUserDetail?.cmboDiaQCid,
  );
  const [selectedCsId, setSelectedCsId] = useState(loginUserDetail?.cmboCSQCid);
  const [IsBreadCumShow, setIsBreadcumShow] = useState(false);
  const [loginInfo, setLoginInfo] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rollOverImgPd, setRolloverImgPd] = useState({});
  const [locationKey, setLocationKey] = useState();
  const [prodListType, setprodListType] = useState();
  const [sortBySelect, setSortBySelect] = useState();
  const [diaFilterRange, setDiaFilterRange] = useState({});
  const [sliderValue, setSliderValue] = useState([]);
  const [sliderValue1, setSliderValue1] = useState([]);
  const [sliderValue2, setSliderValue2] = useState([]);
  const [isRollOverVideo, setIsRollOverVideo] = useState({});
  const [afterCountStatus, setAfterCountStatus] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [diaRange, setDiaRange] = useState("");
  const [netRange, setNetRange] = useState("");
  const [grossRange, setGrossRange] = useState("");
  const [securityKey, setSecurityKey] = useState();
  const formatter = new Intl.NumberFormat("en-IN");
  let cookie = Cookies.get("visiterId");
  const [menuDecode, setMenuDecode] = useState("");

  const [inputPage, setInputPage] = useState(currPage);
  const [inputGross, setInputGross] = useState([]);
  const [inputNet, setInputNet] = useState([]);
  const [inputDia, setInputDia] = useState([]);
  const [isReset, setIsReset] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [appliedRange1, setAppliedRange1] = useState(null);
  const [appliedRange2, setAppliedRange2] = useState(null);
  const [appliedRange3, setAppliedRange3] = useState(null);
  const [isClearAllClicked, setIsClearAllClicked] = useState(false);
  let result = [];

  const lastSearchParamsRef = useRef(null);
  const isApiCallInProgressRef = useRef(false);
  // Tracks whether the initial fetchData has resolved prodListType.
  // Prevents the metal/dia/cs combo effect from firing an extra API call on first mount.
  const prodListTypeReadyRef = useRef(false);
  const isFirstComboRun = useRef(true);
  const lastFetchedComboRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const setCSSVariable = () => {
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    const backgroundColor = storeInit?.IsPLW == 1 ? "#c4cfdb" : "#c0bbb1";
    document.documentElement.style.setProperty(
      "--background-color",
      backgroundColor,
    );
  };

  const isEditablePage = 1;

  useEffect(() => {
    // setCSSVariable();

    let mtid = loginUserDetail?.MetalId ?? storeInit?.MetalId;
    setSelectedMetalId(mtid);

    let diaid = loginUserDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid;
    setSelectedDiaId(diaid);

    let csid = loginUserDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid;
    setSelectedCsId(csid);
  }, []);

  const callAllApi = () => {
    let mtTypeLocal = JSON.parse(sessionStorage.getItem("metalTypeCombo"));
    let diaQcLocal = JSON.parse(
      sessionStorage.getItem("diamondQualityColorCombo"),
    );
    let csQcLocal = JSON.parse(
      sessionStorage.getItem("ColorStoneQualityColorCombo"),
    );
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
            sessionStorage.setItem(
              "diamondQualityColorCombo",
              JSON.stringify(data),
            );
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
            sessionStorage.setItem(
              "ColorStoneQualityColorCombo",
              JSON.stringify(data),
            );
            setCsQcCombo(data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setCsQcCombo(csQcLocal);
    }

    if (!mtColorLocal || mtColorLocal?.length === 0) {
      MetalColorCombo()
        .then((response) => {
          if (response?.Data?.rd) {
            let data = response?.Data?.rd;
            sessionStorage.setItem("MetalColorCombo", JSON.stringify(data));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    const logininfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    setLoginInfo(logininfo);
  }, []);

  useEffect(() => {
    callAllApi();
  }, [loginInfo]);

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    let param = JSON.parse(sessionStorage.getItem("menuparams"));
    // Only depends on params — productListData/filterChecked were causing this to
    // re-run on every API response, producing unnecessary re-renders.
    if (location?.state?.SearchVal === undefined) {
      setMenuParams(param);
    }
  }, [params]);
  // },[location?.state?.menu,productListData,filterChecked])

  useEffect(() => {
    const url = `${location?.pathname}${location?.search}`;
    const pathSegments = location?.pathname?.split("/") || [];
    const kSegment = pathSegments.find((s) => s.includes("K="));
    const encodedKey = kSegment?.split("?")[0]?.split("K=")[1];
    const isB2B = storeInit?.IsB2BWebsite === 1;

    // Condition 1: B2B Website restriction for guest users
    if (isB2B && islogin !== true) {
      navigate.push(`/LoginOption/?LoginRedirect=${encodeURIComponent(url)}`);
      return;
    }

    // Condition 2: Album Security Key restriction for guest users
    if (encodedKey) {
      let decodedKey = null;
      try {
        decodedKey = atob(decodeURIComponent(encodedKey));
      } catch (err) {
        console.warn("Invalid Base64 Key:", encodedKey);
        // If key is invalid but present, and user is guest, treat as restricted to be safe
        if (islogin !== true) {
          navigate.push(
            `/LoginOption/?LoginRedirect=${encodeURIComponent(url)}`,
          );
        }
        return;
      }

      if (Number(decodedKey) > 0 && islogin !== true) {
        navigate.push(`/LoginOption/?LoginRedirect=${encodeURIComponent(url)}`);
      }
    } else {
      // Check query params SK/SecurityKey as well for redirect
      const sk = searchParams?.SK || searchParams?.SecurityKey;
      if (Number(sk) > 0 && islogin !== true) {
        navigate.push(`/LoginOption/?LoginRedirect=${encodeURIComponent(url)}`);
      }
    }
  }, [params, islogin, searchParams, storeInit]);

  useEffect(() => {
    let result = ParseAndDecodeSearchParams(searchParams);
    const currentSearchKey = JSON.stringify(searchParams);
    if (
      lastSearchParamsRef.current === currentSearchKey ||
      isApiCallInProgressRef.current
    ) {
      return;
    }
    lastSearchParamsRef.current = currentSearchKey;
    isApiCallInProgressRef.current = true;

    const fetchData = async () => {
      let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
      lastFetchedComboRef.current = obj;
      let UrlVal = result;
      let MenuVal = "";
      let MenuKey = "";
      let SearchVar = "";
      let TrendingVar = "";
      let NewArrivalVar = "";
      let BestSellerVar = "";
      let AlbumVar = "";

      let productlisttype;

      const getSecurityKeyFromUrl = () => {
        // 1. From path segment K=
        const pathSegments = location?.pathname?.split("/") || [];
        const kSegment = pathSegments.find((s) => s.includes("K="));
        const pathKey = kSegment?.split("?")[0]?.split("K=")[1];
        if (pathKey) {
          try {
            return atob(decodeURIComponent(pathKey));
          } catch (e) {
            console.error("Error decoding path key:", e);
          }
        }

        // 2. From searchParams (SK or SecurityKey)
        const sk = searchParams?.SK || searchParams?.SecurityKey;
        if (sk) return sk;

        // 3. From location state (legacy/fallback)
        if (location?.state?.SecurityKey) return location.state.SecurityKey;

        return "";
      };

      const securityKey = getSecurityKeyFromUrl();
      setSecurityKey(securityKey);

      UrlVal?.forEach((ele) => {
        console.log(ele, "ele");
        let firstChar = ele.charAt(0);

        switch (firstChar) {
          case "M":
            MenuVal = ele;
            break;
          case "S":
            SearchVar = ele;
            break;
          case "T":
            TrendingVar = ele;
            break;
          case "N":
            NewArrivalVar = ele;
            break;
          case "B":
            BestSellerVar = ele;
            break;
          case "A":
            AlbumVar = ele;
            break;
          default:
            return "";
        }
      });
      if (MenuVal?.length > 0) {
        let menuDecode = "";
        try {
          const valPart = MenuVal?.split("=")[1];
          if (valPart && valPart !== "undefined" && valPart !== "null") {
            menuDecode = atob(valPart);
          }
        } catch (e) {
          console.error("Error decoding MenuVal:", MenuVal, e);
        }

        if (menuDecode) {
          let key = menuDecode?.split("/")[1]?.split(",");
          let val = menuDecode?.split("/")[0]?.split(",");

          setIsBreadcumShow(true);
          setMenuDecode(menuDecode?.split("/"));

          productlisttype = [key, val];
        }
      }

      if (SearchVar) {
        productlisttype = SearchVar;
      }

      if (TrendingVar) {
        productlisttype = TrendingVar.split("=")[1];
      }
      if (NewArrivalVar) {
        productlisttype = NewArrivalVar.split("=")[1];
      }

      if (BestSellerVar) {
        productlisttype = BestSellerVar.split("=")[1];
      }

      if (AlbumVar) {
        productlisttype = AlbumVar.split("=")[1];
      }

      setIsProdLoading(true);
      setprodListType(productlisttype);
      prodListTypeReadyRef.current = true; // mark that prodListType is now resolved

      let diafilter =
        filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
          ?.length > 0
          ? JSON.parse(
              filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
            )[0]
          : [];
      let diafilter1 =
        filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length >
        0
          ? JSON.parse(
              filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
            )[0]
          : [];
      let diafilter2 =
        filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length >
        0
          ? JSON.parse(
              filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
            )[0]
          : [];
      const isDia =
        JSON.stringify(sliderValue) !==
        JSON.stringify([diafilter?.Min, diafilter?.Max]);
      const isNet =
        JSON.stringify(sliderValue1) !==
        JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
      const isGross =
        JSON.stringify(sliderValue2) !==
        JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

      let DiaRange = {
        DiaMin: isDia ? (sliderValue[0] ?? "") : "",
        DiaMax: isDia ? (sliderValue[1] ?? "") : "",
      };

      let netRange = {
        netMin: isNet ? (sliderValue1[0] ?? "") : "",
        netMax: isNet ? (sliderValue1[1] ?? "") : "",
      };

      let grossRange = {
        grossMin: isGross ? (sliderValue2[0] ?? "") : "",
        grossMax: isGross ? (sliderValue2[1] ?? "") : "",
      };

      await ProductListApi(
        {},
        1,
        obj,
        productlisttype,
        cookie,
        sortBySelect,
        DiaRange,
        netRange,
        grossRange,
      )
        .then((res) => {
          if (res) {
            setProductListData(res?.pdList);
            sessionStorage.setItem(
              "deatilSliderData",
              JSON.stringify(res?.pdList),
            );
            setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          }
          return res;
        })
        // .then( async(res) => {
        //   let forWardResp;
        //   if (res) {
        //     await GetPriceListApi(1,{},{},res?.pdResp?.rd1[0]?.AutoCodeList,obj,productlisttype).then((resp)=>{
        //       if(resp){
        //         setPriceListData(resp)
        //         forWardResp = resp;
        //       }
        //     })
        //   }
        //   return forWardResp
        // })
        .then(async (res) => {
          let forWardResp1;
          if (res) {
            await FilterListAPI(productlisttype, cookie)
              .then((res) => {
                setFilterData(res);
                let diafilter =
                  res?.filter((ele) => ele?.Name == "Diamond")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        res?.filter((ele) => ele?.Name == "Diamond")[0]
                          ?.options,
                      )[0]
                    : [];
                let diafilter1 =
                  res?.filter((ele) => ele?.Name == "NetWt")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        res?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
                      )[0]
                    : [];
                let diafilter2 =
                  res?.filter((ele) => ele?.Name == "Gross")[0]?.options
                    ?.length > 0
                    ? JSON.parse(
                        res?.filter((ele) => ele?.Name == "Gross")[0]?.options,
                      )[0]
                    : [];
                setSliderValue(
                  diafilter?.Min != null || diafilter?.Max != null
                    ? [diafilter.Min, diafilter.Max]
                    : [],
                );
                setSliderValue1(
                  diafilter1?.Min != null || diafilter1?.Max != null
                    ? [diafilter1?.Min, diafilter1?.Max]
                    : [],
                );
                setSliderValue2(
                  diafilter2?.Min != null || diafilter2?.Max != null
                    ? [diafilter2?.Min, diafilter2?.Max]
                    : [],
                );
                forWardResp1 = res;
              })
              .catch((err) => console.log("err", err));
          }
          return forWardResp1;
        })
        .finally(() => {
          setIsProdLoading(false);
          setIsOnlyProdLoading(false);
          isApiCallInProgressRef.current = false;
          isInitialLoadRef.current = false;
          window.scroll({
            top: 0,
            behavior: "smooth",
          });
        })
        .catch((err) => {
          console.log("err", err);
          isApiCallInProgressRef.current = false;
          isInitialLoadRef.current = false;
        });

      // }
    };

    fetchData();

    if (searchParams) {
      setLocationKey(searchParams);
    }
    setCurrPage(1);
    setInputPage(1);
  }, [searchParams]);

  let getDesignImageFol = storeInit?.CDNDesignImageFolThumb;
  const getDesignVideoFol = storeInit?.CDNVPath;

  const getDynamicRollImages = (designno, count, extension) => {
    if (count > 1) {
      return `${getDesignImageFol}${designno}~${2}.jpg`;
    }
    return;
  };

  const getDynamicImages = (designno, extension) => {
    return `${getDesignImageFol}${designno}~${1}.jpg`;
  };

  const getDynamicVideo = (designno, count, extension) => {
    if (extension && count > 0) {
      const url = `${getDesignVideoFol}${designno}~${1}.${extension}`;
      return url;
    }
    return;
  };


  const generateImageList = useCallback((product) => {
    let storeInitX = JSON.parse(sessionStorage.getItem("storeInit"));
    let pdImgList = [];
    if (product?.ImageCount > 0) {
      for (let i = 1; i <= product?.ImageCount; i++) {
        let imgString =
          storeInitX?.CDNDesignImageFol +
          product?.designno +
          "~" +
          i +
          "." +
          product?.ImageExtension;
        pdImgList?.push(imgString);
      }
    } else {
      pdImgList?.push(imageNotFound);
    }
    return pdImgList;
  }, []);

  useEffect(() => {
    const initialProducts = productListData?.map((product) => ({
      ...product,
      images: [],
      loading: true,
    }));

    setFinalProductListData(initialProducts);

    // const timer = setTimeout(() => {
    const updateData = productListData?.map((product) => ({
      ...product,
      images: generateImageList(product),
      loading: false,
    }));

    setFinalProductListData(updateData);
    // }, 150);

    // return () => clearTimeout(timer);
  }, [productListData, generateImageList]);

  // useEffect(() => {
  //   if (loadingIndex >= finalProductListData?.length) return

  //   const loadNextProductImages = () => {
  //     setFinalProductListData(prevData => {
  //       const newData = [...prevData]
  //       newData[loadingIndex] = {
  //         ...newData[loadingIndex],
  //         images: generateImageList(newData[loadingIndex]),
  //         loading: false
  //       }
  //       return newData
  //     })

  //     setLoadingIndex(prevIndex => prevIndex + 1)
  //   }

  //   const timer = setTimeout(loadNextProductImages, 20)
  //   return () => clearTimeout(timer)
  // }, [loadingIndex, finalProductListData, generateImageList])

  // useEffect(()=>{
  //   const finalProdWithSocket = productListData.map((product) => {
  //     let common = SoketData?.find((ele)=> ele?.designno === product?.designno)
  //     if(common !== undefined && common ){
  //       let StatusId = common?.StatusId
  //       return {
  //         ...product,
  //         StatusId
  //       }
  //     }else{
  //       let StatusId = 0
  //       return {...product,StatusId}
  //     }
  //   })
  //   setFinalProductListData(finalProdWithSocket);
  //   console.log("finalProdWithPrice",finalProdWithSocket);
  // },[productListData,SoketData])

  // useEffect(() => {
  //   const finalProdWithPrice = productListData.map((product) => {
  //     const newPriceData = priceListData?.rd?.find(
  //       (pda) => pda.A == product.autocode
  //     );

  //     const newPriceData1 = priceListData?.rd1
  //       ?.filter((pda) => pda.A == product.autocode)
  //       .reduce((acc, obj) => acc + obj.S, 0);

  //     const newPriceData2 = priceListData?.rd2
  //       ?.filter((pda) => pda.A == product.autocode)
  //       .reduce((acc, obj) => acc + obj.S, 0);

  //       let pdImgList = [];

  //       if(product?.ImageCount > 0){
  //         for(let i = 1; i <= product?.ImageCount; i++){
  //           let imgString = storeInit?.CDNDesignImageFol + product?.designno + "~" + i + "." + product?.ImageExtension
  //           pdImgList.push(imgString)
  //         }
  //       }
  //       else{
  //         pdImgList.push(imageNotFound)
  //       }

  //     let price = 0;
  //     let markup = 0;
  //     let metalrd = 0;
  //     let diard1 = 0;
  //     let csrd2 = 0;
  //     let updNWT = 0;
  //     let updGWT = 0;
  //     let updDWT = 0;
  //     let updDPCS = 0;
  //     let updCWT = 0;
  //     let updCPCS = 0;
  //     let ismrpbase;
  //     let mrpbaseprice;
  //     let images = pdImgList;

  //     if (newPriceData || newPriceData1 || newPriceData2) {
  //       price =
  //         ((newPriceData?.V ?? 0) / storeInit?.CurrencyRate ?? 0) +
  //         (newPriceData?.W ?? 0) +
  //         (newPriceData?.X ?? 0) +
  //         (newPriceData1 ?? 0) +
  //         (newPriceData2 ?? 0);
  //       metalrd =
  //         ((newPriceData?.V ?? 0) / storeInit?.CurrencyRate ?? 0) +
  //         (newPriceData?.W ?? 0) +
  //         (newPriceData?.X ?? 0);
  //       diard1 = newPriceData1 ?? 0;
  //       csrd2 = newPriceData2 ?? 0;
  //       markup = newPriceData?.AB;
  //       updNWT = newPriceData?.I ?? 0;
  //       updGWT = newPriceData?.N ?? 0;
  //       updDWT = newPriceData?.K ?? 0;
  //       updDPCS = newPriceData?.J ?? 0;
  //       updCWT = newPriceData?.M ?? 0;
  //       updCPCS = newPriceData?.L ?? 0;
  //       ismrpbase = newPriceData?.U;
  //       mrpbaseprice = newPriceData?.Z;
  //     }

  //     return {
  //       ...product,
  //       price,
  //       markup,
  //       metalrd,
  //       diard1,
  //       csrd2,
  //       updNWT,
  //       updGWT,
  //       updDWT,
  //       updDPCS,
  //       updCWT,
  //       updCPCS,
  //       ismrpbase,
  //       mrpbaseprice,
  //       images
  //     };
  //   });
  //   setFinalProductListData(finalProdWithPrice);
  // }, [productListData, priceListData]);

  const ProdCardImageFunc = (pd, j) => {
    let finalprodListimg;
    let pdImgList = [];

    if (pd?.ImageCount > 0) {
      for (let i = 1; i <= pd?.ImageCount; i++) {
        let imgString =
          storeInit?.CDNDesignImageFol +
          pd?.designno +
          "~" +
          i +
          "." +
          pd?.ImageExtension;
        pdImgList.push(imgString);
      }
    } else {
      finalprodListimg = imageNotFound;
    }
    if (pdImgList?.length > 0) {
      finalprodListimg = pdImgList[j];
      if (j > 0 && (!finalprodListimg || finalprodListimg == undefined)) {
        finalprodListimg = pdImgList[0];
      }
    }
    return finalprodListimg;
  };

  const handleCheckboxChange = (e, listname, val) => {
    const { name, checked } = e.target;
    setAfterCountStatus(true);
    setFilterChecked((prev) => ({
      ...prev,
      [name]: {
        checked,
        type: listname,
        id: name?.replace(/[a-zA-Z]/g, ""),
        value: val,
      },
    }));
  };

  const FilterValueWithCheckedOnly = () => {
    let onlyTrueFilterValue = Object.values(filterChecked).filter(
      (ele) => ele.checked,
    );

    const priceValues = onlyTrueFilterValue
      .filter((item) => item.type === "Price")
      .map((item) => item.value);

    const output = {};

    onlyTrueFilterValue.forEach((item) => {
      if (!output[item.type]) {
        output[item.type] = "";
      }

      if (item.type == "Price") {
        output["Price"] = priceValues;
        return;
      }

      output[item.type] += `${item.id}, `;
    });

    for (const key in output) {
      if (key !== "Price") {
        output[key] = output[key].slice(0, -2);
      }
    }

    // NOTE: page-reset is intentionally NOT done here.
    // FilterValueWithCheckedOnly is a pure computation helper; callers that
    // actually need a page reset (filterChecked effect, handelCustomCombo)
    // call setCurrPage / setInputPage themselves.
    return output;
  };

  useEffect(() => {
    setSortBySelect("Recommended");
  }, [params]);

  const prevFilterChecked = useRef();

  useEffect(() => {
    setAfterCountStatus(true);
    const previousChecked = prevFilterChecked.current;
    prevFilterChecked.current = filterChecked;

    if (
      Object.keys(filterChecked).length > 0 ||
      (previousChecked &&
        JSON.stringify(previousChecked) !== JSON.stringify(filterChecked))
    ) {
      setCurrPage(1);
      setInputPage(1);
    }

    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
    let diafilter =
      filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length >
      0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
          )[0]
        : [];
    let diafilter1 =
      filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
          )[0]
        : [];
    let diafilter2 =
      filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
          )[0]
        : [];
    const isDia =
      JSON.stringify(sliderValue) !==
      JSON.stringify([diafilter?.Min, diafilter?.Max]);
    const isNet =
      JSON.stringify(sliderValue1) !==
      JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
    const isGross =
      JSON.stringify(sliderValue2) !==
      JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

    //  if(location?.state?.SearchVal === undefined && Object.keys(filterChecked)?.length > 0){
    // console.log("locationkey",location?.key !== locationKey,location?.key,locationKey);

    // if (location?.key === locationKey && (Object.keys(filterChecked)?.length > 0 || isClearAllClicked === true)) {
    if (Object.keys(filterChecked)?.length > 0 || isClearAllClicked === true) {
      setIsOnlyProdLoading(true);
      let DiaRange = {
        DiaMin: isDia ? sliderValue[0] : "",
        DiaMax: isDia ? sliderValue[1] : "",
      };
      let grossRange = {
        grossMin: isGross ? sliderValue2[0] : "",
        grossMax: isGross ? sliderValue2[1] : "",
      };
      let netRange = {
        netMin: isNet ? sliderValue1[0] : "",
        netMax: isNet ? sliderValue1[1] : "",
      };

      ProductListApi(
        output,
        1,
        obj,
        prodListType,
        cookie,
        sortBySelect,
        DiaRange,
        netRange,
        grossRange,
      )
        .then((res) => {
          if (res) {
            setProductListData(res?.pdList);
            sessionStorage.setItem(
              "deatilSliderData",
              JSON.stringify(res?.pdList),
            );
            setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
            setAfterCountStatus(false);
          }
          return res;
        })
        //  .then( async(res) => {
        //    if (res) {
        //      await GetPriceListApi(1,{},output,res?.pdResp?.rd1[0]?.AutoCodeList,obj).then((resp)=>{
        //        if(resp){
        //          setPriceListData(resp)
        //        }
        //      })
        //    }
        //    return res
        //  })
        .catch((err) => console.log("err", err))
        .finally(() => {
          setAfterCountStatus(false);
          setIsOnlyProdLoading(false);
          setIsClearAllClicked(false);
        });
    } else {
      setAfterCountStatus(false);
    }
    // .then(async(res)=>{
    //   if(res){
    //     FilterListAPI().then((res)=>setFilterData(res)).catch((err)=>console.log("err",err))
    //   }
    // })
    // }
  }, [filterChecked]);

  const handelFilterClearAll = useCallback(() => {
    const diafilter =
      filterData?.find((ele) => ele?.Name === "Diamond")?.options?.length > 0
        ? JSON.parse(
            filterData.find((ele) => ele?.Name === "Diamond")?.options,
          )[0]
        : [];
    const diafilter1 =
      filterData?.find((ele) => ele?.Name === "NetWt")?.options?.length > 0
        ? JSON.parse(
            filterData.find((ele) => ele?.Name === "NetWt")?.options,
          )[0]
        : [];
    const diafilter2 =
      filterData?.find((ele) => ele?.Name === "Gross")?.options?.length > 0
        ? JSON.parse(
            filterData.find((ele) => ele?.Name === "Gross")?.options,
          )[0]
        : [];

    const isFilterChecked = Object.values(filterChecked).some(
      (ele) => ele.checked,
    );
    const isSliderChanged =
      JSON.stringify(sliderValue) !==
        JSON.stringify(
          diafilter?.Min != null || diafilter?.Max != null
            ? [diafilter?.Min, diafilter?.Max]
            : [],
        ) ||
      JSON.stringify(sliderValue1) !==
        JSON.stringify(
          diafilter1?.Min != null || diafilter1?.Max != null
            ? [diafilter1?.Min, diafilter1?.Max]
            : [],
        ) ||
      JSON.stringify(sliderValue2) !==
        JSON.stringify(
          diafilter2?.Min != null || diafilter2?.Max != null
            ? [diafilter2?.Min, diafilter2?.Max]
            : [],
        );

    if (isFilterChecked || isSliderChanged) {
      setSliderValue(
        diafilter?.Min != null || diafilter?.Max != null
          ? [diafilter.Min, diafilter.Max]
          : [],
      );
      setSliderValue1(
        diafilter1?.Min != null || diafilter1?.Max != null
          ? [diafilter1?.Min, diafilter1?.Max]
          : [],
      );
      setSliderValue2(
        diafilter2?.Min != null || diafilter2?.Max != null
          ? [diafilter2?.Min, diafilter2?.Max]
          : [],
      );
      setInputDia([diafilter?.Min, diafilter?.Max]);
      setInputNet([diafilter1?.Min, diafilter1?.Max]);
      setInputGross([diafilter2?.Min, diafilter2?.Max]);
      setAppliedRange1(["", ""]);
      setAppliedRange2(["", ""]);
      setAppliedRange3(["", ""]);
      setShow(false);
      setShow1(false);
      setShow2(false);
      setIsReset(false);
      setFilterChecked({});
      if (Object.keys(filterChecked).length > 0 || isSliderChanged) {
        setIsClearAllClicked(true);
      }
    }
  }, [filterData, filterChecked, sliderValue, sliderValue1, sliderValue2]);

  const totalPages = Math.ceil(afterFilterCount / storeInit.PageSize);

  const handlePageInputChange = (event) => {
    if (event.key === "Enter") {
      let newPage = parseInt(inputPage, 10);
      if (newPage < 1) newPage = 1;
      if (newPage > totalPages) newPage = totalPages;
      setCurrPage(newPage);
      setInputPage(newPage);
      handelPageChange("", newPage);
    }
  };

  const handelPageChange = (event, value) => {
    // console.log("pagination",value);

    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };
    setIsProdLoading(true);
    setCurrPage(value);
    setInputPage(value);
    setTimeout(() => {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
    let diafilter =
      filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length >
      0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
          )[0]
        : [];
    let diafilter1 =
      filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
          )[0]
        : [];
    let diafilter2 =
      filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
          )[0]
        : [];
    const isDia =
      JSON.stringify(sliderValue) !==
      JSON.stringify([diafilter?.Min, diafilter?.Max]);
    const isNet =
      JSON.stringify(sliderValue1) !==
      JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
    const isGross =
      JSON.stringify(sliderValue2) !==
      JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

    let DiaRange = {
      DiaMin: isDia ? (sliderValue[0] ?? "") : "",
      DiaMax: isDia ? (sliderValue[1] ?? "") : "",
    };

    let netRange = {
      netMin: isNet ? (sliderValue1[0] ?? "") : "",
      netMax: isNet ? (sliderValue1[1] ?? "") : "",
    };

    let grossRange = {
      grossMin: isGross ? (sliderValue2[0] ?? "") : "",
      grossMax: isGross ? (sliderValue2[1] ?? "") : "",
    };

    ProductListApi(
      output,
      value,
      obj,
      prodListType,
      cookie,
      sortBySelect,
      DiaRange,
      netRange,
      grossRange,
    )
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
        }
        return res;
      })
      // .then(async (res) => {
      //   if (res) {
      //     await GetPriceListApi(value, {}, output, res?.pdResp?.rd1[0]?.AutoCodeList, obj).then((resp) => {
      //       if (resp) {
      //         setPriceListData(resp)
      //       }
      //     })
      //   }
      //   return res
      // })
      .catch((err) => console.log("err", err))
      .finally(() => {
        setTimeout(() => {
          setIsProdLoading(false);
        }, 100);
      });
  };

  const handleCartandWish = (e, ele, type) => {
    let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));
    let prodObj = {
      autocode: ele?.autocode,
      Metalid: selectedMetalId ?? ele?.MetalPurityid,
      MetalColorId: ele?.MetalColorid,
      DiaQCid:
        selectedDiaId ?? loginInfo?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      CsQCid: selectedCsId ?? loginInfo?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      Size: ele?.DefaultSize,
      Unitcost: ele?.UnitCost,
      markup: ele?.DesignMarkUp,
      UnitCostWithmarkup: ele?.UnitCostWithMarkUp,
      Remark: "",
      // AlbumName: decodeURI(extractedPart) ?? ""
      AlbumName:
        decodeURIComponent(location.pathname?.split("/p/")[1].split("/")[0]) ??
        "",
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
      RemoveCartAndWishAPI(type, ele?.autocode, cookie)
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
        [ele?.autocode]: e.target.checked,
      }));
    }

    if (type === "Wish") {
      setWishArr((prev) => ({
        ...prev,
        [ele?.autocode]: e.target.checked,
      }));
    }
  };

  useEffect(() => {
    if (productListData?.length === 0 || !productListData) {
      setFilterProdListEmpty(true);
    } else {
      setFilterProdListEmpty(false);
      setAfterCountStatus(false);
    }
  }, [productListData]);

  const handelCustomCombo = (obj) => {
    lastFetchedComboRef.current = obj;
    let output = FilterValueWithCheckedOnly();

    if (location?.state?.SearchVal === undefined) {
      setIsOnlyProdLoading(true);
      let diafilter =
        filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
          ?.length > 0
          ? JSON.parse(
              filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
            )[0]
          : [];
      let diafilter1 =
        filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length >
        0
          ? JSON.parse(
              filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
            )[0]
          : [];
      let diafilter2 =
        filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length >
        0
          ? JSON.parse(
              filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
            )[0]
          : [];
      const isDia =
        JSON.stringify(sliderValue) !==
        JSON.stringify([diafilter?.Min, diafilter?.Max]);
      const isNet =
        JSON.stringify(sliderValue1) !==
        JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
      const isGross =
        JSON.stringify(sliderValue2) !==
        JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

      let DiaRange = {
        DiaMin: isDia ? (sliderValue[0] ?? "") : "",
        DiaMax: isDia ? (sliderValue[1] ?? "") : "",
      };

      let netRange = {
        netMin: isNet ? (sliderValue1[0] ?? "") : "",
        netMax: isNet ? (sliderValue1[1] ?? "") : "",
      };

      let grossRange = {
        grossMin: isGross ? (sliderValue2[0] ?? "") : "",
        grossMax: isGross ? (sliderValue2[1] ?? "") : "",
      };

      setCurrPage(1);
      setInputPage(1);

      // , DiaRange, netRange ,grossRange
      ProductListApi(
        output,
        currPage,
        obj,
        prodListType,
        cookie,
        sortBySelect,
        DiaRange,
        netRange,
        grossRange,
      )
        .then((res) => {
          if (res) {
            setProductListData(res?.pdList);
            setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          }
          return res;
        })
        .catch((err) => console.log("err", err))
        .finally(() => {
          setTimeout(() => {
            sessionStorage.setItem("short_cutCombo_val", JSON?.stringify(obj));
            setIsOnlyProdLoading(false);
          }, 100);
        });
    }
  };

  // useEffect(() => {
  //   let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

  //   let loginInfo = JSON.parse(sessionStorage.getItem("loginUserDetail"));

  //   sessionStorage.setItem("short_cutCombo_val", JSON?.stringify(obj));

  //   if (
  //     loginInfo?.MetalId !== selectedMetalId ||
  //     loginInfo?.cmboDiaQCid !== selectedDiaId ||
  //     loginInfo?.cmboCSQCid !== selectedCsId
  //   ) {
  //     if (
  //       selectedMetalId !== "" ||
  //       selectedDiaId !== "" ||
  //       selectedCsId !== ""
  //     ) {
  //       handelCustomCombo(obj);
  //     }
  //   }
  // }, [selectedMetalId, selectedDiaId, selectedCsId, storeInit]);

  useEffect(() => {
    if (!prodListTypeReadyRef.current) return;
    if (isFirstComboRun.current) {
      isFirstComboRun.current = false;
      return;
    }
    if (isInitialLoadRef.current) {
      return;
    }

    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    if (
      lastFetchedComboRef.current &&
      String(lastFetchedComboRef.current.mt) === String(selectedMetalId) &&
      String(lastFetchedComboRef.current.dia) === String(selectedDiaId) &&
      String(lastFetchedComboRef.current.cs) === String(selectedCsId)
    ) {
      return;
    }

    lastFetchedComboRef.current = obj;
    sessionStorage.setItem("short_cutCombo_val", JSON.stringify(obj));

    if (loginUserDetail && Object.keys(loginUserDetail).length > 0) {
      if (
        selectedMetalId != undefined ||
        selectedDiaId != undefined ||
        selectedCsId != undefined
      ) {
        if (
          String(loginUserDetail.MetalId) !== String(selectedMetalId) ||
          String(loginUserDetail.cmboDiaQCid) !== String(selectedDiaId) ||
          String(loginUserDetail.cmboCSQCid) !== String(selectedCsId)
        ) {
          obj;
        }
      }
    } else {
      if (storeInit && Object.keys(storeInit).length > 0) {
        if (
          selectedMetalId != undefined ||
          selectedDiaId != undefined ||
          selectedCsId != undefined
        ) {
          if (
            String(storeInit?.MetalId) !== String(selectedMetalId) ||
            String(storeInit?.cmboDiaQCid) !== String(selectedDiaId) ||
            String(storeInit?.cmboCSQCid) !== String(selectedCsId)
          ) {
            handelCustomCombo(obj);
          }
        }
      }
    }
  }, [selectedMetalId, selectedDiaId, selectedCsId]);

  const compressAndEncode = (inputString) => {
    try {
      const uint8Array = new TextEncoder().encode(inputString);

      const compressed = pako.deflate(uint8Array, { to: "string" });

      return btoa(String.fromCharCode.apply(null, compressed));
    } catch (error) {
      console.error("Error compressing and encoding:", error);
      return null;
    }
  };

  const decodeAndDecompress = (encodedString) => {
    if (!encodedString || typeof encodedString !== "string") {
      return null;
    }
    try {
      // Decode the Base64 string to binary data
      const binaryString = atob(encodedString);

      // Convert binary string to Uint8Array
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      // Decompress the data
      const decompressed = pako.inflate(uint8Array, { to: "string" });

      // Convert decompressed data back to JSON object
      const jsonObject = JSON.parse(decompressed);

      return jsonObject;
    } catch (error) {
      console.error("Error decoding and decompressing:", error);
      return null;
    }
  };

  const handleMoveToDetail = (productData, i) => {
    const logininfoDetail = JSON.parse(
      sessionStorage.getItem("loginUserDetail"),
    );

    let output = FilterValueWithCheckedOnly();

    let imageVideoDetail = [];
    try {
      imageVideoDetail = JSON.parse(productData?.ImageVideoDetail) || [];
      if (!Array.isArray(imageVideoDetail)) imageVideoDetail = [];
    } catch (e) {
      imageVideoDetail = [];
    }

    const uniqueNmList = [
      ...new Set(imageVideoDetail?.map((item) => item?.Nm)),
    ].filter(Boolean);

    let obj = {
      a: productData?.autocode,
      b: productData?.designno,
      m: selectedMetalId ?? logininfoDetail?.MetalId ?? storeInit?.MetalId,
      d:
        selectedDiaId ?? logininfoDetail?.cmboDiaQCid ?? storeInit?.cmboDiaQCid,
      c: selectedCsId ?? logininfoDetail?.cmboCSQCid ?? storeInit?.cmboCSQCid,
      f: output,
      // n: decodeURI(extractedPart)
      n:
        decodeURIComponent(location.pathname?.split("/p/")[1].split("/")[0]) ??
        "",
      pl: prodListType ?? "",
      sb: sortBySelect ?? "",
      sk: securityKey,
      di: diaRange,
      ne: netRange,
      gr: grossRange,
      in: i,

      i: productData?.MetalColorid,
      l: productData?.ImageExtension || "",
      count: productData?.ImageCount,
      s: productData?.DefaultSize || "",
    };
    let encodeObj = compressAndEncode(JSON?.stringify(obj));
    navigate.push(
      `/d/${formatRedirectTitleLine(productData?.TitleLine)}${productData?.designno}?p=${encodeObj}`,
    );
  };

  const handleImgRollover = (pd) => {
    if (pd?.images?.length >= 1) {
      const imageUrls = [pd.images[1], pd.images[0]];
      let imageToUse = imageNotFound;

      for (const imageUrl of imageUrls) {
        imageToUse = imageUrl;
        break;
      }

      setRolloverImgPd((prev) => {
        if (prev[pd?.autocode] !== imageToUse) {
          return { [pd?.autocode]: imageToUse };
        }
        return prev;
      });
    }
  };

  const handleLeaveImgRolloverImg = (pd) => {
    if (pd?.images?.length > 0) {
      const imageUrl = pd?.images[0];
      setRolloverImgPd((prev) => {
        return { [pd?.autocode]: imageUrl };
      });
    }
  };

  const handleBreadcums = (mparams) => {
    let key = Object?.keys(mparams);
    let val = Object?.values(mparams);

    let KeyObj = {};
    let ValObj = {};

    key.forEach((value, index) => {
      let keyName = `FilterKey${index === 0 ? "" : index}`;
      KeyObj[keyName] = value;
    });

    val.forEach((value, index) => {
      let keyName = `FilterVal${index === 0 ? "" : index}`;
      ValObj[keyName] = value;
    });

    let finalData = { ...KeyObj, ...ValObj };

    const queryParameters1 = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ]
      .filter(Boolean)
      .join("/");

    const queryParameters = [
      finalData?.FilterKey && `${finalData.FilterVal}`,
      finalData?.FilterKey1 && `${finalData.FilterVal1}`,
      finalData?.FilterKey2 && `${finalData.FilterVal2}`,
    ]
      .filter(Boolean)
      .join(",");

    const otherparamUrl = Object.entries({
      b: finalData?.FilterKey,
      g: finalData?.FilterKey1,
      c: finalData?.FilterKey2,
    })
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => value)
      .filter(Boolean)
      .join(",");

    let menuEncoded = `${queryParameters}/${otherparamUrl}`;

    const url = `/p/${BreadCumsObj()?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;
    console.log("🚀 ~ ProductList ~ url:", url);
    // const url = `/p?V=${queryParameters}/K=${otherparamUrl}`;

    navigate.push(url);

    // console.log("mparams", KeyObj, ValObj)
  };

  const handleSortby = async (e) => {
    setSortBySelect(e.target?.value);

    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    setIsOnlyProdLoading(true);

    let sortby = e.target?.value;
    let diafilter =
      filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length >
      0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
          )[0]
        : [];
    let diafilter1 =
      filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
          )[0]
        : [];
    let diafilter2 =
      filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
          )[0]
        : [];
    const isDia =
      JSON.stringify(sliderValue) !==
      JSON.stringify([diafilter?.Min, diafilter?.Max]);
    const isNet =
      JSON.stringify(sliderValue1) !==
      JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
    const isGross =
      JSON.stringify(sliderValue2) !==
      JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

    let DiaRange = {
      DiaMin: isDia ? (sliderValue[0] ?? "") : "",
      DiaMax: isDia ? (sliderValue[1] ?? "") : "",
    };

    let netRange = {
      netMin: isNet ? (sliderValue1[0] ?? "") : "",
      netMax: isNet ? (sliderValue1[1] ?? "") : "",
    };

    let grossRange = {
      grossMin: isGross ? (sliderValue2[0] ?? "") : "",
      grossMax: isGross ? (sliderValue2[1] ?? "") : "",
    };

    setCurrPage(1);
    setInputPage(1);

    // DiaRange, netRange ,grossRange
    await ProductListApi(
      output,
      currPage,
      obj,
      prodListType,
      cookie,
      sortby,
      DiaRange,
      netRange,
      grossRange,
    )
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
        }
        return res;
      })
      .catch((err) => console.log("err", err))
      .finally(() => {
        setIsOnlyProdLoading(false);

        // if(element)
        //   {
        //     element.scrollIntoView({ behavior: "smooth", block: "start" })
        //   }
        // window.scroll({
        //   top: 0,
        //   behavior: 'smooth'
        // })
      });
  };

  const handleScrollHeight = () => {
    // const element = document.getElementsByClassName("smr_filter_portion_outter")
    // const clientHeight = element?.clientHeight;
    // console.log('ClientHeight', clientHeight);
  };

  const handleRangeFilterApi = async (Rangeval) => {
    setIsOnlyProdLoading(true);
    setAfterCountStatus(true);
    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    let diafilter =
      filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length >
      0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
          )[0]
        : [];
    let diafilter1 =
      filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
          )[0]
        : [];
    let diafilter2 =
      filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
          )[0]
        : [];
    const isDia =
      JSON.stringify(Rangeval) !==
      JSON.stringify([diafilter?.Min, diafilter?.Max]);
    const isNet =
      JSON.stringify(sliderValue1) !==
      JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
    const isGross =
      JSON.stringify(sliderValue2) !==
      JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

    let DiaRange = {
      DiaMin: isDia ? (Rangeval[0] ?? "") : "",
      DiaMax: isDia ? (Rangeval[1] ?? "") : "",
    };

    let netRange = {
      netMin: isNet ? (sliderValue1[0] ?? "") : "",
      netMax: isNet ? (sliderValue1[1] ?? "") : "",
    };

    let grossRange = {
      grossMin: isGross ? (sliderValue2[0] ?? "") : "",
      grossMax: isGross ? (sliderValue2[1] ?? "") : "",
    };

    await ProductListApi(
      output,
      1,
      obj,
      prodListType,
      cookie,
      sortBySelect,
      DiaRange,
      netRange,
      grossRange,
    )
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          setAfterCountStatus(false);
        }
        return res;
      })
      .catch((err) => console.log("err", err))
      .finally(() => {
        setIsOnlyProdLoading(false);
        setAfterCountStatus(false);
      });
  };

  const handleRangeFilterApi1 = async (Rangeval1) => {
    setIsOnlyProdLoading(true);
    setAfterCountStatus(true);
    // let diafilter = JSON.parse(
    //   filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options
    // )[0];
    // // let diafilter1 = JSON.parse(filterData?.filter((ele)=>ele?.Name == "NetWt")[0]?.options)[0]
    // let diafilter2 = JSON.parse(
    //   filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options
    // )[0];

    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    let diafilter =
      filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length >
      0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
          )[0]
        : [];
    let diafilter1 =
      filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
          )[0]
        : [];
    let diafilter2 =
      filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
          )[0]
        : [];
    const isDia =
      JSON.stringify(sliderValue) !==
      JSON.stringify([diafilter?.Min, diafilter?.Max]);
    const isNet =
      JSON.stringify(Rangeval1) !==
      JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
    const isGross =
      JSON.stringify(sliderValue2) !==
      JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

    let DiaRange = {
      DiaMin: isDia ? (sliderValue[0] ?? "") : "",
      DiaMax: isDia ? (sliderValue[1] ?? "") : "",
    };

    let netRange = {
      netMin: isNet ? (Rangeval1[0] ?? "") : "",
      netMax: isNet ? (Rangeval1[1] ?? "") : "",
    };

    let grossRange = {
      grossMin: isGross ? (sliderValue2[0] ?? "") : "",
      grossMax: isGross ? (sliderValue2[1] ?? "") : "",
    };

    await ProductListApi(
      output,
      1,
      obj,
      prodListType,
      cookie,
      sortBySelect,
      DiaRange,
      netRange,
      grossRange,
    )
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          setAfterCountStatus(false);
        }
        return res;
      })
      .catch((err) => console.log("err", err))
      .finally(() => {
        setIsOnlyProdLoading(false);
        setAfterCountStatus(false);
      });
  };

  const handleRangeFilterApi2 = async (Rangeval2) => {
    setIsOnlyProdLoading(true);
    setAfterCountStatus(true);
    let output = FilterValueWithCheckedOnly();
    let obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    let diafilter =
      filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length >
      0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
          )[0]
        : [];
    let diafilter1 =
      filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
          )[0]
        : [];
    let diafilter2 =
      filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
          )[0]
        : [];
    const isDia =
      JSON.stringify(sliderValue) !==
      JSON.stringify([diafilter?.Min, diafilter?.Max]);
    const isNet =
      JSON.stringify(sliderValue1) !==
      JSON.stringify([diafilter1?.Min, diafilter1?.Max]);
    const isGross =
      JSON.stringify(Rangeval2) !==
      JSON.stringify([diafilter2?.Min, diafilter2?.Max]);

    let DiaRange = {
      DiaMin: isDia ? (sliderValue[0] ?? "") : "",
      DiaMax: isDia ? (sliderValue[1] ?? "") : "",
    };

    let netRange = {
      netMin: isNet ? (sliderValue1[0] ?? "") : "",
      netMax: isNet ? (sliderValue1[1] ?? "") : "",
    };

    let grossRange = {
      grossMin: isGross ? (Rangeval2[0] ?? "") : "",
      grossMax: isGross ? (Rangeval2[1] ?? "") : "",
    };

    await ProductListApi(
      output,
      1,
      obj,
      prodListType,
      cookie,
      sortBySelect,
      DiaRange,
      netRange,
      grossRange,
    )
      .then((res) => {
        if (res) {
          setProductListData(res?.pdList);
          setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
          setAfterCountStatus(false);
        }
        return res;
      })
      .catch((err) => console.log("err", err))
      .finally(() => {
        setIsOnlyProdLoading(false);
        setAfterCountStatus(false);
      });
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    handleRangeFilterApi(newValue);
  };
  const handleSliderChange1 = (event, newValue) => {
    setSliderValue1(newValue);
    handleRangeFilterApi1(newValue);
  };
  const handleSliderChange2 = (event, newValue) => {
    setSliderValue2(newValue);
    handleRangeFilterApi2(newValue);
  };

  const handleInputChange = (index) => (event) => {
    const newSliderValue = [...sliderValue];
    newSliderValue[index] =
      event.target.value === "" ? "" : Number(event.target.value);
    setSliderValue(newSliderValue);
    handleRangeFilterApi(newSliderValue);
  };
  const handleInputChange1 = (index) => (event) => {
    const newSliderValue = [...sliderValue1];
    newSliderValue[index] =
      event.target.value === "" ? "" : Number(event.target.value);
    setSliderValue1(newSliderValue);
    handleRangeFilterApi1(newSliderValue);
  };
  const handleInputChange2 = (index) => (event) => {
    const newSliderValue = [...sliderValue2];
    newSliderValue[index] =
      event.target.value === "" ? "" : Number(event.target.value);
    setSliderValue2(newSliderValue);
    handleRangeFilterApi2(newSliderValue);
  };

  const SharedStyleForRange = {
    width: 170,
    height: 88,
    "@media (max-width:1520px)": {
      width: 165, // Example of how to change width on small screens
    },
    "@media (max-width:1410px)": {
      width: 160, // Example of how to change width on small screens
    },
    "@media (max-width:1290px)": {
      width: 145, // Example of how to change width on small screens
    },
  };

  const resetRangeFilter = async ({
    filterName,
    setSliderValue,
    setTempSliderValue,
    handleRangeFilterApi,
    prodListType,
    cookie,
    setIsShowBtn,
    show,
    setShow,
    setAppliedRange,
  }) => {
    try {
      const res1 = await FilterListAPI(prodListType, cookie);
      const optionsRaw = res1?.find((f) => f?.Name === filterName)?.options;

      if (optionsRaw) {
        const { Min = 0, Max = 100 } = JSON.parse(optionsRaw)?.[0] || {};
        const resetValue = [Min, Max];
        setSliderValue(resetValue);
        setTempSliderValue(resetValue);
        handleRangeFilterApi("");
        setAppliedRange(["", ""]);
        // handleRangeFilterApi(resetValue);
        setIsShowBtn?.(false);
        if (show) setShow(false);
      }
    } catch (error) {
      console.error(`Failed to reset filter "${filterName}":`, error);
    }
  };

  const RangeFilterView = ({
    ele,
    sliderValue,
    setSliderValue,
    handleRangeFilterApi,
    prodListType,
    cookie,
    setShow,
    show,
    setAppliedRange1,
    appliedRange1,
  }) => {
    const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
    const min = Number(parsedOptions.Min || 0); // Ensure min is a number
    const max = Number(parsedOptions.Max || 100);
    const [tempSliderValue, setTempSliderValue] = useState(sliderValue);
    const [isShowBtn, setIsShowBtn] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
      inputRefs.current = tempSliderValue.map(
        (_, i) => inputRefs.current[i] ?? React.createRef(),
      );
    }, [tempSliderValue]);

    const handleKeyDown = (index) => (e) => {
      if (e.key === "Enter") {
        if (index < tempSliderValue.length - 1) {
          inputRefs.current[index + 1]?.current?.focus();
        } else {
          handleSave(); // last input triggers apply
        }
      }
    };

    useEffect(() => {
      if (Array.isArray(sliderValue) && sliderValue.length === 2) {
        setTempSliderValue(sliderValue);
      }
    }, [sliderValue]);

    const handleInputChange = (index) => (event) => {
      const value = event.target.value === "" ? "" : Number(event.target.value);
      const updated = [...tempSliderValue];
      updated[index] = value;
      setTempSliderValue(updated);
      setIsShowBtn(
        updated[0] !== sliderValue[0] || updated[1] !== sliderValue[1],
      );
    };

    const handleSliderChange = (_, newValue) => {
      setTempSliderValue(newValue);
      setIsShowBtn(
        newValue[0] !== sliderValue[0] || newValue[1] !== sliderValue[1],
      );
    };

    const handleSave = () => {
      const [minDiaWt, maxDiaWt] = tempSliderValue;

      // Empty or undefined
      if (
        minDiaWt == null ||
        maxDiaWt == null ||
        minDiaWt === "" ||
        maxDiaWt === ""
      ) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Not a number
      if (isNaN(minDiaWt) || isNaN(maxDiaWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Negative values
      if (minDiaWt < 0 || maxDiaWt < 0) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Equal values
      if (Number(minDiaWt) === Number(maxDiaWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Min > Max
      if (Number(minDiaWt) > Number(maxDiaWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Below actual min
      if (minDiaWt < min) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Above actual max
      if (maxDiaWt > max) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      setSliderValue(tempSliderValue);
      setTempSliderValue(tempSliderValue);
      handleRangeFilterApi(tempSliderValue);
      setIsShowBtn(false);
      setAppliedRange1([min, max]);
      setShow(true);
    };

    return (
      <div style={{ position: "relative" }}>
        {appliedRange1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
              position: "absolute",
              top: "-12px",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange1[0] !== "" ? `Min: ${appliedRange1[0]}` : ""}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange1[1] !== "" ? `Max: ${appliedRange1[1]}` : ""}
            </Typography>
          </div>
        )}

        <Slider
          value={tempSliderValue}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={0.001}
          disableSwap
          valueLabelDisplay="off"
          sx={{
            marginTop: "12px",
            color: "#7d7f85",
            height: 4,
            p: "12px 0",
            "& .MuiSlider-thumb": {
              height: 16,
              width: 16,
              backgroundColor: "#7d7f85",
              border: "2px solid #ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
              "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                boxShadow: "0 0 0 6px rgba(125, 127, 133, 0.16)",
              },
            },
            "& .MuiSlider-track": { height: 4, border: "none" },
            "& .MuiSlider-rail": { color: "#E0E0E0", opacity: 1, height: 4 },
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
            mt: 1.5,
          }}
        >
          {tempSliderValue.map((val, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#FAFAFA",
                border: "1px solid #E5E5E5",
                borderRadius: "6px",
                px: 1,
                py: 0.3,
                width: "46%",
              }}
            >
              <Input
                disableUnderline
                value={val}
                inputRef={inputRefs.current[index]}
                onKeyDown={handleKeyDown(index)}
                onChange={handleInputChange(index)}
                inputProps={{ step: 0.001, min, max, type: "number" }}
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#333",
                  width: "100%",
                  "& input": { textAlign: "center", py: 0.3 },
                }}
              />
            </Box>
          ))}
        </Box>

        <Stack direction="row" justifyContent="flex-end" gap={1} mt={1.5}>
          {show && (
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderColor: "#E0E0E0",
                color: "#666",
                fontSize: "11px",
                borderRadius: "16px",
                px: 2,
                py: 0.2,
                textTransform: "none",
                ":hover": { borderColor: "#999", bgcolor: "#FAFAFA" },
              }}
              onClick={() =>
                resetRangeFilter({
                  filterName: "Diamond",
                  setSliderValue: setSliderValue,
                  setTempSliderValue,
                  handleRangeFilterApi: handleRangeFilterApi,
                  prodListType,
                  cookie,
                  setIsShowBtn,
                  show: show,
                  setShow: setShow,
                  setAppliedRange: setAppliedRange1,
                })
              }
            >
              Reset
            </Button>
          )}
          {isShowBtn && (
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: "#7d7f85",
                color: "#FFF",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "16px",
                px: 2,
                py: 0.2,
                textTransform: "none",
                ":hover": { bgcolor: "#5a5c60" },
              }}
            >
              Apply
            </Button>
          )}
        </Stack>
      </div>
    );
  };

  const RangeFilterView1 = ({
    ele,
    sliderValue1,
    setSliderValue1,
    handleRangeFilterApi1,
    prodListType,
    cookie,
    show1,
    setShow1,
    setAppliedRange2,
    appliedRange2,
  }) => {
    const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
    const min = parsedOptions.Min || "";
    const max = parsedOptions.Max || "";
    const [tempSliderValue, setTempSliderValue] = useState(sliderValue1);
    const [isShowBtn, setIsShowBtn] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
      inputRefs.current = tempSliderValue.map(
        (_, i) => inputRefs.current[i] ?? React.createRef(),
      );
    }, [tempSliderValue]);

    const handleKeyDown = (index) => (e) => {
      if (e.key === "Enter") {
        if (index < tempSliderValue.length - 1) {
          inputRefs.current[index + 1]?.current?.focus();
        } else {
          handleSave(); // last input triggers apply
        }
      }
    };

    useEffect(() => {
      if (Array.isArray(sliderValue1) && sliderValue1.length === 2) {
        setTempSliderValue(sliderValue1);
      }
    }, [sliderValue1]);

    useEffect(() => {
      if (Array.isArray(sliderValue1) && sliderValue1.length === 2) {
        setTempSliderValue(sliderValue1);
      }
    }, [sliderValue1]);

    const handleInputChange = (index) => (event) => {
      const newValue =
        event.target.value === "" ? "" : Number(event.target.value);
      const updated = [...tempSliderValue];
      updated[index] = newValue;
      setTempSliderValue(updated);
      setIsShowBtn(
        updated[0] !== sliderValue1[0] || updated[1] !== sliderValue1[1],
      );
    };

    const handleSliderChange = (_, newValue) => {
      setTempSliderValue(newValue);
      setIsShowBtn(
        newValue[0] !== sliderValue1[0] || newValue[1] !== sliderValue1[1],
      );
    };

    const handleSave = () => {
      const [minNetWt, maxNetWt] = tempSliderValue;

      if (
        minNetWt == null ||
        maxNetWt == null ||
        minNetWt === "" ||
        maxNetWt === ""
      ) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (isNaN(minNetWt) || isNaN(maxNetWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (minNetWt < 0 || maxNetWt < 0) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // 👇 New specific validation
      if (Number(minNetWt) === Number(maxNetWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (Number(minNetWt) > Number(maxNetWt)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (minNetWt < min) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (maxNetWt > max) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      setSliderValue1(tempSliderValue);
      setTempSliderValue(tempSliderValue);
      handleRangeFilterApi1(tempSliderValue);
      setAppliedRange2([min, max]);

      setIsShowBtn(false);
      setShow1(true);
    };

    return (
      <div style={{ position: "relative" }}>
        {appliedRange2 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
              position: "absolute",
              top: "-12px",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange2[0] !== "" ? `Min: ${appliedRange2[0]}` : ""}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange2[1] !== "" ? `Max: ${appliedRange2[1]}` : ""}
            </Typography>
          </div>
        )}

        <Slider
          value={tempSliderValue}
          onChange={handleSliderChange}
          valueLabelDisplay="off"
          min={min}
          max={max}
          step={0.001}
          disableSwap
          sx={{
            marginTop: "12px",
            color: "#7d7f85",
            height: 4,
            p: "12px 0",
            "& .MuiSlider-thumb": {
              height: 16,
              width: 16,
              backgroundColor: "#7d7f85",
              border: "2px solid #ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
              "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                boxShadow: "0 0 0 6px rgba(125, 127, 133, 0.16)",
              },
            },
            "& .MuiSlider-track": { height: 4, border: "none" },
            "& .MuiSlider-rail": { color: "#E0E0E0", opacity: 1, height: 4 },
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
            mt: 1.5,
          }}
        >
          {tempSliderValue.map((val, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#FAFAFA",
                border: "1px solid #E5E5E5",
                borderRadius: "6px",
                px: 1,
                py: 0.3,
                width: "46%",
              }}
            >
              <Input
                disableUnderline
                inputRef={inputRefs.current[index]}
                onKeyDown={handleKeyDown(index)}
                value={val}
                onChange={handleInputChange(index)}
                inputProps={{ step: 0.001, min, max, type: "number" }}
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#333",
                  width: "100%",
                  "& input": { textAlign: "center", py: 0.3 },
                }}
              />
            </Box>
          ))}
        </Box>
        <Stack direction="row" justifyContent="flex-end" gap={1} mt={1.5}>
          {show1 && (
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderColor: "#E0E0E0",
                color: "#666",
                fontSize: "11px",
                borderRadius: "16px",
                px: 2,
                py: 0.2,
                textTransform: "none",
                ":hover": { borderColor: "#999", bgcolor: "#FAFAFA" },
              }}
              onClick={() =>
                resetRangeFilter({
                  filterName: "NetWt",
                  setSliderValue: setSliderValue1,
                  setTempSliderValue,
                  handleRangeFilterApi: handleRangeFilterApi1,
                  prodListType,
                  cookie,
                  setIsShowBtn,
                  show: show1,
                  setShow: setShow1,
                  setAppliedRange: setAppliedRange2,
                })
              }
            >
              Reset
            </Button>
          )}
          {isShowBtn && (
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: "#7d7f85",
                color: "#FFF",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "16px",
                px: 2,
                py: 0.2,
                textTransform: "none",
                ":hover": { bgcolor: "#5a5c60" },
              }}
            >
              Apply
            </Button>
          )}
        </Stack>
      </div>
    );
  };

  const RangeFilterView2 = ({
    ele,
    sliderValue2,
    setSliderValue2,
    handleRangeFilterApi2,
    prodListType,
    cookie,
    show2,
    setShow2,
    setAppliedRange3,
    appliedRange3,
  }) => {
    const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
    const min = parsedOptions.Min ?? "";
    const max = parsedOptions.Max ?? "";
    const [tempSliderValue, setTempSliderValue] = useState(sliderValue2);
    const [isShowBtn, setIsShowBtn] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
      inputRefs.current = tempSliderValue.map(
        (_, i) => inputRefs.current[i] ?? React.createRef(),
      );
    }, [tempSliderValue]);

    const handleKeyDown = (index) => (e) => {
      if (e.key === "Enter") {
        if (index < tempSliderValue.length - 1) {
          inputRefs.current[index + 1]?.current?.focus();
        } else {
          handleSave(); // last input triggers apply
        }
      }
    };

    useEffect(() => {
      if (Array.isArray(sliderValue2) && sliderValue2.length === 2) {
        setTempSliderValue(sliderValue2);
      }
    }, [sliderValue2]);

    const handleInputChange = (index) => (event) => {
      const newValue =
        event.target.value === "" ? "" : Number(event.target.value);
      const updated = [...tempSliderValue];
      updated[index] = newValue;
      setTempSliderValue(updated);
      setIsShowBtn(
        updated[0] !== sliderValue2[0] || updated[1] !== sliderValue2[1],
      );
    };

    const handleSliderChange = (_, newValue) => {
      setTempSliderValue(newValue);
      setIsShowBtn(
        newValue[0] !== sliderValue2[0] || newValue[1] !== sliderValue2[1],
      );
    };

    const handleSave = () => {
      const [minWeight, maxWeight] = tempSliderValue;

      // Validation: Empty or undefined
      if (
        minWeight == null ||
        maxWeight == null ||
        minWeight === "" ||
        maxWeight === ""
      ) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Not a number
      if (isNaN(minWeight) || isNaN(maxWeight)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Negative values
      if (minWeight < 0 || maxWeight < 0) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // 👇 New specific validation
      if (Number(minWeight) === Number(maxWeight)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Min > Max
      if (Number(minWeight) > Number(maxWeight)) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // Validation: Range must stay within allowed min and max
      if (minWeight < min) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      if (maxWeight > max) {
        toast.error("Please enter valid range values.", {
          hideProgressBar: true,
          duration: 5000,
        });
        return;
      }

      // If validation passes, update the parent state and handle the API call
      setSliderValue2(tempSliderValue);
      setTempSliderValue(tempSliderValue);
      handleRangeFilterApi2(tempSliderValue);
      setAppliedRange3([min, max]);
      setIsShowBtn(false);
      setShow2(true);
    };

    return (
      <div style={{ position: "relative" }}>
        {appliedRange3 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
              position: "absolute",
              top: "-12px",
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange3[0] !== "" ? `Min: ${appliedRange3[0]}` : ""}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="11px"
            >
              {appliedRange3[1] !== "" ? `Max: ${appliedRange3[1]}` : ""}
            </Typography>
          </div>
        )}

        <Slider
          value={tempSliderValue}
          onChange={handleSliderChange}
          valueLabelDisplay="off"
          min={min}
          max={max}
          step={0.001}
          disableSwap
          sx={{
            marginTop: "12px",
            color: "#7d7f85",
            height: 4,
            p: "12px 0",
            "& .MuiSlider-thumb": {
              height: 16,
              width: 16,
              backgroundColor: "#7d7f85",
              border: "2px solid #ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
              "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                boxShadow: "0 0 0 6px rgba(125, 127, 133, 0.16)",
              },
            },
            "& .MuiSlider-track": { height: 4, border: "none" },
            "& .MuiSlider-rail": { color: "#E0E0E0", opacity: 1, height: 4 },
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
            mt: 1.5,
          }}
        >
          {tempSliderValue.map((val, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#FAFAFA",
                border: "1px solid #E5E5E5",
                borderRadius: "6px",
                px: 1,
                py: 0.3,
                width: "46%",
              }}
            >
              <Input
                disableUnderline
                inputRef={inputRefs.current[index]}
                value={val}
                onKeyDown={handleKeyDown(index)}
                onChange={handleInputChange(index)}
                inputProps={{ step: 0.001, type: "number" }}
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#333",
                  width: "100%",
                  "& input": { textAlign: "center", py: 0.3 },
                }}
              />
            </Box>
          ))}
        </Box>

        <Stack direction="row" justifyContent="flex-end" gap={1} mt={1.5}>
          {show2 && (
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderColor: "#E0E0E0",
                color: "#666",
                fontSize: "11px",
                borderRadius: "16px",
                px: 2,
                py: 0.2,
                textTransform: "none",
                ":hover": { borderColor: "#999", bgcolor: "#FAFAFA" },
              }}
              onClick={() =>
                resetRangeFilter({
                  filterName: "Gross",
                  setSliderValue: setSliderValue2,
                  setTempSliderValue,
                  handleRangeFilterApi: handleRangeFilterApi2,
                  prodListType,
                  cookie,
                  setIsShowBtn,
                  show: show2,
                  setShow: setShow2,
                  setAppliedRange: setAppliedRange3,
                })
              }
            >
              Reset
            </Button>
          )}
          {isShowBtn && (
            <Button
              size="small"
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: "#7d7f85",
                color: "#FFF",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "16px",
                px: 2,
                py: 0.2,
                textTransform: "none",
                ":hover": { bgcolor: "#5a5c60" },
              }}
            >
              Apply
            </Button>
          )}
        </Stack>
      </div>
    );
  };

  const DynamicListPageTitleLineFunc = () => {
    if (location?.search.split("=")[0]?.slice(1) == "M") {
      return menuParams?.menuname;
    } else {
      return location?.pathname.split("/")[2];
    }
  };

  const BreadCumsObj = () => {
    let BreadCum = decodeURI(atob(location?.search.slice(3))).split("/");
    const values = BreadCum[0].split(",");
    const labels = BreadCum[1].split(",");

    const updatedBreadCum = labels.reduce((acc, label, index) => {
      acc[label] = values[index] || "";
      return acc;
    }, {});

    const result = Object.entries(updatedBreadCum).reduce(
      (acc, [key, value], index) => {
        acc[`FilterKey${index === 0 ? "" : index}`] =
          key.charAt(0).toUpperCase() + key.slice(1);
        acc[`FilterVal${index === 0 ? "" : index}`] = value;
        return acc;
      },
      {},
    );

    result.menuname = decodeURI(location?.pathname)
      .slice(3)
      .slice(0, -1)
      .split("/")[0];

    return result;
  };

  const showClearAllButton = () => {
    let diafilter =
      filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options?.length >
      0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Diamond")[0]?.options,
          )[0]
        : [];
    let diafilter1 =
      filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "NetWt")[0]?.options,
          )[0]
        : [];
    let diafilter2 =
      filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options?.length > 0
        ? JSON.parse(
            filterData?.filter((ele) => ele?.Name == "Gross")[0]?.options,
          )[0]
        : [];
    const isFilterChecked = Object.values(filterChecked).some(
      (ele) => ele.checked,
    );
    const isSliderChanged =
      JSON.stringify(sliderValue) !==
        JSON.stringify(
          diafilter?.Min != null || diafilter?.Max != null
            ? [diafilter?.Min, diafilter?.Max]
            : [],
        ) ||
      JSON.stringify(sliderValue1) !==
        JSON.stringify(
          diafilter1?.Min != null || diafilter1?.Max != null
            ? [diafilter1?.Min, diafilter1?.Max]
            : [],
        ) ||
      JSON.stringify(sliderValue2) !==
        JSON.stringify(
          diafilter2?.Min != null || diafilter2?.Max != null
            ? [diafilter2?.Min, diafilter2?.Max]
            : [],
        );

    return isFilterChecked || isSliderChanged;
  };

  const FilterOptionsList = memo(
    ({ options, eleId, filterChecked, handleCheckboxChange }) => {
      const [showMore, setShowMore] = useState(false);
      const INITIAL_COUNT = 5;

      const displayOptions = showMore
        ? options
        : options?.slice(0, INITIAL_COUNT);
      const hasMore = options?.length > INITIAL_COUNT;

      return (
        <Box>
          {displayOptions?.map((opt) => (
            <Box
              key={opt?.id}
              sx={{ display: "flex", alignItems: "center", py: 0.15 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name={`${eleId}${opt?.id}`}
                    checked={Boolean(
                      filterChecked[`${eleId}${opt?.id}`]?.checked,
                    )}
                    onChange={(e) => handleCheckboxChange(e, eleId, opt?.Name)}
                    size="small"
                    sx={{
                      color: "#A0A0A0",
                      "&.Mui-checked": { color: "#000000" },
                      p: 0.4,
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#222",
                      ml: 0.6,
                      fontWeight: 450,
                      lineHeight: 1.35,
                    }}
                  >
                    {opt.Name}
                  </Typography>
                }
                sx={{ ml: -0.4, mr: 0, my: 0.1 }}
              />
            </Box>
          ))}
          {hasMore && (
            <Box sx={{ pt: 0.8, pl: 0.4 }}>
              <Typography
                onClick={() => setShowMore(!showMore)}
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#E26B00",
                  cursor: "pointer",
                  display: "inline-block",
                  userSelect: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {showMore ? "View Less" : "View More"}
              </Typography>
            </Box>
          )}
        </Box>
      );
    },
  );
  FilterOptionsList.displayName = "FilterOptionsList";

  const FilterPriceList = memo(
    ({
      options,
      eleId,
      filterChecked,
      handleCheckboxChange,
      loginUserDetail,
      storeInit,
      formatter,
    }) => {
      const [showMore, setShowMore] = useState(false);
      const INITIAL_COUNT = 5;

      const displayOptions = showMore
        ? options
        : options?.slice(0, INITIAL_COUNT);
      const hasMore = options?.length > INITIAL_COUNT;

      return (
        <Box>
          {displayOptions?.map((opt, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", py: 0.15 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name={`Price${i}${i}`}
                    checked={Boolean(filterChecked[`Price${i}${i}`]?.checked)}
                    onChange={(e) => handleCheckboxChange(e, eleId, opt)}
                    size="small"
                    sx={{
                      color: "#A0A0A0",
                      "&.Mui-checked": { color: "#000000" },
                      p: 0.4,
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#222",
                      ml: 0.6,
                      fontWeight: 450,
                      lineHeight: 1.35,
                    }}
                  >
                    {opt?.Minval == 0
                      ? `Under ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${formatter.format(opt?.Maxval)}`
                      : opt?.Maxval == 0
                        ? `Over ${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${formatter.format(opt?.Minval)}`
                        : `${loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode} ${formatter.format(opt?.Minval)} - ${formatter.format(opt?.Maxval)}`}
                  </Typography>
                }
                sx={{ ml: -0.4, mr: 0, my: 0.1 }}
              />
            </Box>
          ))}
          {hasMore && (
            <Box sx={{ pt: 0.8, pl: 0.4 }}>
              <Typography
                onClick={() => setShowMore(!showMore)}
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#E26B00",
                  cursor: "pointer",
                  display: "inline-block",
                  userSelect: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {showMore ? "View Less" : "View More"}
              </Typography>
            </Box>
          )}
        </Box>
      );
    },
  );
  FilterPriceList.displayName = "FilterPriceList";

  const renderFilterAccordionsList = () => {
    return filterData?.map((ele) => (
      <React.Fragment key={ele?.id || ele?.Fil_DisName}>
        {!ele?.id?.includes("Range") && !ele?.id?.includes("Price") && (
          <Paper
            elevation={0}
            sx={{
              p: 1.6,
              mb: 1.4,
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
              border: "1px solid #000000",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Typography
              sx={{ fontSize: "15px", fontWeight: 600, color: "#222", mb: 1 }}
            >
              {ele.Fil_DisName}
            </Typography>
            <FilterOptionsList
              options={JSON.parse(ele?.options) ?? []}
              eleId={ele?.id}
              filterChecked={filterChecked}
              handleCheckboxChange={handleCheckboxChange}
            />
          </Paper>
        )}

        {storeInit?.IsPriceShow == 1 && ele?.id?.includes("Price") && (
          <Paper
            elevation={0}
            sx={{
              p: 1.6,
              mb: 1.4,
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
              border: "1px solid #000000",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Typography
              sx={{ fontSize: "15px", fontWeight: 600, color: "#222", mb: 1 }}
            >
              {ele.Fil_DisName}
            </Typography>
            <FilterPriceList
              options={JSON.parse(ele?.options) ?? []}
              eleId={ele?.id}
              filterChecked={filterChecked}
              handleCheckboxChange={handleCheckboxChange}
              loginUserDetail={loginUserDetail}
              storeInit={storeInit}
              formatter={formatter}
            />
          </Paper>
        )}

        {ele?.Name?.includes("Diamond") && (
          <Paper
            elevation={0}
            sx={{
              p: 1.6,
              mb: 1.4,
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
              border: "1px solid #000000",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Typography
              sx={{ fontSize: "15px", fontWeight: 600, color: "#222", mb: 1 }}
            >
              {ele.Fil_DisName}
            </Typography>
            <Box sx={{ width: "100%", pt: 0.5 }}>
              <RangeFilterView
                ele={ele}
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
                handleRangeFilterApi={handleRangeFilterApi}
                prodListType={prodListType}
                cookie={cookie}
                show={show}
                setShow={setShow}
                appliedRange1={appliedRange1}
                setAppliedRange1={setAppliedRange1}
              />
            </Box>
          </Paper>
        )}

        {ele?.Name?.includes("NetWt") && (
          <Paper
            elevation={0}
            sx={{
              p: 1.6,
              mb: 1.4,
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
              border: "1px solid #000000",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Typography
              sx={{ fontSize: "15px", fontWeight: 600, color: "#222", mb: 1 }}
            >
              {ele.Fil_DisName}
            </Typography>
            <Box sx={{ width: "100%", pt: 0.5 }}>
              <RangeFilterView1
                ele={ele}
                sliderValue1={sliderValue1}
                setSliderValue1={setSliderValue1}
                handleRangeFilterApi1={handleRangeFilterApi1}
                prodListType={prodListType}
                cookie={cookie}
                show1={show1}
                setShow1={setShow1}
                appliedRange2={appliedRange2}
                setAppliedRange2={setAppliedRange2}
              />
            </Box>
          </Paper>
        )}

        {ele?.Name?.includes("Gross") && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 1.8,
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
              border: "1px solid #000000",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Typography
              sx={{ fontSize: "15px", fontWeight: 600, color: "#222", mb: 1 }}
            >
              {ele.Fil_DisName}
            </Typography>
            <Box sx={{ width: "100%", pt: 0.5 }}>
              <RangeFilterView2
                ele={ele}
                sliderValue2={sliderValue2}
                setSliderValue2={setSliderValue2}
                handleRangeFilterApi2={handleRangeFilterApi2}
                prodListType={prodListType}
                cookie={cookie}
                show2={show2}
                setShow2={setShow2}
                appliedRange3={appliedRange3}
                setAppliedRange3={setAppliedRange3}
              />
            </Box>
          </Paper>
        )}
      </React.Fragment>
    ));
  };

  const renderCustomizationCombos = () => {
    const isMetal = storeInit?.IsMetalCustComb === 1;
    const isDia = storeInit?.IsDiamondCustComb === 1;
    const isCs = storeInit?.IsCsCustomization === 1;

    if (!isMetal && !isDia && !isCs) return null;

    return (
      <Box
        sx={{
          display: "flex",
          gap: 1.2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {isMetal && (
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <Select
              value={selectedMetalId || ""}
              onChange={(e) => setSelectedMetalId(e.target.value)}
              sx={{
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                height: "36px",
                bgcolor: "#000000",
                color: "#FFFFFF",
                "& .MuiSelect-icon": { color: "#FFFFFF" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000000",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#222222",
                },
              }}
            >
              {metalTypeCombo?.map((metalele) => (
                <MenuItem
                  key={metalele?.Metalid}
                  value={metalele?.Metalid}
                  sx={{ fontSize: "12px" }}
                >
                  {metalele?.metaltype.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {isDia && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={selectedDiaId || ""}
              onChange={(e) => setSelectedDiaId(e.target.value)}
              sx={{
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                height: "36px",
                bgcolor: "#000000",
                color: "#FFFFFF",
                "& .MuiSelect-icon": { color: "#FFFFFF" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000000",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#222222",
                },
              }}
            >
              {diaQcCombo?.map((diaQc) => (
                <MenuItem
                  key={diaQc?.QualityId}
                  value={`${diaQc?.QualityId},${diaQc?.ColorId}`}
                  sx={{ fontSize: "12px" }}
                >
                  {`${diaQc.Quality.toUpperCase()}, ${diaQc.color.toLowerCase()}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {isCs && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={selectedCsId || ""}
              onChange={(e) => setSelectedCsId(e.target.value)}
              sx={{
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                height: "36px",
                bgcolor: "#000000",
                color: "#FFFFFF",
                "& .MuiSelect-icon": { color: "#FFFFFF" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000000",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#222222",
                },
              }}
            >
              {csQcCombo?.map((csCombo) => (
                <MenuItem
                  key={csCombo?.QualityId}
                  value={`${csCombo?.QualityId},${csCombo?.ColorId}`}
                  sx={{ fontSize: "12px" }}
                >
                  {`${csCombo.Quality.toUpperCase()}, ${csCombo.color.toLowerCase()}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    );
  };

  const activeCheckedList = Object.entries(filterChecked).filter(
    ([_, val]) => val?.checked,
  );

  return (
    <>
      <title>{decodeURI(DynamicListPageTitleLineFunc())}</title>
      <Box id="top" sx={{ minHeight: "100vh", pb: { xs: 6, md: 10 }, mb: 4 }}>
        {/* Mobile Filter Drawer */}
        <Drawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          PaperProps={{ sx: { width: "85%", maxWidth: "340px", p: 2 } }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 1.5,
              borderBottom: "1px solid #EEE",
            }}
          >
            <Typography
              sx={{ fontWeight: 700, fontSize: "16px", color: "#222" }}
            >
              FILTERS {showClearAllButton() && `(${activeCheckedList.length})`}
            </Typography>
            <IconButton size="small" onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ mt: 2 }}>{renderFilterAccordionsList()}</Box>
        </Drawer>

        {/* Top Header Controls Bar */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: 2.5,
            bgcolor: "#FFFFFF",
            borderTop: "0",
            position: "sticky",
            top: "90px",
            zIndex: 100,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            {/* Title & Back button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton
                size="small"
                onClick={() => navigate.back()}
                sx={{ bgcolor: "#F5F5F7", ":hover": { bgcolor: "#EAEAEF" } }}
              >
                <IoArrowBack size={18} color="#444" />
              </IconButton>
              <Typography
                sx={{
                  fontSize: { xs: "16px", sm: "20px" },
                  fontWeight: 700,
                  color: "#111",
                }}
              >
                {decodeURIComponent(
                  location.pathname?.split("/p/")[1]?.split("/")[0] ||
                    DynamicListPageTitleLineFunc() ||
                    "Products",
                )}
              </Typography>
              {afterFilterCount !== undefined && (
                <Chip
                  label={
                    afterCountStatus ? "..." : `${afterFilterCount} Designs`
                  }
                  size="small"
                  sx={{
                    bgcolor: "rgba(125, 127, 133, 0.1)",
                    color: "#7d7f85",
                    fontWeight: 600,
                    fontSize: "12px",
                  }}
                />
              )}
            </Box>

            {/* Customization Combos & Sort Dropdown */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              {renderCustomizationCombos()}

              {/* Sort By Dropdown */}
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={sortBySelect || "Recommended"}
                  onChange={(e) => handleSortby(e)}
                  sx={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    height: "36px",
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                    "& .MuiSelect-icon": { color: "#FFFFFF" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#000000",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#222222",
                    },
                  }}
                >
                  <MenuItem value="Recommended" sx={{ fontSize: "12px" }}>
                    Sort By: Recommended
                  </MenuItem>
                  {storeInit?.IsStockWebsite == 1 && (
                    <MenuItem value="In Stock" sx={{ fontSize: "12px" }}>
                      Sort By: In Stock
                    </MenuItem>
                  )}
                  <MenuItem value="PRICE HIGH TO LOW" sx={{ fontSize: "12px" }}>
                    Price: High To Low
                  </MenuItem>
                  <MenuItem value="PRICE LOW TO HIGH" sx={{ fontSize: "12px" }}>
                    Price: Low To High
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Mobile Filter Toggle Button */}
              {filterData?.length > 0 && !minwidth1201px && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FilterAltIcon sx={{ color: "#000000" }} />}
                  onClick={() => setIsDrawerOpen(true)}
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#000000",
                    color: "#000000",
                    fontWeight: 600,
                    fontSize: "12px",
                    height: "36px",
                  }}
                >
                  Filters{" "}
                  {showClearAllButton() && `(${activeCheckedList.length})`}
                </Button>
              )}
            </Box>
          </Box>

          {/* Active Applied Filter Tags / Chips */}
          {(activeCheckedList.length > 0 || showClearAllButton()) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
                mt: 1.5,
                pt: 1.5,
                borderTop: "1px solid #F0F0F0",
              }}
            >
              <Typography
                sx={{ fontSize: "12px", fontWeight: 600, color: "#777" }}
              >
                Applied Filters:
              </Typography>
              {activeCheckedList.map(([key, val]) => {
                let chipLabel = "";
                if (typeof val?.value === "object" && val?.value !== null) {
                  const { Minval, Maxval } = val.value;
                  const currency = loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode ?? "";
                  if (Minval !== undefined && Maxval !== undefined) {
                    if (Number(Minval) === 0) {
                      chipLabel = `Under ${currency} ${formatter.format(Maxval)}`;
                    } else if (Number(Maxval) === 0) {
                      chipLabel = `Over ${currency} ${formatter.format(Minval)}`;
                    } else {
                      chipLabel = `${currency} ${formatter.format(Minval)} - ${formatter.format(Maxval)}`;
                    }
                  } else {
                    chipLabel = JSON.stringify(val.value);
                  }
                } else {
                  chipLabel = String(val?.value ?? "");
                }
                return (
                  <Chip
                    key={key}
                    label={chipLabel}
                    onDelete={() =>
                      handleCheckboxChange(
                        { target: { checked: false, name: key } },
                        val?.type,
                        val?.value,
                      )
                    }
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: "16px",
                      borderColor: "#7d7f85",
                      color: "#7d7f85",
                      bgcolor: "rgba(125, 127, 133, 0.08)",
                      fontWeight: 500,
                      fontSize: "11px",
                      "& .MuiChip-deleteIcon": {
                        color: "#7d7f85",
                        ":hover": { color: "#5a5c60" },
                      },
                    }}
                  />
                );
              })}
              <Typography
                onClick={handelFilterClearAll}
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#7d7f85",
                  cursor: "pointer",
                  ml: 1,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                CLEAR ALL
              </Typography>
            </Box>
          )}
        </Paper>
        {/* Main Grid Layout */}
        {isProdLoading || isOnlyProdLoading ? (
          <ProductListSkeleton />
        ) : (
          <Grid container spacing={2}>
            {/* Desktop Left Sidebar Filters Grid Item */}
            {filterData?.length > 0 && (
              <Grid
                size={{ xs: 12, md: 2.6, lg: 2.2 }}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <Box
                  sx={{
                    position: "sticky",
                    top: "170px",
                    maxHeight: "100vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                    pr: 0.5,
                    transition: "top 0.25s ease, max-height 0.25s ease",
                    "&::-webkit-scrollbar": {
                      width: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#D1D1D1",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "transparent",
                    },
                           pl:2,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.6,
                      mb: 1.4,
                      borderRadius: "12px",
                      bgcolor: "#FFFFFF",
                      border: "1px solid #000000",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
               
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "15px",
                        color: "#111",
                        letterSpacing: "0.5px",
                      }}
                    >
                      FILTERS{" "}
                      {showClearAllButton() && `(${activeCheckedList.length})`}
                    </Typography>
                    {showClearAllButton() && (
                      <Typography
                        onClick={handelFilterClearAll}
                        sx={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#E26B00",
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        CLEAR ALL
                      </Typography>
                    )}
                  </Paper>
                  {renderFilterAccordionsList()}
                </Box>
              </Grid>
            )}
            <Grid
              size={{
                xs: 12,
                md: filterData?.length > 0 ? 9.4 : 12,
                lg: filterData?.length > 0 ? 9.8 : 12,
              }}
            >
              {filterProdListEmpty ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 8,
                    textAlign: "center",
                    borderRadius: "16px",
                    bgcolor: "#FFFFFF",
                    border: "1px solid #EDEDED",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    No Products Found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, mb: 3 }}
                  >
                    Try relaxing your search or clear filters to see more
                    results.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handelFilterClearAll}
                    sx={{
                      bgcolor: "#7d7f85",
                      borderRadius: "20px",
                      px: 4,
                      ":hover": { bgcolor: "#5a5c60" },
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={1.5}>
                  {finalProductListData?.map((productData, i) => (
                    <Grid
                      key={i}
                      size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}
                      sx={{ display: "flex" }}
                    >
                      <Product_Card
                        productData={productData}
                        setIsRollOverVideo={setIsRollOverVideo}
                        handleImgRollover={handleImgRollover}
                        handleMoveToDetail={handleMoveToDetail}
                        i={i}
                        videoUrl={getDynamicVideo(
                          productData.designno,
                          productData.VideoCount,
                          productData.VideoExtension,
                        )}
                        RollImageUrl={getDynamicRollImages(
                          productData.designno,
                          productData.ImageCount,
                          productData.ImageExtension,
                        )}
                        imageUrl={getDynamicImages(
                          productData.designno,
                          productData.ImageExtension,
                        )}
                        handleLeaveImgRolloverImg={handleLeaveImgRolloverImg}
                        isRollOverVideo={isRollOverVideo}
                        storeInit={storeInit}
                        rollOverImgPd={rollOverImgPd}
                        loginUserDetail={loginUserDetail}
                        formatter={formatter}
                        handleCartandWish={handleCartandWish}
                        cartArr={cartArr}
                        wishArr={wishArr}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Pagination Controls */}
              {storeInit?.IsProductListPagination == 1 &&
                Math.ceil(afterFilterCount / storeInit.PageSize) > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 4,
                      mb: 2,
                      width: "100%",
                    }}
                  >
                    {isEditablePage === 1 ? (
                      <EditablePagination
                        currentPage={currPage}
                        totalItems={afterFilterCount || 0}
                        itemsPerPage={storeInit?.PageSize || 60}
                        onPageChange={handelPageChange}
                        inputPage={inputPage}
                        setInputPage={setInputPage}
                        handlePageInputChange={handlePageInputChange}
                        maxwidth464px={maxwidth464px}
                        totalPages={totalPages}
                        currPage={currPage}
                        isShowButton={false}
                      />
                    ) : (
                      <Pagination
                        count={Math.ceil(afterFilterCount / storeInit.PageSize)}
                        size={maxwidth464px ? "small" : "large"}
                        shape="circular"
                        onChange={handelPageChange}
                        page={currPage}
                        showFirstButton
                        showLastButton
                        renderItem={(item) => (
                          <PaginationItem
                            {...item}
                            sx={{
                              "&.Mui-selected": {
                                bgcolor: "#DE0090",
                                color: "#FFF",
                                ":hover": { bgcolor: "#b00072" },
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  </Box>
                )}
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default memo(ProductList);

const Product_Card = ({
  productData,
  setIsRollOverVideo,
  handleImgRollover,
  handleMoveToDetail,
  i,
  videoUrl,
  RollImageUrl,
  imageUrl,
  handleLeaveImgRolloverImg,
  isRollOverVideo,
  storeInit,
  rollOverImgPd,
  loginUserDetail,
  formatter,
  handleCartandWish,
  cartArr,
  wishArr,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHover, setIsHover] = useState(false);

  const IsMultiVariantCart = storeInit?.IsMultiVariantCart == 0;
  const isWishlisted = Boolean(
    wishArr?.[productData?.autocode] ?? productData?.IsInWish === 1,
  );
  const isCarted = Boolean(
    cartArr?.[productData?.autocode] ?? productData?.IsInCart === 1,
  );

  useEffect(() => {
    const delay = (i + 1) * 80;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [i]);

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      sx={{
        bgcolor: "#FFFFFF",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: "12px",
        p: 1.5,
        border: "1px solid #EAEAEA",
        boxShadow: isHover ? "0 12px 32px rgba(0, 0, 0, 0.14)" : "none",
        transform: isHover ? "translateY(-6px)" : "none",
        zIndex: isHover ? 10 : 1,
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      {/* Top Image Container */}
      <Box
        onClick={() => handleMoveToDetail(productData, i)}
        sx={{
          position: "relative",
          width: "100%",
          pt: "100%", // 1:1 Square aspect ratio like CaratLane
          bgcolor: "#F8F8F9",
          cursor: "pointer",
          overflow: "hidden",
          borderRadius: "8px",
          transition: "all 0.3s ease",
        }}
      >
        {isLoading ? (
          <Skeleton
            animation="wave"
            variant="rectangular"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <>
            {/* Hover Video / Roll Image */}
            {isHover && (videoUrl || RollImageUrl) ? (
              videoUrl ? (
                <video
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={(e) => {
                    e.target.poster = imageNotFound;
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <img
                  src={RollImageUrl || imageUrl}
                  alt={productData?.TitleLine || productData?.designno}
                  onError={(e) => {
                    e.target.src = imageNotFound;
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "8px",
                    transition: "transform 0.4s ease",
                    transform: isHover ? "scale(1.05)" : "scale(1)",
                  }}
                />
              )
            ) : (
              <img
                src={imageUrl}
                alt={productData?.TitleLine || productData?.designno}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = imageNotFound;
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 0.4s ease",
                  transform: isHover ? "scale(1.04)" : "scale(1)",
                }}
              />
            )}
          </>
        )}
      </Box>

      {/* Product Details Section */}
      <CardContent
        sx={{
          p: 0,
          pt: 1.5,
          pb: 0.5,
          "&:last-child": { pb: 0.5 },
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
          bgcolor: "#FFFFFF",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          onClick={() => handleMoveToDetail(productData, i)}
          sx={{ cursor: "pointer" }}
        >
          {/* Prices */}
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {storeInit?.IsPriceShow == 1 && (
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "15px", sm: "16px" },
                  color: "#111111",
                }}
              >
                {(loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode) +
                  " "}
                {formatter.format(productData?.UnitCostWithMarkUp)}
              </Typography>
            )}
          </Box>

          {/* Title & Design Number */}
          <Typography
            noWrap
            sx={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#555555",
              mt: 0.5,
              lineHeight: 1.3,
            }}
          >
            {productData?.TitleLine || productData?.designno}
          </Typography>

          {/* Gross Weight info if available */}
          {productData?.Gwt && (
            <Typography sx={{ fontSize: "11px", color: "#888888", mt: 0.2 }}>
              Gross Wt: {productData?.Gwt}g
            </Typography>
          )}
        </Box>

        {/* CTA Action Button */}
        <Box sx={{ mt: 1.5 }}>
          {IsMultiVariantCart ? (
            <Button
              variant={isCarted ? "contained" : "outlined"}
              fullWidth
              size="small"
              startIcon={
                isCarted ? <LocalMallIcon /> : <LocalMallOutlinedIcon />
              }
              onClick={(e) => {
                e.stopPropagation();
                handleCartandWish(
                  { target: { checked: !isCarted } },
                  productData,
                  "Cart",
                );
              }}
              sx={{
                borderRadius: "4px",
                borderColor: "#7d7f85",
                color: isCarted ? "#FFFFFF" : "#7d7f85",
                bgcolor: isCarted ? "#7d7f85" : "transparent",
                fontWeight: 600,
                fontSize: "11px",
                py: 0.9,
                textTransform: "uppercase",
                ":hover": {
                  borderColor: "#7d7f85",
                  bgcolor: isCarted ? "#5a5c60" : "rgba(125, 127, 133, 0.08)",
                },
              }}
            >
              {isCarted ? "Remove From Cart" : "Add To Cart"}
            </Button>
          ) : (
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleMoveToDetail(productData, i);
              }}
              sx={{
                borderRadius: "4px",
                borderColor: "#7d7f85",
                color: "#7d7f85",
                fontWeight: 600,
                fontSize: "11px",
                py: 0.9,
                textTransform: "uppercase",
                ":hover": {
                  borderColor: "#7d7f85",
                  bgcolor: "rgba(125, 127, 133, 0.08)",
                },
              }}
            >
              View Details
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
