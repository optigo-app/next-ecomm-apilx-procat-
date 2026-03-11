# CHANGELOG

## [2026-03-07]

### Fixed

- **ProductDetail.js**: Fixed metal color dropdown not reflecting the product's color on initial load.
  - **Old behavior**: `selectMtColor` was initialized with the color name (e.g., "ROSE"), which didn't match the dropdown option values (color codes like "RG").
  - **New behavior**: `selectMtColor` is initialized with the color code, ensuring the dropdown correctly reflects the current metal color.
  - **Reason**: Dropdown options in `DetailBlock.jsx` use `colorcode` as values; if the state doesn't match, the dropdown shows the first entry by default.

## [2026-03-11]

### Changed

- **ProductDetail.js**: Implemented multi-variant cart logic and fixed metal color passing.
  - **Multi-variant Cart**: Added `quantity` state and updated `handleCart` to pass `Quantity` to the API.
  - **Cart Flag Fix**: Updated `handleCustomChange` to refresh `addToCartFlag` based on the `IsInCart` value from the variant API response.
  - **Metal Color Fix**: Ensured `handleCart` prioritizes `mcArr?.id` (derived from selected color) over the base product ID.
  - **Autocode Fix**: Prioritized variant-specific `autocode` in cart/wishlist operations for correct multi-variant support.
  - **Criteria Binding Fix**: Refactored mount effects to correctly bind Metal, Diamond, Stone criteria and Size from URL parameters when navigating from the cart [2026-03-11].
  - **Debounced Quantity Updater**: Implemented 500ms debouncing for quantity updates on the detail page, including loading states and header cart count synchronization. Optimized to only call API if item is already in cart [2026-03-11].
  - **Product Remarks**: Added a debounced remarks input field to the product detail page, allowing users to save custom notes for specific variants once they are in the cart [2026-03-11].
  - **Crash Fix**: Added optional chaining to `split()` calls in `handleCart` and `handleWishList` to prevent crashes if user interacts before criteria are fully initialized [2026-03-11].
- **DetailBlock.jsx**: Passed `quantity` and its setter to `QuantityInput` component.
- **Cart.js (hook)**: 
  - Updated `handleMoveToDetail` to pass all item-specific criteria and size to the product detail page [2026-03-11].
  - Implemented silent cart refresh in `getCartData` to support multi-variant item merging without full UI blocking.
  - Added intelligent item re-selection after refresh to maintain user context based on `IsMultiVariantCart` flag [2026-03-11].

### Fixed

- **ProductDetail.js**: Fixed broken "no-image-found" showing during chevron product navigation.
  - **Old behavior**: Clicking chevrons showed broken image icon because `imagePromise` was never re-set to `true`, so the skeleton overlay didn't appear.
  - **New behavior**: `imagePromise` is set to `true` in `handleMoveToDetail` (showing skeleton), and set to `false` at end of `ProdCardImageFunc` (hiding skeleton once images are ready).
  - **Reason**: Match old Backup.jsx image loading flow — skeleton covers image area during navigation transition.

## [2026-02-27]

### Added

- Implemented default video fallback logic in `ProductDetail.js`.
- Automatically switches to video if product images are missing or fail to load.

## [2026-02-26]

### Added

- Initial CHANGELOG.md file.

### Changed

- Refactoring `Album.js` and `CacheBuilder.js` to improve performance and readability.
- Extracted pricing context logic to `CacheBuilder.js`.
- Centralized cache validation logic in `CacheBuilder.js`.
- Optimized image loading flow in `Album.js`.
- Parallelized cache validation calls and optimized data fetch waterfall in `Album.js`.
- Fixed cache key inconsistency to ensure reliable request deduplication.
- Fixed infinite loop in `TopSection.js` by replacing async pre-fetch with a native `onError` fallback mechanism.
