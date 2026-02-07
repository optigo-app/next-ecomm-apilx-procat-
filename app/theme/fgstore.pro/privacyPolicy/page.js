import fs from "fs";
import path from "path";
import "./PrivacyPolicy.scss";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";

const PrivacyPolicy = () => {
  const ht = getStaticHtmlPages();
  const filePath = path.join(
    process.cwd(),
    ht?.pages?.privacy
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
};

export default PrivacyPolicy;

const Banner = ({ title = "Privacy Policy" }) => {
  return (
    <div className="procatalog-banner">
      <h1>{title}</h1>
    </div>
  );
};
