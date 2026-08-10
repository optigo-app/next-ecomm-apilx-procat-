import axios from "axios";
import fs from "fs";
import path from "path";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";

const API_URL = "http://newnextjs.web/api/report";
// window.location.hostname === "localhost"
//   ? "http://newnextjs.web/api/report"
//   : "https://apix.optigoapps.com/api/report";

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

export const updateColorThemeFile = async ({ host, styleContent, storeInitData }) => {
  try {
    if (!styleContent) return;

    const ht = await getStaticHtmlPages(host);
    const filePath = path.join(process.cwd(), ht.pages.styleContent);
    const exists = fs.existsSync(filePath);

    const TWELVE_HOURS_MS = 0;
    let shouldUpdate = !exists;

    if (exists) {
      const stats = fs.statSync(filePath);
      const lastModifiedMs = stats.mtimeMs;
      const now = Date.now();
      const fileAgeMs = now - lastModifiedMs;

      const fileCreateDateStr = storeInitData?.FileCreateDate || styleContent?.updated_at || styleContent?.created_at;
      if (fileCreateDateStr) {
        const backendTime = new Date(fileCreateDateStr).getTime();
        if (!isNaN(backendTime) && backendTime > lastModifiedMs) {
          shouldUpdate = true;
        }
      }

      if (fileAgeMs >= TWELVE_HOURS_MS) {
        shouldUpdate = true;
      }
    }

    if (!shouldUpdate) {
      console.log(`🎨 [ColorTheme.txt] Up to date (within 12h threshold): ${filePath}`);
      return;
    }

    const cssContent = `
.setFullThemeBack{
background-color: ${styleContent.primary_theme_color || '#98b8d9'} !important;
}

${styleContent.primary_theme_bg ? `.setFullThemeBack_Bg{
background-color: ${styleContent.primary_theme_bg} !important;
}
` : ''}
.btnColorProCat{
	background-color: ${styleContent.btn_main_bg || '#98b8d9'} !important;
	color: ${styleContent.btn_main_text || '#ffffff'} !important;
	border: 1px solid ${styleContent.btn_main_border || '#98b8d9'} !important;
}

.btnColorProCatProduct{
	background-color: ${styleContent.btn_product_bg || '#98b8d9'} !important;
	color: ${styleContent.btn_product_text || '#594646'} !important;
	border: 1px solid ${styleContent.btn_product_border || '#98b8d9'} !important;
${styleContent.btn_product_border_radius ? `\tborder-radius: ${styleContent.btn_product_border_radius} !important;\n` : ''}}

.btnColorProCatProductRemoveCart {
	background-color: ${styleContent.btn_remove_cart_bg || '#CBE5FF'} !important;
	color: ${styleContent.btn_remove_cart_text || '#474747D1'} !important;
	border: 1px solid ${styleContent.btn_remove_cart_border || '#CBE5FF'} !important;
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

{
background-color: ${styleContent.sticky_header_bg || '#ffffff'} !important;
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
    console.log(`✅ [ColorTheme.txt] Successfully updated style content in ${filePath}`);
  } catch (error) {
    console.error("❌ Error updating ColorTheme.txt:", error);
  }
};

