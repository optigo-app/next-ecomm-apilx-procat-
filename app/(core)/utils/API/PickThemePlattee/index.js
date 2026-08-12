import axios from "axios";
import fs from "fs";
import path from "path";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";

const API_URL = "http://newnextjs.web/api/report";
// const API_URL = "https://apix.optigoapps.com/api/report


const sv = process.env.NODE_ENV === "production" ? "1" : "0";
const version = "beta";
const sp = "230";

export const SyncProcatTheme = async ({ domainName, yearCode }) => {
  try {
    const body = {
      con: JSON.stringify({
        mode: "gettheme",
        appuserid: "admin@orail.co.in",
        IPAddress: "",
        FormName: "DynamicReport ( data )",
      }),
      p: JSON.stringify({
        domain_name: domainName,
      }),
      f: "GetThemeActiveProcatTheme ( data )",
    };

    const { data } = await axios.post(API_URL, body, {
      headers: {
        "Content-Type": "application/json",
        Yearcode: yearCode,
        sp,
        sv,
        version,
      },
    });

    if (data?.Data?.rd?.length) {
      return data.Data.rd[0];
    }

    throw new Error("Theme not found.");
  } catch (error) {
    console.error("Error fetching theme:", error);
    throw error;
  }
};

export const shouldUpdateColorTheme = async ({ host, storeInitData }) => {
  try {
    const fileCreateDateStr = storeInitData?.FileCreateDate;
    if (!fileCreateDateStr) return true;

    const ht = await getStaticHtmlPages(host);
    const filePath = path.join(process.cwd(), ht.pages.styleContent);

    if (!fs.existsSync(filePath)) return true;

    const existingContent = await fs.promises.readFile(filePath, "utf-8");
    const headerLine = `/* FileCreateDate: ${fileCreateDateStr} */`;

    if (existingContent.startsWith(headerLine)) {
      console.log(`🎨 [ColorTheme.txt] FileCreateDate (${fileCreateDateStr}) unchanged. Skipping update.`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking color theme update status:", error);
    return true;
  }
};

export const updateColorThemeFile = async ({ host, styleContent, storeInitData }) => {
  try {
    if (!styleContent) return;

    const ht = await getStaticHtmlPages(host);
    const filePath = path.join(process.cwd(), ht.pages.styleContent);
    const exists = fs.existsSync(filePath);

    const fileCreateDateStr = storeInitData?.FileCreateDate || styleContent?.updated_at || styleContent?.created_at || "";
    const headerLine = fileCreateDateStr ? `/* FileCreateDate: ${fileCreateDateStr} */\n` : "";

    const cssContent = `${headerLine}.setFullThemeBack{
background-color: ${styleContent.primary_theme_color } !important;
}

${styleContent.primary_theme_bg ? `.setFullThemeBack_Bg{
background-color: ${styleContent.primary_theme_color} !important;
}
` : ''}
.btnColorProCat{
	background-color: ${styleContent.btn_main_bg } !important;
	color: ${styleContent.btn_main_text } !important;
	border: 1px solid ${styleContent.btn_main_border } !important;
}

.badgeColor .MuiBadge-badge, .badgeColorFix .MuiBadge-badge {
	background-color: ${styleContent.btn_main_bg } !important;
	color: ${styleContent.btn_main_text } !important;
}

.btnColorProCatProduct{
	background-color: ${styleContent.btn_product_bg } !important;
	color: ${styleContent.btn_product_text } !important;
	border: 1px solid ${styleContent.btn_product_border } !important;
${styleContent.btn_product_border_radius ? `\tborder-radius: ${styleContent.btn_product_border_radius} !important;\n` : ''}}

.btnColorProCatProductRemoveCart {
	background-color: ${styleContent.btn_remove_cart_bg } !important;
	color: ${styleContent.btn_remove_cart_text } !important;
	border: 1px solid ${styleContent.btn_remove_cart_border } !important;
${styleContent.btn_remove_cart_border_radius ? `\tborder-radius: ${styleContent.btn_remove_cart_border_radius} !important;\n` : ''}}

${styleContent.icon_color ? `.btnColorSvg{
	color: ${styleContent.icon_color} !important;
	fill: ${styleContent.icon_color} !important;
}
` : ''}
${styleContent.icon_remove_color ? `.btnColorRemoveSvg{
	color: ${styleContent.icon_remove_color} !important;
	fill: ${styleContent.icon_remove_color} !important;
}
` : ''}

.tab_color : {
	background-color: ${styleContent.btn_main_bg } !important;
  background : ${styleContent.btn_main_bg } !important;
}


.sticky_part_header_pk{
	background-color:  ${styleContent.primary_theme_bg }!important;
}

`;

    let jsonBlock = `{
"rd":[
 {
  "Themeno": 6,
  "Headerno": 1,
  "Blockno": 1,
  "Footerno": 1,
  "IsHomeAlbum": 1,
  "IsHomeBestSeller": 1,
  "IsHomeTrending": 1,
  "IsHomeDesignSet": 1,
  "IsHomeNewArrival": 1
 }
]
}`;

    if (exists) {
      try {
        const existingContent = await fs.promises.readFile(filePath, "utf-8");
        const match = existingContent.match(/\{\s*"rd"\s*:/);
        if (match) {
          jsonBlock = existingContent.slice(match.index);
        }
      } catch (e) {
        console.error("Error reading existing JSON block from ColorTheme.txt:", e);
      }
    }

    const fullFileContent = cssContent.trim() + "\n\n" + jsonBlock.trim() + "\n";

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    await fs.promises.writeFile(filePath, fullFileContent, "utf-8");
    console.log(`✅ [ColorTheme.txt] Successfully updated style content in ${filePath} (FileCreateDate: ${fileCreateDateStr})`);
  } catch (error) {
    console.error("❌ Error updating ColorTheme.txt:", error);
  }
};

