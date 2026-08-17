import "./refundPolicy.scss";
import { getStaticHtmlContent } from "@/app/(core)/utils/StaticFileGetter";

const RefundPolicy = async ({ hostname }) => {
  const htmlContent = getStaticHtmlContent("refund", hostname);
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

