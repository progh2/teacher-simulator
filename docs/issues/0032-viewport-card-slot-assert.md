# 0032 Viewport card/slot overflow asserts

## Critique
overflowX alone missed clipped pile cards / tray slots inside a non-scrolling desk.

## Fix
viewport-check.mjs now counts `.pile-card` / `.tray-slot` outside the client rect and fails the run.

## Verify
`npm run test:viewport` → VIEWPORT OK (desktop + tablet)
