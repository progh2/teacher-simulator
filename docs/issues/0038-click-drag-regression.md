# 0038 Click + drag regression in e2e

## Critique
Round 0036 fixed filter/3d hit-testing; need a lasting assert so pile clicks and tray drops cannot silently break.

## Fix
e2e easy path: `elementFromPoint` must hit `.pile-card`, mouse click enables tray button, HTML5 drag into `#tray-rail` fills a slot, then cards return to pile.

## Verify
e2e OK · viewport OK
