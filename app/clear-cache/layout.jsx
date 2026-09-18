export const metadata = {
  title: "Clear & Rebuild Cache | System Utility",
  description: "Internal cache management utility",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ClearCacheLayout({ children }) {
  return <>{children}</>;
}
