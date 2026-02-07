import { CommonAPIForRazorPay } from "./commonApiForRazorPay";


export const handleVerifySignature = async (razorpayData) => {
    const storedData = sessionStorage.getItem("loginUserDetail");
    const data = JSON.parse(storedData);
    const customerEmail = data?.userid ?? "";

    console.log("razorpayData", razorpayData)

    try {
        const combinedValue = {
            razorpayPaymentId: `${razorpayData?.razorpay_payment_id}`,
            razorpayOrderId: `${razorpayData?.razorpay_order_id}`,
            razorpaySignature: `${razorpayData?.razorpay_signature}`
        };
        
        const body = {
            con: `{\"id\":\"\",\"mode\":\"razorpay_verification\",\"appuserid\":\"${customerEmail ?? ""}\"}`,
            f: "razorpay api",
            ...combinedValue
        };
        console.log("sssssssssssss", body)

        const response = await CommonAPIForRazorPay(body);
        return response;
    } catch (error) {
        console.error("Error fetching cart details:", error);
        throw error;
    }
};
