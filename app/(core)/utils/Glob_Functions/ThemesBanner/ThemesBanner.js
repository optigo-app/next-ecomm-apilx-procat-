import { storImagePath } from "../GlobalFunction";


const format = "png";

const useHomeBannerImages = ({host}) => {
  const bannerData = {
      mainBanner: {
        image: [
          `${host || storImagePath()}/Banner/Homepagemainbanner1.${format}`,
          `${host || storImagePath()}/Banner/Homepagemainbanner2.${format}`,
          `${host || storImagePath()}/Banner/Homepagemainbanner3.${format}`,
          `${host || storImagePath()}/Banner/Homepagemainbanner4.${format}`,
          `${host || storImagePath()}/Banner/Homepagemainbanner5.${format}`,
        ],
        video: [`${host || storImagePath()}/Banner/homepagemainvideo.mp4`, `${host || storImagePath()}/Banner/homepagemainvideo2.mp4`],
      },
      middleBanner: {
        image: [
          `${host || storImagePath()}/Banner/middlebanner1.${format}`,
          `${host || storImagePath()}/Banner/middlebanner2.${format}`,
          `${host || storImagePath()}/Banner/middlebanner3.${format}`,
        ],
        video: [`${host || storImagePath()}/Banner/middlebanner1.mp4`,
        `${host || storImagePath()}/Banner/middlebanner2.mp4`,
        `${host || storImagePath()}/Banner/middlebanner3.mp4`
        ],
      },
      brandlogo: {
        image: [
          `${host || storImagePath()}/Banner/brandlogo1.${format}`,
          `${host || storImagePath()}/Banner/brandlogo2.${format}`,
          `${host || storImagePath()}/Banner/brandlogo3.${format}`,
          `${host || storImagePath()}/Banner/brandlogo4.${format}`,
          `${host || storImagePath()}/Banner/brandlogo5.${format}`,
          `${host || storImagePath()}/Banner/brandlogo6.${format}`,
        ],
        video: [],
      },
      socialMediaBanner2: {
        image: [
          `${host || storImagePath()}/Banner/socialmediabanner1.${format}`,
          `${host || storImagePath()}/Banner/socialmediabanner2.${format}`,
          `${host || storImagePath()}/Banner/socialmediabanner3.${format}`,
          `${host || storImagePath()}/Banner/socialmediabanner4.${format}`,
          `${host || storImagePath()}/Banner/socialmediabanner5.${format}`,
        ],
        video: [],
      },
      trendingBanner: {
        image: [
          `${host || storImagePath()}/Banner/trendingbanner1.${format}`,
          `${host || storImagePath()}/Banner/trendingbanner2.${format}`,
          `${host || storImagePath()}/Banner/trendingbanner3.${format}`,
        ],
        video: [],
      },
      bestsellerBanner: {
        image: [
          `${host || storImagePath()}/Banner/bestsellerbanner1.${format}`,
          `${host || storImagePath()}/Banner/bestsellerbanner2.${format}`,
        ],
        video: [],
      },
      newArrivalBanner: {
        image: [
          `${host || storImagePath()}/Banner/newarrivalbanner1.${format}`,
          `${host || storImagePath()}/Banner/newarrivalbanner2.${format}`,
        ],
        video: [],
      },
      bottomBanner: {
        image: [
          `${host || storImagePath()}/Banner/bottombanner1.${format}`,
          `${host || storImagePath()}/Banner/bottombanner2.${format}`,
        ],
        video: [`${host || storImagePath()}/Banner/bottombannerVideo1.mp4`,],
      },
      lookbookBanner: {
        image: [
          `${host || storImagePath()}/Banner/lookbookbanner1.${format}`,
          `${host || storImagePath()}/Banner/lookbookbanner.${format}`,
        ],
        video: [],
      },
      promotionalBanner: {
        image: [
          `${host || storImagePath()}/Banner/promotionalbanner1.${format}`,
          `${host || storImagePath()}/Banner/promotionalbanner2.${format}`,
          `${host || storImagePath()}/Banner/promotionalbanner3.${format}`,
          `${host || storImagePath()}/Banner/promotionalbanner4.${format}`,
          `${host || storImagePath()}/Banner/promotionalbanner5.${format}`,
        ],
        video: [],
      },
      collectionBanner: {
        image: [
          `${host || storImagePath()}/Banner/collectionbanner1.${format}`,
          `${host || storImagePath()}/Banner/collectionbanner2.${format}`,
          `${host || storImagePath()}/Banner/collectionbanner3.${format}`,
          `${host || storImagePath()}/Banner/collectionbanner4.${format}`,
          `${host || storImagePath()}/Banner/collectionbanner5.${format}`,
          `${host || storImagePath()}/Banner/collectionbanner6.${format}`,
        ],
        video: [],
      },
      affiliation: {
        image: [
          `${host || storImagePath()}/Banner/Affiliation1.${format}`,
          `${host || storImagePath()}/Banner/Affiliation2.${format}`,
          `${host || storImagePath()}/Banner/Affiliation3.${format}`,
          `${host || storImagePath()}/Banner/Affiliation4.${format}`,
          `${host || storImagePath()}/Banner/Affiliation5.${format}`,
          `${host || storImagePath()}/Banner/Affiliation6.${format}`,
          `${host || storImagePath()}/Banner/Affiliation7.${format}`,
          `${host || storImagePath()}/Banner/Affiliation8.${format}`,
          `${host || storImagePath()}/Banner/Affiliation9.${format}`,
          `${host || storImagePath()}/Banner/Affiliation10.${format}`,
          `${host || storImagePath()}/Banner/Affiliation11.${format}`,
          `${host || storImagePath()}/Banner/Affiliation12.${format}`,
        ],
        video: [],
      },
      photoGallery: {
        image: [
          `${host || storImagePath()}/Banner/photogallery1.${format}`,
          `${host || storImagePath()}/Banner/photogallery2.${format}`,
          `${host || storImagePath()}/Banner/photogallery3.${format}`,
          `${host || storImagePath()}/Banner/photogallery4.${format}`,
          `${host || storImagePath()}/Banner/photogallery5.${format}`,
          `${host || storImagePath()}/Banner/photogallery6.${format}`,
          `${host || storImagePath()}/Banner/photogallery7.${format}`,
          `${host || storImagePath()}/Banner/photogallery8.${format}`,
          `${host || storImagePath()}/Banner/photogallery9.${format}`,
          `${host || storImagePath()}/Banner/photogallery10.${format}`,
        ],
        video: [],
      },
      popup: {
        image: [
          `${host || storImagePath()}/Banner/popup.${format}`,
          `${host || storImagePath()}/Banner/popup1.${format}`,
          `${host || storImagePath()}/Banner/popup2.${format}`,
        ],
        video: [],
      },
      navbarMenu: {
        image: [
          `${host || storImagePath()}/Banner/navbarMenu1.${format}`,
          `${host || storImagePath()}/Banner/navbarMenu2.${format}`,
          `${host || storImagePath()}/Banner/navbarMenu3.${format}`,
          `${host || storImagePath()}/Banner/navbarMenu4.${format}`,
        ],
        video: [],
      },
      categoryBanner: {
        image: [
          `${host || storImagePath()}/Banner/categorybanner01.${format}`,
          `${host || storImagePath()}/Banner/categorybanner02.${format}`,
          `${host || storImagePath()}/Banner/categorybanner03.${format}`,
          `${host || storImagePath()}/Banner/categorybanner04.${format}`,
        ],
        video: [],
      },
      aboutusBanner: {
        image: [
          `${host || storImagePath()}/Banner/aboutusBanner1.${format}`,
          `${host || storImagePath()}/Banner/aboutusBanner2.${format}`,
          `${host || storImagePath()}/Banner/aboutusBanner3.${format}`,
        ],
        video: [],
      },
      careerBanner: {
        image: [
          `${host || storImagePath()}/Banner/careerBanner1.${format}`,
          `${host || storImagePath()}/Banner/careerBanner2.${format}`,
        ],
        video: [],
      },
      historyBanner: {
        image: [
          `${host || storImagePath()}/Banner/historyBanner1.${format}`,
          `${host || storImagePath()}/Banner/historyBanner2.${format}`,
        ],
        video: [],
      },
      contactusBanner: {
        image: [
          `${host || storImagePath()}/Banner/contactBanner1.${format}`,
        ],
        video: [],
      },
      termsBanner: {
        image: [
          `${host || storImagePath()}/Banner/termsBanner1.${format}`,
          `${host || storImagePath()}/Banner/termsBanner2.${format}`,
        ],
        video: [],
      },
      servicesBanner: {
        image: [
          `${host || storImagePath()}/Banner/servicesBanner1.${format}`,
          `${host || storImagePath()}/Banner/servicesBanner2.${format}`,
          `${host || storImagePath()}/Banner/servicesBanner3.${format}`,
          `${host || storImagePath()}/Banner/servicesBanner4.${format}`,
        ],
        video: [],
      },
      appointmentBanner: {
        image: [
          `${host || storImagePath()}/Banner/appointBanner1.${format}`,
          `${host || storImagePath()}/Banner/appointBanner2.${format}`,
          `${host || storImagePath()}/Banner/appointBanner3.${format}`,
          `${host || storImagePath()}/Banner/appointBanner4.${format}`,
          `${host || storImagePath()}/Banner/appointBanner5.${format}`,
          `${host || storImagePath()}/Banner/appointBanner6.${format}`,
          `${host || storImagePath()}/Banner/appointBanner7.${format}`,
          `${host || storImagePath()}/Banner/appointBanner8.${format}`,
          `${host || storImagePath()}/Banner/appointBanner9.${format}`,
        ],
        video: [],
      },
      customizeBanner: {
        image: [
          `${host || storImagePath()}/Banner/customizeBanner1.${format}`,
          `${host || storImagePath()}/Banner/customizeBanner2.${format}`,
          `${host || storImagePath()}/Banner/customizeBanner3.${format}`,
        ],
        video: [],
      },
      faqBanner: {
        image: [
          `${host || storImagePath()}/Banner/faqBanner1.${format}`,
        ],
        video: [],
      },
      impactBanner: {
        image: [
          `${host || storImagePath()}/Banner/impactBanner1.${format}`,
          `${host || storImagePath()}/Banner/impactBanner2.${format}`,
          `${host || storImagePath()}/Banner/impactBanner3.${format}`,
          `${host || storImagePath()}/Banner/impactBanner4.${format}`,
          `${host || storImagePath()}/Banner/impactBanner5.${format}`,
          `${host || storImagePath()}/Banner/impactBanner6.${format}`,
          `${host || storImagePath()}/Banner/impactBanner7.${format}`,
          `${host || storImagePath()}/Banner/impactBanner8.${format}`,
          `${host || storImagePath()}/Banner/impactBanner9.${format}`,
          `${host || storImagePath()}/Banner/impactBanner10.${format}`,
          `${host || storImagePath()}/Banner/impactBanner11.${format}`,
          `${host || storImagePath()}/Banner/impactBanner12.${format}`,
          `${host || storImagePath()}/Banner/impactBanner13.${format}`,
          `${host || storImagePath()}/Banner/impactBanner14.${format}`,
          `${host || storImagePath()}/Banner/impactBanner15.${format}`,
          `${host || storImagePath()}/Banner/impactBanner16.${format}`,
          `${host || storImagePath()}/Banner/impactBanner17.${format}`,
          `${host || storImagePath()}/Banner/impactBanner18.${format}`,
          `${host || storImagePath()}/Banner/impactBanner19.${format}`,
          `${host || storImagePath()}/Banner/impactBanner20.${format}`,
          `${host || storImagePath()}/Banner/impactBanner21.${format}`,
          `${host || storImagePath()}/Banner/impactBanner22.${format}`,
          `${host || storImagePath()}/Banner/impactBanner23.${format}`,
          `${host || storImagePath()}/Banner/impactBanner24.${format}`,
          `${host || storImagePath()}/Banner/impactBanner25.${format}`,
          `${host || storImagePath()}/Banner/impactBanner26.${format}`,
        ],
        video: [],
      },
      srcsetMedias: {
        image: [
          `${host || storImagePath()}/Banner/image-400_1.${format}`,
          `${host || storImagePath()}/Banner/image-400_2.${format}`,
          `${host || storImagePath()}/Banner/image-800_1.${format}`,
          `${host || storImagePath()}/Banner/image-800_2.${format}`,
          `${host || storImagePath()}/Banner/image-1200_1.${format}`,
          `${host || storImagePath()}/Banner/image-1200_2.${format}`,
        ],
        video: [
          `${host || storImagePath()}/Banner/homepagemainvideo-360p.mp4`,
          `${host || storImagePath()}/Banner/homepagemainvideo-720p.mp4`,
          `${host || storImagePath()}/Banner/homepagemainvideo-1080p.mp4`,
        ],
      },
    };
    return bannerData;
};

export default useHomeBannerImages;


