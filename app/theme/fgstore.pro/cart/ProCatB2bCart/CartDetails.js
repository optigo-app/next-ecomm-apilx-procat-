import React, { useEffect, useState } from 'react';
import './proCat_cartPage.scss';
import Customization from './Customization';
import { CardMedia, Skeleton } from '@mui/material';

const CartDetails = ({
  ispriceloding,
  selectedItem,
  CartCardImageFunc,
  qtyCount,
  handleIncrement,
  handleDecrement,
  multiSelect,
  handleAddReamrk,
  productRemark,
  sizeCombo,
  showRemark,
  CurrencyData,
  mrpbasedPriceFlag,
  handleRemarkChange,
  handleSave,
  handleCancel,
  handleMetalTypeChange,
  handleMetalColorChange,
  handleDiamondChange,
  handleColorStoneChange,
  handleSizeChange,
  onUpdateCart,
  decodeEntities,
  handleMoveToDetail
}) => {

  const [imageSrc, setImageSrc] = useState();
  const noImageFound = "/image-not-found.jpg";
  const storeinitData = JSON.parse(sessionStorage.getItem('storeInit'));
  const CDNDesignImageFolThumb = storeinitData?.CDNDesignImageFolThumb;
  const fullImagePath = `${CDNDesignImageFolThumb}${selectedItem?.designno}~1.jpg`;
  const CDNDesignImageFol = storeinitData?.CDNDesignImageFol;
  const fullImagePath1 = `${CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;

  const isLoading = selectedItem?.loading;

  // useEffect(() => {
  //   if (selectedItem?.ImageCount > 0) {
  //     CartCardImageFunc(selectedItem).then((src) => {
  //       setImageSrc(src);
  //     });
  //   } else {
  //     setImageSrc(noImageFound);
  //   }
  // }, [selectedItem]);

  const defaultUrl = selectedItem?.images?.replace("/Design_Thumb", "");
  const firstPart = defaultUrl?.split(".")[0]
  const secondPart = selectedItem?.ImageExtension;
  const finalSelectedUrl = `${firstPart}.${secondPart}`;

  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    let imageURL = selectedItem?.images
      ? finalSelectedUrl
      : selectedItem?.ImageCount > 1
        ? `${storeinitData?.CDNDesignImageFol}${selectedItem?.designno}~1~${selectedItem?.metalcolorname}.${selectedItem?.ImageExtension}`
        : `${storeinitData?.CDNDesignImageFol}${selectedItem?.designno}~1.${selectedItem?.ImageExtension}`;

    const img = new Image();
    img.onload = () => setImgSrc(imageURL);
    img.onerror = () => {
      if (selectedItem?.ImageCount > 0) {
        setImgSrc(fullImagePath1 || noImageFound);
      } else {
        setImgSrc(noImageFound);
      }
    };
    img.src = imageURL;
  }, [selectedItem, storeinitData, finalSelectedUrl]);

  return (
    <div className="proCat_cart-container">
      <div className="proCat_Cart-imageDiv">
        {/* <img src={selectedItem?.imageUrl} alt="Cluster Diamond" className='proCat_cartImage' /> */}
        {isLoading === true ? (
          <CardMedia
            width="100%"
            height={400}
            sx={{
              width: "400px",
              height: "400px !important",
              '@media (max-width: 1750px)': {
                width: "350px",
                height: "350px !important",
              },
              '@media (max-width: 1500px)': {
                width: "300px",
                height: "300px !important",
              },
              '@media (max-width: 1100px)': {
                width: "250px",
                height: "250px !important",
              },
            }}
          >
            <Skeleton
              animation="wave"
              variant="rect"
              width="100%"
              height="100%"
            />
          </CardMedia>
        ) : (
          <img
            src={imgSrc}
            style={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              '&:focus': { outline: 'none' },
              '&:active': { outline: 'none' },
            }}
            className='proCat_cartDetailImage'
            onClick={() => handleMoveToDetail(selectedItem)}
            loading="eager"
          />
        )}
      </div>
      <Customization
        ispriceloding={ispriceloding}
        selectedItem={selectedItem}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        qtyCount={qtyCount}
        showRemark={showRemark}
        productRemark={productRemark}
        sizeCombo={sizeCombo}
        CurrencyData={CurrencyData}
        mrpbasedPriceFlag={mrpbasedPriceFlag}
        handleAddReamrk={handleAddReamrk}
        handleRemarkChange={handleRemarkChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleMetalTypeChange={handleMetalTypeChange}
        handleMetalColorChange={handleMetalColorChange}
        handleDiamondChange={handleDiamondChange}
        handleColorStoneChange={handleColorStoneChange}
        handleSizeChange={handleSizeChange}
        decodeEntities={decodeEntities}
        onUpdateCart={onUpdateCart}
      />
    </div>
  );
};

export default CartDetails;

