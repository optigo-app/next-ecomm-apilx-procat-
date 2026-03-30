# CHANGELOG

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
