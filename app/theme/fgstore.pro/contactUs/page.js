import ContactForm from "./ContactForm.jsx";
import "./ContactUs.modul.scss";
import { getStaticHtmlContent } from "@/app/(core)/utils/StaticFileGetter.js";

export default async function ContactUsPage({ hostname }) {
  const htmlContent = getStaticHtmlContent("contact", hostname);

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

const Banner = ({ title = "Contact Us" }) => {
  return (
    <div className="procatalog-banner">
      <h1>{title}</h1>
    </div>
  );
};

