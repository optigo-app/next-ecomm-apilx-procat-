import { cookies } from "next/headers";
import { assetBase } from "../../lib/ServerHelper";
import fs from "fs";
import path from "path";
import { getStaticHtmlPages } from "../StaticFileGetter";

function safeParse(value) {
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

export const getStoreInit = async () => {
  const cookieStore = await cookies();
  const storeData = safeParse(cookieStore?.get("x-store-data")?.value);
  return storeData;
};

export const getMyAccountFlags = async () => {
  const cookieStore = await cookies();
  const storeData = safeParse(cookieStore?.get("x-myAccountFlags-data")?.value);
  return storeData;
};

export const getCompanyInfoData = async () => {
  const cookieStore = await cookies();
  const storeData = safeParse(cookieStore?.get("x-CompanyInfoData-data")?.value);
  return storeData;
};

export const GetVistitorId = async () => {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("visitorId")?.value ?? null;
  return visitorId;
};

export const GetUserLoginCookie = async () => {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("userLoginCookie")?.value ?? null;
  return userToken;
};

export const getAboutUsContent = async () => {
  try {
    const ht = getStaticHtmlPages();
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", ht.folder, "aboutUs.html");
    if (!fs.existsSync(filePath)) {
      console.warn("AboutUs HTML file not found at path:", filePath);
      return null;
    }
    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error loading AboutUs HTML file:", error);
    return null;
  }
};

export const getContactUsContent = async () => {
  try {
    const ht = getStaticHtmlPages();
    // Assuming Contact Us might be in the same folder or follows a similar pattern
    // The previous error was: open 'F:\next-ecomm(apilx-procat)\public\WebSiteStaticImage\html\SonasonsContactPage.html'
    // We should try to find it in the site folder or provide a safer fallback
    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", ht.folder, "ContactPage.html");

    if (!fs.existsSync(filePath)) {
      // Fallback or just return null if not mandatory
      return null;
    }

    const htmlContent = await fs.promises.readFile(filePath, "utf-8");
    return htmlContent;
  } catch (error) {
    console.error("Error fetching contact HTML:", error);
    return null;
  }
};
