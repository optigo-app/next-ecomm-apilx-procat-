import { TbMailFast } from "react-icons/tb";
import NewsletterForm from "./NewsletterForm";
import "./NewsletterSignup.scss";

export default function NewsletterSignup({ storeData }) {
  return (
    <div className="smr_newsletter-signup">
      <div className="icon">
        <TbMailFast size={65} />
      </div>
      <h2>Deals are delivered to your Inbox.</h2>
      <p className="sub-text">
        Be the first one to get the details of the 'Sonasons' Brand New
        Collection.
      </p>
      <NewsletterForm storeData={storeData} />
      <p className="disclaimer">
        By signing up with Sonasons, you are agreeing to the terms outlined in
        our privacy policy. Any information provided will be collected and used
        for the purpose of sending news, promotions, and updates through email
        communication. You can withdraw your consent at any time by
        unsubscribing or reaching out to the customer service team at&nbsp;
        <a href="mailto:service@Sonasons.com">service@Sonasons.com.</a>
      </p>
    </div>
  );
}
