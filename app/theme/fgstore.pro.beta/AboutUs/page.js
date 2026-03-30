import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";
import "./index.scss";
import fs from "fs";
import path from "path";

export default async function AboutUs() {
  const ht = getStaticHtmlPages();
  const filePath = path.join(
    process.cwd(),
    ht?.pages?.aboutUs
  );

  const htmlContent = fs.readFileSync(filePath, "utf8");

  return (
    <div className="main_warrpper_pro">
      <div className="procatalog-terms">
        <Banner />
        <main
          className="procatalog-main"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}


const Banner = ({ title = "About Us" }) => {
  return (
    <div className="procatalog-banner">
      <h1>{title}</h1>
    </div>
  );
};
