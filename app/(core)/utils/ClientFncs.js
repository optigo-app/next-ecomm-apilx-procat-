"use client";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";

export function storInitDataPath() {
    if (typeof window === "undefined") {
        // running on server → return fallback
        return "";
    }

    let hostName =
        window.location.hostname === "localhost" ||
            window.location.hostname === "zen"
            ? NEXT_APP_WEB
            : window.location.hostname;

    if (hostName?.startsWith("www.")) {
        hostName = hostName.substring(4);
    }

    let statiPath = `${window.location.protocol}//${hostName}`;
    return `${statiPath}/Website_Store/WebSiteStaticImage/${hostName}`;
}
