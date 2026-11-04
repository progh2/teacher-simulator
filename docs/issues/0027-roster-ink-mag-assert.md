# 0027 Roster ink · sticky pile toolbar · magnifier e2e assert

## Critique

- Roster still described as faint in 05.
- Magnifier content was fixed earlier but e2e only unhid lens — now assert `.omr-card` inside lens.

## Fixes

1. Force roster paper `#fffef8` + black cell ink.
2. Sticky semi-opaque pile zone-head so flip/tray buttons stay readable over cards.
3. E2E throws if magnifier lacks cloned OMR.
