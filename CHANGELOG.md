## [2026-04-09] — Critical: Product Detail Crash Fix

### Fixed

- **CRITICAL — useProductDetail.js (fgstore.web)**: Fixed `TypeError: Cannot destructure property 'FrontEnd_RegNo' of 'u' as it is null` crash when navigating to the product detail page.
  - **Old behavior**: The `useEffect` that decodes the URL param called `decodeAndDecompress(navVal)` — which explicitly returns `null` on any parsing or decompression error — and then **immediately** destructured the result with `const { b, l, count } = decodeobj`. When `decodeobj` is `null`, JavaScript throws a fatal `TypeError`, crashing the entire detail page. The product data was still inside a `if (decodeobj)` block below, but the destructure on line 343 happened before that check.
  - **New behavior**: Added an early-return guard `if (!decodeobj) { console.warn(...); return; }` immediately after `decodeAndDecompress()`. If the URL param is missing or corrupt, the effect bails gracefully without crashing. The `if (decodeobj)` wrapper below was also removed (now redundant) and the code was flattened for clarity.
  - **Reason**: The URL param is decoded via pako inflate + atob. Any navigation where the param is missing, malformed, or from an incompatible source will return `null`. This null was not guarded at the destructuring site.
  - **File(s)**: `app/theme/fgstore.web/detail/_detComponents/hooks/useProductDetail.js`

- **SingleProdListAPI.js**: Fixed `"undefined"` literal strings being sent to the backend as API parameter values.
  - **Old behavior**: Template literals like `` `${storeinit?.FrontEnd_RegNo}` `` and `` `${storeinit?.CurrencyRate}` `` produce the string `"undefined"` when properties are missing or `storeInit` itself is null at call time. The backend received parameters like `PackageId: "undefined"`, `FrontEnd_RegNo: "undefined"`, etc.
  - **New behavior**: Added `?? ""` fallbacks to all critical fields (`FrontEnd_RegNo`, `PackageId`, `CurrencyRate`, `Metalid`, `DiaQCid`, `Laboursetid`, `diamondpricelistname`, `colorstonepricelistname`, `SettingPriceUniqueNo`, `IsStockWebsite`). These now produce clean empty strings instead of `"undefined"`.
  - **Reason**: Prevents junk parameter values from corrupting the product API request even in race-condition / guest scenarios.
  - **File(s)**: `app/(core)/utils/API/SingleProdListAPI/SingleProdListAPI.js`



### Changed

- **StoreProvider.js**: Changed `ToastContainer` position to `bottom-right` to ensure toast notifications no longer obstruct center-screen interactions.

### Fixed

- **Cart Mobile Header (proCat_cartPage.scss)**: Improved mobile alignment of the `Back`, `Clear All`, and `Place Order` button cluster.
  - **Old behavior**: The `Place Order` button retained a forced `width: 200px` and huge `margin-inline: 6%` over-stretching the mobile flexbox layout and causing overlap/wrapping issues with the `Back` and `Clear All` buttons.
  - **New behavior**: Added a precise `@media (max-width: 768px)` constraint to `.proCat_cartmainRowDiv`. Removed `flex: 1` pushing and configured `Place Order` button to use responsive padding (`width: auto`) instead of a fixed 200px width. `Back/Clear All` buttons now fit comfortably on the left without touching the edges.
  - **Reason**: To give the mobile cart heading the proper spacing and correct visual weight.
  - **File(s)**: `app/theme/fgstore.pro/cart/ProCatB2bCart/proCat_cartPage.scss`

