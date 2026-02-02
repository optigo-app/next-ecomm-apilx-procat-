import RegisterComponent from "@/app/theme/fgstore.pro/Auth/Register/page.js";

const page = async ({ params, searchParams }) => {
  const [awaitedParams, awaitedSearchParams] = await Promise.all([params, searchParams]);
  return <RegisterComponent params={awaitedParams} searchParams={awaitedSearchParams} />;
};

export default page;
