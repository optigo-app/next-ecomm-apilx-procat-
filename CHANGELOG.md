# CHANGELOG

## [2026-03-21]

### Fixed

- **ProductDetail.js & Blocks/MoreProducts.jsx**: Fixed product navigation "Next/Previous" desync and swiper synchronization.
  - **Old behavior**: The `nextindex` state (tracking current position in the product list) was being reset to `0` by the main `DetailBlock` Swiper initialization. Additionally, the index was not correctly synchronized when the page loaded without an explicit `in` parameter, and the "More Products" swiper did not follow the current selection.
  - **New behavior**: Removed the incorrect index reset in `DetailBlock`. Added an effect in `ProductDetail.js` to automatically find and set the correct `nextindex` based on the current `designno`. Attached `innerSwiperRef` to the `MoreProducts` component to enable automatic scrolling to the active product.
  - **Reason**: To fix the user-reported issue where the "Next" button pointed to an incorrect "demo" design instead of the actual next product in the list.

## [2026-03-18]

### Fixed

- **ProductDetail.js**: Fixed an issue where the user-selected metal color would visually reset on the screen when adding an item to the cart.
  - **Old behavior**: The dependency array for the `useEffect` handling initial state selection included the full `singleProd` object. When adding to cart, `singleProd.IsInCart` updated, causing the effect to re-run and reset the UI's selected metal color (and other criteria) back to the original API response values. 
  - **New behavior**: The `useEffect` dependencies were narrowed down from `[singleProd]` to `[singleProd?.autocode]` (and similar specific primitives).
  - **Reason**: To prevent local UI states (`selectMtColor`, `selectMtType`, etc.) from being overwritten whenever cart-related properties of the product are updated.

- **QuantityInput.jsx**: Removed flickering loading skeleton during quantity updates.
  - **Old behavior**: The quantity controls were replaced by a `Skeleton` component during the debounced API update (`isQtyLoading`), causing a flickering effect.
  - **New behavior**: The quantity controls remain visible during updates. Buttons are disabled while the update is in progress, but the local value is updated immediately for a smooth experience.
  - **Reason**: To provide a "smooth update" without flickering as requested by the user.

## [2026-03-16]

### Changed

- **ProductDetail.js & DetailBlock.jsx**: Refactored product remark saving logic.
  - **Old behavior**: Remarks were automatically saved using a debounced 500ms timer on every keystroke.
  - **New behavior**: Remarks are now only saved manually when the user clicks the "Save" button. The "Save" button is only visible when the item is already in the cart.
  - **Reason**: To give users more control over when remarks are saved and to improve performance by reducing unnecessary API calls.

## [2026-03-14]

### Fixed

- **ProductDetail.js**: Fixed `addToCartFlag` synchronization and `CartId` management.
  - **New behavior**: `IsInCart` and `CartId` are now explicitly updated in the `singleProd` and `singleProd1` states after adding or removing items from the cart. This prevents side effects from resetting the "Add to Cart" button state.
  - **Reason**: To ensure the UI accurately reflects the cart status immediately after user interaction and maintains consistency across variant changes.

## [2026-03-13]

### Fixed

- **DetailBlock.jsx**: Fixed laggy typing and flickering effect in the product remark box.
  - **Old behavior**: The `TextField` was replaced by a `Skeleton` during auto-saves (`isRemarkLoading`), causing loss of focus and flickering.
  - **New behavior**: The `TextField` remains mounted during saving. The skeleton is only shown during initial product loading.
  - **Reason**: To ensure a smooth, uninterrupted typing experience.

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
