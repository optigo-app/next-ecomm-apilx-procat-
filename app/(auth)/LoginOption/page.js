import LoginOptionComponent from "@/app/theme/fgstore.pro/Auth/LoginOption/page.js";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  return <LoginOptionComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
