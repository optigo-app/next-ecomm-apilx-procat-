import { CommonAPIForRazorPay } from "./commonApiForRazorPay";


export const fetchRazorPayData = async (razorpayData) => {
    let storeInit = JSON.parse(sessionStorage.getItem("storeInit"));
    const storedData = sessionStorage.getItem("loginUserDetail");
    const islogin = JSON.parse(sessionStorage.getItem("LoginUser"));
    const data = JSON.parse(storedData);
    const customerId = data?.id ?? "";
    const customerEmail = data?.userid ?? "";

    console.log("razorpayData", razorpayData)

    let addressData = `${razorpayData?.addressData?.shippingfirstname}, ${razorpayData?.addressData?.shippinglastname}, ${razorpayData?.addressData?.street}, ${razorpayData?.addressData?.zip} ${razorpayData?.addressData?.city}, ${razorpayData?.addressData?.state}, ${razorpayData?.addressData?.country}, ${razorpayData?.addressData?.shippingmobile}`;


    try {
        const combinedValue = {
            // Customerid: `${customerId ?? ""}`,
            currency: `${data?.CurrencyCode}`,
            amount: `${razorpayData?.price ?? ""}`,
            customername: `${razorpayData?.addressData?.shippingfirstname}, ${razorpayData?.addressData?.shippinglastname}`,
            descr: `${razorpayData?.description}`,
            // notes: {
            //     address: `${addressData ?? ""}`
            // }
            notes: addressData ?? ""
        };

        
        const body = {
            con: `{\"id\":\"\",\"mode\":\"razorpay\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            f: "razorpay api",
            ...combinedValue
        };
        console.log("sssssssssssss",body)

        const response = await CommonAPIForRazorPay(body);
        return response;
    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
    }
};
