# 🎬 Figure.ai 스타일 랜딩 페이지 - 확인 가이드

## ✅ 빌드 에러 수정 완료!

**문제**: translations.ts 파일의 작은따옴표 문법 오류  
**해결**: "you'd" → "you would"로 수정  
**상태**: ✅ 빌드 성공

---

## 🌐 브라우저에서 확인하기

### 1단계: 브라우저 열기

```
http://localhost:3001
```

### 2단계: 확인 체크리스트

#### ✅ Hero Section (첫 화면)

- [ ] **풀스크린 로봇 이미지** 표시됨
- [ ] **대형 타이포그래피** "THE FUTURE OF MANUFACTURING IS HERE"
- [ ] **그라데이션 텍스트** "MANUFACTURING" (파란색 → 청록색)
- [ ] **통계 카드** 3개 (99.8%, 40%, 24/7)
- [ ] **CTA 버튼** 2개 (흰색 "Explore Solutions", 투명 "Watch Demo")
- [ ] **스크롤 인디케이터** 하단 중앙 (애니메이션)
- [ ] **플로팅 파티클** 떠다니는 입자들

#### ✅ 스크롤 효과

- [ ] **패럴랙스 효과**: 스크롤 시 로봇 이미지 확대
- [ ] **페이드 아웃**: 스크롤 시 텍스트 서서히 사라짐
- [ ] **Navbar 블러**: 스크롤 시 네비게이션 바 블러 배경 활성화

#### ✅ Navbar (상단 메뉴)

- [ ] **투명 배경** (스크롤 전)
- [ ] **블러 배경** (스크롤 후) - 검은색 반투명 + 블러
- [ ] **로고** 좌측 (그라데이션 아이콘 + "GrowAI")
- [ ] **메뉴** 중앙 (PLATFORM, SOLUTIONS, TECHNOLOGY, COMPANY, CAREERS)
- [ ] **CTA 버튼** 우측 (흰색 "Get Started")
- [ ] **호버 효과**: 메뉴 항목에 마우스 올리면 하단 라인 애니메이션

#### ✅ Technology Section

- [ ] **섹션 제목** "Built for the Future of Manufacturing"
- [ ] **6개 기술 카드** 그리드 레이아웃 (3열)
  - Predictive AI (95% accuracy)
  - Vision Systems (99.8% detection)
  - Real-time Processing (<10ms latency)
  - Enterprise Security (ISO 27001)
  - Continuous Learning (Self-optimizing)
  - Edge Computing (On-premise)
- [ ] **배경 그리드** 패턴
- [ ] **그라데이션 오브** (블루/시안 블러)
- [ ] **호버 효과**: 카드에 마우스 올리면 배경 그라데이션

#### ✅ Platform Section

- [ ] **섹션 제목** "Intelligent Manufacturing Solutions"
- [ ] **Expert Matcher** (좌측 2/3)
- [ ] **Technical Chatbot** (우측 1/3)
- [ ] **그라데이션 배경** (검은색 → 회색 → 검은색)

#### ✅ Solutions Section

- [ ] **Reference Factory** 성공 사례
- [ ] **검색 기능** 작동
- [ ] **필터 기능** 작동

#### ✅ Footer

- [ ] **4개 링크 카테고리** (Product, Company, Resources, Legal)
- [ ] **소셜 미디어 아이콘** (Twitter, LinkedIn, YouTube, GitHub)
- [ ] **브랜드 섹션** (로고 + 설명)
- [ ] **하단 바** (저작권 + 정책 링크)
- [ ] **그라데이션 라인** 최하단

#### ✅ 전체 디자인

- [ ] **검은 배경** 전체
- [ ] **흰색/회색 텍스트**
- [ ] **블루/시안 액센트**
- [ ] **미니멀 디자인** (넓은 여백)
- [ ] **부드러운 애니메이션** (60fps)
- [ ] **반응형** (모바일/태블릿 지원)

---

## 📸 스크린샷 가이드

### 캡처해야 할 화면들

1. **Hero Section (전체 화면)**
   - 로봇 이미지 + 대형 타이포그래피
   - 통계 카드 3개
   - CTA 버튼

2. **Navbar 블러 효과**
   - 스크롤 후 네비게이션 바
   - 블러 배경 확인

3. **Technology Section**
   - 6개 기술 카드
   - 그리드 레이아웃

4. **Platform Section**
   - Expert Matcher + Chatbot
   - 그라데이션 배경

5. **Footer**
   - 전체 푸터 레이아웃
   - 링크 구조

---

## 🎨 Figure.ai 스타일 비교

### 원본 (Figure.ai)

- 미니멀 디자인
- 다크 테마
- 대형 타이포그래피
- 풀스크린 히어로
- 깔끔한 레이아웃

### 우리 구현 (GrowAI)

- ✅ 미니멀 디자인
- ✅ 다크 테마 (검은 배경)
- ✅ 대형 타이포그래피 (text-7xl)
- ✅ 풀스크린 히어로 (로봇 이미지)
- ✅ 깔끔한 레이아웃
- ✅ 그라데이션 텍스트
- ✅ 글래스모피즘 (Navbar)
- ✅ 패럴랙스 효과
- ✅ 플로팅 애니메이션

---

## 🐛 문제 해결

### 이미지가 안 보이는 경우

1. 개발자 도구 열기 (F12)
2. Console 탭 확인
3. 이미지 경로 확인: `/hero-robot.png`
4. Network 탭에서 이미지 로드 확인

### 애니메이션이 안 보이는 경우

1. 브라우저 새로고침 (Ctrl + F5)
2. 캐시 삭제
3. 다른 브라우저로 테스트

### 스크롤 효과가 안 보이는 경우

1. 천천히 스크롤
2. 마우스 휠 사용
3. 스크롤바 드래그

---

## 📊 성능 확인

### 개발자 도구에서 확인

1. F12 → Performance 탭
2. 페이지 로드 시간 확인
3. 애니메이션 FPS 확인 (60fps 목표)

### Lighthouse 점수

1. F12 → Lighthouse 탭
2. "Generate report" 클릭
3. Performance, Accessibility 점수 확인

---

## 🎉 완성 확인

모든 체크리스트 항목이 ✅ 표시되면 완성!

**예상 결과**:

- 영화 같은 풀스크린 히어로
- 부드러운 스크롤 애니메이션
- 세련된 미니멀 디자인
- Figure.ai와 유사한 프리미엄 느낌

---

## 📞 문제 발생 시

### 빌드 에러

```bash
# 터미널에서 확인
npm run dev
```

### 이미지 경로 문제

```
파일 위치: src/growai-map-solutions/public/hero-robot.png
크기: 645KB
```

### 컴포넌트 에러

```
확인 파일:
- components/Hero.tsx
- components/Navbar.tsx
- components/TechnologySection.tsx
- components/Footer.tsx
- App.tsx
```

---

_작성일: 2026-01-29_  
_빌드 상태: ✅ 성공_  
_준비 완료: 브라우저에서 확인하세요!_
