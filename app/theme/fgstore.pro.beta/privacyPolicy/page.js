import "./PrivacyPolicy.scss";
import { getStaticHtmlContent } from "@/app/(core)/utils/StaticFileGetter";

const PrivacyPolicy = async ({ hostname }) => {
  const htmlContent = getStaticHtmlContent("privacy", hostname);

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

