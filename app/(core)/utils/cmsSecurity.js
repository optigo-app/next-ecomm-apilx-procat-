/**
 * Simple key-based security utility for CMS access.
 * In a production environment, this key should be moved to environment variables.
 */
const CMS_ACCESS_KEY = process.env.CMS_ACCESS_KEY || 'rajan';

export const verifyCMSKey = (key) => {
    return key === CMS_ACCESS_KEY;
};

export const getCMSSecret = () => CMS_ACCESS_KEY;
