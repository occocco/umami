# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 설정

**모든 대화와 응답은 한국어로 작성한다.**

---

This is the **frontend** app within the monorepo. For monorepo-wide commands, see the root `CLAUDE.md`.

## 명령어
```bash
pnpm dev          # 개발 서버 (포트 3001)
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint 검사
```

## 기술 스택

| 영역 | 기술 | 버전 |
|-----|-----|-----|
| 프레임워크 | Next.js (App Router) | 16 |
| UI 런타임 | React | 19 |
| 스타일 | Tailwind CSS | 4 |
| 컴포넌트 | shadcn/ui (new-york) | - |
| 서버 상태 | TanStack Query | 5 |
| 클라이언트 상태 | Zustand | 5 |
| 원자 상태 | Jotai | 2 |
| 아이콘 | Lucide React | - |

## 성능 최적화 원칙 (필수)

### 1. 서버 컴포넌트 우선
```
기본 = 서버 컴포넌트
'use client' = useState, useEffect, 이벤트 핸들러가 필요한 경우만
```

**클라이언트 컴포넌트 최소화 전략:**
- 인터랙티브 부분만 분리하여 작은 클라이언트 컴포넌트로 만듦
- 데이터 페칭은 서버 컴포넌트에서 수행 후 props로 전달

### 2. 번들 최적화
```tsx
// 동적 임포트 (무거운 컴포넌트)
const HeavyChart = dynamic(() => import('@/components/chart'), {
  ssr: false,
  loading: () => <Skeleton />
})

// 조건부 렌더링 시 동적 임포트
{showModal && <DynamicModal />}
```

**피해야 할 것:**
- barrel exports (`index.ts`에서 모든 컴포넌트 re-export)
- 사용하지 않는 import
- 클라이언트 컴포넌트에서 무거운 라이브러리 직접 import

### 3. 이미지 최적화
```tsx
// 필수: next/image 사용
<Image src="..." alt="..." width={} height={} />

// LCP 이미지만 priority
<Image priority src="..." />

// 뷰포트 밖 이미지는 lazy (기본값)
```

### 4. 데이터 페칭 전략
```
서버 컴포넌트: fetch() + cache/revalidate
클라이언트 컴포넌트: TanStack Query (staleTime, gcTime 설정)
```

```tsx
// 서버: 캐싱
const data = await fetch(url, { next: { revalidate: 3600 } })

// 클라이언트: 쿼리 키 구조화
useQuery({
  queryKey: ['users', { page, filter }],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000,  // 5분
})
```

### 5. 렌더링 최적화
```tsx
// React 19: 자동 메모이제이션으로 대부분 불필요
// 아래 경우만 수동 최적화:

// 1) 비용이 큰 계산
const sorted = useMemo(() => heavySort(items), [items])

// 2) 참조 안정성이 필요한 콜백 (자식에게 전달 시)
const handleClick = useCallback(() => {}, [dep])

// 3) 리스트 렌더링 최적화
{items.map(item => <MemoizedItem key={item.id} {...item} />)}
```

### 6. 레이아웃 시프트 방지
```tsx
// 스켈레톤은 실제 콘텐츠와 동일한 크기
<Skeleton className="h-[200px] w-full" />

// 이미지는 항상 width/height 또는 aspect-ratio
<Image width={800} height={600} />
<div className="aspect-video" />
```

## 디렉토리 구조
```
app/                    # 라우트
├── (auth)/            # 인증 레이아웃 그룹
├── (dashboard)/       # 대시보드 레이아웃 그룹
└── globals.css        # Tailwind + 테마 변수

components/
├── ui/                # shadcn/ui
└── features/          # 도메인별 컴포넌트

lib/
├── api/               # API 클라이언트
├── hooks/             # 커스텀 훅
├── stores/            # Zustand 스토어
├── atoms/             # Jotai 아톰
└── utils.ts           # cn() 유틸리티
```

## 코드 규칙

### 파일/네이밍
- 파일: `kebab-case.tsx`
- 컴포넌트: `PascalCase`
- 훅: `use-kebab-case.ts` → `useKebabCase`
- Props: `ComponentNameProps`

### Import 순서
```tsx
// 1. React/Next
import { useState } from 'react'
import Image from 'next/image'

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query'

// 3. 내부 모듈 (@/)
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// 4. 상대 경로
import { LocalComponent } from './local'
```

### 스타일링
```tsx
// cn()으로 조건부 클래스 조합
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)} />

// CSS 변수 사용 (globals.css에 정의됨)
// bg-background, text-foreground, bg-primary 등
```

## 환경 변수
```
NEXT_PUBLIC_* = 브라우저 노출
그 외 = 서버 전용
```

## 체크리스트

코드 작성 시 확인:
- [ ] 서버 컴포넌트로 충분한가? `'use client'` 필요한가?
- [ ] 이미지에 `next/image` 사용했는가?
- [ ] 큰 컴포넌트는 동적 임포트했는가?
- [ ] TanStack Query에 적절한 staleTime 설정했는가?
- [ ] 레이아웃 시프트 없는가? (Skeleton, 이미지 크기)