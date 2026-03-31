import config from "@/public/config.json";

export const IS_B2B = config.IS_B2B;
export const IS_B2C = config.IS_B2C;

export const THEME_VERSIONS = {
  PRO: "fgstore.pro",
  BETA: "fgstore.pro.beta",
};

export const getThemeByDomain = (host) => {
  if (host.includes("localhost")) {
    return THEME_VERSIONS.BETA;
  }

  const DomainBinding = {
    "beta.procatalog.web": THEME_VERSIONS.BETA,
    "procatalog.web": THEME_VERSIONS.PRO,
  };

  return DomainBinding[host] || THEME_VERSIONS.PRO;
};

export const ACTIVE_THEME = THEME_VERSIONS.BETA;

export const currentActiveFlow = IS_B2B;
export const ActiveMode = ACTIVE_THEME === THEME_VERSIONS.BETA;
