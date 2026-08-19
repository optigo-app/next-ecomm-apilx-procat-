import React, { useRef, useState, useEffect } from "react";
import { Grid, Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DetailSkeleton } from "./Skeleton";
import JewelryCarousel from "./Carousel";

const noImageFound = "/image-not-found.jpg";

const LeftSide = ({
  HandleImageDialogOpen = () => {},
  loading = false,
  media = [],
  isMediaReady,
  mediaBuildDone,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRefs = useRef([]);
  const thumbnailContainerRef = useRef(null);
  const thumbRefs = useRef([]);
  const Ismobile = useMediaQuery("(max-width: 768px)");
  const mediaSignature = media?.map((item) => item?.src).filter(Boolean).join("|");

  // Reset selected thumbnail only when actual media items change (not on every parent re-render)
  useEffect(() => {
    setSelectedIndex(0);
  }, [mediaSignature]);

  // Auto-scroll active thumbnail smoothly into view
  useEffect(() => {
    if (thumbRefs.current[selectedIndex]) {
      thumbRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedIndex]);

  const handlePrev = (e) => {
    e?.stopPropagation?.();
    if (!media || media.length <= 1) return;
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation?.();
    if (!media || media.length <= 1) return;
    setSelectedIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  const handleMouseEnter = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = true;
      video.play();
    }
  };

  const handleMouseLeave = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = noImageFound;
  };

  const handleVideoError = (e) => {
    e.target.onerror = null;
    e.target.poster = noImageFound;
  };

  const handleThumbnailScroll = (direction) => {
    if (thumbnailContainerRef.current) {
      const scrollOffset = direction === "left" ? -160 : 160;
      thumbnailContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  // Show skeleton while media is still loading or empty on first load
  if (!isMediaReady || !mediaBuildDone || !media || media.length === 0) {
    return (
      <Grid size={{ xs: 12, sm: 12, md: 7 }}>
        <DetailSkeleton />
      </Grid>
    );
  }

  if (Ismobile) {
    return (
      <Grid size={{ xs: 12, sm: 12 }}>
        <Box>
          <JewelryCarousel
            carouselItems={media}
            HandleImageDialogOpen={HandleImageDialogOpen}
          />
        </Box>
      </Grid>
    );
  }

  const activeItem = media?.[selectedIndex] || media?.[0];
  const showThumbnailArrows = media.length > 7;

  return (
    <Grid size={{ xs: 12, sm: 12, md: 7 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          mx: "auto",
        }}
      >
        {/* ── Main Top Featured Image / Video ── */}
        <Box
          onClick={() => HandleImageDialogOpen(selectedIndex)}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: { xs: "100%", sm: "800px", md: "800px" },
            aspectRatio: "1 / 1",
            cursor: "zoom-in",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #f2f0ee33",
            bgcolor: "#fff9f266",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s ease",
            mx: "auto",
            "&:hover .main-nav-arrow": {
              opacity: 1,
            },
          }}
        >
          {/* Main View Previous Button */}
          {/* {media.length > 1 && (
            <IconButton
              className="main-nav-arrow"
              size="small"
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 12,
                zIndex: 3,
                bgcolor: "rgba(255, 255, 255, 0.85)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                opacity: 0,
                transition: "opacity 0.25s ease, background-color 0.2s",
                "&:hover": { bgcolor: "#FFFFFF" },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )} */}
  
          {activeItem?.type === "image" && (
            <Box
              component="img"
              src={activeItem?.src}
              alt=""
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                mixBlendMode: "multiply",
                transition: "all 0.25s ease",
              }}
              onError={handleError}
            />
          )}

          {activeItem?.type === "video" && (
            <Box
              className="video-wrapper"
              onMouseEnter={() => handleMouseEnter(selectedIndex)}
              onMouseLeave={() => handleMouseLeave(selectedIndex)}
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <video
                ref={(el) => (videoRefs.current[selectedIndex] = el)}
                src={activeItem?.src}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "12px",
                  display: "block",
                }}
                onError={handleVideoError}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 1,
                  transition: "0.25s",
                  pointerEvents: "none",
                  ".video-wrapper:hover &": {
                    opacity: 0,
                  },
                }}
              >
                <PlaySvg />
              </Box>
            </Box>
          )}

          {/* Floating Aesthetic Thumbnails Overlay on Main Image (Transparent & Centered) */}
          {media?.length > 1 && (
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: "absolute",
                bottom: { xs: 10, sm: 16 },
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 0.5, sm: 0.8 },
                p: 0.5,
                bgcolor: "transparent",
                boxShadow: "none",
                border: "none",
                maxWidth: "96%",
                width: "auto",
              }}
            >
              {/* Left Chevron */}
              {showThumbnailArrows && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  sx={{
                    p: 0.5,
                    color: "#111",
                    bgcolor: "rgba(255,255,255,0.9)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    "&:hover": { bgcolor: "#ffffff" },
                  }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}

              {/* Thumbnails Scroll Container */}
              <Box
                ref={thumbnailContainerRef}
                sx={{
                  display: "flex",
                  gap: { xs: 0.8, sm: 1 },
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                  py: 0.5,
                  px: 0.5,
                  alignItems: "center",
                }}
              >
                {media.map((item, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <Box
                      key={index}
                      ref={(el) => (thumbRefs.current[index] = el)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIndex(index);
                      }}
                      sx={{
                        position: "relative",
                        width: { xs: "50px", sm: "62px", md: "80px" },
                        height: { xs: "50px", sm: "62px", md: "80px" },
                        flexShrink: 0,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: isSelected
                          ? "2.5px solid #111111"
                          : "1.5px solid rgba(0,0,0,0.16)",
                        bgcolor: "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        transform: isSelected ? "scale(1.08)" : "scale(1)",
                        boxShadow: isSelected
                          ? "0 4px 12px rgba(0,0,0,0.22)"
                          : "0 2px 6px rgba(0,0,0,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": {
                          borderColor: "#111",
                          transform: "scale(1.08)",
                        },
                      }}
                    >
                      {item?.type === "image" && (
                        <Box
                          component="img"
                          src={item?.src}
                          alt=""
                          sx={{
                            width: "84%",
                            height: "84%",
                            maxWidth: "84%",
                            maxHeight: "84%",
                            objectFit: "contain",
                            objectPosition: "center",
                            display: "block",
                            mixBlendMode: "multiply",
                            m: "auto",
                          }}
                          onError={handleError}
                        />
                      )}

                      {item?.type === "video" && (
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <video
                            src={item?.src}
                            muted
                            playsInline
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={handleVideoError}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              bgcolor: "rgba(0,0,0,0.25)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <PlaySmallSvg />
                          </Box>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>

              {/* Right Chevron */}
              {showThumbnailArrows && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  sx={{
                    p: 0.5,
                    color: "#111",
                    bgcolor: "rgba(255,255,255,0.9)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    "&:hover": { bgcolor: "#ffffff" },
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Grid>
  );
};

export default LeftSide;

const PlaySvg = () => (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="none">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="rgba(141, 133, 133, 1)"
      strokeWidth="1.5"
      opacity="0.5"
    />
    <path
      d="M13.88 9.93C14.96 10.81 15.5 11.25 15.5 12c0 .75-.54 1.19-1.62 2.07-.3.24-.6.46-.87.65-.24.17-.51.34-.79.5-1.07.66-1.61.99-2.09.63-.48-.36-.52-1.12-.6-2.63-.02-.42-.04-.84-.04-1.23s.02-.81.04-1.23c.08-1.51.12-2.27.6-2.63.48-.36 1.02-.03 2.09.63.28.16.55.33.79.5.3.21.6.43.87.66z"
      stroke="rgba(141, 133, 133, 1)"
      strokeWidth="1.5"
    />
  </svg>
);

const PlaySmallSvg = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="rgba(0,0,0,0.4)"
      stroke="#FFFFFF"
      strokeWidth="1.5"
    />
    <path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill="#FFFFFF" />
  </svg>
);
