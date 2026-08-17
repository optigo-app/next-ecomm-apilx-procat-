import "./termsPage.scss";
import { getStaticHtmlContent } from "@/app/(core)/utils/StaticFileGetter";

const TermsAndConditions = async ({ hostname }) => {
  const htmlContent = getStaticHtmlContent("terms", hostname);

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

export default TermsAndConditions;

const Banner = ({ title = "Terms and Conditions" }) => {
  return (
    <div className="procatalog-banner">
      <h1>{title}</h1>
    </div>
  );
};

