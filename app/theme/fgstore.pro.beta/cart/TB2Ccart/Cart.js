import React, { useEffect, useState } from 'react';
import useCart from '../../../../../../utils/Glob_Functions/Cart_Wishlist/Cart';
import CartList from './CartList';
import './ProCat_cartb2c.scss';
import Footer from '../../Home/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import ConfirmationDialog from '../../ConfirmationDialog.js/ConfirmationDialog';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { GetCountAPI } from '../../../../../../utils/API/GetCount/GetCountAPI';
import Cookies from "js-cookie";
import { proCat_CartCount, proCat_loginState } from '../../../Recoil/atom';

const CartPage = () => {
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
    handleMoveToDetail
  } = useCart();

  const navigate = useNavigate();

  const setCartCountVal = useSetRecoilState(proCat_CartCount)

  const handlePlaceOrder = () => {
    let priceData = cartData.reduce((total, item) => total + item.UnitCostWithmarkup, 0).toFixed(2)
    sessionStorage.setItem('TotalPriceData', priceData)
    navigate("/Delivery")
    window.scrollTo(0, 0);
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [countstatus, setCountStatus] = useState();
  const visiterId = Cookies.get('visiterId');
  const islogin = useRecoilValue(proCat_loginState)

  useEffect(() => {
    const iswishUpdateStatus = sessionStorage.getItem('cartUpdation');
    setCountStatus(iswishUpdateStatus)
  }, [handleRemoveItem, handleRemoveAll])

  const handleRemoveAllDialog = () => {
    setDialogOpen(true);
  };

  const handleConfirmRemoveAll = () => {
    setDialogOpen(false);
    handleRemoveAll();
    setTimeout(() => {
      if (countstatus) {
        GetCountAPI(visiterId, islogin).then((res) => {
          
          setCartCountVal(res?.cartcount);
        })
      }
    }, 500)
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  return (
    <div className='ProCat_MainB2cBGDiv'>
      <div className='cartMainb2cPageDiv'>
        <div className="cartB2cBtnGroupMainDiv">
          <div className="ProCat_B2ccart-title">My Cart</div>
          {!isloding && cartData.length != 0 &&
            <>
              <div className="ProCat_B2ccartButton-group">
                <Link className='ProCat_B2cReomoveAllCartbtn' href="#" variant="body2" onClick={handleRemoveAllDialog} >
                  Clear All
                </Link>
                <div className='ProCat_b2cplaceOrderMobileMainbtnDiv'>
                  <button className="ProCat_B2cplace-order-btnMobile" onClick={handlePlaceOrder}>Place Order</button>
                </div>
              </div>
              {/* <div className='ProCat_B2cplaceOrderMainbtnDiv'>
                <button className="ProCat_B2cplace-order-btn" onClick={handlePlaceOrder}>Place Order</button>
              </div> */}
            </>
          }
        </div>
        {!isloding ? (
          <>
            {cartData.length !== 0 ? (
              <div className="ProCat_B2ccartMainPages">
                <div className="ProCat_B2CcartSide">
                  <CartList
                    items={cartData}
                    CartCardImageFunc={CartCardImageFunc}
                    showRemark={showRemark}
                    productRemark={productRemark}
                    onSelect={handleSelectItem}
                    selectedItem={selectedItem}
                    selectedItems={selectedItems}
                    multiSelect={multiSelect}
                    onRemove={handleRemoveItem}
                    handleAddReamrk={handleAddReamrk}
                    handleRemarkChange={handleRemarkChange}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                  />
                </div>
              </div>
            ) :
              <div className='ProCat_noWishlistData'>
                <p className='ProCat_title'>No Item Found!</p>
                <p className='ProCat_desc'>Please First Add To Cart Data</p>
                <button className='ProCat_browseOurCollectionbtn'>Browse our collection</button>
              </div>
            }
          </>
        ) :
          // <CartPageSkeleton />
          <div></div>
        }

        <ConfirmationDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmRemoveAll}
          title="Confirm Remove All"
          content="Are you sure you want to clear all items?"
        />

        <Footer />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '30px' }}>
        <p style={{ margin: '0px', fontWeight: 500, color: 'white', cursor: 'pointer' }} onClick={scrollToTop}>BACK TO TOP</p>
      </div>
    </div>
  );
};

export default CartPage;
