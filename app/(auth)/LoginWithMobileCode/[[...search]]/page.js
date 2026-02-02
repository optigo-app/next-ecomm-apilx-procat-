import LoginWithMobileCodeComponent from "@/app/theme/fgstore.pro/Auth/LoginWithMobileCode/page.js";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  return <LoginWithMobileCodeComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
