import { getStaticHtmlContent } from "@/app/(core)/utils/StaticFileGetter";
import "./index.scss";

export default async function AboutUs({ hostname }) {
  console.log("=== AboutUs Server Render ===", hostname);
  const htmlContent = getStaticHtmlContent("aboutUs", hostname);

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


