

/**
 * Safely parses and decodes searchParams
 * @param {object|string} searchParams - The search parameters to process
 * @returns {Array<string>} - Array of key=reEncodedBase64 strings
 */
export const SearchParamsParser = (searchParams) => {
    const result = [];

    try {
        const p = searchParams?.p;
        if (!p) return result;

        // Decode URL encoding
        let decodedParam = decodeURIComponent(p.replace(/ /g, "+"));

        // Convert URL-safe Base64 to standard Base64
        decodedParam = decodedParam.replace(/-/g, "+").replace(/_/g, "/");

        // Fix padding
        const padding = decodedParam.length % 4;
        if (padding !== 0) decodedParam = decodedParam.padEnd(decodedParam.length + (4 - padding), "=");

        // Split multiple key=value pairs if necessary
        // In your current usage, it looks like a single encoded value
        result.push(`p=${decodedParam}`);

    } catch (err) {
        console.error("❌ parseSearchParams failed:", err);
    }

    return result;
};


/**
 * Safely parses and decodes searchParams
 * @param {object|string} searchParams - The search parameters to process
 * @returns {Array<string>} - Array of key=reEncodedBase64 strings
 */
export const ParseAndDecodeSearchParams = (searchParams) => {
    let result = [];
    // Keys known to contain base64-encoded values
    const base64Keys = ["A", "M", "S"];

    try {
        let parsed = searchParams;

        // If searchParams is a string, attempt to JSON.parse it
        if (typeof searchParams === "string") {
            try {
                parsed = JSON.parse(searchParams);
            } catch (e) {
                console.error("❌ Failed to parse searchParams string:", e);
                parsed = null;
            }
        }

        // If parsed is a valid object, process each key/value
        if (parsed && typeof parsed === "object") {
            result = Object.entries(parsed)
                .filter(([key, value]) => value !== undefined && value !== null && value !== "undefined" && value !== "null" && value !== "")
                .map(([key, value]) => {
                    if (typeof value !== "string") return null;

                    // Only attempt base64 decode/re-encode on known base64 keys
                    if (base64Keys.includes(key)) {
                        try {
                            // Replace spaces with + (common issue with Base64 in URLs)
                            let fixed = value.replace(/ /g, "+");

                            // Ensure padding length is correct
                            const paddingNeeded = (4 - (fixed.length % 4)) % 4;
                            if (paddingNeeded !== 0) {
                                fixed = fixed.padEnd(fixed.length + paddingNeeded, "=");
                            }

                            // Decode and then re-encode to ensure valid Base64
                            const decoded = atob(fixed);
                            const reEncoded = btoa(decoded);
                            return `${key}=${reEncoded}`;
                        } catch (e) {
                            console.warn(`⚠️ Value for key "${key}" is not valid base64, passing as-is:`, value);
                            return `${key}=${value}`;
                        }
                    }

                    // Non-base64 keys (T, N, B, K, etc.) — pass through as-is
                    return `${key}=${value}`;
                })
                .filter(Boolean); // Remove any null entries
        }
    } catch (err) {
        console.error("❌ Unexpected error in searchParams processing:", err);
    }

    return result;
};
