/** 가상의 흔한 한국 성·이름 조합 (저작권 없는 합성 이름) */
const SURNAMES = [
  '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
  '한', '오', '서', '신', '권', '황', '안', '송', '류', '홍',
] as const

const GIVEN = [
  '민준', '서준', '도윤', '예준', '시우', '하준', '주원', '지호', '준서', '건우',
  '서연', '서윤', '지우', '서현', '민서', '하은', '하윤', '윤서', '채원', '지유',
  '수아', '지민', '현우', '지안', '유준', '은우', '시현', '예은', '다은', '수빈',
  '연우', '태양', '가은', '예린', '소율', '도현', '준혁', '시온', '나윤', '재원',
] as const

export function makeKoreanName(rng: () => number): string {
  const s = SURNAMES[Math.floor(rng() * SURNAMES.length)]!
  const g = GIVEN[Math.floor(rng() * GIVEN.length)]!
  return s + g
}

/** 다른 이름 하나 (성명 불일치용) */
export function makeDifferentName(rng: () => number, avoid: string): string {
  for (let i = 0; i < 20; i++) {
    const n = makeKoreanName(rng)
    if (n !== avoid) return n
  }
  return '홍길동'
}

/** 반 안에서 가나다순으로 쓸 고유 이름 count개 */
export function makeSortedKoreanNames(rng: () => number, count: number): string[] {
  const set = new Set<string>()
  let guard = 0
  while (set.size < count && guard < count * 40) {
    set.add(makeKoreanName(rng))
    guard++
  }
  while (set.size < count) set.add(`가상${String(set.size + 1).padStart(2, '0')}`)
  return [...set].sort((a, b) => a.localeCompare(b, 'ko'))
}
