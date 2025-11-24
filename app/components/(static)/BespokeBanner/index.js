import Link from "next/link";
import "./BespokeBanner.scss";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

const BespokeBanner = () => {


  return (
    <div className="hero-container">
      <div className="hero-content">
        <div
          className="text-content"
        >
          <h1 className="title_bep">
            Crafting Timeless Bespoke Jewelry for Every Occasion
          </h1>
          <p>
            Experience the art of bespoke jewelry, where every piece is designed
            exclusively for you. From personalized necklaces and bracelets to
            custom rings and earrings, our artisans combine traditional
            craftsmanship with modern design. Choose your gemstones, metals, and
            styles to create a piece that reflects your unique personality and
            style.
          </p>
          <Link
            href="/bespoke-jewelry"
            className="shop-button"
          >
            CREATE YOUR BESPOKE PIECE
            <span className="arrow">→</span>
          </Link>
        </div>

        <div
          className="image-content"
        >
          <img
            src={assetBase + `/images/HomePage/bespoke/2.png`}
            alt="Luxury Diamond Jewelry"
            className="hero-image"
          />
        </div>
      </div>
    </div>
  );
};

export default BespokeBanner;
