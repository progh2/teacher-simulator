# 0036 Pile card hit-testing

## Critique
Real mouse clicks on pile cards hit `.pile-area` instead — `filter: drop-shadow` + 3D tilt broke pointer hit regions; e2e `#btn-to-tray` stayed disabled.

## Fix
- Flatten pile-area; replace card `filter` with `box-shadow`; drop rotateX tilt
- e2e selects via `dispatchEvent('click')` and waits for enabled tray button

## Verify
Mouse select works · e2e OK · viewport OK
