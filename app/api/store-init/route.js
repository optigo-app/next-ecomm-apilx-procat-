
import { NextResponse } from "next/server";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
import { SyncProcatTheme, updateColorThemeFile } from "@/app/(core)/utils/API/PickThemePlattee";

export async function GET(req) {
    try {
        const host = req.headers.get("host") || "";
        const storeName = NEXT_APP_WEB; 
        const data = await fetchStoreInitData(storeName);
        const StyleContenet = await SyncProcatTheme({
            domainName: data?.rd?.[0]?.domain,
            yearCode: data?.rd?.[0]?.YearCode,
        });

        if (StyleContenet) {
            await updateColorThemeFile({
                host,
                styleContent: StyleContenet,
                storeInitData: data?.rd?.[0],
            });
        }

        const storeInit = data?.rd?.[0] || {};
        return NextResponse.json(storeInit, {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch storeInit" },
            { status: 500 }
        );
    }
}


// import { NextResponse } from "next/server";
// import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
// import { NEXT_APP_WEB } from "@/app/(core)/utils/env";

// export async function GET(req) {
//     try {
//         const host = req.headers.get("host") || "";
//         const storeName = NEXT_APP_WEB;
//         const data = await fetchStoreInitData(storeName);
//         const storeInit = data?.rd?.[0] || {};
//         return NextResponse.json(storeInit, {
//             status: 200,
//         });
//     } catch (error) {
//         return NextResponse.json(
//             { error: "Failed to fetch storeInit" },
//             { status: 500 }
//         );
//     }
// }

// // // app/api/store-init/route.ts

// import { NextResponse } from "next/server";
// import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
// import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
// import { SyncProcatTheme, updateColorThemeFile } from "@/app/(core)/utils/API/PickThemePlattee";

// export async function GET(req) {
//     try {
//         const host = req.headers.get("host") || "";
//         const storeName = NEXT_APP_WEB; // or map using host if needed
//         const data = await fetchStoreInitData(storeName);
//         const StyleContenet = await SyncProcatTheme({
//             domainName: data?.rd?.[0]?.domain,
//             yearCode: data?.rd?.[0]?.YearCode,
//         });
//         console.log(StyleContenet , "StyleContenet")

//         if (StyleContenet) {
//             await updateColorThemeFile({
//                 host,
//                 styleContent: StyleContenet,
//                 storeInitData: data?.rd?.[0],
//             });
//         }

//         const storeInit = data?.rd?.[0] || {};
//         return NextResponse.json(storeInit, {
//             status: 200,
//         });
//     } catch (error) {
//         return NextResponse.json(
//             { error: "Failed to fetch storeInit" },
//             { status: 500 }
//         );
//     }
// }
