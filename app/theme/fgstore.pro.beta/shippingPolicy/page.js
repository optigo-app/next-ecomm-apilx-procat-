import fs from "fs";
import path from "path";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";
import "./ShippingPolicy.scss";

const ShippingPolicy = () => {
  const ht = getStaticHtmlPages();
  const filePath = path.join(
    process.cwd(),
    ht?.pages?.shipping
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

export default ShippingPolicy;

const Banner = ({ title = "Shipping Policy" }) => {
  return (
    <div className="procatalog-banner">
      <h1>{title}</h1>
    </div>
  );
};
