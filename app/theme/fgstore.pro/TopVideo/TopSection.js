import { assetBase } from "@/app/(core)/lib/ServerHelper";
import "./TopSection.modul.scss";

async function isValidImage(url) {
  if (!url) return false;

  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });

    return (
      res.ok &&
      res.headers.get("content-type")?.startsWith("image/")
    );
  } catch {
    return false;
  }
}

const TopSection = async ({ storeData }) => {
  const defaultImage = `${assetBase}/procat1.jpg`;

  let imageSrc = defaultImage;

  if (await isValidImage(storeData?.ProCatLogbanner)) {
    imageSrc = storeData.ProCatLogbanner;
  }
  return (
    <div>
      <img
        src={imageSrc}
        className="proCatTopBannerImg"
        alt="Top Banner"
      />
    </div>
  );
};

export default TopSection;
