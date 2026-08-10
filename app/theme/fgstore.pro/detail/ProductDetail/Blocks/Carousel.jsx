import React, { useState } from "react";
import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function JewelryCarousel({
  carouselItems,
  HandleImageDialogOpen = () => {},
}) {
  const [swiperRef, setSwiperRef] = useState(null);
  const [active, setActive] = useState(0);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        mx: "auto",
        border: "1px solid #edededa1",
        borderRadius: 2,
      }}
    >
      <Swiper
        onSwiper={setSwiperRef}
        slidesPerView={1}
        loop={true}
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        style={{ width: "100%", height: "auto" }}
      >
        {carouselItems.map((item, i) => (
          <SwiperSlide key={i}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {item.type === "image" && (
                <img
                  src={item.src}
                  style={{ width: "100%", maxWidth: 700, objectFit: "contain" }}
                />
              )}
              {item.type === "video" && (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  style={{ width: "100%", maxWidth: 700, objectFit: "contain" }}
                />
              )}
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      <Box
        sx={{
          mt: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          position: "absolute",
          bottom: 15,
          left: 0,
          right: 0,
          mx: "auto",
          zIndex: 100,
        }}
      >
        {carouselItems.map((_, index) => (
          <Box
            key={index}
            onClick={() => {
              swiperRef?.slideToLoop(index);
              HandleImageDialogOpen(index);
            }}
            sx={{
              width: active === index ? 22 : 8,
              height: 6,
              borderRadius: 10,
              backgroundColor: active === index ? "#000" : "#d0d0d0",
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
