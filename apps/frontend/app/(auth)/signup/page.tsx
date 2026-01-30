/**
 * 회원가입 페이지
 * - 서버 컴포넌트 (기본값)
 * - SignupForm 클라이언트 컴포넌트를 렌더링
 */

import {SignupForm} from '@/components/features/auth/signup-form'
import {Metadata} from "next";

// 페이지 메타데이터 (SEO)
export const metadata: Metadata = {
    title: '회원가입',
    description: '새 계정을 만드세요',
}

export default function SignupPage() {
    return <SignupForm/>
}
