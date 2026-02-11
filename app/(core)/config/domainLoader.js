import sitesData from "./sites.json" with { type: "json" };

/**
 * Reconstructs the PROCATALOG_DOMAINS object from sites.json
 */
export const getDomains = () => {
    const domains = {};
    sitesData.sites.forEach(site => {
        if (site.keys) {
            Object.assign(domains, site.keys);
        }
    });
    return domains;
};

export const List = getDomains();

/**
 * Reconstructs the domainHtmlMap object from sites.json
 */
export const getDomainHtmlMap = () => {
    const htmlMap = {};
    sitesData.sites.forEach(site => {
        if (site.domains && site.folder) {
            site.domains.forEach(domain => {
                htmlMap[domain] = site.folder;
            });
        }
    });
    return htmlMap;
};

/**
 * Verifies that the specified folders exist on the filesystem.
 * This should only be called on the server side.
 */
export const verifyFolders = () => {
    if (typeof window !== "undefined") return true;

    try {
        const fs = require('fs');
        const path = require('path');
        const baseDir = path.join(process.cwd(), 'public', 'WebSiteStaticImage', 'html');

        sitesData.sites.forEach(site => {
            const folderPath = path.join(baseDir, site.folder);
            if (!fs.existsSync(folderPath)) {
                console.warn(`[Config Warning] Folder mapping "${site.folder}" for site "${site.id}" does not exist at ${folderPath}`);
            }
        });
        return true;
    } catch (error) {
        console.error("[Config Error] Failed to verify folders:", error);
        return false;
    }
};

// Initial verification on load (if on server)
if (typeof window === "undefined") {
    verifyFolders();
}
