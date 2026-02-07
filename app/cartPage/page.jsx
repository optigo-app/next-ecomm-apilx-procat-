import CartComponent from "@/app/theme/fgstore.pro/cart/page.jsx";


export default async function Page({ params, searchParams }) {
  return <CartComponent params={params} searchParams={searchParams} />;
}
