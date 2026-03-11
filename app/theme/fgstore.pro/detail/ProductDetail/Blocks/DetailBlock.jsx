import { useRef, useState, useEffect } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Skeleton, Typography } from "@mui/material";
import { IoIosPlayCircle } from "react-icons/io";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Navigation, FreeMode, Keyboard } from "swiper/modules";
import { Swiper } from "swiper/react";
import { IoArrowBack } from "react-icons/io5";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";
import "../detailBlock.scss";
import QuantityInput from "../QuantityInput";


const imageNotFound = "/image-not-found.jpg";

const DetailBlock = ({
    // swiper
    swiperMainRef,
    onSlideChange,
    handlePrev,
    handleNext,

    // navigation
    navigate,

    // media
    selectedThumbImg,
    pdThumbImg,
    pdVideoArr,
    filteredVideos,
    isImageload,
    imagePromise,
    setImagePromise,
    setSelectedThumbImg,
    setThumbImgIndex,

    // loading
    prodLoading,
    setProdLoading,
    nextindex,

    // product
    singleProd,
    singleProd1,
    storeInit,

    // customization
    selectMtColorName,
    metalTypeCombo,
    metalColorCombo,
    diaQcCombo,
    csQcCombo,
    diaList,
    csList,
    SizeCombo,
    sizeData,
    selectMtType,
    selectMtColor,
    selectDiaQc,
    selectCsQc,
    handleCustomChange,
    handleMetalWiseColorImg,
    metalColorName,
    SizeSorting,
    Almacarino,

    // description
    descriptionText,
    isExpanded,
    isClamped,
    toggleText,
    descriptionRef,

    // pricing
    formatter,
    isPriceloading,
    loginInfo,

    // cart
    addToCartFlag,
    handleCart,
}) => {
    const thumbScrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const IsMultiVariantCart = storeInit?.IsMultiVariantCart == 1;


    const checkScrollability = () => {
        const el = thumbScrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };



    useEffect(() => {
        checkScrollability();
        const el = thumbScrollRef.current;
        if (el) {
            el.addEventListener("scroll", checkScrollability);
            const ro = new ResizeObserver(checkScrollability);
            ro.observe(el);
            return () => {
                el.removeEventListener("scroll", checkScrollability);
                ro.disconnect();
            };
        }
    }, [pdThumbImg, filteredVideos]);

    const scrollThumbs = (dir) => {
        if (thumbScrollRef.current) {
            thumbScrollRef.current.scrollBy({ left: dir * 110, behavior: "smooth" });
        }
    };

    const totalThumbs = (pdThumbImg?.length || 0) + (filteredVideos?.length || 0);

    return (
        <>
            <Box className="db-wrapper">
                <Swiper
                    ref={swiperMainRef}
                    spaceBetween={10}
                    lazy={true}
                    navigation={false}
                    breakpoints={{
                        1024: { slidesPerView: 4 },
                        768: { slidesPerView: 2 },
                        0: { slidesPerView: 2 },
                    }}
                    modules={[Keyboard, FreeMode, Navigation]}
                    keyboard={{ enabled: true }}
                    pagination={false}
                    onSlideChange={onSlideChange}
                    className="db-swiper-host"
                >
                    <div style={{ width: "100%", position: "relative" }}>
                        <button className="db-back-btn" onClick={() => navigate.back()}>
                            <IoArrowBack />
                            <span>Back</span>
                        </button>

                        {/* ── Two-column layout ── */}
                        <Box className="db-layout">
                            <Box className="db-left">
                                <Box className="db-main-img-wrap">
                                    {(isImageload || imagePromise) && <Skeleton variant="rounded" sx={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />}

                                    <div style={{ display: isImageload || imagePromise ? "none" : "block", height: "100%" }}>
                                        {selectedThumbImg?.type === "img" ? (
                                            <img
                                                src={selectedThumbImg?.link?.imageUrl}
                                                onError={(e) => {
                                                    e.target.src = imageNotFound;
                                                    e.target.alt = "no-image-found";
                                                    setImagePromise(false);
                                                }}
                                                onLoad={() => {
                                                    setImagePromise(false);
                                                    if (nextindex > 0) {
                                                        setTimeout(() => setProdLoading(false), 500);
                                                    } else {
                                                        setProdLoading(false);
                                                    }
                                                }}
                                                alt=""
                                            />
                                        ) : (
                                            <video
                                                src={pdVideoArr?.length > 0 ? selectedThumbImg?.link?.imageUrl : imageNotFound}
                                                loop
                                                autoPlay
                                                muted
                                                playsInline
                                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                                                onError={(e) => {
                                                    e.target.poster = imageNotFound;
                                                }}
                                            />
                                        )}
                                    </div>
                                </Box>

                                {/* Thumbnail strip with scroll chevrons */}
                                {(pdThumbImg?.length > 1 || pdVideoArr?.length > 0) && (
                                    <div className="db-thumb-strip-outer">
                                        {/* {totalThumbs > 4 && (
                                            <button className="db-thumb-chevron" onClick={() => scrollThumbs(-1)} disabled={!canScrollLeft} aria-label="Scroll thumbnails left">
                                                <HiOutlineChevronLeft />
                                            </button>
                                        )} */}

                                        {(!isImageload || !imagePromise) && <div className="db-thumb-strip" ref={thumbScrollRef}>
                                            {pdThumbImg?.map((ele, i) => {
                                                const firstHalf = ele?.thumbImageUrl?.split("/Design_Thumb")[0];
                                                const secondhalf = ele?.thumbImageUrl?.split("/Design_Thumb")[1]?.split(".")[0];
                                                return (
                                                    <div
                                                        key={ele?.thumbImageUrl}
                                                        className={`db-thumb-item ${selectedThumbImg?.link?.imageUrl === `${firstHalf}${secondhalf}.${ele?.originalImageExtension}` ? "active" : ""}`}
                                                        onClick={() => {
                                                            setSelectedThumbImg({
                                                                link: {
                                                                    imageUrl: `${firstHalf}${secondhalf}.${ele?.originalImageExtension}`,
                                                                    extension: `${ele?.originalImageExtension}`,
                                                                },
                                                                type: "img",
                                                            });
                                                            setThumbImgIndex(i);
                                                        }}
                                                    >
                                                        <img
                                                            src={ele?.thumbImageUrl ? ele?.thumbImageUrl : ele}
                                                            alt=""
                                                            onLoad={() => {
                                                                if (nextindex > 0) {
                                                                    setTimeout(() => setProdLoading(false), 500);
                                                                } else {
                                                                    setProdLoading(false);
                                                                }
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = imageNotFound;
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            })}

                                            {filteredVideos?.map((data, vi) => (
                                                <div
                                                    key={`vid-${vi}`}
                                                    className="db-thumb-item"
                                                    onClick={() =>
                                                        setSelectedThumbImg({
                                                            link: { imageUrl: data, extension: "mp4" },
                                                            type: "vid",
                                                        })
                                                    }
                                                >
                                                    <video
                                                        src={data}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        onError={(e) => {
                                                            e.target.poster = imageNotFound;
                                                        }}
                                                    />
                                                    <div className="db-thumb-play-icon">
                                                        <IoIosPlayCircle />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        }
                                        {/* {totalThumbs > 4 && (
                                            <button className="db-thumb-chevron" onClick={() => scrollThumbs(1)} disabled={!canScrollRight} aria-label="Scroll thumbnails right">
                                                <HiOutlineChevronRight />
                                            </button>
                                        )} */}
                                    </div>
                                )}
                            </Box>

                            <Box className="db-right">
                                {/* Title */}
                                {formatTitleLine(singleProd?.TitleLine) && singleProd?.TitleLine && <p className="db-title">{singleProd?.TitleLine}</p>}

                                {/* Design no + stock badge */}
                                <div className="db-design-row">
                                    <span className="db-designno">{singleProd?.designno}</span>
                                    {prodLoading === false && <span className={`db-badge ${singleProd?.StatusId === 1 ? "proCat_app_Deatil_instock" : singleProd?.StatusId === 2 ? "proCat_app_deatil_MEMO" : "proCat_app_Make_to_order"}`}>{singleProd?.StatusId === 1 ? "In Stock" : singleProd?.StatusId === 2 ? "In Memo" : "Make To Order"}</span>}
                                </div>

                                {/* Quick info rows */}
                                <div className="db-info-row">
                                    <span>Metal Purity :</span>
                                    <span className="db-info-val">{selectMtType}</span>
                                </div>
                                <div className="db-info-row">
                                    <span>Metal Color :</span>
                                    <span className="db-info-val">{selectMtColorName}</span>

                                </div>
                                {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
                                    <div className="db-info-row">
                                        <span>Diamond Quality Color :</span>
                                        <span className="db-info-val">{selectDiaQc}</span>
                                    </div>
                                ) : null}
                                <div className="db-info-row">
                                    <span>NWT :</span>
                                    <span className="db-info-val">{(singleProd1?.Nwt ?? singleProd?.Nwt)?.toFixed(3)}</span>
                                </div>
                                {Almacarino === 1 && (
                                    <div className="db-info-row">
                                        <span>GWT :</span>
                                        <span className="db-info-val">{(singleProd1?.Gwt ?? singleProd?.Gwt)?.toFixed(3)}</span>
                                    </div>
                                )}

                                {/* Description */}
                                {descriptionText?.length > 0 && (
                                    <div className="db-desc-wrap">
                                        <p className={`db-desc-text${isExpanded ? " expanded" : ""}`} ref={descriptionRef}>
                                            {descriptionText}
                                        </p>
                                        {isClamped && !isExpanded && (
                                            <span className="db-toggle-text" onClick={toggleText}>
                                                Show More
                                            </span>
                                        )}
                                        {isExpanded && (
                                            <span className="db-toggle-text" onClick={toggleText}>
                                                Show Less
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="db-divider" />

                                {/* ── Customization ── */}
                                {
                                    Number(storeInit?.IsProductWebCustomization) === 1 &&
                                    metalTypeCombo?.length > 0 &&
                                    Number(storeInit?.IsMetalCustomization) === 1 && (
                                        <div className="db-customize-section">
                                            <Grid container spacing={2}>
                                                {/* Metal Type */}
                                                <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                    <div className="db-field-row">
                                                        <label className="db-field-label">Metal Type</label>
                                                        {singleProd?.IsMrpBase === 1 ? (
                                                            <span className="db-field-value">{metalTypeCombo?.find((e) => e?.Metalid === singleProd?.MetalPurityid)?.metaltype}</span>
                                                        ) : (
                                                            <select className="db-classy-select" value={selectMtType} onChange={(e) => handleCustomChange(e, "mt")}>
                                                                {metalTypeCombo.map((ele) => (
                                                                    <option key={ele?.Metalid} value={ele?.metaltype}>
                                                                        {ele?.metaltype}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>
                                                </Grid>

                                                {/* Metal Color */}
                                                {metalColorCombo?.length > 0 &&
                                                    Number(storeInit?.IsMetalTypeWithColor) === 1 && (
                                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                            <div className="db-field-row">
                                                                <label className="db-field-label">Metal Color</label>
                                                                {singleProd?.IsMrpBase === 1 ? (
                                                                    <span className="db-field-value">{metalColorCombo?.find((e) => e?.id === singleProd?.MetalColorid)?.metalcolorname}</span>
                                                                ) : (
                                                                    <select className="db-classy-select" value={selectMtColor} onChange={(e) => handleMetalWiseColorImg(e)}>
                                                                        {metalColorCombo.map((ele) => (
                                                                            <option key={ele?.id} value={ele?.colorcode}>
                                                                                {ele?.metalcolorname}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                )}
                                                            </div>
                                                        </Grid>
                                                    )}

                                                {/* Diamond */}
                                                {storeInit?.IsDiamondCustomization === 1 &&
                                                    diaQcCombo?.length > 0 &&
                                                    diaList?.length > 0 && (
                                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                            <div className="db-field-row">
                                                                <label className="db-field-label">Diamond</label>
                                                                {singleProd?.IsMrpBase === 1 ? (
                                                                    <span className="db-field-value">{singleProd?.DiaQuaCol}</span>
                                                                ) : (
                                                                    <select className="db-classy-select" value={selectDiaQc} onChange={(e) => handleCustomChange(e, "dia")}>
                                                                        {diaQcCombo.map((ele) => (
                                                                            <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
                                                                                {`${ele?.Quality},${ele?.color}`}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                )}
                                                            </div>
                                                        </Grid>
                                                    )}

                                                {/* Color Stone */}
                                                {storeInit?.IsCsCustomization === 1 &&
                                                    selectCsQc?.length > 0 &&
                                                    csList?.some((e) => e?.D !== "MISC") && (
                                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                            <div className="db-field-row">
                                                                <label className="db-field-label">Color Stone</label>
                                                                {singleProd?.IsMrpBase === 1 ? (
                                                                    <span className="db-field-value">{singleProd?.CsQuaCol}</span>
                                                                ) : (
                                                                    <select className="db-classy-select" value={selectCsQc} onChange={(e) => handleCustomChange(e, "cs")}>
                                                                        {csQcCombo.map((ele) => (
                                                                            <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
                                                                                {`${ele?.Quality},${ele?.color}`}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                )}
                                                            </div>
                                                        </Grid>
                                                    )}

                                                {/* Size */}
                                                {SizeSorting(SizeCombo?.rd)?.length > 0 &&
                                                    singleProd?.DefaultSize &&
                                                    (

                                                        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                                                            <div className="db-field-row">
                                                                <label className="db-field-label">Size</label>
                                                                {singleProd?.IsMrpBase === 1 ? (
                                                                    <span className="db-field-value">{singleProd?.DefaultSize}</span>
                                                                ) : (
                                                                    <select className="db-classy-select" value={sizeData} onChange={(e) => handleCustomChange(e, "sz")}>
                                                                        {SizeCombo?.rd?.map((ele) => (
                                                                            <option value={ele?.sizename} key={ele?.id}>
                                                                                {ele?.sizename}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                )}
                                                            </div>
                                                        </Grid>
                                                    )}
                                            </Grid>
                                        </div>
                                    )}

                                {/* ── Price Breakup Accordion ── */}
                                {storeInit?.IsPriceShow === 1 && storeInit?.IsPriceBreakUp === 1 && (singleProd ?? singleProd1)?.IsMrpBase !== 1 && (
                                    <Accordion
                                        elevation={0}
                                        sx={{
                                            borderBottom: "1px solid #ebe7e0",
                                            borderRadius: "0 !important",
                                            "&.MuiPaper-root.MuiAccordion-root:last-of-type": {
                                                borderBottomLeftRadius: "0 !important",
                                                borderBottomRightRadius: "0 !important",
                                            },
                                            "&.MuiPaper-root.MuiAccordion-root:before": { background: "none" },
                                            px: 1,
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon sx={{ width: "18px", color: "#a09a93" }} />}
                                            sx={{
                                                padding: 0,
                                                "& .MuiAccordionSummary-root": { padding: 0 },
                                                color: "#7d7f85",
                                            }}
                                        >
                                            <Typography sx={{ fontFamily: "TT Commons Regular", fontSize: "15px", letterSpacing: "0.04em" }}>Price Breakup</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ padding: "0 0 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                            {[
                                                { label: "Metal", val: singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost },
                                                { label: "Diamond", val: singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost },
                                                { label: "Stone", val: singleProd1?.ColorStone_Cost ?? singleProd?.ColorStone_Cost },
                                                { label: "MISC", val: singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost },
                                                { label: "Labour", val: singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost },
                                                {
                                                    label: "Other",
                                                    val: (singleProd1?.Other_Cost ?? singleProd?.Other_Cost) + (singleProd1?.Size_MarkUp ?? singleProd?.Size_MarkUp) + (singleProd1?.DesignMarkUpAmount ?? singleProd?.DesignMarkUpAmount) + (singleProd1?.ColorStone_SettingCost ?? singleProd?.ColorStone_SettingCost) + (singleProd1?.Diamond_SettingCost ?? singleProd?.Diamond_SettingCost) + (singleProd1?.Misc_SettingCost ?? singleProd?.Misc_SettingCost),
                                                },
                                            ]
                                                .filter((item) => item.val !== 0 && item.val != null)
                                                .map((item) => (
                                                    <div key={item.label} className="db-breakup-row">
                                                        <span className="db-breakup-label">{item.label}</span>
                                                        <span className="db-breakup-price">
                                                            <span >{loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}</span>
                                                            {formatter.format(item.val?.toFixed(2))}
                                                        </span>
                                                    </div>
                                                ))}
                                        </AccordionDetails>
                                    </Accordion>
                                )}

                                {/* ── Total Price ── */}
                                {storeInit?.IsPriceShow === 1 && (
                                    <div className="db-price-section">
                                        {isPriceloading ? (
                                            <Skeleton variant="rounded" width={180} height={38} />
                                        ) : (
                                            <>
                                                <span className="db-price-currency">{loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}</span>
                                                <span className="db-price-amount">{formatter.format(singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp)}</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ── Cart + Delivery ── */}
                                {prodLoading ? null : (
                                    <div>
                                        {/* <button className={` bhtn proCat_AddToCart_btn ${!addToCartFlag ? "btnColorProCatProduct" : "proCat_AddToCart_btn"}`} onClick={() => handleCart(!addToCartFlag)}>
                                            {!addToCartFlag ? "ADD TO CART" : "REMOVE FROM CART"}
                                        </button> */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                width: '100%',
                                                height: '100%',
                                                marginTop: '16px'
                                            }}
                                        >
                                            <button
                                                className={`bhtn proCat_AddToCart_btn ${!addToCartFlag ? "btnColorProCatProduct" : "proCat_AddToCart_btn"
                                                    }`}
                                                onClick={() => {
                                                    if (addToCartFlag && IsMultiVariantCart) {
                                                        navigate.push("/cartPage");
                                                    } else {
                                                        handleCart(!addToCartFlag);
                                                    }
                                                }}
                                            >
                                                {!addToCartFlag
                                                    ? "ADD TO CART"
                                                    : IsMultiVariantCart
                                                        ? "GO TO CART"
                                                        : "REMOVE FROM CART"}
                                            </button>
                                            <QuantityInput />
                                        </Box>


                                        {singleProd?.InStockDays !== 0 && <p className="db-delivery-txt">Express Shipping · In Stock — {singleProd?.InStockDays} Days Delivery</p>}
                                        {singleProd?.MakeOrderDays !== 0 && <p className="db-delivery-txt">Make To Order · {singleProd?.MakeOrderDays} Days Delivery</p>}
                                    </div>
                                )}
                            </Box>
                        </Box>

                        {/* ── Product navigation chevrons ── */}
                        <button className="db-nav-chevron db-nav-prev" onClick={handlePrev} aria-label="Previous product">
                            <HiOutlineChevronLeft />
                        </button>
                        <button className="db-nav-chevron db-nav-next" onClick={handleNext} aria-label="Next product">
                            <HiOutlineChevronRight />
                        </button>
                    </div>
                </Swiper>
            </Box>
        </>
    );
};

export default DetailBlock;

// import { Accordion, AccordionDetails, AccordionSummary, Box, Skeleton, Typography } from "@mui/material";
// import { IoIosPlayCircle } from "react-icons/io";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { Navigation, FreeMode, Keyboard } from "swiper/modules";
// import { Swiper } from "swiper/react";
// import { IoArrowBack } from "react-icons/io5";
// import { HiOutlineChevronRight } from "react-icons/hi2";
// import { HiOutlineChevronLeft } from "react-icons/hi2";
// import { formatTitleLine } from "@/app/(core)/utils/Glob_Functions/GlobalFunction";

// const imageNotFound = "/image-not-found.jpg";

// const DetailBlock = ({
//   // swiper
//   swiperMainRef,
//   onSlideChange,
//   handlePrev,
//   handleNext,

//   // navigation
//   navigate,

//   // media
//   selectedThumbImg,
//   pdThumbImg,
//   pdVideoArr,
//   filteredVideos,
//   imageNotFound,
//   isImageload,
//   imagePromise,
//   setSelectedThumbImg,
//   setThumbImgIndex,

//   // loading
//   prodLoading,
//   setProdLoading,
//   nextindex,

//   // product
//   singleProd,
//   singleProd1,
//   storeInit,

//   // customization
//   metalTypeCombo,
//   metalColorCombo,
//   diaQcCombo,
//   csQcCombo,
//   diaList,
//   csList,
//   SizeCombo,
//   sizeData,
//   selectMtType,
//   selectMtColor,
//   selectDiaQc,
//   selectCsQc,
//   handleCustomChange,
//   handleMetalWiseColorImg,
//   metalColorName,
//   SizeSorting,
//   Almacarino,

//   // description
//   descriptionText,
//   isExpanded,
//   isClamped,
//   toggleText,
//   descriptionRef,

//   // pricing
//   formatter,
//   isPriceloading,
//   loginInfo,

//   // cart
//   addToCartFlag,
//   handleCart,
// }) => {
//   return (
//     <>
//       <Box
//         sx={{
//           width: "100%",
//         }}
//       >
//         <Swiper
//           ref={swiperMainRef}
//           spaceBetween={10}
//           lazy={true}
//           navigation={true}
//           breakpoints={{
//             1024: {
//               slidesPerView: 4,
//             },
//             768: {
//               slidesPerView: 2,
//             },
//             0: {
//               slidesPerView: 2,
//             },
//           }}
//           modules={[Keyboard, FreeMode, Navigation]}
//           keyboard={{ enabled: true }}
//           pagination={false}
//           onSlideChange={onSlideChange}
//         >
//           <div className="proCat_prod_detail_main">
//             <IoArrowBack
//               style={{
//                 height: "35px",
//                 width: "35px",
//                 margin: "20px 0px 0px 50px",
//                 cursor: "pointer",
//                 color: "rgba(143, 140, 139, 0.9019607843)",
//               }}
//               onClick={() => navigate.back()}
//             />
//             <div className="proCat_prod_image_shortInfo">
//               {/* <div>
//                       <span>{"<"}</span>
//                     </div> */}

//               <div className="proCat_prod_image_Sec">
//                 {/* {isImageload && ( */}
//                 {(isImageload || imagePromise) && (
//                   <Skeleton
//                     sx={{
//                       width: "95%",
//                       height: "750px",
//                       margin: "20px 0 0 0",
//                     }}
//                     variant="rounded"
//                   />
//                 )}

//                 <div className="proCat_main_prod_img" style={{ display: isImageload || imagePromise ? "none" : "block" }}>
//                   {selectedThumbImg?.type == "img" ? (
//                     <img
//                       src={selectedThumbImg?.link?.imageUrl}
//                       // src={imageSrc}
//                       onError={(e) => {
//                         e.target.src = imageNotFound;
//                         e.target.alt = "no-image-found";
//                       }}
//                       onLoad={() => {
//                         if (nextindex > 0) {
//                           setTimeout(() => {
//                             setProdLoading(false);
//                             // setImagePromise(false);
//                           }, 500);
//                         } else {
//                           setProdLoading(false);
//                           // setImagePromise(false);
//                         }
//                       }}
//                       alt={""}
//                       className="proCat_prod_img"
//                     />
//                   ) : (
//                     <div className="proCat_prod_video">
//                       <video
//                         src={pdVideoArr?.length > 0 ? selectedThumbImg?.link?.imageUrl : imageNotFound}
//                         loop={true}
//                         autoPlay={true}
//                         style={{
//                           width: "100%",
//                           objectFit: "cover",
//                           marginTop: "40px",
//                           // height: "90%",
//                           borderRadius: "8px",
//                         }}
//                         onError={(e) => {
//                           e.target.poster = imageNotFound;
//                           e.target.alt = "no-image-found";
//                         }}
//                       />
//                     </div>
//                   )}

//                   <div className="proCat_thumb_prod_img">
//                     {(pdThumbImg?.length > 1 || pdVideoArr?.length > 0) &&
//                       pdThumbImg?.map((ele, i) => {
//                         const firstHalf = ele?.thumbImageUrl?.split("/Design_Thumb")[0];
//                         const secondhalf = ele?.thumbImageUrl?.split("/Design_Thumb")[1]?.split(".")[0];
//                         return (
//                           <img
//                             key={ele?.thumbImageUrl}
//                             src={ele?.thumbImageUrl ? ele?.thumbImageUrl : ele}
//                             alt={""}
//                             className="proCat_prod_thumb_img"
//                             onLoad={() => {
//                               if (nextindex > 0) {
//                                 setTimeout(() => {
//                                   setProdLoading(false);
//                                   // setImagePromise(false);
//                                 }, 500);
//                               } else {
//                                 setProdLoading(false);
//                                 // setImagePromise(false);
//                               }
//                             }}
//                             onClick={() => {
//                               setSelectedThumbImg({
//                                 // link: ele.replace('Design_Thumb/', ''),
//                                 link: {
//                                   imageUrl: `${firstHalf}${secondhalf}.${ele?.originalImageExtension}`,
//                                   extension: `${ele?.originalImageExtension}`,
//                                 },
//                                 type: "img",
//                               });
//                               setThumbImgIndex(i);
//                             }}
//                             onError={(e) => {
//                               e.target.src = imageNotFound;
//                               e.target.alt = "no-image-found";
//                             }}
//                           />
//                         );
//                       })}
//                     {filteredVideos?.map((data) => (
//                       <div
//                         style={{
//                           position: "relative",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                         }}
//                         onClick={() =>
//                           // setSelectedThumbImg({
//                           //   link: data,
//                           //   type: "vid",
//                           // })
//                           setSelectedThumbImg({
//                             link: {
//                               imageUrl: data,
//                               extension: "mp4",
//                             },
//                             type: "vid",
//                           })
//                         }
//                       >
//                         <video
//                           src={data}
//                           autoPlay={true}
//                           loop={true}
//                           className="proCat_prod_thumb_img"
//                           style={{ height: "70px", objectFit: "cover" }}
//                           onError={(e) => {
//                             e.target.poster = imageNotFound;
//                             e.target.alt = "no-image-found";
//                           }}
//                         />
//                         <IoIosPlayCircle
//                           style={{
//                             position: "absolute",
//                             color: "white",
//                             width: "35px",
//                             height: "35px",
//                           }}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="proCat_prod_shortInfo">
//                 <div className="proCat_prod_shortInfo_inner">
//                   <p className="proCat_prod_titleLine">{formatTitleLine(singleProd?.TitleLine) && singleProd?.TitleLine}</p>
//                   <div className="proCat_prod_summury_info">
//                     <div className="proCat_prod_summury_info_inner">
//                       <span className="proCat_single_prod_designno">
//                         {singleProd?.designno}
//                         {prodLoading == false && <div className="proCat_app_productDetail_label">{singleProd?.StatusId == 1 ? <span className="proCat_app_Deatil_instock">In Stock</span> : singleProd?.StatusId == 2 ? <span className="proCat_app_deatil_MEMO">In memo</span> : <span className="proCat_app_Make_to_order">Make To Order</span>}</div>}
//                       </span>
//                       <span className="proCat_prod_short_key">
//                         Metal Purity : <span className="proCat_prod_short_val">{selectMtType}</span>
//                       </span>
//                       <span className="proCat_prod_short_key">
//                         Metal Color : <span className="proCat_prod_short_val">{metalColorName()}</span>
//                       </span>
//                       {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
//                         <span className="proCat_prod_short_key">
//                           Diamond Quality Color : <span className="proCat_prod_short_val">{`${selectDiaQc}`}</span>
//                         </span>
//                       ) : null}
//                       <span className="proCat_prod_short_key">
//                         NWT : <span className="proCat_prod_short_val">{(singleProd1?.Nwt ?? singleProd?.Nwt)?.toFixed(3)}</span>
//                       </span>
//                       {Almacarino === 1 && (
//                         <span className="proCat_prod_short_key">
//                           GWT : <span className="proCat_prod_short_val">{(singleProd1?.Gwt ?? singleProd?.Gwt)?.toFixed(3)}</span>
//                         </span>
//                       )}
//                       {descriptionText?.length > 0 && (
//                         <div className={`proCat_prod_description ${isExpanded ? "proCat_show-more" : ""}`}>
//                           <p className="proCat_description-text" ref={descriptionRef}>
//                             {descriptionText}
//                           </p>

//                           {isClamped &&
//                             !isExpanded && ( // Show "Show More" only if text is clamped and not expanded
//                               <span className="proCat_toggle-text" onClick={toggleText}>
//                                 Show More
//                               </span>
//                             )}

//                           {isExpanded && ( // Show "Show Less" when the description is expanded
//                             <span className="proCat_toggle-text" onClick={toggleText}>
//                               Show Less
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   {storeInit?.IsProductWebCustomization == 1 && metalTypeCombo?.length > 0 && storeInit?.IsMetalCustomization === 1 && (
//                     <div className="proCat_single_prod_customize">
//                       <div className="proCat_single_prod_customize_metal">
//                         <label className="menuItemTimeEleveDeatil">METAL TYPE:</label>
//                         {singleProd?.IsMrpBase == 1 ? (
//                           <span className="menuitemSelectoreMain">{metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}</span>
//                         ) : (
//                           <select
//                             className="menuitemSelectoreMain"
//                             value={selectMtType}
//                             onChange={(e) => handleCustomChange(e, "mt")}
//                             // onChange={(e) => setSelectMtType(e.target.value)}
//                           >
//                             {metalTypeCombo.map((ele) => (
//                               <option key={ele?.Metalid} value={ele?.metaltype}>
//                                 {ele?.metaltype}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                       </div>
//                       {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
//                         <div className="proCat_single_prod_customize_outer">
//                           <label className="menuItemTimeEleveDeatil">METAL COLOR:</label>
//                           {singleProd?.IsMrpBase == 1 ? (
//                             <span className="menuitemSelectoreMain">{metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}</span>
//                           ) : (
//                             <select className="menuitemSelectoreMain" value={selectMtColor} onChange={(e) => handleMetalWiseColorImg(e)}>
//                               {metalColorCombo?.map((ele) => (
//                                 <option key={ele?.id} value={ele?.colorcode}>
//                                   {ele?.metalcolorname}
//                                 </option>
//                               ))}
//                             </select>
//                           )}
//                         </div>
//                       )}
//                       {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
//                         <div className="proCat_single_prod_customize_outer">
//                           <label className="menuItemTimeEleveDeatil">DIAMOND :</label>
//                           {singleProd?.IsMrpBase == 1 ? (
//                             <>
//                               <span className="menuitemSelectoreMain">{singleProd?.DiaQuaCol}</span>
//                             </>
//                           ) : (
//                             <>
//                               <select
//                                 className="menuitemSelectoreMain"
//                                 value={selectDiaQc}
//                                 // onChange={(e) => setSelectDiaQc(e.target.value)}
//                                 onChange={(e) => handleCustomChange(e, "dia")}
//                               >
//                                 {diaQcCombo.map((ele) => (
//                                   <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
//                                 ))}
//                               </select>
//                             </>
//                           )}
//                         </div>
//                       ) : null}
//                       {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 ? (
//                         <div className="proCat_single_prod_customize_outer">
//                           <label className="menuItemTimeEleveDeatil">COLOR STONE :</label>
//                           {singleProd?.IsMrpBase == 1 ? (
//                             <span className="menuitemSelectoreMain">{singleProd?.CsQuaCol}</span>
//                           ) : (
//                             <select className="menuitemSelectoreMain" value={selectCsQc} onChange={(e) => handleCustomChange(e, "cs")}>
//                               {csQcCombo.map((ele, i) => (
//                                 <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
//                               ))}
//                             </select>
//                           )}
//                         </div>
//                       ) : null}
//                       {/* {console.log("sizeData",SizeCombo?.find((size) => size.IsDefaultSize === 1)?.sizename)} */}
//                       {SizeSorting(SizeCombo?.rd)?.length > 0 && singleProd?.DefaultSize !== "" && (
//                         <div className="proCat_single_prod_customize_outer">
//                           <label className="menuItemTimeEleveDeatil">SIZE:</label>
//                           {singleProd?.IsMrpBase == 1 ? (
//                             <span className="menuitemSelectoreMain">{singleProd?.DefaultSize}</span>
//                           ) : (
//                             <select className="menuitemSelectoreMain" value={sizeData} onChange={(e) => handleCustomChange(e, "sz")}>
//                               {SizeCombo?.rd?.map((ele) => (
//                                 <option value={ele?.sizename} key={ele?.id}>
//                                   {ele?.sizename}
//                                 </option>
//                               ))}
//                             </select>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {storeInit?.IsPriceShow == 1 && storeInit?.IsPriceBreakUp == 1 && (singleProd ?? singleProd1)?.IsMrpBase != 1 && (
//                     <Accordion
//                       elevation={0}
//                       sx={{
//                         borderBottom: "1px solid #c7c8c9",
//                         borderRadius: 0,
//                         "&.MuiPaper-root.MuiAccordion-root:last-of-type": {
//                           borderBottomLeftRadius: "0px",
//                           borderBottomRightRadius: "0px",
//                         },
//                         "&.MuiPaper-root.MuiAccordion-root:before": {
//                           background: "none",
//                         },
//                         width: "95.5%",
//                       }}
//                     >
//                       <AccordionSummary
//                         expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
//                         aria-controls="panel1-content"
//                         id="panel1-header"
//                         sx={{
//                           color: "#7d7f85 !important",
//                           borderRadius: 0,

//                           "&.MuiAccordionSummary-root": {
//                             padding: 0,
//                           },
//                         }}
//                         // className="filtercategoryLable"
//                       >
//                         <Typography
//                           sx={{
//                             fontFamily: "TT Commons Regular",
//                             fontSize: "18px",
//                           }}
//                         >
//                           Price Breakup
//                         </Typography>
//                       </AccordionSummary>
//                       <AccordionDetails
//                         sx={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: "4px",
//                           padding: "0 0 16px 0",
//                         }}
//                       >
//                         {(singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost) !== 0 ? (
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                             }}
//                           >
//                             <Typography
//                               className="proCat_Price_breakup_label"
//                               sx={{
//                                 fontFamily: "TT Commons Regular",
//                               }}
//                             >
//                               Metal
//                             </Typography>
//                             <span style={{ display: "flex" }}>
//                               <Typography>
//                                 {
//                                   <span
//                                     className="proCat_currencyFont"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                   </span>
//                                 }
//                               </Typography>
//                               &nbsp;
//                               <Typography
//                                 sx={{
//                                   fontFamily: "TT Commons Regular",
//                                 }}
//                                 className="proCat_PriceBreakup_Price"
//                               >
//                                 {formatter.format((singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost)?.toFixed(2))}
//                               </Typography>
//                             </span>
//                           </div>
//                         ) : null}

//                         {(singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost) !== 0 ? (
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                             }}
//                           >
//                             <Typography
//                               className="proCat_Price_breakup_label"
//                               sx={{
//                                 fontFamily: "TT Commons Regular",
//                               }}
//                             >
//                               Diamond{" "}
//                             </Typography>

//                             <span style={{ display: "flex" }}>
//                               <Typography>
//                                 {
//                                   <span
//                                     className="proCat_currencyFont"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                   </span>
//                                 }
//                               </Typography>
//                               &nbsp;
//                               <Typography
//                                 className="proCat_PriceBreakup_Price"
//                                 sx={{
//                                   fontFamily: "TT Commons Regular",
//                                 }}
//                               >
//                                 {formatter.format((singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost)?.toFixed(2))}
//                               </Typography>
//                             </span>
//                           </div>
//                         ) : null}

//                         {(singleProd1?.ColorStone_Cost ?? singleProd?.ColorStone_Cost) !== 0 ? (
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                             }}
//                           >
//                             <Typography
//                               className="proCat_Price_breakup_label"
//                               sx={{
//                                 fontFamily: "TT Commons Regular",
//                               }}
//                             >
//                               Stone{" "}
//                             </Typography>

//                             <span style={{ display: "flex" }}>
//                               <Typography>
//                                 {
//                                   <span
//                                     className="proCat_currencyFont"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                   </span>
//                                 }
//                               </Typography>
//                               &nbsp;
//                               <Typography
//                                 className="proCat_PriceBreakup_Price"
//                                 sx={{
//                                   fontFamily: "TT Commons Regular",
//                                 }}
//                               >
//                                 {formatter.format((singleProd1?.ColorStone_Cost ?? singleProd?.ColorStone_Cost)?.toFixed(2))}
//                               </Typography>
//                             </span>
//                           </div>
//                         ) : null}

//                         {(singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost) !== 0 ? (
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                             }}
//                           >
//                             <Typography
//                               className="proCat_Price_breakup_label"
//                               sx={{
//                                 fontFamily: "TT Commons Regular",
//                               }}
//                             >
//                               MISC{" "}
//                             </Typography>

//                             <span style={{ display: "flex" }}>
//                               <Typography>
//                                 {
//                                   <span
//                                     className="proCat_currencyFont"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                   </span>
//                                 }
//                               </Typography>
//                               &nbsp;
//                               <Typography
//                                 className="proCat_PriceBreakup_Price"
//                                 sx={{
//                                   fontFamily: "TT Commons Regular",
//                                 }}
//                               >
//                                 {formatter.format((singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost)?.toFixed(2))}
//                               </Typography>
//                             </span>
//                           </div>
//                         ) : null}

//                         {formatter.format((singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost)?.toFixed(2)) !== 0 ? (
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                             }}
//                           >
//                             <Typography
//                               className="proCat_Price_breakup_label"
//                               sx={{
//                                 fontFamily: "TT Commons Regular",
//                               }}
//                             >
//                               Labour{" "}
//                             </Typography>

//                             <span style={{ display: "flex" }}>
//                               <Typography>
//                                 {
//                                   <span
//                                     className="proCat_currencyFont"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                   </span>
//                                 }
//                               </Typography>
//                               &nbsp;
//                               <Typography
//                                 className="proCat_PriceBreakup_Price"
//                                 sx={{
//                                   fontFamily: "TT Commons Regular",
//                                 }}
//                               >
//                                 {formatter.format((singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost)?.toFixed(2))}
//                               </Typography>
//                             </span>
//                           </div>
//                         ) : null}

//                         {(singleProd1?.Other_Cost ?? singleProd?.Other_Cost) + (singleProd1?.Size_MarkUp ?? singleProd?.Size_MarkUp) + (singleProd1?.DesignMarkUpAmount ?? singleProd?.DesignMarkUpAmount) + (singleProd1?.ColorStone_SettingCost ?? singleProd?.ColorStone_SettingCost) + (singleProd1?.Diamond_SettingCost ?? singleProd?.Diamond_SettingCost) + (singleProd1?.Misc_SettingCost ?? singleProd?.Misc_SettingCost) !== 0 ? (
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                             }}
//                           >
//                             <Typography
//                               className="proCat_Price_breakup_label"
//                               sx={{
//                                 fontFamily: "TT Commons Regular",
//                               }}
//                             >
//                               Other{" "}
//                             </Typography>

//                             <span style={{ display: "flex" }}>
//                               <Typography>
//                                 {
//                                   <span
//                                     className="proCat_currencyFont"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                   </span>
//                                 }
//                               </Typography>
//                               &nbsp;
//                               <Typography
//                                 className="proCat_PriceBreakup_Price"
//                                 sx={{
//                                   fontFamily: "TT Commons Regular",
//                                 }}
//                               >
//                                 {formatter.format(((singleProd1?.Other_Cost ?? singleProd?.Other_Cost) + (singleProd1?.Size_MarkUp ?? singleProd?.Size_MarkUp) + (singleProd1?.DesignMarkUpAmount ?? singleProd?.DesignMarkUpAmount) + (singleProd1?.ColorStone_SettingCost ?? singleProd?.ColorStone_SettingCost) + (singleProd1?.Diamond_SettingCost ?? singleProd?.Diamond_SettingCost) + (singleProd1?.Misc_SettingCost ?? singleProd?.Misc_SettingCost))?.toFixed(2))}
//                               </Typography>
//                             </span>
//                           </div>
//                         ) : null}
//                       </AccordionDetails>
//                     </Accordion>
//                   )}

//                   {storeInit?.IsPriceShow == 1 && (
//                     <div className="proCat_price_portion">
//                       {isPriceloading ? "" : <span className="proCat_currencyFont">{loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}</span>}
//                       &nbsp;
//                       {isPriceloading ? <Skeleton variant="rounded" width={140} height={30} /> : formatter.format(singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp)}
//                     </div>
//                   )}

//                   {prodLoading ? null : (
//                     <div>
//                       <div className="Smr_CartAndWish_portion">
//                         <button className={!addToCartFlag ? "proCat_AddToCart_btn btnColorProCatProduct" : "proCat_AddToCart_btn_afterCart btnColorProCatProductRemoveCart"} onClick={() => handleCart(!addToCartFlag)}>
//                           <span className="pro_addtocart_btn_txt">{!addToCartFlag ? "ADD TO CART" : "REMOVE FROM CART"}</span>
//                         </button>
//                       </div>
//                       {singleProd?.InStockDays !== 0 && (
//                         <p
//                           style={{
//                             margin: "20px 0px 0px 0px",
//                             fontWeight: 500,
//                             fontSize: "18px",
//                             fontFamily: "TT Commons Regular",
//                             color: "#7d7f85",
//                           }}
//                         >
//                           Express Shipping in Stock {singleProd?.InStockDays} Days Delivery
//                         </p>
//                       )}
//                       {singleProd?.MakeOrderDays != 0 && (
//                         <p
//                           style={{
//                             margin: "0px",
//                             fontWeight: 500,
//                             fontSize: "18px",
//                             fontFamily: "TT Commons Regular",
//                             color: "#7d7f85",
//                           }}
//                         >
//                           Make To Order {singleProd?.MakeOrderDays} Days Delivery
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <button className="proDuct_swiper_button_prev" onClick={handlePrev} style={{ backgroundColor: "transparent", border: "none" }}>
//               <HiOutlineChevronLeft className="rightIconeP" />
//             </button>
//             <button className="proDuct_swiper_button_next" onClick={handleNext} style={{ backgroundColor: "transparent", border: "none" }}>
//               <HiOutlineChevronRight className="rightIconeP" />
//             </button>
//           </div>
//         </Swiper>
//       </Box>
//     </>
//   );
// };

// export default DetailBlock;

// {
//     `
//     see what i have to make i wnat slider base product detail page with produtt image left side and right side derail section exct which current and have an left and right cevron button for chnaging product jus us this buttondont think anythnig
//     the th left panel shoudl stikcy and detil panel shoudl scrolable but with classy tsicky ont usinh heigh okay and image logic shouddl exctlyu same for thumb but also there scroling chevron if it get more okay

//     `
// }

//   {storeInit?.IsProductWebCustomization === 1 &&
//                   metalTypeCombo?.length > 0 &&
//                   storeInit?.IsMetalCustomization === 1 && (
//                     <div className="db-customize-section">
//                       {/* Metal Type */}
//                       <div className="db-field-row">
//                         <label className="db-field-label">Metal Type</label>
//                         {singleProd?.IsMrpBase === 1 ? (
//                           <span className="db-field-value">
//                             {metalTypeCombo?.find((e) => e?.Metalid === singleProd?.MetalPurityid)?.metaltype}
//                           </span>
//                         ) : (
//                           <select
//                             className="db-classy-select"
//                             value={selectMtType}
//                             onChange={(e) => handleCustomChange(e, "mt")}
//                           >
//                             {metalTypeCombo.map((ele) => (
//                               <option key={ele?.Metalid} value={ele?.metaltype}>
//                                 {ele?.metaltype}
//                               </option>
//                             ))}
//                           </select>
//                         )}
//                       </div>

//                       {/* Metal Color */}
//                       {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
//                         <div className="db-field-row">
//                           <label className="db-field-label">Metal Color</label>
//                           {singleProd?.IsMrpBase === 1 ? (
//                             <span className="db-field-value">
//                               {metalColorCombo?.find((e) => e?.id === singleProd?.MetalColorid)?.metalcolorname}
//                             </span>
//                           ) : (
//                             <select
//                               className="db-classy-select"
//                               value={selectMtColor}
//                               onChange={(e) => handleMetalWiseColorImg(e)}
//                             >
//                               {metalColorCombo.map((ele) => (
//                                 <option key={ele?.id} value={ele?.colorcode}>
//                                   {ele?.metalcolorname}
//                                 </option>
//                               ))}
//                             </select>
//                           )}
//                         </div>
//                       )}

//                       {/* Diamond */}
//                       {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
//                         <div className="db-field-row">
//                           <label className="db-field-label">Diamond</label>
//                           {singleProd?.IsMrpBase === 1 ? (
//                             <span className="db-field-value">{singleProd?.DiaQuaCol}</span>
//                           ) : (
//                             <select
//                               className="db-classy-select"
//                               value={selectDiaQc}
//                               onChange={(e) => handleCustomChange(e, "dia")}
//                             >
//                               {diaQcCombo.map((ele) => (
//                                 <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
//                                   {`${ele?.Quality},${ele?.color}`}
//                                 </option>
//                               ))}
//                             </select>
//                           )}
//                         </div>
//                       ) : null}

//                       {/* Color Stone */}
//                       {storeInit?.IsCsCustomization === 1 &&
//                         selectCsQc?.length > 0 &&
//                         csList?.filter((e) => e?.D !== "MISC")?.length > 0 ? (
//                         <div className="db-field-row">
//                           <label className="db-field-label">Color Stone</label>
//                           {singleProd?.IsMrpBase === 1 ? (
//                             <span className="db-field-value">{singleProd?.CsQuaCol}</span>
//                           ) : (
//                             <select
//                               className="db-classy-select"
//                               value={selectCsQc}
//                               onChange={(e) => handleCustomChange(e, "cs")}
//                             >
//                               {csQcCombo.map((ele) => (
//                                 <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
//                                   {`${ele?.Quality},${ele?.color}`}
//                                 </option>
//                               ))}
//                             </select>
//                           )}
//                         </div>
//                       ) : null}

//                       {/* Size */}
//                       {SizeSorting(SizeCombo?.rd)?.length > 0 && singleProd?.DefaultSize !== "" && (
//                         <div className="db-field-row">
//                           <label className="db-field-label">Size</label>
//                           {singleProd?.IsMrpBase === 1 ? (
//                             <span className="db-field-value">{singleProd?.DefaultSize}</span>
//                           ) : (
//                             <select
//                               className="db-classy-select"
//                               value={sizeData}
//                               onChange={(e) => handleCustomChange(e, "sz")}
//                             >
//                               {SizeCombo?.rd?.map((ele) => (
//                                 <option value={ele?.sizename} key={ele?.id}>
//                                   {ele?.sizename}
//                                 </option>
//                               ))}
//                             </select>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}





























// Org

// <Swiper
//               ref={swiperMainRef}
//               spaceBetween={10}
//               lazy={true}
//               navigation={true}
//               breakpoints={{
//                 1024: {
//                   slidesPerView: 4,
//                 },
//                 768: {
//                   slidesPerView: 2,
//                 },
//                 0: {
//                   slidesPerView: 2,
//                 },
//               }}
//               modules={[Keyboard, FreeMode, Navigation]}
//               keyboard={{ enabled: true }}
//               pagination={false}
//               onSlideChange={onSlideChange}
//             >
//               <div className="proCat_prod_detail_main">
//                 <IoArrowBack
//                   style={{
//                     height: "35px",
//                     width: "35px",
//                     margin: "20px 0px 0px 50px",
//                     cursor: "pointer",
//                     color: "rgba(143, 140, 139, 0.9019607843)",
//                   }}
//                   onClick={() => navigate.back()}
//                 />
//                 <div className="proCat_prod_image_shortInfo">
//                   {/* <div>
//                   <span>{"<"}</span>
//                 </div> */}

//                   <div className="proCat_prod_image_Sec">
//                     {/* {isImageload && ( */}
//                     {(isImageload || imagePromise) && (
//                       <Skeleton
//                         sx={{
//                           width: "95%",
//                           height: "750px",
//                           margin: "20px 0 0 0",
//                         }}
//                         variant="rounded"
//                       />
//                     )}

//                     <div className="proCat_main_prod_img" style={{ display: isImageload || imagePromise ? "none" : "block" }}>
//                       {selectedThumbImg?.type == "img" ? (
//                         <img
//                           src={selectedThumbImg?.link?.imageUrl}
//                           // src={imageSrc}
//                           onError={(e) => {
//                             e.target.src = imageNotFound;
//                             e.target.alt = "no-image-found";
//                           }}
//                           onLoad={() => {
//                             if (nextindex > 0) {
//                               setTimeout(() => {
//                                 setProdLoading(false);
//                                 // setImagePromise(false);
//                               }, 500);
//                             } else {
//                               setProdLoading(false);
//                               // setImagePromise(false);
//                             }
//                           }}
//                           alt={""}
//                           className="proCat_prod_img"
//                         />
//                       ) : (
//                         <div className="proCat_prod_video">
//                           <video
//                             src={pdVideoArr?.length > 0 ? selectedThumbImg?.link?.imageUrl : imageNotFound}
//                             loop={true}
//                             autoPlay={true}
//                             style={{
//                               width: "100%",
//                               objectFit: "cover",
//                               marginTop: "40px",
//                               // height: "90%",
//                               borderRadius: "8px",
//                             }}
//                             onError={(e) => {
//                               e.target.poster = imageNotFound;
//                               e.target.alt = "no-image-found";
//                             }}
//                           />
//                         </div>
//                       )}

//                       <div className="proCat_thumb_prod_img">
//                         {(pdThumbImg?.length > 1 || pdVideoArr?.length > 0) &&
//                           pdThumbImg?.map((ele, i) => {
//                             const firstHalf = ele?.thumbImageUrl?.split("/Design_Thumb")[0];
//                             const secondhalf = ele?.thumbImageUrl?.split("/Design_Thumb")[1]?.split(".")[0];
//                             return (
//                               <img
//                                 key={ele?.thumbImageUrl}
//                                 src={ele?.thumbImageUrl ? ele?.thumbImageUrl : ele}
//                                 alt={""}
//                                 className="proCat_prod_thumb_img"
//                                 onLoad={() => {
//                                   if (nextindex > 0) {
//                                     setTimeout(() => {
//                                       setProdLoading(false);
//                                       // setImagePromise(false);
//                                     }, 500);
//                                   } else {
//                                     setProdLoading(false);
//                                     // setImagePromise(false);
//                                   }
//                                 }}
//                                 onClick={() => {
//                                   setSelectedThumbImg({
//                                     // link: ele.replace('Design_Thumb/', ''),
//                                     link: {
//                                       imageUrl: `${firstHalf}${secondhalf}.${ele?.originalImageExtension}`,
//                                       extension: `${ele?.originalImageExtension}`,
//                                     },
//                                     type: "img",
//                                   });
//                                   setThumbImgIndex(i);
//                                 }}
//                                 onError={(e) => {
//                                   e.target.src = imageNotFound;
//                                   e.target.alt = "no-image-found";
//                                 }}
//                               />
//                             );
//                           })}
//                         {filteredVideos?.map((data) => (
//                           <div
//                             style={{
//                               position: "relative",
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                             }}
//                             onClick={() =>
//                               // setSelectedThumbImg({
//                               //   link: data,
//                               //   type: "vid",
//                               // })
//                               setSelectedThumbImg({
//                                 link: {
//                                   imageUrl: data,
//                                   extension: "mp4",
//                                 },
//                                 type: "vid",
//                               })
//                             }
//                           >
//                             <video
//                               src={data}
//                               autoPlay={true}
//                               loop={true}
//                               className="proCat_prod_thumb_img"
//                               style={{ height: "70px", objectFit: "cover" }}
//                               onError={(e) => {
//                                 e.target.poster = imageNotFound;
//                                 e.target.alt = "no-image-found";
//                               }}
//                             />
//                             <IoIosPlayCircle
//                               style={{
//                                 position: "absolute",
//                                 color: "white",
//                                 width: "35px",
//                                 height: "35px",
//                               }}
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="proCat_prod_shortInfo">
//                     <div className="proCat_prod_shortInfo_inner">
//                       <p className="proCat_prod_titleLine">{formatTitleLine(singleProd?.TitleLine) && singleProd?.TitleLine}</p>
//                       <div className="proCat_prod_summury_info">
//                         <div className="proCat_prod_summury_info_inner">
//                           <span className="proCat_single_prod_designno">
//                             {singleProd?.designno}
//                             {prodLoading == false && <div className="proCat_app_productDetail_label">{singleProd?.StatusId == 1 ? <span className="proCat_app_Deatil_instock">In Stock</span> : singleProd?.StatusId == 2 ? <span className="proCat_app_deatil_MEMO">In memo</span> : <span className="proCat_app_Make_to_order">Make To Order</span>}</div>}
//                           </span>
//                           <span className="proCat_prod_short_key">
//                             Metal Purity : <span className="proCat_prod_short_val">{selectMtType}</span>
//                           </span>
//                           <span className="proCat_prod_short_key">
//                             Metal Color : <span className="proCat_prod_short_val">{metalColorName()}</span>
//                           </span>
//                           {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
//                             <span className="proCat_prod_short_key">
//                               Diamond Quality Color : <span className="proCat_prod_short_val">{`${selectDiaQc}`}</span>
//                             </span>
//                           ) : null}
//                           <span className="proCat_prod_short_key">
//                             NWT : <span className="proCat_prod_short_val">{(singleProd1?.Nwt ?? singleProd?.Nwt)?.toFixed(3)}</span>
//                           </span>
//                           {Almacarino === 1 && (
//                             <span className="proCat_prod_short_key">
//                               GWT : <span className="proCat_prod_short_val">{(singleProd1?.Gwt ?? singleProd?.Gwt)?.toFixed(3)}</span>
//                             </span>
//                           )}
//                           {descriptionText?.length > 0 && (
//                             <div className={`proCat_prod_description ${isExpanded ? "proCat_show-more" : ""}`}>
//                               <p className="proCat_description-text" ref={descriptionRef}>
//                                 {descriptionText}
//                               </p>

//                               {isClamped &&
//                                 !isExpanded && ( // Show "Show More" only if text is clamped and not expanded
//                                   <span className="proCat_toggle-text" onClick={toggleText}>
//                                     Show More
//                                   </span>
//                                 )}

//                               {isExpanded && ( // Show "Show Less" when the description is expanded
//                                 <span className="proCat_toggle-text" onClick={toggleText}>
//                                   Show Less
//                                 </span>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       {storeInit?.IsProductWebCustomization == 1 && metalTypeCombo?.length > 0 && storeInit?.IsMetalCustomization === 1 && (
//                         <div className="proCat_single_prod_customize">
//                           <div className="proCat_single_prod_customize_metal">
//                             <label className="menuItemTimeEleveDeatil">METAL TYPE:</label>
//                             {singleProd?.IsMrpBase == 1 ? (
//                               <span className="menuitemSelectoreMain">{metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}</span>
//                             ) : (
//                               <select
//                                 className="menuitemSelectoreMain"
//                                 value={selectMtType}
//                                 onChange={(e) => handleCustomChange(e, "mt")}
//                               // onChange={(e) => setSelectMtType(e.target.value)}
//                               >
//                                 {metalTypeCombo.map((ele) => (
//                                   <option key={ele?.Metalid} value={ele?.metaltype}>
//                                     {ele?.metaltype}
//                                   </option>
//                                 ))}
//                               </select>
//                             )}
//                           </div>
//                           {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
//                             <div className="proCat_single_prod_customize_outer">
//                               <label className="menuItemTimeEleveDeatil">METAL COLOR:</label>
//                               {singleProd?.IsMrpBase == 1 ? (
//                                 <span className="menuitemSelectoreMain">{metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}</span>
//                               ) : (
//                                 <select className="menuitemSelectoreMain" value={selectMtColor} onChange={(e) => handleMetalWiseColorImg(e)}>
//                                   {metalColorCombo?.map((ele) => (
//                                     <option key={ele?.id} value={ele?.colorcode}>
//                                       {ele?.metalcolorname}
//                                     </option>
//                                   ))}
//                                 </select>
//                               )}
//                             </div>
//                           )}
//                           {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
//                             <div className="proCat_single_prod_customize_outer">
//                               <label className="menuItemTimeEleveDeatil">DIAMOND :</label>
//                               {singleProd?.IsMrpBase == 1 ? (
//                                 <>
//                                   <span className="menuitemSelectoreMain">{singleProd?.DiaQuaCol}</span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <select
//                                     className="menuitemSelectoreMain"
//                                     value={selectDiaQc}
//                                     // onChange={(e) => setSelectDiaQc(e.target.value)}
//                                     onChange={(e) => handleCustomChange(e, "dia")}
//                                   >
//                                     {diaQcCombo.map((ele) => (
//                                       <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
//                                     ))}
//                                   </select>
//                                 </>
//                               )}
//                             </div>
//                           ) : null}
//                           {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 ? (
//                             <div className="proCat_single_prod_customize_outer">
//                               <label className="menuItemTimeEleveDeatil">COLOR STONE :</label>
//                               {singleProd?.IsMrpBase == 1 ? (
//                                 <span className="menuitemSelectoreMain">{singleProd?.CsQuaCol}</span>
//                               ) : (
//                                 <select className="menuitemSelectoreMain" value={selectCsQc} onChange={(e) => handleCustomChange(e, "cs")}>
//                                   {csQcCombo.map((ele, i) => (
//                                     <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
//                                   ))}
//                                 </select>
//                               )}
//                             </div>
//                           ) : null}
//                           {/* {console.log("sizeData",SizeCombo?.find((size) => size.IsDefaultSize === 1)?.sizename)} */}
//                           {SizeSorting(SizeCombo?.rd)?.length > 0 && singleProd?.DefaultSize !== "" && (
//                             <div className="proCat_single_prod_customize_outer">
//                               <label className="menuItemTimeEleveDeatil">SIZE:</label>
//                               {singleProd?.IsMrpBase == 1 ? (
//                                 <span className="menuitemSelectoreMain">{singleProd?.DefaultSize}</span>
//                               ) : (
//                                 <select
//                                   className="menuitemSelectoreMain"
//                                   value={sizeData}
//                                   onChange={(e) => handleCustomChange(e, "sz")}
//                                 >
//                                   {SizeCombo?.rd?.map((ele) => (
//                                     <option
//                                       value={ele?.sizename}
//                                       key={ele?.id}
//                                     >
//                                       {ele?.sizename}
//                                     </option>
//                                   ))}
//                                 </select>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       {storeInit?.IsPriceShow == 1 && storeInit?.IsPriceBreakUp == 1 && (singleProd ?? singleProd1)?.IsMrpBase != 1 && (
//                         <Accordion
//                           elevation={0}
//                           sx={{
//                             borderBottom: "1px solid #c7c8c9",
//                             borderRadius: 0,
//                             "&.MuiPaper-root.MuiAccordion-root:last-of-type": {
//                               borderBottomLeftRadius: "0px",
//                               borderBottomRightRadius: "0px",
//                             },
//                             "&.MuiPaper-root.MuiAccordion-root:before": {
//                               background: "none",
//                             },
//                             width: "95.5%",
//                           }}
//                         >
//                           <AccordionSummary
//                             expandIcon={<ExpandMoreIcon sx={{ width: "20px" }} />}
//                             aria-controls="panel1-content"
//                             id="panel1-header"
//                             sx={{
//                               color: "#7d7f85 !important",
//                               borderRadius: 0,

//                               "&.MuiAccordionSummary-root": {
//                                 padding: 0,
//                               },
//                             }}
//                           // className="filtercategoryLable"
//                           >
//                             <Typography
//                               sx={{
//                                 fontFamily: "TT Commons Regular",
//                                 fontSize: "18px",
//                               }}
//                             >
//                               Price Breakup
//                             </Typography>
//                           </AccordionSummary>
//                           <AccordionDetails
//                             sx={{
//                               display: "flex",
//                               flexDirection: "column",
//                               gap: "4px",
//                               padding: "0 0 16px 0",
//                             }}
//                           >
//                             {(singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost) !== 0 ? (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <Typography
//                                   className="proCat_Price_breakup_label"
//                                   sx={{
//                                     fontFamily: "TT Commons Regular",
//                                   }}
//                                 >
//                                   Metal
//                                 </Typography>
//                                 <span style={{ display: "flex" }}>
//                                   <Typography>
//                                     {
//                                       <span
//                                         className="proCat_currencyFont"
//                                         sx={{
//                                           fontFamily: "TT Commons Regular",
//                                         }}
//                                       >
//                                         {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                       </span>
//                                     }
//                                   </Typography>
//                                   &nbsp;
//                                   <Typography
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                     className="proCat_PriceBreakup_Price"
//                                   >
//                                     {formatter.format((singleProd1?.Metal_Cost ?? singleProd?.Metal_Cost)?.toFixed(2))}
//                                   </Typography>
//                                 </span>
//                               </div>
//                             ) : null}

//                             {(singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost) !== 0 ? (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <Typography
//                                   className="proCat_Price_breakup_label"
//                                   sx={{
//                                     fontFamily: "TT Commons Regular",
//                                   }}
//                                 >
//                                   Diamond{" "}
//                                 </Typography>

//                                 <span style={{ display: "flex" }}>
//                                   <Typography>
//                                     {
//                                       <span
//                                         className="proCat_currencyFont"
//                                         sx={{
//                                           fontFamily: "TT Commons Regular",
//                                         }}
//                                       >
//                                         {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                       </span>
//                                     }
//                                   </Typography>
//                                   &nbsp;
//                                   <Typography
//                                     className="proCat_PriceBreakup_Price"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {formatter.format((singleProd1?.Diamond_Cost ?? singleProd?.Diamond_Cost)?.toFixed(2))}
//                                   </Typography>
//                                 </span>
//                               </div>
//                             ) : null}

//                             {(singleProd1?.ColorStone_Cost ?? singleProd?.ColorStone_Cost) !== 0 ? (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <Typography
//                                   className="proCat_Price_breakup_label"
//                                   sx={{
//                                     fontFamily: "TT Commons Regular",
//                                   }}
//                                 >
//                                   Stone{" "}
//                                 </Typography>

//                                 <span style={{ display: "flex" }}>
//                                   <Typography>
//                                     {
//                                       <span
//                                         className="proCat_currencyFont"
//                                         sx={{
//                                           fontFamily: "TT Commons Regular",
//                                         }}
//                                       >
//                                         {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                       </span>
//                                     }
//                                   </Typography>
//                                   &nbsp;
//                                   <Typography
//                                     className="proCat_PriceBreakup_Price"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {formatter.format((singleProd1?.ColorStone_Cost ?? singleProd?.ColorStone_Cost)?.toFixed(2))}
//                                   </Typography>
//                                 </span>
//                               </div>
//                             ) : null}

//                             {(singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost) !== 0 ? (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <Typography
//                                   className="proCat_Price_breakup_label"
//                                   sx={{
//                                     fontFamily: "TT Commons Regular",
//                                   }}
//                                 >
//                                   MISC{" "}
//                                 </Typography>

//                                 <span style={{ display: "flex" }}>
//                                   <Typography>
//                                     {
//                                       <span
//                                         className="proCat_currencyFont"
//                                         sx={{
//                                           fontFamily: "TT Commons Regular",
//                                         }}
//                                       >
//                                         {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                       </span>
//                                     }
//                                   </Typography>
//                                   &nbsp;
//                                   <Typography
//                                     className="proCat_PriceBreakup_Price"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {formatter.format((singleProd1?.Misc_Cost ?? singleProd?.Misc_Cost)?.toFixed(2))}
//                                   </Typography>
//                                 </span>
//                               </div>
//                             ) : null}

//                             {formatter.format((singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost)?.toFixed(2)) !== 0 ? (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <Typography
//                                   className="proCat_Price_breakup_label"
//                                   sx={{
//                                     fontFamily: "TT Commons Regular",
//                                   }}
//                                 >
//                                   Labour{" "}
//                                 </Typography>

//                                 <span style={{ display: "flex" }}>
//                                   <Typography>
//                                     {
//                                       <span
//                                         className="proCat_currencyFont"
//                                         sx={{
//                                           fontFamily: "TT Commons Regular",
//                                         }}
//                                       >
//                                         {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                       </span>
//                                     }
//                                   </Typography>
//                                   &nbsp;
//                                   <Typography
//                                     className="proCat_PriceBreakup_Price"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {formatter.format((singleProd1?.Labour_Cost ?? singleProd?.Labour_Cost)?.toFixed(2))}
//                                   </Typography>
//                                 </span>
//                               </div>
//                             ) : null}

//                             {(singleProd1?.Other_Cost ?? singleProd?.Other_Cost) + (singleProd1?.Size_MarkUp ?? singleProd?.Size_MarkUp) + (singleProd1?.DesignMarkUpAmount ?? singleProd?.DesignMarkUpAmount) + (singleProd1?.ColorStone_SettingCost ?? singleProd?.ColorStone_SettingCost) + (singleProd1?.Diamond_SettingCost ?? singleProd?.Diamond_SettingCost) + (singleProd1?.Misc_SettingCost ?? singleProd?.Misc_SettingCost) !== 0 ? (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <Typography
//                                   className="proCat_Price_breakup_label"
//                                   sx={{
//                                     fontFamily: "TT Commons Regular",
//                                   }}
//                                 >
//                                   Other{" "}
//                                 </Typography>

//                                 <span style={{ display: "flex" }}>
//                                   <Typography>
//                                     {
//                                       <span
//                                         className="proCat_currencyFont"
//                                         sx={{
//                                           fontFamily: "TT Commons Regular",
//                                         }}
//                                       >
//                                         {loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}
//                                       </span>
//                                     }
//                                   </Typography>
//                                   &nbsp;
//                                   <Typography
//                                     className="proCat_PriceBreakup_Price"
//                                     sx={{
//                                       fontFamily: "TT Commons Regular",
//                                     }}
//                                   >
//                                     {formatter.format(((singleProd1?.Other_Cost ?? singleProd?.Other_Cost) + (singleProd1?.Size_MarkUp ?? singleProd?.Size_MarkUp) + (singleProd1?.DesignMarkUpAmount ?? singleProd?.DesignMarkUpAmount) + (singleProd1?.ColorStone_SettingCost ?? singleProd?.ColorStone_SettingCost) + (singleProd1?.Diamond_SettingCost ?? singleProd?.Diamond_SettingCost) + (singleProd1?.Misc_SettingCost ?? singleProd?.Misc_SettingCost))?.toFixed(2))}
//                                   </Typography>
//                                 </span>
//                               </div>
//                             ) : null}
//                           </AccordionDetails>
//                         </Accordion>
//                       )}

//                       {storeInit?.IsPriceShow == 1 && (
//                         <div className="proCat_price_portion">
//                           {isPriceloading ? "" : <span className="proCat_currencyFont">{loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}</span>}
//                           &nbsp;
//                           {isPriceloading ? <Skeleton variant="rounded" width={140} height={30} /> : formatter.format(singleProd1?.UnitCostWithMarkUp ?? singleProd?.UnitCostWithMarkUp)}
//                         </div>
//                       )}

//                       {prodLoading ? null : (
//                         <div>
//                           <div className="Smr_CartAndWish_portion">
//                             <button className={!addToCartFlag ? "proCat_AddToCart_btn btnColorProCatProduct" : "proCat_AddToCart_btn_afterCart btnColorProCatProductRemoveCart"} onClick={() => handleCart(!addToCartFlag)}>
//                               <span className="pro_addtocart_btn_txt">{!addToCartFlag ? "ADD TO CART" : "REMOVE FROM CART"}</span>
//                             </button>
//                           </div>
//                           {singleProd?.InStockDays !== 0 && (
//                             <p
//                               style={{
//                                 margin: "20px 0px 0px 0px",
//                                 fontWeight: 500,
//                                 fontSize: "18px",
//                                 fontFamily: "TT Commons Regular",
//                                 color: "#7d7f85",
//                               }}
//                             >
//                               Express Shipping in Stock {singleProd?.InStockDays} Days Delivery
//                             </p>
//                           )}
//                           {singleProd?.MakeOrderDays != 0 && (
//                             <p
//                               style={{
//                                 margin: "0px",
//                                 fontWeight: 500,
//                                 fontSize: "18px",
//                                 fontFamily: "TT Commons Regular",
//                                 color: "#7d7f85",
//                               }}
//                             >
//                               Make To Order {singleProd?.MakeOrderDays} Days Delivery
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   className="proDuct_swiper_button_prev"
//                   onClick={handlePrev}
//                   style={{ backgroundColor: "transparent", border: "none" }}
//                 >
//                   <HiOutlineChevronLeft className="rightIconeP" />
//                 </button>
//                 <button
//                   className="proDuct_swiper_button_next"
//                   onClick={handleNext}
//                   style={{ backgroundColor: "transparent", border: "none" }}
//                 >
//                   <HiOutlineChevronRight className="rightIconeP" />
//                 </button>
//               </div>
//             </Swiper>