"use server";
import { headers } from "next/headers";
import { NEXT_APP_WEB } from "./env";

export async function getDomainInfo() {
    try {
        const headerList = headers();
        const headersObj = {};

        headerList.forEach((value, key) => {
            headersObj[key] = value;
        });
        if (process.env.NODE_ENV === "development") {
        }
        const rawHost = headerList.get("x-forwarded-host")  || "";
        const rawProto = headerList.get("x-forwarded-proto") || "";
        const hostname = rawHost || NEXT_APP_WEB;
        const protocol = `${rawProto}:`;
        return { hostname, protocol };
    } catch (error) {
        console.error("😉 ~ getDomainInfo ~ error:", error);
        return {
            hostname: NEXT_APP_WEB,
            protocol: process.env.NODE_ENV === "development" ? "http:" : "https:",
        };
    }
}
