import { getCompanyInfoData,  getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
// import Header2 from "@/app/components/(dynamic)/Header/Procat/Header2";
import Header1 from "@/app/components/(dynamic)/Header/Procat/Header";
import React from "react";
import { getLogos } from "@/app/(core)/lib/ServerHelper";
import FooterNew from "@/app/components/(static)/Footer/procat/Footer";
import { Box } from "@mui/material";
import BackToTop from "@/app/components/(static)/Footer/procat/BackToTop";

const layout = async ({ children }) => {
  const storeData = await getStoreInit();
  const companyInfoData = await getCompanyInfoData();
  const logos = getLogos();

  let parsedSocialLinks = [];
  try {
    const rawSocial = companyInfoData?.SocialLinkObj;
    parsedSocialLinks = rawSocial && rawSocial !== "undefined" && rawSocial !== "null" ? JSON.parse(rawSocial) : [];
  } catch (err) {
    console.warn("Invalid SocialLinkObj JSON:", err);
    parsedSocialLinks = [];
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", overflow: "hidden", position: "relative" }} className="setFullThemeBack animateThemeFill">
      <Header1 logos={logos} storeinit={storeData} />
      <Box
        sx={{
          minHeight: 650,
          backgroundColor: "white",
          marginInline: "6%",
          "@media screen and (max-width: 1200px)": {
            marginInline: "1%",
          },
          "@media screen and (max-width: 768px)": {
            minHeight: 500,
          },
          "@media screen and (max-width: 480px)": {
            marginInline: "0",
            minHeight: 400,
          },
        }}
        className="theme-content"
      >
        {children}
        <FooterNew socialMediaData={parsedSocialLinks} companyInfoData={companyInfoData} storeData={storeData}  logos={logos} />
      </Box>
      <BackToTop />
    </Box>
  );
};

export default layout;
