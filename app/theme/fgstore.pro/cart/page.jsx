

import { getStoreInit, GetVistitorId } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import CartMain from "./CartMain";

const Cart = async ({ params, searchParams }) => {
    const storeinit = await getStoreInit();
    const visiterId = await GetVistitorId();

    return (
        <>
            <CartMain params={params} searchParams={searchParams} storeinit={storeinit} visiterId={visiterId} />
        </>
    );
};

export default Cart;


