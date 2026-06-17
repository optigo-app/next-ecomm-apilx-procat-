import "./index.scss";
import fs from "fs";
import path from "path";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";

export default async function AboutUs() {
  const ht = await getStaticHtmlPages();
  const filePath = path.join(
    process.cwd(),
    ht?.pages?.aboutUs
  );
  
  let aboutUsContent = "";
  try {
    if (fs.existsSync(filePath)) {
      aboutUsContent = fs.readFileSync(filePath, "utf8");
    } else {
      console.error("File not found:", filePath);
    }
  } catch (error) {
    console.error("Error reading About Us HTML:", error);
  }

  return (
    <div className="smr_about_mainDiv">
      <div className="daimondsEveryAbout">
        <div className="smr_daimondsEveryAbout_sub" style={{ paddingBottom: "80px", minHeight: "400px" }}>
          <div dangerouslySetInnerHTML={{ __html: aboutUsContent }} />
        </div>
      </div>
    </div>
  );
}
