# 트레이 푸터 겹침 · 단축키 · 오배치 샷

- **상태:** 완료
- **라벨:** `ux`, `round-18–19`
- **작성:** 2026-11-05 00:04 KST

## 자기비판 (07 / 14)

- 하단 sticky «정렬 완료» 바가 트레이 슬롯 도구와 겹침
- 14-wrong-slot 초기 샷이 빈 슬롯만 보여 피드백 미확인
- 더미 카드가 zone-head 라벨과 겹침

## 조치

- [x] 정렬 완료·수기번호순을 트레이 zone-head toolbar로 이동, desk footer 제거
- [x] zone-head 반투명 바 + z-index
- [x] e2e가 카드 2장을 트레이에 올린 뒤 slot-bad 확인 후 14-wrong-slot.png
- [x] F(뒤집기) / R(위아래) / Enter(트레이) 단축키
- [x] score-smoke.mjs (easy/normal/hard 만점 로직)

## 남은 한계

- 단축키 안내가 트레이 헤더 small에만 있음
- 목재는 CSS 줄무늬 — 사진 텍스처/Three.js 책상은 미도입(가독성 우선)
