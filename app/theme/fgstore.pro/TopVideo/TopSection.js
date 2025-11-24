import { assetBase } from '@/app/(core)/lib/ServerHelper';
import './TopSection.modul.scss';

const TopSection = ({ storeData }) => {
  const imageSrc = storeData?.ProCatLogbanner || `${assetBase}/procat1.jpg`;

  return (
    <div>
      <img src={imageSrc} className="proCatTopBannerImg" alt="Top Banner" />
    </div>
  );
};

export default TopSection;
