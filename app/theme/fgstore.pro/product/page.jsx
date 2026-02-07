import { getStoreInit } from "@/app/(core)/utils/GlobalFunctions/GlobalFunctions";
import ProductList from "./ProductList/ProductList";

const page = async ({ params, searchParams }) => {
  const storeinit = await getStoreInit();
  return (
    <>
      <ProductList storeinit={storeinit} params={params} searchParams={searchParams} />
    </>
  );
};

export default page;