- **ProductDetail.js (fgstore.pro + fgstore.pro.beta)**: Fixed product detail page receiving all API params as `undefined`/`null` when navigating from the product list.
  - **Old behavior**: The `FetchProductData` `useEffect` ran on `[params]` change immediately on navigation — before `MasterProvider`'s `useEffect` had finished writing `storeInit`, `loginUserDetail`, `metalTypeCombo`, etc. to `sessionStorage`. As a result, `SingleProdListAPI` read `undefined` from `getSession()` and the JS template literals converted them to the literal string `"undefined"`, causing the backend to receive invalid parameters (`PackageId: "undefined"`, `CurrencyRate: "undefined"`, etc.) and return no data.
  - **New behavior**: 
    1. Both `ProductDetail.js` files now import `useMaster` from `MasterProvider` and destructure `comboReady`.
    2. The `FetchProductData` `useEffect` has an early-return guard: `if (!comboReady || !storeInit) return;`
    3. `comboReady` and `storeInit` are added to the effect's dependency array so the fetch fires automatically once both are ready.
    4. This is the same proven pattern already used in `Album.js`.
  - **Reason**: `MasterProvider`'s session-population `useEffect` runs asynchronously after the first render. Client components that read from `sessionStorage` on mount/navigation must wait for `comboReady` before making API calls.
  - **File(s)**:
    - `app/theme/fgstore.pro/detail/ProductDetail/ProductDetail.js`
    - `app/theme/fgstore.pro.beta/detail/ProductDetail/ProductDetail.js`

- **Header.modul.scss (Procat)**: Fixed logo display issues in both the normal header and sticky (fixed) header where logos were being cut off, half-hidden, or not displaying proportionally.
  - **Old behavior**: `.smr_logo_header` and `.smr_logo_header_Fixed` both only had `max-width: 1000px` with no height constraint. Because the header containers are height-constrained (110px normal, 60px sticky), an unconstrained image would overflow vertically and get clipped. The image had no `object-fit` so it could distort or be cut at unpredictable sizes.
  - **New behavior**:
    - `.smr_logo_header` now has `max-height: 75px`, `width: auto`, `max-width: 100%`, `object-fit: contain`, `object-position: left center`. Logo stays proportional and is fully visible within the 110px header.
    - `.smr_logo_header_Fixed` now has `max-height: 42px`, same `contain` rules — fits cleanly inside the 60px sticky header.
    - Mobile (`≤1200px`): logos scale to `55px` / `38px`.
    - Small mobile (`≤500px`): logos scale to `50px` / `35px`.
    - `.smiling_Top_header_div2_web` and `.smiling_Top_header_div2_mobile` now have `overflow: hidden` to prevent any edge-case overflow bleed.
    - Removed two empty/comment-only SCSS rulesets that triggered lint warnings.
  - **Reason**: The logo was cut or half-hidden because there was no vertical (height) constraint on the `<img>` element — only a max-width that was effectively uncapped. Adding `max-height` relative to the header height and `object-fit: contain` guarantees the logo is always fully visible regardless of its original aspect ratio.
  - **File(s)**: `app/components/(dynamic)/Header/Procat/Header.modul.scss`

## [2026-04-08]

### Added

- **Cart.js (fgstore.pro)**: Added a "Back" button at the top of the Cart page for easier navigation.
  - Styled with `.proCat_backButton` using a clean, borderless design, matching `titleColor`, with a smooth hover effect and left alignment mirroring the multiselect checkboxes.
  - **File(s)**: `app/theme/fgstore.pro/cart/ProCatB2bCart/Cart.js`, `proCat_cartPage.scss`

### Fixed

- **Cart.js (useCart hook)**: Fixed an issue where manual quantity inputs were incorrectly decrementing by 1 instead of setting the actual typed value.
  - **Old behavior**: `handleIncrement` and `handleDecrement` inside `useCart` strictly functioned by mutating the `item.Quantity` by +1 or -1. In `QuantitySelector.js`, passing an exact number via numeric input triggered `handleDecrement` (e.g., inputting 1 when current was 15) which only reduced the quantity by 1 (to 14).
  - **New behavior**: `handleIncrement` and `handleDecrement` now accept an optional `targetQuantity` parameter. If given, they set the quantity directly to the target amount while still recalculating the associated price correctly and making the backend `updateQuantity` API call. `setQtyCount` has been updated to confidently set the target amount synchronously.
  - **Reason**: To reliably parse and apply explicit numeric inputs while preserving the original click-to-decrement (-1 / +1) behavior.
  - **File(s)**: `app/(core)/utils/Glob_Functions/Cart_Wishlist/Cart.js`

## [2026-04-06]

### Fixed

