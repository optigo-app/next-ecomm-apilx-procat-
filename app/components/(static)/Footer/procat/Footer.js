import "./Footer.modul.scss";
import { IoMdCall, IoMdMail } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import Link from "next/link";

const Footer = ({ fromPage, companyInfoData, socialMediaData }) => {
  const hasCompanyInfo =
    companyInfoData?.FrontEndAddress ||
    companyInfoData?.FrontEndCity ||
    companyInfoData?.FrontEndZipCode ||
    companyInfoData?.FrontEndContactno1 ||
    companyInfoData?.FrontEndEmail1;

  return (
    <footer
      className="footerContainer"
      style={{ marginTop: fromPage === "ProdList" ? "8%" : 0 }}
    >
      <div className="footerContent">
        {/* CONTACT SECTION */}
        <div className="footerColumn">
          {hasCompanyInfo && <h4 className="footerTitle">Contact Us</h4>}

          {companyInfoData?.FrontEndAddress && (
            <div className="footerRow">
              <IoLocationOutline className="footerIcon" />
              <span>
                {companyInfoData?.FrontEndAddress}, <br />
                {companyInfoData?.FrontEndCity} -{" "}
                {companyInfoData?.FrontEndZipCode}
              </span>
            </div>
          )}

          {companyInfoData?.FrontEndContactno1 && (
            <div className="footerRow">
              <IoMdCall className="footerIcon" />
              <span>
                {companyInfoData?.FrontEndContactno1}
                {companyInfoData?.FrontEndContactno2 && (
                  <>
                    , {companyInfoData?.FrontEndContactno2}
                  </>
                )}
              </span>
            </div>
          )}

          {companyInfoData?.FrontEndEmail1 && (
            <div className="footerRow">
              <IoMdMail className="footerIcon" />
              <a
                href={`mailto:${companyInfoData?.FrontEndEmail1}`}
                className="footerLink"
              >
                {companyInfoData?.FrontEndEmail1}
              </a>
            </div>
          )}
        </div>

        {/* LINKS SECTION */}
        <div className="footerColumn">
          <h4 className="footerTitle">Quick Links</h4>
          <div className="footerLinks">
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
            <Link href="/privacyPolicy">Privacy Policy</Link>
            <Link href="/aboutUs">About Us</Link>
            <Link href="/refund-policy">Refund Policy</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
          </div>
        </div>

        {/* SOCIAL SECTION */}
        {socialMediaData?.length > 0 && (
          <div className="footerColumn">
            <h4 className="footerTitle">Follow Us</h4>
            <div className="footerSocial">
              {socialMediaData.map((social, i) => (
                <a
                  key={i}
                  href={social?.SLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footerSocialIcon"
                >
                  <img
                    src={social?.SImgPath}
                    alt={social?.SName}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="footerBottom">
        <p style={{ textTransform: 'capitalize' }}>© {new Date().getFullYear()} {companyInfoData?.companyname_menu}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
