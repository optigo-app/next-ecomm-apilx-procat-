import "./index.scss";
import { getStaticHtmlContent } from "@/app/(core)/utils/StaticFileGetter";

export default async function AboutUs({ hostname }) {
  const aboutUsContent = getStaticHtmlContent("aboutUs", hostname);


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
