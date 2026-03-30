import React from 'react';
import Grid from '@mui/material/Grid';
import CartItem from './CartItem';

const CartList = ({
  items,
  CartCardImageFunc,
  onSelect,
  selectedItem,
  selectedItems,
  multiSelect,
  showRemark,
  productRemark,
  onRemove,
  handleAddReamrk,
  handleRemarkChange,
  handleSave,
  handleCancel,
}) => {
  return (
    <div className="ProCat_MainCartList">
      <Grid container spacing={2}>
        {items.map(item => (
          <CartItem
            key={item.id}
            item={item}
            CartCardImageFunc={CartCardImageFunc}
            onSelect={onSelect}
            selectedItem={selectedItem}
            isActive={selectedItems.includes(item)}
            isSelected={multiSelect ? selectedItems.includes(item) : selectedItem === item}
            multiSelect={multiSelect}
            onRemove={onRemove}
            itemLength={items?.length}
            showRemark={showRemark}
            productRemark={productRemark}
            handleAddReamrk={handleAddReamrk}
            handleRemarkChange={handleRemarkChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        ))}
      </Grid>
    </div>
  );
};

export default CartList;
