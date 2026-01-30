# Next.js + React 입문자 가이드

이 문서는 Next.js와 React를 처음 접하는 개발자를 위한 실습 가이드입니다.

---

## 목차

1. [기본 개념](#1-기본-개념)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [컴포넌트 작성법](#3-컴포넌트-작성법)
4. [스타일링 (Tailwind CSS)](#4-스타일링-tailwind-css)
5. [상태 관리](#5-상태-관리)
6. [API 통신](#6-api-통신)
7. [페이지 추가하기](#7-페이지-추가하기)
8. [컴포넌트 확장하기](#8-컴포넌트-확장하기)

---

## 1. 기본 개념

### 서버 컴포넌트 vs 클라이언트 컴포넌트

Next.js 13+에서 가장 중요한 개념입니다.

```
┌─────────────────────────────────────────────────────────────┐
│                    서버 컴포넌트 (기본값)                      │
├─────────────────────────────────────────────────────────────┤
│ - 서버에서 렌더링되어 HTML로 전송                              │
│ - JavaScript 번들에 포함되지 않음 → 빠른 로딩                   │
│ - 데이터베이스, 파일 시스템 직접 접근 가능                       │
│ - useState, useEffect 사용 불가                              │
│ - 이벤트 핸들러(onClick 등) 사용 불가                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  클라이언트 컴포넌트 ('use client')            │
├─────────────────────────────────────────────────────────────┤
│ - 브라우저에서 실행                                           │
│ - JavaScript 번들에 포함됨                                    │
│ - useState, useEffect 사용 가능                              │
│ - 이벤트 핸들러 사용 가능                                      │
│ - 파일 최상단에 'use client' 선언 필요                         │
└─────────────────────────────────────────────────────────────┘
```

**언제 'use client'를 사용할까?**

```tsx
// ✅ 클라이언트 컴포넌트가 필요한 경우
'use client'

import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)  // useState 사용

  return (
    <button onClick={() => setCount(count + 1)}>  {/* 이벤트 핸들러 사용 */}
      클릭: {count}
    </button>
  )
}
```

```tsx
// ✅ 서버 컴포넌트로 충분한 경우 (기본값, 'use client' 불필요)
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

---

## 2. 프로젝트 구조

```
apps/frontend/
├── app/                      # 라우트 (URL 경로)
│   ├── (auth)/              # 레이아웃 그룹 (URL에 영향 없음)
│   │   ├── layout.tsx       # 인증 페이지 공통 레이아웃
│   │   ├── login/
│   │   │   └── page.tsx     # /login 페이지
│   │   └── signup/
│   │       └── page.tsx     # /signup 페이지
│   ├── globals.css          # 전역 스타일 (Tailwind + 테마)
│   ├── layout.tsx           # 루트 레이아웃 (모든 페이지 공통)
│   └── page.tsx             # / (홈) 페이지
│
├── components/
│   ├── ui/                  # shadcn/ui 기본 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── label.tsx
│   └── features/            # 도메인별 컴포넌트
│       └── auth/
│           ├── login-form.tsx
│           └── signup-form.tsx
│
├── lib/
│   ├── utils.ts             # cn() 유틸리티
│   ├── api/                 # API 클라이언트 (여기에 추가)
│   ├── hooks/               # 커스텀 훅
│   ├── stores/              # Zustand 스토어
│   └── atoms/               # Jotai 아톰
│
└── docs/                    # 문서
    └── BEGINNER_GUIDE.md
```

### 라우팅 규칙

| 폴더 구조 | URL |
|----------|-----|
| `app/page.tsx` | `/` |
| `app/login/page.tsx` | `/login` |
| `app/(auth)/login/page.tsx` | `/login` (괄호 폴더는 URL에 포함 안됨) |
| `app/users/[id]/page.tsx` | `/users/123` (동적 라우트) |

---

## 3. 컴포넌트 작성법

### 기본 컴포넌트 템플릿

```tsx
// components/features/example/my-component.tsx

// Props 타입 정의 (TypeScript)
interface MyComponentProps {
  title: string
  description?: string  // ? = 선택적 prop
  onClick?: () => void
}

// 컴포넌트 함수
export function MyComponent({ title, description, onClick }: MyComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
      {onClick && <button onClick={onClick}>클릭</button>}
    </div>
  )
}
```

### 클라이언트 컴포넌트 템플릿

```tsx
// components/features/example/interactive-component.tsx
'use client'

import { useState, useEffect } from 'react'

interface InteractiveComponentProps {
  initialValue?: number
}

export function InteractiveComponent({ initialValue = 0 }: InteractiveComponentProps) {
  // 상태 관리
  const [count, setCount] = useState(initialValue)

  // 부수 효과 (마운트 시 실행)
  useEffect(() => {
    console.log('컴포넌트가 마운트됨')

    // 클린업 함수 (언마운트 시 실행)
    return () => {
      console.log('컴포넌트가 언마운트됨')
    }
  }, [])  // 빈 배열 = 마운트 시 한 번만 실행

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  )
}
```

---

## 4. 스타일링 (Tailwind CSS)

### 자주 사용하는 클래스

```tsx
// 레이아웃
<div className="flex">              {/* Flexbox */}
<div className="flex flex-col">     {/* 세로 방향 */}
<div className="grid grid-cols-3">  {/* 3열 그리드 */}
<div className="items-center">      {/* 수직 중앙 정렬 */}
<div className="justify-between">   {/* 양 끝 정렬 */}

// 여백
<div className="p-4">       {/* padding: 1rem (16px) */}
<div className="px-4 py-2"> {/* 좌우 1rem, 상하 0.5rem */}
<div className="m-4">       {/* margin: 1rem */}
<div className="space-y-4"> {/* 자식 요소 사이 세로 간격 */}
<div className="gap-4">     {/* flex/grid 아이템 간격 */}

// 크기
<div className="w-full">    {/* width: 100% */}
<div className="h-screen">  {/* height: 100vh */}
<div className="max-w-md">  {/* max-width: 28rem */}
<div className="min-h-screen"> {/* min-height: 100vh */}

// 텍스트
<p className="text-sm">     {/* font-size: 0.875rem */}
<p className="text-lg">     {/* font-size: 1.125rem */}
<p className="font-bold">   {/* font-weight: 700 */}
<p className="text-center"> {/* text-align: center */}

// 색상 (테마 변수 사용)
<div className="bg-background">      {/* 배경색 */}
<p className="text-foreground">      {/* 텍스트 색상 */}
<p className="text-muted-foreground">{/* 흐린 텍스트 */}
<div className="bg-primary">         {/* 주요 색상 */}
<div className="bg-destructive">     {/* 에러/삭제 색상 */}

// 테두리 & 모서리
<div className="border">           {/* 테두리 */}
<div className="border-2">         {/* 두꺼운 테두리 */}
<div className="rounded-md">       {/* 둥근 모서리 */}
<div className="rounded-full">     {/* 원형 */}

// 그림자 & 효과
<div className="shadow-sm">        {/* 작은 그림자 */}
<div className="shadow-lg">        {/* 큰 그림자 */}
<div className="opacity-50">       {/* 50% 투명 */}

// 반응형 (모바일 우선)
<div className="w-full md:w-1/2 lg:w-1/3">
{/*
  기본: 100%
  md (768px 이상): 50%
  lg (1024px 이상): 33.3%
*/}
```

### cn() 유틸리티 사용법

조건부 클래스를 깔끔하게 조합할 수 있습니다.

```tsx
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  isActive?: boolean
  className?: string
}

function MyButton({ variant = 'primary', isActive, className }: ButtonProps) {
  return (
    <button
      className={cn(
        // 기본 스타일
        "px-4 py-2 rounded-md font-medium",

        // 조건부 스타일
        variant === 'primary' && "bg-primary text-primary-foreground",
        variant === 'secondary' && "bg-secondary text-secondary-foreground",

        // 상태에 따른 스타일
        isActive && "ring-2 ring-primary",

        // 외부에서 전달받은 클래스 (덮어쓰기 가능)
        className
      )}
    >
      버튼
    </button>
  )
}
```

---

## 5. 상태 관리

### useState (컴포넌트 내부 상태)

```tsx
'use client'
import { useState } from 'react'

function Example() {
  // 기본 타입
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // 객체 타입
  const [user, setUser] = useState<{ name: string; age: number } | null>(null)

  // 배열 타입
  const [items, setItems] = useState<string[]>([])

  // 상태 업데이트
  setCount(10)                    // 직접 값 설정
  setCount(prev => prev + 1)      // 이전 값 기반 업데이트
  setItems([...items, 'new'])     // 배열에 추가
  setUser({ ...user, name: '김철수' }) // 객체 일부 업데이트

  return <div>...</div>
}
```

### Zustand (전역 상태)

여러 컴포넌트에서 공유해야 하는 상태에 사용합니다.

```tsx
// lib/stores/auth-store.ts
import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user) => set({
    user,
    isAuthenticated: true
  }),

  logout: () => set({
    user: null,
    isAuthenticated: false
  }),
}))
```

```tsx
// 컴포넌트에서 사용
'use client'
import { useAuthStore } from '@/lib/stores/auth-store'

