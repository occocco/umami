'use client'

/**
 * 로그인 폼 컴포넌트
 * - 'use client': 이벤트 핸들러(onSubmit)를 사용하므로 클라이언트 컴포넌트로 지정
 * - API 통신은 props로 받은 onSubmit에서 처리 (부모 컴포넌트에서 구현)
 */

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Props 타입 정의 - 컴포넌트가 받을 속성들
export interface LoginFormProps {
  /** 폼 제출 시 호출되는 함수 (API 통신 담당) */
  onSubmit?: (data: LoginFormData) => Promise<void>
  /** 로딩 상태 (버튼 비활성화에 사용) */
  isLoading?: boolean
  /** 에러 메시지 */
  error?: string
}

// 폼 데이터 타입
export interface LoginFormData {
  email: string
  password: string
}

export function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  // 폼 입력 상태 관리
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // 기본 폼 제출 동작 방지

    if (onSubmit) {
      await onSubmit({ email, password })
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">로그인</CardTitle>
        <CardDescription>
          이메일과 비밀번호를 입력하세요
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* 에러 메시지 표시 */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 이메일 입력 */}
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* 로그인 버튼 */}
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
