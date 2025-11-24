import { getActiveTheme } from "./(core)/lib/getActiveTheme";
import { themeMap } from "./(core)/utils/ThemeMap";

// Revalidate this page every 60 seconds
export const revalidate = 60;


export default async function Page() {
  const theme = await getActiveTheme();
  const themeData = themeMap[theme];
  const Home = (await import(`@/app/theme/${themeData.page}/home/page.jsx`)).default;
  return <Home />;
}
