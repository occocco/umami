'use client'

/**
 * 회원가입 폼 컴포넌트
 * - 'use client': 이벤트 핸들러와 상태를 사용하므로 클라이언트 컴포넌트
 * - 비밀번호 확인 기능 포함
 */

import React, {useState} from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card'
import {signup, SignupFormData, SignupResponse} from "@/lib/api/auth";

// Props 타입 정의
export interface SignupFormProps {
    /** 폼 제출 시 호출되는 함수 */
    onSubmit?: (data: SignupFormData) => Promise<SignupResponse>
    /** 로딩 상태 */
    isLoading?: boolean
    /** 에러 메시지 */
    error?: string
}

export function SignupForm({isLoading = false, error}: SignupFormProps) {
    // 폼 입력 상태
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // 클라이언트 측 유효성 검사 에러
    const [validationError, setValidationError] = useState('')

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setValidationError('')

        // 비밀번호 확인 검사
        if (password !== confirmPassword) {
            setValidationError('비밀번호가 일치하지 않습니다')
            return
        }

        // 비밀번호 길이 검사
        if (password.length < 4) {
            setValidationError('비밀번호는 8자 이상이어야 합니다')
            return
        }

        await signup({name, email, password});

    }

    // 표시할 에러 메시지 (서버 에러 또는 유효성 검사 에러)
    const displayError = error || validationError

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
                <CardDescription>
                    계정을 만들어 서비스를 이용하세요
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {/* 에러 메시지 */}
                    {displayError && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {displayError}
                        </div>
                    )}

                    {/* 이름 입력 */}
                    <div className="space-y-2">
                        <Label htmlFor="name">이름</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="홍길동"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

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
                            placeholder="8자 이상 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    {/* 회원가입 버튼 */}
                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? '가입 중...' : '회원가입'}
                    </Button>

                    {/* 로그인 링크 */}
                    <p className="text-center text-sm text-muted-foreground">
                        이미 계정이 있으신가요?{' '}
                        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                            로그인
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
