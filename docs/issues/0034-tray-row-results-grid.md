# 0034 Tray single row + denser results

## Critique
Tray wrapped with a lonely 9th slot; results commentary needed scroll to see all cards.

## Fix
- ≥1180px: tray `repeat(9, minmax(0,1fr))` one row
- Results list 3-column grid, smaller mini OMR

## Verify
e2e OK · viewport OK · autosort tray 1 row, slotsOut=0
