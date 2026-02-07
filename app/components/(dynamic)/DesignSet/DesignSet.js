"use client"
import React, { useEffect, useState } from 'react';
import './DesignSet.modul.scss';
import { Get_Tren_BestS_NewAr_DesigSet_Album } from '@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album';
import Pako from 'pako';
import Cookies from 'js-cookie';
import { Link } from '@mui/material';
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";


const DesignSet = ({ data, storeInit }) => {
    const location = useNextRouterLikeRR();
    const { islogin, loginUserDetail } = useStore()
    const [imageUrl, setImageUrl] = useState();
    const [designSetList, setDesignSetList] = useState([]);
    const [swiper, setSwiper] = useState(null);
    const navigate = location.push;
    const imageNotFound = './Assets/image-not-found.jpg';

    useEffect(() => {

        const visiterID = Cookies.get('visiterId');
        let finalID;
        if (storeInit?.IsB2BWebsite == 0) {
            finalID = islogin === false ? visiterID : (loginUserDetail?.id || '0');
        } else {
            finalID = loginUserDetail?.id || '0';
        }

        setImageUrl(storeInit?.DesignSetImageFol);

        Get_Tren_BestS_NewAr_DesigSet_Album(storeInit, 'GETDesignSet', finalID)
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
            finalprodListimg = imageUrl + pd?.designsetuniqueno + '/' + pd?.DefaultImageName;
        } else {
            finalprodListimg = imageNotFound;
        }
        return finalprodListimg;
    };

    const compressAndEncode = (inputString) => {
        try {
            const uint8Array = new TextEncoder().encode(inputString);
            const compressed = Pako.deflate(uint8Array, { to: 'string' });
            return btoa(String.fromCharCode.apply(null, compressed));
        } catch (error) {
            console.error('Error compressing and encoding:', error);
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
        navigate(`/d/${titleLine?.replace(/\s+/g, `_`)}${titleLine?.length > 0 ? '_' : ''}${designNo}?p=${encodeURIComponent(encodeObj)}`);
    };

    const decodeEntities = (html) => {
        var txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    const onSwiperInit = (swiper) => {
        console.log('Swiper initialized:', swiper);
        setSwiper(swiper);
    };


    const [showAll, setShowAll] = useState(false);

    const handleViewAll = () => {
        setShowAll(true);
    };

    // Determine the items to show
    const itemsToShow = showAll ? designSetList.slice(1) : designSetList.slice(1, 7);
    const handleNavigate = () => {
        navigate("/Lookbook");
    }


    return (
        <div className="smr_designSetMain">

            <p className='smr_desognSetTitle'>Complete Your Look
                <Link className='smr_designSetViewmoreBtn' onClick={handleNavigate}>
                    View more
                </Link>
            </p>
            <div className='smr_designSetMainDiv'>
                <div className='smr_designSetDiv1'>
                    <img className="smr_designSetDiv1_img" alt="Design Set" loading="lazy" src={`${imageUrl}${designSetList[0]?.designsetuniqueno}/${designSetList[0]?.DefaultImageName}`} onClick={() => handleNavigation(designSetList[0]?.designno, designSetList[0]?.autocode, designSetList[0]?.TitleLine ? designSetList[0]?.TitleLine : '')} />
                </div>
                <div className='smr_designSetDiv2'>
                    {itemsToShow?.map((slide, index) => (
                        <div className="smr_designSetDiv" key={index}>
                            <img
                                className="image"
                                loading="lazy"

                                src={ProdCardImageFunc(slide)}
                                alt={`Slide ${index}`}
                                onClick={() => handleNavigation(slide?.designno, slide?.autocode, slide?.TitleLine ? slide?.TitleLine : '')}
                            />
                            <p className="smr_designList_title">{slide?.TitleLine}</p>
                        </div>
                    ))}
                    {!showAll && itemsToShow?.length > 6 && (
                        <p className='smr_designSetImageViewAll' onClick={handleViewAll}>View All</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DesignSet;






// import React, { useEffect } from 'react'
// import './DesignSet.modul.scss'
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';

// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import { Get_Tren_BestS_NewAr_DesigSet_Album } from '@/app/(core)/utils/API/Home/Get_Tren_BestS_NewAr_DesigSet_Album/Get_Tren_BestS_NewAr_DesigSet_Album';

// const DesignSet = () => {


//     const [imageUrl, setImageUrl] = useState();
//     const [designSetList, setDesignSetList] = useState('')


//     useEffect(() => {
//         let data = JSON.parse(sessionStorage.getItem('storeInit'))
//         setImageUrl(data?.DesignSetImageFol);

//         Get_Tren_BestS_NewAr_DesigSet_Album("GETDesignSet").then((response) => {
//             if (response?.Data?.rd) {
//                 setDesignSetList(response?.Data?.rd);
//             }
//         }).catch((err) => console.log(err))
//     }, [])

//     const sliderData = [
//         {
//             imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf233YjCHPR7pFu6ACQaPcvObBdQgKLx2pWQ&s",
//             price: '$60,000'
//         },
//         {
//             imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThQqSUiojvwNG6vTqSFW1cLFvskJ44wN0p1-hgfWxOZSs477U7ZyynwghZ9w&s",
//             price: '$75,000'

//         },
//         {
//             imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNaEtB0YUooeWEzCu4yVCuQeKMIjWEG-O2RLsDASRvKAoanUeC99eVAgqdGw&s",
//             price: '$50,000'

//         },
//         {
//             imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5-ND2i2SZDjfq8-EwmK9AJ4E_KTwnIPTyE6iNA3jWYipPF5clk2nBguRvJQ&s",
//             price: '$20,000'

//         },
//         {
//             imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5-ND2i2SZDjfq8-EwmK9AJ4E_KTwnIPTyE6iNA3jWYipPF5clk2nBguRvJQ&s",
//             price: '$80,000'

//         },
//     ];


//     return (
//         <div className='smr_designSetMain' style={{ position: 'relative' }}>
//             <div>
//                 <p className='designSetTitle'>Design Set</p>
//             </div>
//             <div>
//                 <Swiper
//                     slidesPerView={1}
//                     spaceBetween={10}
//                     loop={true}
//                     breakpoints={{
//                         640: {
//                             slidesPerView: 2,
//                             spaceBetween: 0,
//                         },
//                         768: {
//                             slidesPerView: 4,
//                             spaceBetween: 0,
//                         },
//                         1024: {
//                             slidesPerView: 5,
//                             spaceBetween: 0,
//                         },
//                         1240: {
//                             slidesPerView: 4,
//                             spaceBetween: 0,
//                         },
//                     }}
//                     modules={[Pagination, Navigation]}
//                     navigation={{
//                         nextEl: '.swiper-button-next-designSet',
//                         prevEl: '.swiper-button-prev-designSet',
//                     }}
//                     className="mySwiper"
//                 >
//                     {sliderData.map((slide, index) => (
//                         <SwiperSlide key={index} className='srm_designSetMain'>
//                             <div className='smr_designsetDiv'>
//                                 <div className='smr_designsetDivImg'>
//                                     <img loading="lazy"  src={imageUrl + slide?.designsetuniqueno + '/' + slide?.DefaultImageName} alt={`Slide ${index}`} />
//                                 </div>
//                                 <p className='designsetPrice'>{slide.price}</p>
//                             </div>
//                         </SwiperSlide>
//                     ))}
//                     <div className="swiper-button-next-designSet"></div>
//                     <div className="swiper-button-prev-designSet"></div>
//                 </Swiper>
//             </div>

//             <p className='smr_designSetShowAll'>View All</p>
//         </div>
//     )
// }

// export default DesignSet