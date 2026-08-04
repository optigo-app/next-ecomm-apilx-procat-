import { getSession } from "../../FetchSessionData";
import { CommonAPI } from "../CommonAPI/CommonAPI";


const ProductListApi = async (filterObj = {}, page, obj = {}, mainData = "", visiterId, sortby = "", diaRange = {}, netWt = {}, gross = {}, Shape = "", dno = "", album = "") => {

  let MenuParams = {};
  let serachVar = "";

  const safeAtob = (str) => {
    if (!str || str === "undefined" || str === "null") return "";
    try {
      return atob(str);
    } catch (e) {
      return str;
    }
  };

  if (Array.isArray(mainData)) {
    if (mainData?.length > 0) {
      Object.values(mainData[0])?.forEach((ele, index) => {
        let keyName = `FilterKey${index === 0 ? '' : index}`;
        MenuParams[keyName] = typeof ele === "string" ? ele.replace(/%20/g, ' ') : ele;
      });

      Object.values(mainData[1])?.forEach((ele, index) => {
        let keyName = `FilterVal${index === 0 ? '' : index}`;
        MenuParams[keyName] = typeof ele === "string" ? ele.replace(/%20/g, ' ') : ele;
      });
    }
  } else if (mainData && typeof mainData === "object") {
    MenuParams = { ...mainData };
  } else if (typeof mainData === "string" && mainData !== "") {
    const prefix = mainData?.split("=")[0]?.toUpperCase();
    const payloadStr = mainData?.includes("=") ? mainData?.substring(mainData.indexOf("=") + 1) : mainData;

    if (prefix === "S") {
      serachVar = JSON.parse(safeAtob(payloadStr) || "{}");
    } else {
      const decoded = safeAtob(prefix === "A" ? payloadStr : mainData);
      if (decoded?.includes("=")) {
        const parts = decoded.split("=");
        MenuParams.FilterKey = parts[0];
        MenuParams.FilterVal = parts.slice(1).join("=");
      } else {
        MenuParams.FilterKey = decoded;
        MenuParams.FilterVal = decoded;
      }
    }
  }

  let storeinit = window.__STORE_INIT__ || getSession("storeInit");
  let loginInfo = getSession("loginUserDetail");
  let menuparam = getSession("menuparams");

  if ((!MenuParams?.FilterKey || MenuParams?.FilterKey === "") && menuparam) {
    if (typeof menuparam === "object") {
      MenuParams = { ...menuparam, ...MenuParams };
    }
  }

  const islogin = getSession("LoginUser") ?? false;

  const customerId = (storeinit?.IsB2BWebsite == 0 && islogin == false) || islogin == null ? visiterId : loginInfo?.id ?? 0;
  const customerEmail = (storeinit?.IsB2BWebsite == 0 && islogin == false) || islogin == null ? visiterId : loginInfo?.userid ?? "";

  let diaQc = (obj?.dia === undefined ? (loginInfo?.cmboDiaQCid ?? storeinit?.cmboDiaQCid) : obj?.dia)
  let csQc = (obj?.cs === undefined ? (loginInfo?.cmboCSQCid ?? storeinit?.cmboCSQCid) : obj?.cs)
  let mtid = (obj?.mt === undefined ? (loginInfo?.MetalId ?? storeinit?.MetalId) : obj?.mt)
  let filPrice = Array.isArray(filterObj?.Price) && filterObj.Price.length > 0
    ? filterObj.Price
    : '';

  const priceData = Array.isArray(filterObj)
    ? filterObj.find(item => item.dropdownIndex === 4) || {}
    : [];

  let foreveryPrice = priceData?.value
    ? { Minval: priceData.value[0], Maxval: priceData.value[1] }
    : {};

  const hasValidMin = filterObj?.PriceMin !== null && filterObj?.PriceMin !== undefined;
  const hasValidMax = filterObj?.PriceMax !== null && filterObj?.PriceMax !== undefined;

  const elveePrice = (hasValidMin || hasValidMax)
    ? {
      Minval: hasValidMin ? filterObj.PriceMin : filPrice[0]?.Minval,
      Maxval: hasValidMax ? filterObj.PriceMax : filPrice[0]?.Maxval
    }
    : {};

  const isNonEmptyObject = (obj) => obj && Object.keys(obj).length > 0;

  const getFilterVal = (key) => {
    if (!filterObj || typeof filterObj !== "object") return "";
    const lowerKey = key.toLowerCase();
    const lowerKeyId = `${lowerKey}id`;
    const foundKey = Object.keys(filterObj).find((k) => {
      const lk = k.toLowerCase();
      return lk === lowerKey || lk === lowerKeyId;
    });
    return foundKey ? filterObj[foundKey] : "";
  };

  const data = {
    PackageId: `${(loginInfo?.PackageId ?? storeinit?.PackageId) ?? ''}`,
    autocode: '',
    FrontEnd_RegNo: `${storeinit?.FrontEnd_RegNo ?? ''}`,
    Customerid: `${customerId ?? 0}`,
    designno: dno ?? '',
    Shape: `${Shape ?? ''}`,
    FilterKey: `${MenuParams?.FilterKey ?? getFilterVal("filterkey") ?? ""}`,
    FilterVal: `${MenuParams?.FilterVal ?? getFilterVal("filterval") ?? ""}`,
    FilterKey1: `${MenuParams?.FilterKey1 ?? ""}`,
    FilterVal1: `${MenuParams?.FilterVal1 ?? ""}`,
    FilterKey2: `${MenuParams?.FilterKey2 ?? ""}`,
    FilterVal2: `${MenuParams?.FilterVal2 ?? ""}`,
    SearchKey: `${serachVar?.b ?? ""}`,
    PageNo: `${page ?? ''}`,
    PageSize: `${storeinit?.PageSize ?? ''}`,
    Metalid: `${mtid ?? ''}`,
    DiaQCid: `${diaQc ?? ''}`,
    CsQCid: `${csQc ?? '0,0'}`,
    Collectionid: `${getFilterVal("collection")}`,
    Categoryid: `${getFilterVal("category")}`,
    SubCategoryid: `${getFilterVal("subcategory")}`,
    Brandid: `${getFilterVal("brand")}`,
    Genderid: `${getFilterVal("gender")}`,
    Ocassionid: `${getFilterVal("ocassion") || getFilterVal("occasion")}`,
    Themeid: `${getFilterVal("theme")}`,
    Producttypeid: `${getFilterVal("producttype")}`,
    Styleid: `${getFilterVal("style")}`,
    Min_DiaWeight: `${diaRange?.DiaMin ?? ""}`,
    Max_DiaWeight: `${diaRange?.DiaMax ?? ""}`,
    Min_GrossWeight: `${gross?.grossMin ?? ""}`,
    Max_GrossWeight: `${gross?.grossMax ?? ""}`,
    Min_NetWt: `${netWt?.netMin ?? ""}`,
    Max_NetWt: `${netWt?.netMax ?? ""}`,
    // FilPrice: filterObj?.Price?.length > 0 ? `${JSON.stringify(filterObj?.Price)}` : '',
    FilPrice:
      isNonEmptyObject(foreveryPrice)
        ? foreveryPrice
        : isNonEmptyObject(elveePrice)
          ? elveePrice
          : filPrice ?? "",
    // FilPrice: filPrice,
    // Max_Price: '',
    // Min_Price: '',
    CurrencyRate: `${(loginInfo?.CurrencyRate ?? storeinit?.CurrencyRate) ?? ''}`,
    SortBy: `${sortby ?? ""}`,
    Laboursetid: `${storeinit?.IsB2BWebsite == 0 && islogin == false
      ? storeinit?.pricemanagement_laboursetid
      : loginInfo?.pricemanagement_laboursetid
      ?? ''}`,
    diamondpricelistname: `${storeinit?.IsB2BWebsite == 0 && islogin == false
      ? storeinit?.diamondpricelistname
      : loginInfo?.diamondpricelistname
      ?? ''}`,
    colorstonepricelistname: `${storeinit?.IsB2BWebsite == 0 && islogin == false
      ? storeinit?.colorstonepricelistname
      : loginInfo?.colorstonepricelistname
      ?? ''}`,
    SettingPriceUniqueNo: `${storeinit?.IsB2BWebsite == 0 && islogin == false
      ? storeinit?.SettingPriceUniqueNo
      : loginInfo?.SettingPriceUniqueNo
      ?? ''}`,
    IsStockWebsite: `${storeinit?.IsStockWebsite ?? ''}`,
    Size: "",
    IsFromDesDet: "",
    IsPLW: `${storeinit?.IsPLW ?? ''}`,
    DomainForNo: `${storeinit?.DomainForNo ?? ""}`,
    AlbumName: album || (MenuParams?.FilterKey === "AlbumName" ? MenuParams?.FilterVal : "") || "",
    TaxId: loginInfo?.TaxId || 0,
    "WebDiscount": islogin ? `${loginInfo?.WebDiscount ?? 0}` : `${0}`,
    IsZeroPriceProductShow: `${storeinit?.IsZeroPriceProductShow ?? 0}`,
    IsSolitaireWebsite: `${storeinit?.IsSolitaireWebsite ?? 0}`,
  };

  let encData = JSON.stringify(data)

  let body = {
    con: `{\"id\":\"\",\"mode\":\"GETPRODUCTLIST\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
    f: "onlogin (GETPRODUCTLIST)",
    p: encData,
    // p: btoa(encData),
    // dp: encData,
  };

  let pdList = [];
  let pdResp = [];

  await CommonAPI(body).then((res) => {
    if (res) {
      pdList = res?.Data.rd;
      pdResp = res?.Data
    }
  });

  return { pdList, pdResp }
};

export default ProductListApi;
