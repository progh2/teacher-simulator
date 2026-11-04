# 0031 Upside-down / back card readability

## Critique
Rotated handwriting buried under neighbors; orient cue rotates with the face.

## Fix
- Upright `.pile-chip` badges (위아래 / 뒷면) outside the 3D rotate
- Milder fan (−4…+4°), lift + z-boost for misoriented cards
- Counter-rotate in-face orient badge; pile-area overflow visible with zone clip
- Memo/hint 16px

## Verify
e2e OK · viewport OK · chips present · no card/slot outside 1280×800
