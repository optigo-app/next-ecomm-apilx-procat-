'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, CardMedia, Modal, Skeleton } from '@mui/material';
import { useNextRouterLikeRR } from "@/app/(core)/hooks/useLocationRd";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { Get_Procatalog } from "@/app/(core)/utils/API/Home/Get_Procatalog/Get_Procatalog";
import Cookies from "js-cookie";
import "./Album.modul.scss";

// Lazy load heavy components
const LazyMasonry = dynamic(() => import('@mui/lab/Masonry'), {
  ssr: false,
  loading: () => <div>Loading grid...</div>
});

// Constants
const BATCH_SIZE = 12;
const IMAGE_NOT_FOUND = "/Assets/image-not-found.jpg";

// Memoized Album Item Component
const AlbumItem = React.memo(({ data, onClick, getImageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div 
      className="album-item"
      onClick={() => onClick(data)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(data)}
    >
      {!imageLoaded && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={200} 
          animation="wave"
        />
      )}
      <img
        src={getImageUrl(data)}
        alt={data.AlbumName || 'Album'}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          e.target.src = IMAGE_NOT_FOUND;
          setImageLoaded(true);
        }}
        style={{ display: imageLoaded ? 'block' : 'none' }}
        className="album-image"
      />
      <div className="album-overlay">
        <h3>{data.AlbumName}</h3>
      </div>
    </div>
  );
});

AlbumItem.displayName = 'AlbumItem';

const OptimizedAlbum = () => {
  const { islogin } = useStore();
  const [albumData, setAlbumData] = useState([]);
  const [visibleItems, setVisibleItems] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [designSubData, setDesignSubData] = useState([]);
  const observer = useRef();
  const storeinit = useMemo(() => JSON.parse(sessionStorage.getItem("storeInit") || '{}'), []);
  const navigation = useNextRouterLikeRR();

  // Memoized navigation function
  const navigate = useCallback((link) => {
    navigation.push(link);
  }, [navigation]);

  // Memoized function to get image URL
  const getImageUrl = useCallback((data) => {
    if (!data) return IMAGE_NOT_FOUND;
    
    if (data.AlbumImageName && data.AlbumImageFol && storeinit?.AlbumImageFol) {
      return `${storeinit.AlbumImageFol}${data.AlbumImageFol}/${data.AlbumImageName}`;
    }

    if (data?.AlbumDetail) {
      try {
        const albumDetails = JSON.parse(data.AlbumDetail);
        if (albumDetails?.[0]?.Image_Name && storeinit?.CDNDesignImageFol) {
          return `${storeinit.CDNDesignImageFol}${albumDetails[0].Image_Name}`;
        }
      } catch (e) {
        console.error('Error parsing AlbumDetail:', e);
      }
    }

    return IMAGE_NOT_FOUND;
  }, [storeinit]);

  // Fetch album data
  const fetchAlbumData = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      const loginUserDetail = JSON.parse(sessionStorage.getItem("loginUserDetail") || '{}');
      const visiterID = Cookies.get("visiterId") || '';
      const queryParams = new URLSearchParams(window.location.search);
      const ALCVAL = queryParams.get('ALC');
      
      const finalID = storeinit?.IsB2BWebsite === 0
        ? (islogin ? (loginUserDetail?.id || "") : visiterID)
        : (loginUserDetail?.id || "");

      const alcValue = ALCVAL || JSON.parse(sessionStorage.getItem('ALCVALUE') || 'null') || '';
      if (ALCVAL) {
        sessionStorage.setItem('ALCVALUE', ALCVAL);
      }

      const response = await Get_Procatalog("GET_Procatalog", finalID, alcValue);
      if (response?.Data?.rd) {
        setAlbumData(response.Data.rd);
      }
    } catch (error) {
      console.error('Error fetching album data:', error);
    } finally {
      setLoading(false);
    }
  }, [islogin, loading, storeinit]);

  // Handle navigation
  const handleNavigate = useCallback((data) => {
    if (!data) return;
    
    const albumName = data?.AlbumName;
    const securityKey = data?.AlbumSecurityId;
    const url = `/p/${encodeURIComponent(albumName)}/K=${btoa(securityKey)}/?A=${btoa(`AlbumName=${albumName}`)}`;
    const redirectUrl = `/loginOption/?LoginRedirect=${encodeURIComponent(url)}`;
    const albumDetails = data?.AlbumDetail ? JSON.parse(data.AlbumDetail) : [];
    const state = { SecurityKey: securityKey };

    if (data?.IsDual === 1 && albumDetails?.length > 1) {
      const finalNewData = albumDetails.map((item) => ({
        ...item,
        imageKey: item?.Image_Name 
          ? `${storeinit?.CDNDesignImageFol || ''}${item.Image_Name}` 
          : IMAGE_NOT_FOUND
      }));

      setDesignSubData(finalNewData);
      setOpen(true);
    } else {
      sessionStorage.setItem('redirectURL', url);
      const shouldRedirect = islogin || (securityKey == 0 && storeinit?.IsB2BWebsite === 0);
      navigate(shouldRedirect ? url : redirectUrl, { state });
    }
  }, [islogin, navigate, storeinit]);

  // Infinite scroll implementation
  const lastAlbumElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleItems < albumData.length) {
        setVisibleItems(prev => Math.min(prev + BATCH_SIZE, albumData.length));
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, visibleItems, albumData.length]);

  // Initial data fetch
  useEffect(() => {
    fetchAlbumData();
  }, [fetchAlbumData]);

  // Memoize the visible album data
  const visibleAlbumData = useMemo(() => {
    return albumData.slice(0, visibleItems);
  }, [albumData, visibleItems]);

  if (loading && albumData.length === 0) {
    return (
      <div className="album-grid">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" width="100%" height={200} />
        ))}
      </div>
    );
  }

  return (
    <div className="album-container">
      <div className="album-grid">
        <LazyMasonry columns={{ xs: 2, sm: 3, md: 4 }} spacing={2}>
          {visibleAlbumData.map((data, index) => (
            <div 
              key={`${data.AlbumId || index}`}
              ref={index === visibleAlbumData.length - 1 ? lastAlbumElementRef : null}
            >
              <AlbumItem 
                data={data}
                onClick={handleNavigate}
                getImageUrl={getImageUrl}
              />
            </div>
          ))}
        </LazyMasonry>
      </div>

      {/* Add some styles */}
      <style jsx>{`
        .album-container {
          padding: 1rem;
        }
        .album-grid {
          width: 100%;
        }
        .album-item {
          position: relative;
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .album-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .album-image {
          width: 100%;
          height: auto;
          display: block;
          aspect-ratio: 1;
          object-fit: cover;
        }
        .album-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          color: white;
          padding: 1rem;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .album-item:hover .album-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

OptimizedAlbum.displayName = 'OptimizedAlbum';
export default React.memo(OptimizedAlbum);
