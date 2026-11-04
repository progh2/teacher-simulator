# 0029 Viewport readability script

## Fixes

1. `scripts/viewport-check.mjs` walks hub→sort→inspect at 1280×800 and 1024×768.
2. Asserts no console errors, no horizontal overflow, cards ≥140px wide.
3. `npm run test:viewport` → `docs/viewport-check.json`.
