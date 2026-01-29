# 🎨 Spline 3D 애니메이션 통합 완료!

## 📦 설치 완료

```bash
✅ @splinetool/react-spline
✅ @splinetool/runtime
```

---

## 🎬 통합된 3D 애니메이션

### 1. **Hero Section** - 메인 3D 로봇

**파일**: `components/Hero.tsx`

#### 기능

- ✅ **Spline 3D 로봇 씬** 풀스크린 배경
- ✅ **스크롤 패럴랙스** - 스크롤 시 확대 및 어두워짐
- ✅ **3D 오브젝트 회전** - 스크롤에 따라 로봇 회전
- ✅ **로딩 상태** - Suspense로 부드러운 로딩
- ✅ **그라데이션 오버레이** - 텍스트 가독성 향상

#### Spline 씬 URL

```typescript
// 현재 사용 중인 씬
scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"

// 대체 가능한 씬들:
- Robot: https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode
- Abstract: https://prod.spline.design/llcWwd4JNJkFpAjh/scene.splinecode
- Tech Sphere: https://prod.spline.design/bRqyBPKhJEu1rqJr/scene.splinecode
```

#### 스크롤 애니메이션

```typescript
// 이미지 확대
transform: `scale(${1 + scrollY * 0.0003})`;

// 밝기 감소
filter: `brightness(${0.6 - scrollY * 0.0003})`;

// 3D 오브젝트 회전
obj.rotation.y = scrollProgress * Math.PI;
```

---

### 2. **Technology Section** - 추상적 3D 배경

**파일**: `components/TechnologySection.tsx`

#### 기능

- ✅ **3D 배경 애니메이션** - 추상적 기하학 패턴
- ✅ **스크롤 패럴랙스** - 배경이 스크롤에 따라 이동
- ✅ **카드 호버 효과** - 3D 변환 및 그라데이션
- ✅ **애니메이션 보더** - 흐르는 그라데이션 테두리
- ✅ **그라데이언트 오브** - 블루/시안 블러 효과

#### Spline 씬 URL

```typescript
// 현재 사용 중인 씬
scene="https://prod.spline.design/llcWwd4JNJkFpAjh/scene.splinecode"

// 대체 가능한 씬들:
- Abstract Tech: https://prod.spline.design/llcWwd4JNJkFpAjh/scene.splinecode
- Geometric: https://prod.spline.design/bRqyBPKhJEu1rqJr/scene.splinecode
```

#### 스크롤 애니메이션

```typescript
// 배경 이동 및 확대
transform: `translateY(${scrollProgress * 100}px) scale(${1 + scrollProgress * 0.2})`;

// 그라데이션 오브 이동
transform: `translateY(${scrollProgress * 200}px)`;
```

---

### 3. **Platform Section** - 플로팅 3D 오브젝트

**파일**: `components/PlatformSection.tsx`

#### 기능

- ✅ **플로팅 3D 큐브** - 우측에 떠있는 3D 오브젝트
- ✅ **회전 애니메이션** - 스크롤에 따라 360도 회전
- ✅ **수직 이동** - 사인 곡선 패턴으로 상하 이동
- ✅ **파티클 시스템** - 30개의 떠다니는 파티클
- ✅ **그라데이션 오버레이** - 상하단 페이드 효과

#### Spline 씬 URL

```typescript
// 현재 사용 중인 씬
scene="https://prod.spline.design/bRqyBPKhJEu1rqJr/scene.splinecode"

// 대체 가능한 씬들:
- Tech Cube: https://prod.spline.design/bRqyBPKhJEu1rqJr/scene.splinecode
- Hologram: https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode
```

#### 스크롤 애니메이션

```typescript
// 3D 오브젝트 회전 및 이동
transform: `translateY(${Math.sin(scrollProgress * Math.PI) * 50}px) rotateY(${scrollProgress * 360}deg)`;

// 파티클 이동
transform: `translateY(${scrollProgress * 100}px)`;
```

---

## 🎯 Spline 커뮤니티 프리셋 사용법

### 1. Spline 웹사이트 방문

```
https://spline.design/community
```

### 2. 원하는 3D 씬 선택

- 검색: "robot", "abstract", "tech", "geometric"
- 필터: Free, Animated, Interactive

### 3. 씬 URL 복사

1. 씬 클릭
2. "Share" 버튼 클릭
3. "Embed" 탭 선택
4. URL 복사 (예: `https://prod.spline.design/xxxxx/scene.splinecode`)

