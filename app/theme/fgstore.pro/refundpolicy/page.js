import fs from "fs";
import path from "path";
import "./refundPolicy.scss";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";

const RefundPolicy = () => {
  const ht = getStaticHtmlPages();
  const filePath = path.join(
    process.cwd(),
    ht?.pages?.refund
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

export default RefundPolicy;

const Banner = ({ title = "Refund Policy" }) => {
  return (
    <div className="procatalog-banner">
      <h1>{title}</h1>
    </div>
  );
};
