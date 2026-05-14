import ContactForm from "./ContactForm.jsx";
import "./ContactUs.modul.scss";
import fs from "fs";
import path from "path";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter.js";

export const metadata = {
  title: 'Francis Diamonds | Diamond Jewellery Manufacturer & Wholesale Jewellery Catalogue',
  description: 'Explore premium diamond jewellery collections from Francis Diamonds, a trusted manufacturer of elegant and modern diamond jewellery designs.',
};

export default async function ContactUsPage() {
  const ht = getStaticHtmlPages();
  const filePath = path.join(
    process.cwd(),
    ht?.pages?.contact || ""
  );
  console.log(filePath, "filePath")
  let htmlContent = "";
  try {
    if (fs.existsSync(filePath)) {
      htmlContent = fs.readFileSync(filePath, "utf8");
    } else {
      console.error("File not found:", filePath);
    }
  } catch (error) {
    console.error("Error reading Contact Us HTML:", error);
  }

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
