import { CommonAPI } from "../CommonAPI/CommonAPI";

export const handleWishlistToCartAPI = async (param, item, visiterId) => {
    const storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    const storedData = sessionStorage.getItem("loginUserDetail");
    const islogin = JSON.parse(sessionStorage.getItem("LoginUser"));
    const { FrontEnd_RegNo } = storeInit;
    const data = JSON.parse(storedData);
    const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data.id ?? 0;
    const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data.userid ?? "";
    try {
        let combinedValue;
        if (param == 'isSelectAll') {
            combinedValue = JSON.stringify({
                Cartidlist: '',
                ischeckall: "1",
                FrontEnd_RegNo: `${FrontEnd_RegNo}`,
                Customerid: `${customerId ?? 0}`,
                WebDiscount: islogin ? `${data?.WebDiscount ?? 0}` : `${0}`,
                IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
                IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
            });
        } else {
            combinedValue = JSON.stringify({
                Cartidlist: `${item?.id}`,
                ischeckall: "0",
                FrontEnd_RegNo: `${FrontEnd_RegNo}`,
                Customerid: `${customerId ?? 0}`,
                WebDiscount: islogin ? `${data?.WebDiscount ?? 0}` : `${0}`,
                IsZeroPriceProductShow: `${storeInit?.IsZeroPriceProductShow ?? 0}`,
                IsSolitaireWebsite: `${storeInit?.IsSolitaireWebsite ?? 0}`,
            });
        }

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: `{\"id\":\"Store\",\"mode\":\"ADDWISHLISTTOCART\",\"appuserid\":\"${customerEmail ?? ''}\"}`,
            f: "MyWishList (GetWishList)",
            // p: encodedCombinedValue,
            // dp: combinedValue
            p: combinedValue
        };
        const response = await CommonAPI(body);

        return response;
    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
    }
};
