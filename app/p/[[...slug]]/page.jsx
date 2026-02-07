import ProductComponent from "@/app/theme/fgstore.pro/product/page.jsx";
export default async function Page({ params, searchParams }) {
  return <ProductComponent params={params} searchParams={searchParams} />;
}
