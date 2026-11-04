# 0019 Hub 4-tile fit · magnifier content · horizontal wood

## Critique after 0018

- Hub cut off bottom two tiles at 1280×800 — banner too tall + tile min-heights.
- Magnifier often a blank white disk (wrong content-space math vs canvas pan/zoom).
- Wood still read as vertical wallpaper stripes.
- Empty pile leftover band fixed earlier; tray now fills column.

## Fixes

1. Compact hub: banner max-height 160px, smaller hero/tiles so 2×2 grid fully visible.
2. Magnifier: map pointer → content coords `(x-pan)/zoom`, center with scale 2.6; clamp lens inside viewport.
3. Desk wood: horizontal plank bands + window light (desk top-down look).
4. E2E aims lens at handwriting/bubbles region; tray cards slight fan rotation.
