import { Checkbox, FormControlLabel } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";

const StockBlock = ({ stockItemArr = [], storeInit, loginInfo, imageStates, imageNotFound, isPriceloading, formatter, cartArr, handleCartandWish }) => {
  return (
    <>
      {stockItemArr?.length > 0 && stockItemArr?.[0]?.stat_code != 1005 && storeInit?.IsStockWebsite === 1 && (
        <div className="proCat_stockItem_div">
          <p className="proCat_details_title"> Stock Items </p>
          <div className="proCat_stockitem_container">
            <div className="proCat_stock_item_card">
              {stockItemArr?.map((ele) => (
                <div className="proCat_stockItemCard">
                  <div className="cart_and_wishlist_icon"></div>
                  <img
                    className="procat_productCard_Image"
                    // src={
                    //   storeInit?.CDNDesignImageFol +
                    //   ele?.designno +
                    //   "~" +
                    //   "1" +
                    //   "." +
                    //   ele?.ImageExtension
                    // }
                    src={imageStates[ele.StockId] || imageNotFound}
                    alt={""}
                    onError={(e) => (e.target.src = imageNotFound)}
                  />
                  <div
                    className="proCat_stockutem_shortinfo"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <span className="proCat_prod_designno">{ele?.designno + "  " + "(" + ele?.StockBarcode + ")"}</span>
                    <div className="proCat_prod_Allwt">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <span className="proCat_prod_wt">
                          <span
                            className="proCat_d_keys"
                            style={{
                              fontSize: "12px",
                            }}
                          >
                            NWT:
                          </span>
                          <span
                            className="proCat_d_val"
                            style={{
                              fontSize: "12px",
                            }}
                          >
                            {ele?.NetWt}
                          </span>
                        </span>

                        {storeInit?.IsGrossWeight == 1 && Number(ele?.GrossWt) !== 0 && (
                          <>
                            <span
                              style={{
                                fontSize: "12px",
                                padding: "0 2px",
                              }}
                            >
                              |
                            </span>
                            <span className="proCat_prod_wt">
                              <span
                                className="proCat_d_keys"
                                style={{
                                  fontSize: "12px",
                                }}
                              >
                                GWT:
                              </span>
                              <span className="proCat_d_val">{ele?.GrossWt}</span>
                            </span>
                          </>
                        )}
                        {storeInit?.IsDiamondWeight == 1 && Number(ele?.DiaWt) !== 0 && (
                          <>
                            <span
                              style={{
                                fontSize: "12px",
                                padding: "0 2px",
                              }}
                            >
                              |
                            </span>
                            <span className="proCat_prod_wt">
                              <span
                                className="proCat_d_keys"
                                style={{
                                  fontSize: "12px",
                                }}
                              >
                                DWT:
                              </span>
                              <span
                                className="proCat_d_val"
                                style={{
                                  fontSize: "12px",
                                }}
                              >
                                {ele?.DiaWt}
                                {storeInit?.IsDiamondPcs === 1 ? `/${ele?.DiaPcs}` : null}
                              </span>
                            </span>
                          </>
                        )}

                        {storeInit?.IsStoneWeight == 1 && Number(ele?.CsWt) !== 0 && (
                          <>
                            <span
                              style={{
                                fontSize: "12px",
                                padding: "0 2px",
                              }}
                            >
                              |
                            </span>
                            <span className="proCat_prod_wt">
                              <span
                                className="proCat_d_keys"
                                style={{
                                  fontSize: "12px",
                                }}
                              >
                                CWT:
                              </span>
                              <span
                                className="proCat_d_val"
                                style={{
                                  fontSize: "12px",
                                }}
                              >
                                {ele?.CsWt}
                                {storeInit?.IsStonePcs === 1 ? `/${ele?.CsPcs}` : null}
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                      className="proCat_stockItem_price_type_mt"
                    >
                      {storeInit?.IsMetalTypeWithColor == 1 ? `${ele?.metalPurity}-${ele?.MetalColorName}` : ""}{" "}
                      <span
                        style={{
                          padding: "0 4px",
                        }}
                      >
                        /
                      </span>
                      {storeInit?.IsPriceShow == 1 && (
                        <div
                          style={{
                            fontWeight: "600",
                          }}
                        >
                          {isPriceloading ? "" : <span className="proCat_currencyFont">{loginInfo?.CurrencyCode ?? storeInit?.CurrencyCode}</span>}
                          &nbsp;
                          {formatter.format(ele?.Amount)}
                        </div>
                      )}
                    </div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={
                            <LocalMallOutlinedIcon
                              sx={{
                                fontSize: "22px",
                                color: "#594646",
                              }}
                              className="btnColorSvg"
                            />
                          }
                          checkedIcon={
                            <LocalMallIcon
                              sx={{
                                fontSize: "22px",
                                color: "#474747d1",
                              }}
                              className="btnColorRemoveSvg"
                            />
                          }
                          disableRipple={false}
                          onChange={(e) => handleCartandWish(e, ele, "Cart")}
                          checked={(cartArr[ele?.StockId] ?? ele?.IsInCart === 1) ? true : false}
                        />
                      }
                      label={(cartArr[ele?.StockId] ?? ele?.IsInCart === 1) ? <span className="color_jeweliita__footer">Remove From Cart</span> : <span className="">Add To Cart</span>}
                      // For pink one
                      // className={`${ele?.IsInCart === 1 ? 'btnColorProCatProductRemoveCart' : 'btnColorProCatProduct'} procat_cart_btn`}
                      style={{
                        marginInline: 0,
                      }}
                      // For blue one
                      className={`
                                  ${(cartArr[ele?.StockId] ?? ele?.IsInCart === 1) ? "btnColorProCatProductRemoveCart" : "btnColorProCatProduct"}
                                    procat_cart_btn
                                    `}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StockBlock;