- **Album.js (fgstore.pro)**: Fixed albums not loading on first page visit due to API race condition.
  - **Old behavior**: On first load, the combo APIs would finish but the server-side visitor session wasn't fully ready. The album API returned `rd: []` (empty array). The code correctly skipped caching, but `lastRequestKeyRef` was already set to the cache key. Since no dependencies changed (`islogin` stayed `null`), the useEffect never re-triggered. Albums remained permanently empty until a manual page refresh. Additionally, the `finally` block unconditionally set `imagesReady = true`, so the skeleton disappeared immediately on the first empty response — leaving a blank page instead of a loading state.
  - **New behavior**: When the API returns an empty `rd` array, the component now:
    1. Resets `lastRequestKeyRef` to `""` so future triggers are not blocked
    2. Schedules an automatic retry with exponential backoff (2s → 4s → 8s)
    3. Caps retries at 3 attempts to prevent infinite loops
    4. **Keeps the skeleton visible** during retries (only dismisses it on success or after max retries)
    5. Retries also apply to network errors and missing `rd` responses
    6. On success, the retry counter resets and any pending retry timer is cleared
    7. Retry timer is cleaned up on component unmount
  - **Reason**: The backend visitor session is not always initialized by the time the album API is called on first cold load, causing a transient empty response that became permanent.
  - **File(s)**: `app/theme/fgstore.pro/home/Album/Album.js`

- **MasterProvider.js + Album.js**: Architectural fix — Album now waits for combo APIs before fetching (root cause fix).
  - **Old behavior**: `MasterProvider` called all combo APIs (MetalType, Diamond, ColorStone, etc.) in a fire-and-forget `Promise.all` with no completion signal. Its context value was empty `{}`. The Album component's `useEffect` fired **simultaneously** with the combo APIs. On first cold visit, the Album API hit the server before the visitor session was fully registered, causing the server to return an empty `rd: []`.
  - **New behavior**:
    1. `MasterProvider` now tracks a `comboReady` state, set to `true` after `Promise.all` completes (both success and error paths)
    2. `MasterProvider` exposes `{ comboReady }` via its context and exports a `useMaster()` hook
    3. `Album.js` now consumes `comboReady` via `useMaster()` and includes `!comboReady` as a guard in its fetch `useEffect`
    4. The Album API is only called **after** all combo APIs have finished, guaranteeing the server session is ready
  - **Reason**: This is the root cause fix — eliminates the race condition instead of patching it with retries.
  - **File(s)**: `app/(core)/contexts/MasterProvider.js`, `app/theme/fgstore.pro/home/Album/Album.js`

## [2026-04-04]

### Fixed

- **Album.js (fgstore.pro)**: Fixed edge cases causing empty album data to persist and block future fetches.
  - **Old behavior (Edge Case 1)**: When API returned `Data.rd` as `null`/`undefined`, the `else` branch at line 136 did NOT reset `isFetchingRef.current` or `setIsFetching(false)`. This permanently blocked ALL future fetch attempts.
  - **Old behavior (Edge Case 2)**: When API returned `Data.rd` as an empty array `[]`, `setAlbumData([])` was called, overwriting any existing valid data with empty state. The empty array was not cached (guard at line 121 prevented it), but the UI was left showing nothing.
  - **Old behavior (Edge Case 3)**: `sessionStorage.setItem("ALCVALUE", "")` was called even when ALC was empty, poisoning future page loads to always use an empty ALC from session.
  - **New behavior (Fix 1)**: `isFetchingRef.current = false` and `setIsFetching(false)` are now called in the `else` branch when API returns no `Data.rd`.
  - **New behavior (Fix 2)**: When `Data.rd` is an empty array, the code skips `setAlbumData` entirely and resets fetch state, preventing empty data from overwriting valid state.
  - **New behavior (Fix 3)**: `sessionStorage.setItem("ALCVALUE", ...)` is only called when `rawALC` is non-empty.
  - **Reason**: First-time visitors or stale cache scenarios could result in empty API responses that permanently broke the album component.

- **Album.js (fgstore.pro)**: Added comprehensive `██████` debug logs at every critical decision point.
  - Logs cover: fetch blocked/start, cache key generation, pricing context values, cache validation flow, API call/response, data setting, and render state.
  - **Reason**: To enable quick visual debugging of album data flow in browser console.

