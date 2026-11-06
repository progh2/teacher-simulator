# 플레이테스트 피드백 반영 — 과목·명렬·손상·결시·조치·다중 반

- **상태:** 완료
- **라벨:** `omr`, `domain`, `playtest`
- **작성:** 2026-11-06 KST

## 요구

1. 응시 과목코드·과목명 표시, 반 내 번호=가나다 이름순
2. 접힘·얼룩·찢김 시각화, 화이트 줌 정렬, 돋보기 제거
3. 검사 이상 체크 2열, 노란 명렬 힌트 박스 제거
4. 결시생 빈 답안지 + 결시·사유 대조
5. 흐린/한 줄(ㅡ) 마킹, 지저분해도 인식 가능은 OK, 감독관 도장 누락 보장
6. OMR 문제 부위 클릭 → 이상 선택
7. 검사 시점: 시험 직후(≤10분) / 교과 확인(무제한)
8. 학생 호출은 학번·이름·과목만. 답안 마킹은 호출 없이 오답 처리. 교사 수정 없음
9. 여러 반 동시 검사 난이도(`multi`)

## 완료

- [x] generator/types/scoring/omrRender/main 갱신
- [x] e2e: immediate+subject_review, multi, tape align, no magnifier, absent blanks
- [x] score-smoke: stamp coverage deterministic
- [x] 스크린샷 e2e 갱신


후속: 0054에서 수능 문구·문형 제거, 수기 과목명 추가.
