'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Client Configurable Theme Object (Easily update colors, gradients, and fonts per client)
export const clientThemeConfig = {
  // Metallic Gold Color Palette
  goldLight: '#FAF0C5',
  goldMedium: '#D4B26F',
  goldDark: '#9E7429',
  goldAccent: '#F3E5AB',
  
  // Gradient stops
  gradientStops: {
    stop0: '#9E7429',
    stop20: '#D4B26F',
    stop50: '#FAF0C5',
    stop80: '#D4B26F',
    stop100: '#9E7429',
  },
  
  // Ambient Glow Shadow
  glowShadow: 'drop-shadow(0 3px 14px rgba(212, 178, 111, 0.35))',
};

const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4, 2),
  margin: '0 auto',
}));

const FrameBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px 64px',
  minWidth: 320,
  maxWidth: 880,
  width: '90%',
  filter: clientThemeConfig.glowShadow,
  cursor: 'default',
  [theme.breakpoints.down('md')]: {
    padding: '20px 48px',
    width: '95%',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '16px 28px',
    minWidth: 260,
  },
}));

export default function JewelryHeader({ 
  text = "Catalogs & Lookbooks", 
  subtitle = "", 
  config = clientThemeConfig,
  sx 
}) {
  const mergedConfig = { ...clientThemeConfig, ...config };

  return (
    <MainContainer sx={sx}>
      <FrameBox style={{ filter: mergedConfig.glowShadow }}>
        {/* SVG Decorative Frame Background */}
        <svg
          viewBox="0 0 800 120"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gold-frame-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mergedConfig.gradientStops.stop0} />
              <stop offset="20%" stopColor={mergedConfig.gradientStops.stop20} />
              <stop offset="50%" stopColor={mergedConfig.gradientStops.stop50} />
              <stop offset="80%" stopColor={mergedConfig.gradientStops.stop80} />
              <stop offset="100%" stopColor={mergedConfig.gradientStops.stop100} />
            </linearGradient>
          </defs>

          {/* Single Main Gold Line Frame Path */}
          <path
            d="M 65 18 L 735 18 C 760 18, 770 35, 778 48 C 784 56, 794 60, 798 60 C 794 60, 784 64, 778 72 C 770 85, 760 102, 735 102 L 65 102 C 40 102, 30 85, 22 72 C 16 64, 6 60, 2 60 C 6 60, 16 56, 22 48 C 30 35, 40 18, 65 18 Z"
            fill="none"
            stroke="url(#gold-frame-gradient)"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Gem Accent */}
          <circle cx="2" cy="60" r="3" fill="url(#gold-frame-gradient)" />

          {/* Right Gem Accent */}
          <circle cx="798" cy="60" r="3" fill="url(#gold-frame-gradient)" />

          {/* Top Center Diamond Accent */}
          <polygon points="400,14 404,18 400,22 396,18" fill="url(#gold-frame-gradient)" />

          {/* Bottom Center Diamond Accent */}
          <polygon points="400,98 404,102 400,106 396,102" fill="url(#gold-frame-gradient)" />
        </svg>

        {/* Title Content */}
        <Typography
          component="h2"
          sx={{
            fontFamily: mergedConfig.titleFont || 'inherit',
            fontWeight: 600,
            fontSize: { xs: '1.25rem', sm: '1.65rem', md: '2.1rem' },
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: mergedConfig.goldMedium,
            backgroundImage: `linear-gradient(135deg, ${mergedConfig.gradientStops.stop0} 0%, ${mergedConfig.gradientStops.stop20} 25%, ${mergedConfig.gradientStops.stop50} 50%, ${mergedConfig.gradientStops.stop80} 75%, ${mergedConfig.gradientStops.stop100} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            paddingLeft: '0.2em',
            lineHeight: 1.25,
            whiteSpace: { xs: 'normal', sm: 'nowrap' },
          }}
        >
          {text}
        </Typography>

        {subtitle && (
          <Typography
            component="p"
            sx={{
              fontFamily: mergedConfig.subtitleFont || 'inherit',
              fontWeight: 500,
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(212, 178, 111, 0.85)',
              marginTop: '6px',
              textAlign: 'center',
              paddingLeft: '0.45em',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </FrameBox>
    </MainContainer>
  );
}