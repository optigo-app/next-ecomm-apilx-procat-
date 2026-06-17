import ContactForm from "./ContactForm.jsx";
import "./ContactUs.modul.scss";
import fs from "fs";
import path from "path";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter.js";

export default async function ContactUsPage({ hostname }) {
  const ht = await getStaticHtmlPages(hostname);
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
    <div className="smr_contactMain_div">
      <div className="Fo-contactMain">
        <div>
          <p
            style={{
              fontSize: "40px",
              margin: "0px",
              paddingTop: "30px",
              textAlign: "center",
              fontFamily: "FreightDispProBook-Regular,Times New Roman,serif",
            }}
          >
            Contact Us
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p style={{ width: "300px", textAlign: "center", fontSize: "15px" }}>
              Have a comment, suggestion or question? Feel free to reach out to us and we’ll get
              back to you as soon as possible.
            </p>
          </div>

          <div className="smr_contactPage_BoxMain">
            {/* Left: Client form */}
            <ContactForm />

            {/* Right: Static HTML injected */}
            <div className="smr_Fo_contactBox2_main">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