- **page.jsx (detail)**: Fixed `searchParams` not being awaited before passing to client component.
  - **Old behavior**: In Next.js 15, `searchParams` is a Promise. It was passed directly to `ProductDetail` without awaiting, so the client component received a Promise object instead of `{ p: "encoded_value" }`.
  - **New behavior**: `searchParams` is now awaited (`const resolvedSearchParams = await searchParams`) before being passed as a prop.
  - **Reason**: Next.js 15 requires `searchParams` to be awaited in async server components.

- **ProductDetail.js (fgstore.pro)**: Fixed `atob` `InvalidCharacterError` causing `autocode` and `designno` to be empty/undefined in API calls.
  - **Old behavior**: `parseSearchParams()` only handled a legacy `searchParams.value` JSON structure, not the resolved `{ p: "..." }` format from Next.js 15. Additionally, `decodeAndDecompress()` did not handle URL-encoded base64 strings (`%2B`, `%2F`, `%3D`), causing `atob()` to throw `InvalidCharacterError`.
  - **New behavior**: `parseSearchParams()` now first checks for direct key access (`searchParams.p`) before falling back to the legacy path. `decodeAndDecompress()` now applies `decodeURIComponent()` before base64 decoding.
  - **Reason**: The `p` query param was never decoded, so `decodeobj` was always `null`, making `singprod?.a` and `singprod?.b` undefined — causing `autocode: ""` and `designno: "undefined"` in the API payload.

- **ProductDetail.js (fgstore.pro)**: Fixed `searchParams` Base64 truncation and URL padding loss.
  - **Old behavior**: The `navVal` string was extracted using `result[0]?.split("=")[1]` or `location?.search.split("?p=")[1]`. Because Base64 uses `=` for padding, calling `.split("=")` chopped off the essential padding characters resulting in a malformed Base64 string that crashed `atob()`. Also, `searchParams.p` automatically converted `+` to spaces due to standard HTTP URL decoding, causing `atob()` to fail parsing.
  - **New behavior**: `navVal` is now extracted using `result[0].substring(result[0].indexOf("=") + 1)`, ensuring all subsequent characters (including `=`) remain intact. `parseSearchParams()` now intelligently applies `.replace(/ /g, "+")` to revert any browser URL mutations before attempting decoding.
  - **Reason**: This guarantees the base64 string identically matches the one crafted by `compressAndEncode` in `ProductList.js`.

- **SingleProdListAPI.js**: Added `?? ""` fallback for `designno` to prevent the literal string `"undefined"`.
  - **Old behavior**: `designno: \`${singprod?.b}\`` — when `singprod?.b` is `undefined`, JavaScript template literals convert it to the string `"undefined"`.
  - **New behavior**: `designno: \`${singprod?.b ?? ""}\`` — falls back to empty string.
  - **Reason**: Safety net to prevent sending `"undefined"` as designno even if upstream decoding fails.

## [2026-04-03]

### Fixed

- **ProductList.js (fgstore.pro)**: Fixed filters not passing to the GETPRODUCTLIST API correctly (FilterKey/FilterVal empty).
  - **Old behavior**: The main useEffect read query params from the `searchParams` server-side prop, which is static after the initial render and doesn't update on client-side navigation (clicking albums/menus). Additionally, the code only handled a `?value=JSON` query format, not individual params like `?A=base64`.
  - **New behavior**: Switched to using `ParseAndDecodeSearchParams` from Parser.js to handle both URL formats. Changed useEffect to properly read from searchParams prop.
  - **Reason**: Album/Menu navigation uses `navigate.push()` which is client-side only.

