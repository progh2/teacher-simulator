# 0018 Desk wood · hub fill · magnifier · empty pile

## Critique (00:05 KST screenshots)

- **05 sorting pile:** Wood still reads as vertical wallpaper stripes; empty dark overlay between pile and tray; roster contrast better than before but not ink-black on cream.
- **07 tray:** When pile empties, a huge empty dark band remains above the tray — wastes vertical space.
- **01 hub:** Banner present but short; tiles use text glyphs not clear icons; bottom of grid felt cut off.
- **08/09 inspect:** OMR scale improved; magnifier often missing from zoom shot (pointermove not firing lens clone).

## Fixes

1. Multi-layer desk wood: window radial light + fine grain lines + plank bands + corner shade.
2. Roster: cream paper, 2px black border, heavier table ink (`#0a0a0a`).
3. `.pile-zone.is-empty { display:none }` so tray owns the desk column.
4. Hub SVG taller (280), plant prop, SVG tile icons (OMR bubbles / checklist / book / mail).
5. Magnifier 168px + stronger rim; e2e dispatches pointermove and unhides lens for 09 shot.
6. Gentler pile fan (less overlap) and slightly larger pile cards (268px).

## Verify

`npm run build && npm run e2e && npm run test:score`
