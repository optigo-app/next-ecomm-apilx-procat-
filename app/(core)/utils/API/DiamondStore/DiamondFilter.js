import { CommonAPI } from "../CommonAPI/CommonAPI";

export const DiamondFilterData = async (visiterId) => {
    let storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    const storedData = sessionStorage.getItem("loginUserDetail");
    const islogin = JSON.parse(sessionStorage.getItem("LoginUser"));
    const data = JSON.parse(storedData);
    const customerId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data?.id ?? 0;
    const customerEmail = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? visiterId : data?.userid ?? "";
    const { FrontEnd_RegNo } = storeInit ?? '';

    let packageId = storeInit?.IsB2BWebsite == 0 && islogin == false || islogin == null ? storeInit?.PackageId : data?.PackageId ?? 0

    try {
        const combinedValue = JSON.stringify({
            PackageId: packageId,
            FrontEnd_RegNo: `${FrontEnd_RegNo ?? ''}`,
            Customerid: `${customerId ?? 0}`,
        });

        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            con: `{\"id\":\"\",\"mode\":\"GETDIAMONDSTOREMASTER\",\"appuserid\":\"${customerEmail ?? ''}\"}`,
            f: "Header (getCartData)",
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