- **ProductList.js (fgstore.pro)**: Fixed `InvalidCharacterError: Failed to execute 'atob'` crash in `handleMoveToDetail`.
  - **Old behavior**: `decodeAndDecompress()` was called at line 1374 with NO argument, passing `undefined` to `atob()` which threw an error every time a product card was clicked.
  - **New behavior**: Removed the stray `decodeAndDecompress()` call (it wasn't using the return value). Added an input guard in `decodeAndDecompress` to return `null` if no valid string is passed.
  - **Reason**: Leftover/stray function call from earlier development.

- **Parser.js**: Fixed `atob` crash when processing non-base64 searchParam keys.
  - **Old behavior**: `ParseAndDecodeSearchParams` attempted to `atob()` ALL searchParam values, including non-base64 keys like `K` (security key), causing `InvalidCharacterError`.
  - **New behavior**: Only attempts base64 decode on known base64 keys (`A`, `M`, `S`). Other keys (`T`, `N`, `B`, `K`, etc.) are passed through as-is. Also filters out empty/null/undefined values.

## [2026-03-31]

### Added

- **Multi-Domain Theme Routing**: Implemented dynamic theme selection based on the request domain.
  - `beta.procatalog.web` now automatically renders the **fgstore.pro.beta** theme.
  - `procatalog.web` and all other domains default to the **fgstore.pro** theme.
  - Replaced the static `ACTIVE_THEME` constant with a dynamic `GET_THEME()` helper in router pages to support this flow.
- **B2B Registration Form Update**: Refactored the registration form to better suit a professional jewelry B2B platform.
  - Added `taxId` (VAT/GST No.), `businessType`, and `city` fields.
  - Integrated these fields into the `RegisterAPI` utility.
  - Fixed keyboard navigation for the updated form layout.

### Changed

- **Cleaned Up Themes**: Removed the deprecated `fgstore.pro.v1` theme from the configuration logic as requested.
- **Registration Flow Refactoring**: Transitioned from grid to stack layout for B2B registration per user preference.

## [2026-03-30]

### Added

- **Admin Status Dialogs**: Created reusable modals in the user registration and login components that mimic the OTP verification style using `Dialog` and `Slide` from Material UI.
  - **Files**: 
    - `app/theme/fgstore.pro.beta/Auth/Register/page.js`
    - `app/theme/fgstore.pro.beta/Auth/LoginWithEmail/page.js`
    - `app/theme/fgstore.pro.beta/Auth/LoginWithMobileCode/page.js`
    - `app/theme/fgstore.pro.beta/Auth/LoginWithEmailCode/page.js`
    - `app/theme/fgstore.pro.beta/Auth/Register/components/AdminStatusDialog.js`
  - **Old behavior**: The system directly redirected or showed inline errors.
  - **New behavior**: Added a unified `Dialog` with "Approved", "Rejected", and "Pending" (Waiting) states. Features include context-specific icons, smooth slide-down animation, and dynamic color schemes.
  - **Reason**: To visually notify the user about different account status scenarios including pending admin verification across all registration and login flows.


- **B2B and B2C constants**: Created a consolidated flag to manage store-wide B2B and B2C behavior.
  - **Files**: `app/(core)/constants/data.js`
  - **Old behavior**: No flags existed in the constants file.
  - **New behavior**: `b2b_b2c_flag` is now exported (1 for B2C, 0 for B2B).
  - **Reason**: To provide a single source of truth for component adaptations based on the business model.

- **ActiveMode Theme Switching**: Implemented a scalable theme-switching pattern using dynamic versioning.
  - **Files**: `app/(core)/constants/data.js`
  - **Old behavior**: Boolean-based `BetaMode`/`LiveMode`.
  - **New behavior**: String-based `ACTIVE_THEME` with a `THEME_VERSIONS` object, supporting `PRO`, `BETA`, `V1`, etc.
  - **Reason**: To allow adding any number of release versions (v1, v2) without changing route logic.

## [2026-03-27]

### Fixed

- **Cart Customization & Modal UI**: Unified 2x2 grid layout and aesthetics for all item types.
  - **Files**: `proCat_cartPage.scss`
  - **Layout**: Implemented a consistent CSS Grid (`1fr 1fr`) with optimized spacing for both customizable items and stock designs.
  - **Aesthetics**: Added light background boxes with padding and subtle borders to ensure options are "properly spaced" and visually integrated into the sidebar.
  - **Reason**: To improve visual organization, resolve vertical stacking issues, and fulfill the user request for a professional 2x2 layout.

- **Service Worker & Heartbeat Mechanism**: Implemented PWA-like service worker and periodic heartbeat.
  - **Files**: `public/service-worker.js`, `app/components/SWRegistration.js`, `app/layout.js`, `app/(core)/contexts/MasterProvider.js`
  - **Old behavior**: No service worker or client-side keep-alive mechanism existed.
  - **New behavior**: 
    - A Service Worker (`sw.js`) is now registered to cache static assets while bypassing dynamic API/Cart routes.
    - `MasterProvider.js` sends a `HEARTBEAT` message to the Service Worker every 30 seconds to signal the application is alive.
  - **Reason**: To enhance site performance via caching and establish a local heartbeat mechanism as requested.


## [2026-03-25]

### Fixed

- **Product Detail Remark field**: Added `onKeyDown` event propagation stop to the Remark `TextField`.
  - **Old behavior**: Pressing arrow keys (Left/Right) while typing in the Remarks field would trigger the parent `Swiper` component to change slides, making it impossible to navigate within the text.
  - **New behavior**: Keyboard events are now stopped from bubbling up to the `Swiper` component, allowing normal text navigation within the `TextField`.
  - **Reason**: To prevent conflicting keyboard navigation between the text input and the product image slider.


## [2026-03-24]

### Fixed

- **Product Listing & Detail Pages**: Resolved "undefined" strings in API parameters and `TypeError` crashes.
  - **Old behavior**: URL search parameters containing `null` or `undefined` were sometimes stringified as `"null"` or `"undefined"` and passed to API utilities. In `ProductListApi.js` and `FilterListAPI.js`, `atob()` would crash on these strings. Additionally, several API utilities (e.g., `StockItemApi.js`, `SaveLastViewDesign.js`) crashed with `TypeError: null reading 'id'` when `islogin` was true but session data was incomplete.
  - **New behavior**: 
    - Added defensive filtering and `atob` guards in `ProductList.js` and `ProductDetail.js` to ensure only valid base64 strings are processed and no `"undefined"` parameters are generated.
    - Implemented a `safeAtob` helper in `ProductListApi.js` and `FilterListAPI.js` to gracefully handle malformed or reserved strings.
    - Added optional chaining (`?.id`) to all session data accesses in API utility files to prevent `null` property access crashes.
- **Product Detail Remark Limit**: Implemented a 250-character limit for product remarks in `ProductDetail.js` and added a character counter in `DetailBlock.jsx` for user feedback.
  - **Reason**: To satisfy final user request for a character-based limit.
- **Cart Item Details**: Added granular details (Metal Type/Color, Diamond/Stone quality, Size) to the `CartItem.js` component.
  - **Style Reversion**: Reverted font sizes to normal as per final user request.
  - **Reason**: To maintain the desired visual balance in the cart.

## [2026-03-21]

### Fixed

- **ContinueWithEmail.js & ContinueWithMobile.js (web & pro themes)**: Implemented targeted clearing of session authentication data.
- **ProductDetail.js & Blocks/MoreProducts.jsx**: Fixed product navigation "Next/Previous" desync and swiper synchronization.

## [2026-03-18]

### Fixed

- **ProductDetail.js**: Fixed an issue where the user-selected metal color would visually reset on the screen when adding an item to the cart.
- **QuantityInput.jsx**: Removed flickering loading skeleton during quantity updates.

## [2026-03-16]

### Changed

- **ProductDetail.js & DetailBlock.jsx**: Refactored product remark saving logic.

## [2026-03-14]

### Fixed

- **ProductDetail.js**: Fixed `addToCartFlag` synchronization and `CartId` management.

## [2026-03-13]

### Fixed

- **DetailBlock.jsx**: Fixed laggy typing and flickering effect in the product remark box.

## [2026-03-11]

### Changed

- **ProductDetail.js**: Implemented multi-variant cart logic and fixed metal color passing.
- **DetailBlock.jsx**: Passed `quantity` and its setter to `QuantityInput` component.
- **Cart.js (hook)**: Implemented silent cart refresh and item re-selection.

### Fixed

- **ProductDetail.js**: Fixed broken "no-image-found" showing during chevron product navigation.

## [2026-02-27]

### Added

- Implemented default video fallback logic in `ProductDetail.js`.

## [2026-02-26]

### Added

- Initial CHANGELOG.md file.

### Changed

- Refactoring `Album.js` and `CacheBuilder.js` to improve performance and readability.
