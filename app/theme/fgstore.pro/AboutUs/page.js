import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";
import "./index.scss";
import fs from "fs";
import path from "path";

export default async function AboutUs() {
  const ht = getStaticHtmlPages();
  console.log(ht?.pages?.aboutUs, "ht?.pages?.aboutUs")
  const filePath = path.join(
    process.cwd(),
    ht?.pages?.aboutUs
  );
  console.log(filePath, "filePath")

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
