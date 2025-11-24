"use client"
import React, { useEffect, useState } from 'react'
import './TrendingView.modul.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatRedirectTitleLine, formatter, formatTitleLine, storImagePath } from '@/app/(core)/utils/Glob_Functions/GlobalFunction';
import { Get_Tren_BestS_NewAr_DesigSet_Album } from '@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album';
import pako from "pako";
import Cookies from 'js-cookie';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';

const TrendingView = ({ data, storeInit }) => {
    const { loginUserDetail, islogin } = useStore();
    const { push } = useNextRouterLikeRR();
    const [trandingViewData, setTrandingViewData] = useState([]);
    const [imageUrl, setImageUrl] = useState();

    const [ring1ImageChange, setRing1ImageChange] = useState(false);
    const navigation = push;
    const [oddNumberObjects, setOddNumberObjects] = useState([]);
    const [evenNumberObjects, setEvenNumberObjects] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [validatedData, setValidatedData] = useState([]);
    const imageNotFound = "/image-not-found.jpg";

    const isOdd = (num) => num % 2 !== 0;

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        // prevArrow: false, 
        // nextArrow: false,
    };

    useEffect(() => {
        setImageUrl(storeInit?.CDNDesignImageFolThumb);
        const { IsB2BWebsite } = storeInit;
        const visiterID = Cookies.get('visiterId');
        let finalID;
        if (IsB2BWebsite == 0) {
            finalID = islogin === false ? visiterID : (loginUserDetail?.id || '0');
        } else {
            finalID = loginUserDetail?.id || '0';
        }


        Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, "GETTrending", finalID).then((response) => {
            if (response?.Data?.rd) {
                setTrandingViewData(response?.Data?.rd);

                const oddNumbers = response.Data.rd.filter(obj => isOdd(obj.SrNo));
                const evenNumbers = response.Data.rd.filter(obj => !isOdd(obj.SrNo));

                // Setting states with the separated objects
                setOddNumberObjects(oddNumbers);
                setEvenNumberObjects(evenNumbers);
            }
        }).catch((err) => console.log(err))
    }, [])

    const ProdCardImageFunc = (pd) => {
        let finalprodListimg;
        if (pd?.ImageCount > 0) {
            finalprodListimg = imageUrl + pd?.designno + "_" + 1 + "." + pd?.ImageExtension
        }
        else {
            finalprodListimg = imageNotFound;
        }
        return finalprodListimg
    }

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);
            const compressed = pako.deflate(uint8Array, { to: 'string' });
            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error('Error compressing and encoding:', error);
            return null;
        }
    };

    const handleNavigation = (designNo, autoCode, titleLine) => {
        const storeInit = JSON.parse(sessionStorage.getItem('storeInit')) ?? "";
        const { IsB2BWebsite } = storeInit;

        let obj = {
            a: autoCode,
            b: designNo,
            m: loginUserDetail?.MetalId,
            d: loginUserDetail?.cmboDiaQCid,
            c: loginUserDetail?.cmboCSQCid,
            f: {}
        }
        let encodeObj = compressAndEncode(JSON.stringify(obj))

        // if(IsB2BWebsite === 1){
        //     navigation(`/productdetail/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
        // }else{
        // navigation(`/d/${titleLine.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? "_" : ""}${designNo}?p=${encodeObj}`)
        navigation(`/d/${formatRedirectTitleLine(titleLine)}${designNo}?p=${encodeURIComponent(encodeObj)}`);
        // }
    }

    const checkImageAvailability = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(imageNotFound);
            img.src = url;
        });
    };

    const validateImageURLs = async () => {
        if (!trandingViewData?.length) return;
        const validatedData = await Promise.all(
            trandingViewData.map(async (item) => {
                const defaultImageURL = `${imageUrl}${item?.designno}~1.jpg`;
                const RollOverImageURL = `${imageUrl}${item?.designno}~2.jpg`;
                // const defaultImageURL = `${imageUrl}${item?.designno}~1.${item?.ImageExtension}`;
                // const RollOverImageURL = `${imageUrl}${item?.designno}~2.${item?.ImageExtension}`;
                // const validatedURL1 = await checkImageAvailability(defaultImageURL);
                // const validatedURL2 = await checkImageAvailability(RollOverImageURL);
                // return { ...item, defaultImageURL: validatedURL1, RollOverImageURL: validatedURL2 };
                return { ...item, defaultImageURL: defaultImageURL, RollOverImageURL: RollOverImageURL };
            })
        );
        setValidatedData(validatedData);
    };

    useEffect(() => {
        validateImageURLs();
    }, [trandingViewData]);

    const handleMouseEnterRing1 = (data) => {
        if (data?.ImageCount > 1) {
            setHoveredItem(data.SrNo);
            setRing1ImageChange(true)
        }
    }
    const handleMouseLeaveRing1 = () => {
        setHoveredItem(null);
        setRing1ImageChange(false)
    }


    const chunkedData = [];
    for (let i = 0; i < validatedData?.length; i += 3) {
        chunkedData.push(validatedData?.slice(i, i + 3));
    }
    return (
        <div>
            {validatedData?.length != 0 &&
                <div className='smr_trendingViewTopMain'>
                    <div className='smr_trendingViewTopMain_div'>
                        <div className='smr_trendingViewTopMain_Imgdiv'>
                            <img src={`${storImagePath()}/images/HomePage/TrendingViewBanner/TrendingViewImg.jpg`} className='linkingLoveImageDesign' alt="Trending View Banner" />
                        </div>
                        <div className='smr_trendingViewTopMain_Sliderdiv'>
                            <p className='linkingTitle'>Trending View</p>
                            <Slider {...settings} >
                                {chunkedData?.map((chunk, index) => (
                                    <div className='linkRingLove'>
                                        {chunk?.map((data, dataIndex) => (
                                            <div className='smr_TrendingMainDiv'>
                                                <div className='linkLoveRing1' onClick={() => handleNavigation(data?.designno, data?.autocode, data?.TitleLine)}>
                                                    <img src={hoveredItem === data.SrNo ?
                                                        data?.RollOverImageURL
                                                        :
                                                        data?.defaultImageURL
                                                        // `${imageUrl}${data.designno === undefined ? '' : data?.designno}_2.${data?.ImageExtension === undefined ? '' : data.ImageExtension}`
                                                        // :
                                                        // `${imageUrl}${data.designno === undefined ? '' : data?.designno}_1.${data?.ImageExtension === undefined ? '' : data.ImageExtension}`
                                                    } className='likingLoveImages'
                                                        onMouseEnter={() => handleMouseEnterRing1(data)} onMouseLeave={handleMouseLeaveRing1}
                                                        onError={(e) => {
                                                            e.target.src = imageNotFound;
                                                            e.target.alt = "no-image-found"
                                                        }}
                                                        alt='Trending View Product'
                                                        loading='lazy'
                                                    />
                                                </div>
                                                <div className='linkLoveRing1Desc'>
                                                    <p className='ring1Desc'>{formatTitleLine(data?.TitleLine) && data?.TitleLine}</p>
                                                    <p className='ring1Desc'>
                                                        <span className="smr_currencyFont">
                                                            {loginUserDetail?.CurrencyCode ?? storeInit?.CurrencyCode}
                                                        </span> &nbsp;
                                                        {formatter(data?.UnitCostWithMarkUp)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                                }
                            </Slider>
                            <p className='smr_TrendingViewAll' onClick={() => navigation(`/p/Trending/?T=${btoa('Trending')}`)}>SHOP COLLECTION</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default TrendingView

