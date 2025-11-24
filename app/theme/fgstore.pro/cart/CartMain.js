'use client'
import React from "react";
import B2bCart from "./ProCatB2bCart/Cart";

const CartMain = ({params, searchParams, storeinit, visiterId}) => {

  return (
    <div>
        <title>Cart</title>
      <B2bCart params={params} searchParams={searchParams} storeinit={storeinit} visiterId={visiterId}/>
    </div>
  );
};

export default CartMain;
