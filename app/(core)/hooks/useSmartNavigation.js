"use client";

import { useMemo } from "react";
import Link from "next/link";

// Hidden prefetch component
const PrefetchLink = (href) => (
    <Link href={href} prefetch={true} style={{ display: "none" }} />
);

export const useSmartNavigation = () => {
    return useMemo(() => {
        return {
            push: (href) => {
                PrefetchLink(href);
            },
            replace: (href) => {
                PrefetchLink(href);
            },
        };
    }, []);
};
