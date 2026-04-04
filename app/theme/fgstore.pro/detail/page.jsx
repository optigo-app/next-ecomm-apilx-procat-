import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import ProductDetail from "./ProductDetail/ProductDetail";

const page = async ({ params, searchParams }) => {
    const storeint = await getStoreInit();
    const resolvedSearchParams = await searchParams;
    return (
        <>
            <ProductDetail storeInit={storeint} params={params} searchParams={resolvedSearchParams}  />
        </>
    );
};

export default page;
