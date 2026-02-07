import React from 'react';
import Grid from '@mui/material/Grid';
import CartItem from './CartItem';

const CartList = ({
  items,
  setOpenMobileModal,
  openHandleUpdateCartModal,
  CartCardImageFunc,
  onSelect,
  CurrencyData,
  decodeEntities,
  selectedItem,
  selectedItems,
  multiSelect,
  showRemark,
  productRemark,
  finalCartData,
  onRemove,
  handleAddReamrk,
  handleRemarkChange,
  handleSave,
  handleCancel,
}) => {

  return (
    <div className="proCat_RightCartList">
      <Grid container spacing={0} sx={{ marginBottom: '5rem' }}>
        {items.map((item, index) => (
        // {finalCartData.map((item, index) => (
          <CartItem
            key={item.id}
            item={item}
            index={index}
            CartCardImageFunc={CartCardImageFunc}
            CurrencyData={CurrencyData}
            decodeEntities={decodeEntities}
            onSelect={onSelect}
            selectedItem={selectedItem}
            selectedItemsLength={selectedItems?.length}
            isActive={selectedItems?.includes(item)}
            isSelected={multiSelect ? selectedItems?.includes(item) : selectedItem === item}
            multiSelect={multiSelect}
            onRemove={onRemove}
            itemLength={items?.length}
            showRemark={showRemark}
            productRemark={productRemark}
            handleAddReamrk={handleAddReamrk}
            handleRemarkChange={handleRemarkChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            openHandleUpdateCartModal={openHandleUpdateCartModal}
          />
        ))}
      </Grid>
    </div>
  );
};

export default CartList;

// .proCat_MainBGDiv .proCat_cartMainPage