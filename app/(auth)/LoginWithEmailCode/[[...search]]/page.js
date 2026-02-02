import LoginWithEmailCodeComponent from "@/app/theme/fgstore.pro/Auth/LoginWithEmailCode/page.js";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  return <LoginWithEmailCodeComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
