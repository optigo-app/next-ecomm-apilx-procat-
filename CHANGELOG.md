# CHANGELOG

## [2026-03-07]

### Fixed

- **ProductDetail.js**: Fixed metal color dropdown not reflecting the product's color on initial load.
  - **Old behavior**: `selectMtColor` was initialized with the color name (e.g., "ROSE"), which didn't match the dropdown option values (color codes like "RG").
  - **New behavior**: `selectMtColor` is initialized with the color code, ensuring the dropdown correctly reflects the current metal color.
  - **Reason**: Dropdown options in `DetailBlock.jsx` use `colorcode` as values; if the state doesn't match, the dropdown shows the first entry by default.

## [2026-03-05]

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