### 4. 코드에 적용

```typescript
<Spline
  scene="여기에_복사한_URL_붙여넣기"
  onLoad={onLoad}
  className="w-full h-full"
/>
```

---

## 🎨 추천 Spline 씬

### Hero Section용

1. **Robot/Character**
   - 휴머노이드 로봇
   - 산업용 로봇 팔
   - AI 캐릭터

2. **Abstract Tech**
   - 홀로그램 인터페이스
   - 데이터 시각화
   - 미래형 UI

### Technology Section용

1. **Geometric Patterns**
   - 추상적 기하학
   - 플렉시블 메쉬
   - 파티클 시스템

2. **Tech Elements**
   - 회로 기판
   - 네트워크 노드
   - 에너지 필드

### Platform Section용

1. **Floating Objects**
   - 큐브/구체
   - 크리스탈
   - 홀로그램

2. **Interactive Elements**
   - 회전하는 기어
   - 데이터 스트림
   - 에너지 코어

---

## 🔧 커스터마이징

### 1. 3D 오브젝트 제어

```typescript
const onLoad = (spline: any) => {
  splineRef.current = spline;

  // 오브젝트 찾기
  const obj = spline.findObjectByName("ObjectName");

  if (obj) {
    // 위치 변경
    obj.position.set(x, y, z);

    // 회전 변경
    obj.rotation.set(x, y, z);

    // 스케일 변경
    obj.scale.set(x, y, z);
  }
};
```

### 2. 스크롤 애니메이션

```typescript
useEffect(() => {
  const handleScroll = () => {
    const progress = window.scrollY / 1000;

    if (splineRef.current) {
      const obj = splineRef.current.findObjectByName("Main");
      if (obj) {
        // 회전
        obj.rotation.y = progress * Math.PI * 2;

        // 이동
        obj.position.y = Math.sin(progress * Math.PI) * 50;
      }
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

### 3. 마우스 인터랙션

```typescript
const onMouseMove = (e: MouseEvent) => {
  if (splineRef.current) {
    const obj = splineRef.current.findObjectByName("Main");
    if (obj) {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      obj.rotation.x = y * 0.5;
      obj.rotation.y = x * 0.5;
    }
  }
};
```

---

## 📊 성능 최적화

### 1. Lazy Loading

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <Spline scene="..." />
</Suspense>
```

### 2. 조건부 렌더링

```typescript
// 모바일에서는 3D 비활성화
{!isMobile && (
  <Spline scene="..." />
)}
```

### 3. 투명도 조절

```typescript
<div className="opacity-30">
  <Spline scene="..." />
</div>
```

---

## 🎬 애니메이션 효과

### 1. 페이드 인

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 2. 그라데이션 애니메이션

```css
@keyframes gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

### 3. 보더 플로우

```css
@keyframes border-flow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

---

## 🐛 문제 해결

### 1. 3D 씬이 안 보이는 경우

```typescript
// Suspense 추가
<Suspense fallback={<div>Loading...</div>}>
  <Spline scene="..." />
</Suspense>
```

### 2. 성능 문제

```typescript
// 투명도 낮추기
<div className="opacity-20">
  <Spline scene="..." />
</div>

// 모바일에서 비활성화
{!isMobile && <Spline scene="..." />}
```

### 3. 오브젝트를 찾을 수 없는 경우

```typescript
// try-catch로 감싸기
try {
  const obj = spline.findObjectByName("Name");
  if (obj) {
    // 조작
  }
} catch (e) {
  console.log("Object not found");
}
```

---

## 🎉 완성!

**Spline 3D 애니메이션이 완벽하게 통합되었습니다!**

✅ **Hero Section** - 풀스크린 3D 로봇  
✅ **Technology Section** - 추상적 3D 배경  
✅ **Platform Section** - 플로팅 3D 오브젝트  
✅ **스크롤 애니메이션** - 패럴랙스, 회전, 이동  
✅ **100% React 호환** - TypeScript 지원  
✅ **성능 최적화** - Lazy loading, Suspense

**브라우저에서 확인하세요!** 🚀

---

## 📚 참고 자료

- Spline 공식 문서: https://docs.spline.design
- Spline 커뮤니티: https://spline.design/community
- React Spline: https://github.com/splinetool/react-spline
- 예제 코드: https://spline.design/examples

---

_작성일: 2026-01-29_  
_버전: Spline 3D Integration v1.0_  
_상태: ✅ 완료_
