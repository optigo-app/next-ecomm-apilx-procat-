
import React, { useEffect, useState } from 'react';
import useCart from '@/app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart';
import CartDetails from './CartDetails';
import CartList from './CartList';
import SelectedItemsModal from './SelectedModal';
import './proCat_cartPage.scss';
import { Checkbox, FormControlLabel, Link, useMediaQuery } from '@mui/material';
import CartPageSkeleton from './CartSkelton';
import { GetCountAPI } from '@/app/(core)/utils/API/GetCount/GetCountAPI';
import MobileCartDetails from "./MobileCartDetails"
import { handlePaymentAPI } from '@/app/(core)/utils/API/OrderFlow/PlaceOrderAPI';
import { toast } from 'react-toastify';
import { useAddress } from '@/app/(core)/utils/Glob_Functions/OrderFlow/useAddress';
import Cookies from "js-cookie";
import ConfirmationDialog from '@/app/(core)/utils/Glob_Functions/ConfirmationDialog/ConfirmationDialog';
import { useStore } from '@/app/(core)/contexts/StoreProvider';
import { useRouter } from 'next/navigation';


const CartPage = () => {
  const addressData = useAddress();

  const {
    isloding,
    ispriceloding,
    cartData,
    selectedItem,
    selectedItems,
    multiSelect,
    openModal,
    showRemark,
    productRemark,
    qtyCount,
    sizeCombo,
    CurrencyData,
    countData,
    mrpbasedPriceFlag,
    openMobileModal,
    setOpenMobileModal,
    finalCartData,
    isSelectedAll,
    handleSelectAll,
    handlecloseMobileModal,
    CartCardImageFunc,
    handleSelectItem,
    handleIncrement,
    handleDecrement,
    handleMultiSelectToggle,
    handleOpenModal,
    handleCloseModal,
    handleRemarkChange,
    handleSave,
    handleCancel,
    handleAddReamrk,
    handleRemoveItem,
    handleRemoveAll,
    handleUpdateCart,
    handleCancelUpdateCart,
    handleMetalTypeChange,
    handleMetalColorChange,
    handleDiamondChange,
    handleColorStoneChange,
    handleSizeChange,
    decodeEntities,
    handleMoveToDetail,
    handelMenu
  } = useCart();
    const { islogin, setCartCountNum } = useStore();
  

    const Router= useRouter();
  const navigate = (path)=>Router.push(path)
  const [storeInit, setStoreInit] = useState();
  const [defaultAddr, setDefaultAddr] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [countstatus, setCountStatus] = useState();
  const visiterId = Cookies.get('visiterId');
  const isLargeScreen = useMediaQuery('(min-width:1000px)');
  const isMobileScreen = useMediaQuery('(max-width:768px)');

  // const handlePlaceOrder = () => {
  //   const priceData = cartData.reduce((total, item) => total + item?.FinalCost, 0);
  //   sessionStorage.setItem('TotalPriceData', priceData);

  //   if (islogin) {
  //     if (storeInit?.IsPLW === 0) {
  //       navigate("/Delivery");
  //     } else {
  //       handlePay();
  //     }
  //   } else {
  //     // const redirectUrl = `/loginOption/?LoginRedirect=/Delivery`;
  //     // navigate(redirectUrl);
  //     navigate('/loginOption')
  //   }

  //   window.scrollTo(0, 0);
  // };

  const redirectUrl = `/loginOption/?LoginRedirect=/cartPage`;
  const handlePlaceOrder = () => {
    let storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    let priceData = finalCartData?.reduce(
      (total, item) => total + item?.FinalCost,
      0
    );
    sessionStorage.setItem("TotalPriceData", priceData);
    if (storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null) {
      navigate(redirectUrl);
      // navigate('/loginOption')
    } else {
      navigate("/Delivery", { replace: true });
    }
    window.scrollTo(0, 0);
  };


  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  useEffect(() => {
    const iswishUpdateStatus = sessionStorage.getItem('cartUpdation');
    setCountStatus(iswishUpdateStatus)
  }, [handleRemoveItem, handleRemoveAll])

  const handleRemoveAllDialog = () => {
    setDialogOpen(true);
  };


  const handleConfirmRemoveAll = async () => {
    setDialogOpen(false);
    const returnValue = await handleRemoveAll();
    if (returnValue?.msg == "success") {
      GetCountAPI(visiterId).then((res) => {
        setCartCountNum(res?.cartcount);
      })
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    setStoreInit(storeInit);
    if (storeInit?.IsPLW == 1) {
      if (addressData && addressData.addressData) {
        const defaultAddress = addressData.addressData.find(addr => addr?.isdefault === 1);

        if (defaultAddress) {
          setDefaultAddr(defaultAddress)
        } else {
          console.log('No default address found.');
        }
      }
    }
  }, []);



  const handlePay = async () => {
    const visiterId = Cookies.get('visiterId');
    const paymentResponse = await handlePaymentAPI(visiterId, islogin);

    if (paymentResponse?.Data?.rd[0]?.stat == 1) {
      let num = paymentResponse.Data?.rd[0]?.orderno
      sessionStorage.setItem('orderNumber', num);
      navigate('/Confirmation');
      GetCountAPI().then((res) => {

        setCartCountNum(res?.cartcount)
      })

    } else {
      toast.error('Something went wrong!')
    }
  }

  return (
    <div className='proCat_MainBGDiv'>
      <div className='proCat_cartMainPageDiv'>
        <div className="cartBtnGroupMainDiv">
          {isMobileScreen &&
            <div className="proCat_cart-title">My Cart</div>
          }
          <div className='proCat_cartmainRowDiv'>
            {!isloding && finalCartData?.length != 0 &&
              <div className='proCat_cartButton-groups'>
                <Link
                  className='proCat_ReomoveAllCartbtn'
                  variant="body2"
                  onClick={handleRemoveAllDialog}
                >
                  Clear All
                </Link>
              </div>
            }
            {!isMobileScreen &&
              <div className="proCat_cart-title">My Cart</div>
            }
            {!isloding && finalCartData.length != 0 &&
              <div className='proCat_placeOrderMainbtnDivs'>
                <button className="proCat_place-order-btn btnColorProCatProduct" onClick={handlePlaceOrder}>Place Order</button>
              </div>
            }
          </div>

          {/* {!isloding && finalCartData.length != 0 &&
            <>
              <div className="proCat_cartButton-group">
                <button className="proCat_cartBtn proCat_cartActivebtn">List View</button>
                <button className='proCat_cartBtn'>Image View</button>
                <button className='proCat_cartBtn' onClick={handleRemoveAll}>Clear All</button>
                <div>
                  <Link
                    className='proCat_ReomoveAllCartbtn'
                    variant="body2"
                    onClick={handleRemoveAllDialog}
                  >
                    Clear All
                  </Link>
                  <Link
                    className='proCat_ReomoveAllCartbtn proCat_SelectAllCartbtn'
                    variant="body2"
                    onClick={handleMultiSelectToggle}
                  >
                    {multiSelect ? 'Disable MultiSelect' : 'Enable MultiSelect'}
                  </Link>
                </div>

                <button className='proCat_cartBtn'>Show ProductList</button>

                <button className='proCat_cartBtn' onClick={handleMultiSelectToggle}>{multiSelect ? 'Disable MultiSelect' : 'Select All'}</button>
                {multiSelect && selectedItems.length != 0 &&
                  <button className='proCat_cartBtn' onClick={handleOpenModal} >Show Selected Items</button>
                }
                <div className='proCat_placeOrderMobileMainbtnDiv'>
                  <button className="proCat_place-order-btnMobile" onClick={handlePlaceOrder}>Place Order</button>
                </div>
              </div>
              <div className='proCat_placeOrderMainbtnDiv'>
                <button className="proCat_place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
              </div>
            </>
          } */}
        </div>
        {!isloding ? (
          <>
            <div style={{ marginLeft: '35px' }}>
              {multiSelect &&
                <FormControlLabel
                  control={<Checkbox
                    sx={{
                      color: "rgba(125, 127, 133, 0.4) !important",
                    }}
                  />}
                  label="Select All"
                  checked={isSelectedAll()}
                  onChange={handleSelectAll}
                  sx={{
                    color: "rgba(125, 127, 133, 0.4)",
                  }}
                />
              }
            </div>
            {finalCartData.length != 0 ? (
              <div className="proCat_cartMainPage">
                <div className="proCat_cart-left-sides">
                  <CartList
                    items={finalCartData}
                    CartCardImageFunc={CartCardImageFunc}
                    showRemark={showRemark}
                    productRemark={productRemark}
                    CurrencyData={CurrencyData}
                    decodeEntities={decodeEntities}
                    onSelect={handleSelectItem}
                    selectedItem={selectedItem}
                    selectedItems={selectedItems}
                    multiSelect={multiSelect}
                    onRemove={handleRemoveItem}
                    handleAddReamrk={handleAddReamrk}
                    handleRemarkChange={handleRemarkChange}
                    handleSave={handleSave}
                    finalCartData={finalCartData}
                    handleCancel={handleCancel}
                    openHandleUpdateCartModal={handleOpenModal}
                  />
                </div>
                <div className="proCat_cart-right-side">
                  {isLargeScreen ? (
                    <div className='proCat_pc-cartDetail'>
                      {selectedItem && (
                        <CartDetails
                          ispriceloding={ispriceloding}
                          selectedItem={selectedItem}
                          CartCardImageFunc={CartCardImageFunc}
                          handleIncrement={handleIncrement}
                          handleDecrement={handleDecrement}
                          qtyCount={qtyCount}
                          finalCartData={finalCartData}
                          multiSelect={multiSelect}
                          sizeCombo={sizeCombo}
                          CurrencyData={CurrencyData}
                          mrpbasedPriceFlag={mrpbasedPriceFlag}
                          handleMetalTypeChange={handleMetalTypeChange}
                          handleMetalColorChange={handleMetalColorChange}
                          handleDiamondChange={handleDiamondChange}
                          handleColorStoneChange={handleColorStoneChange}
                          handleSizeChange={handleSizeChange}
                          decodeEntities={decodeEntities}
                          onUpdateCart={handleUpdateCart}
                          handleMoveToDetail={handleMoveToDetail}
                        />
                      )}
                    </div>
                  ) :
                    <div className='proCat_mobile-cartDetails'>
                      <MobileCartDetails
                        open={openMobileModal}
                        handleClose={handlecloseMobileModal}
                        ispriceloding={ispriceloding}
                        selectedItem={selectedItem}
                        CartCardImageFunc={CartCardImageFunc}
                        handleIncrement={handleIncrement}
                        handleDecrement={handleDecrement}
                        qtyCount={qtyCount}
                        multiSelect={multiSelect}
                        sizeCombo={sizeCombo}
                        CurrencyData={CurrencyData}
                        mrpbasedPriceFlag={mrpbasedPriceFlag}
                        handleMetalTypeChange={handleMetalTypeChange}
                        handleMetalColorChange={handleMetalColorChange}
                        handleDiamondChange={handleDiamondChange}
                        handleColorStoneChange={handleColorStoneChange}
                        handleSizeChange={handleSizeChange}
                        decodeEntities={decodeEntities}
                        onUpdateCart={handleUpdateCart}
                        handleMoveToDetail={handleMoveToDetail}
                      />
                    </div>
                  }
                </div>
                <SelectedItemsModal
                  open={openModal}
                  onClose={handleCloseModal}
                  selectedItems={selectedItems}
                  onRemove={handleRemoveItem}
                  onUpdateCart={handleUpdateCart}
                  onCancelCart={handleCancelUpdateCart}
                />
              </div>
            ) :
              <div className='proCat_noCartlistData'>
                <p className='proCat_title'>No Data Found!</p>
                <p className='proCat_desc'>Please First Add Product in Cart</p>
                <button className='proCat_browseOurCollectionbtn' onClick={handelMenu}>Browse our collection</button>
              </div>
            }
          </>
        ) :
          <CartPageSkeleton />
        }

        <ConfirmationDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmRemoveAll}
          title="Confirm"
          content="Are you sure you want to remove all Items?"
        />
      </div>
    </div>
  );
};

export default CartPage;