function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()

  if (!isAuthenticated) {
    return <a href="/login">로그인</a>
  }

  return (
    <div>
      <span>{user?.name}님</span>
      <button onClick={logout}>로그아웃</button>
    </div>
  )
}
```

### TanStack Query (서버 상태)

API에서 가져온 데이터 관리에 사용합니다.

```tsx
// lib/hooks/use-users.ts
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// 사용자 목록 조회
export function useUsers() {
  return useQuery({
    queryKey: ['users'],  // 캐시 키
    queryFn: async () => {
      const res = await fetch('/api/users')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,  // 5분간 fresh 상태 유지
  })
}

// 사용자 생성
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newUser: { name: string; email: string }) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      })
      return res.json()
    },
    onSuccess: () => {
      // 성공 시 users 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

```tsx
// 컴포넌트에서 사용
'use client'
import { useUsers, useCreateUser } from '@/lib/hooks/use-users'

function UserList() {
  const { data: users, isLoading, error } = useUsers()
  const createUser = useCreateUser()

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러 발생</div>

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}

      <button
        onClick={() => createUser.mutate({ name: '새 사용자', email: 'new@test.com' })}
        disabled={createUser.isPending}
      >
        사용자 추가
      </button>
    </div>
  )
}
```

---

## 6. API 통신

### fetch 기본 사용법

```tsx
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}
```

### 로그인 API 연동 예시

```tsx
// lib/api/auth.ts
import { apiClient } from './client'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  user: {
    id: string
    name: string
    email: string
  }
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
```

### 로그인 폼에 연동하기

```tsx
// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm, type LoginFormData } from '@/components/features/auth/login-form'
import { login } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function LoginPage() {
  const router = useRouter()
  const { login: setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await login(data)

      // 토큰 저장 (예: localStorage 또는 쿠키)
      localStorage.setItem('accessToken', response.accessToken)

      // 전역 상태에 사용자 정보 저장
      setUser(response.user)

      // 대시보드로 이동
      router.push('/dashboard')
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  )
}
```

---

## 7. 페이지 추가하기

### 새 페이지 만들기

1. `app/` 폴더에 새 폴더 생성
2. `page.tsx` 파일 생성

```tsx
// app/dashboard/page.tsx
export const metadata = {
  title: '대시보드',
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <p>환영합니다!</p>
    </div>
  )
}
```

### 동적 라우트 (파라미터 받기)

```tsx
// app/users/[id]/page.tsx
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params

  // 서버에서 데이터 fetch
  const user = await fetch(`http://localhost:3000/users/${id}`).then(r => r.json())

  return (
    <div>
      <h1>{user.name}</h1>
      <p>ID: {id}</p>
    </div>
  )
}
```

### 레이아웃 그룹 만들기

URL에 영향 없이 공통 레이아웃을 적용할 수 있습니다.

```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <aside className="w-64 border-r bg-muted/50">
        <nav className="p-4">
          <a href="/dashboard">대시보드</a>
          <a href="/settings">설정</a>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
