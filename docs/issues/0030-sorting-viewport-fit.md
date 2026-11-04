# 0030 Sorting viewport fit

## Critique
- Rightmost pile card and tray slot 4 cut off at 1280×800
- Pile header count hard to read (reported as 0 while cards visible)
- Rotated card handwriting buried under neighbor overlap
- Memo / hint type too small

## Fix
- Cap `.desk-table` to `100vh - 52px` with `minmax(0,1fr)` desk-work so grid cannot expand past viewport
- Scale pile cards (`clamp(110px…158px)`), drop heavy negative margins, disable pile `rotateX` overflow
- Tray uses `auto-fill` grid (`minmax(108px,1fr)`) instead of fixed 250px flex rail
- Pile count badge: `N장` pill; milder fan rotation (−7…+7°)
- Sticky + side-note → 15px

## Verify
- Measure: 1280×800 and 1024×768 → 0 cards/slots outside viewport, 9 slots visible, no overflowX
- `npm run e2e` OK · `npm run test:viewport` OK