```

---

## 8. 컴포넌트 확장하기

### shadcn/ui 컴포넌트 추가

```bash
# 터미널에서 실행
npx shadcn@latest add dialog    # 모달
npx shadcn@latest add toast     # 알림
npx shadcn@latest add dropdown-menu  # 드롭다운
npx shadcn@latest add tabs      # 탭
npx shadcn@latest add table     # 테이블
```

### 기존 컴포넌트 확장

```tsx
// components/ui/button.tsx를 확장한 커스텀 버튼
import { Button, type ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
}

export function LoadingButton({
  isLoading,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
```

### 커스텀 훅 만들기

```tsx
// lib/hooks/use-local-storage.ts
'use client'
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)

  // 마운트 시 localStorage에서 값 읽기
  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored) {
      setValue(JSON.parse(stored))
    }
  }, [key])

  // 값 변경 시 localStorage에 저장
  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setStoredValue] as const
}
```

---

## 자주 묻는 질문

### Q: 언제 'use client'를 사용해야 하나요?

- `useState`, `useEffect` 등 React Hook 사용 시
- `onClick`, `onChange` 등 이벤트 핸들러 사용 시
- `window`, `document` 등 브라우저 API 사용 시
- 라이브러리가 클라이언트 전용일 때

### Q: 서버 컴포넌트에서 데이터를 어떻게 가져오나요?

```tsx
// 서버 컴포넌트에서는 직접 async/await 사용
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()

  return <div>{json.title}</div>
}
```

### Q: 에러가 발생하면 어떻게 처리하나요?

```tsx
// app/(auth)/login/error.tsx
'use client'

export default function LoginError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="text-center">
      <h2>문제가 발생했습니다</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  )
}
```

### Q: 로딩 상태는 어떻게 보여주나요?

```tsx
// app/(auth)/login/loading.tsx
export default function LoginLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}
```

---

## 다음 단계

1. **로그인 API 연동**: `lib/api/auth.ts` 파일 생성
2. **Zustand 스토어 설정**: `lib/stores/auth-store.ts` 파일 생성
3. **TanStack Query Provider 설정**: 루트 레이아웃에 추가
4. **보호된 라우트 구현**: 인증이 필요한 페이지 보호

더 궁금한 점이 있으면 공식 문서를 참고하세요:
- [Next.js 문서](https://nextjs.org/docs)
- [React 문서](https://react.dev)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com)
