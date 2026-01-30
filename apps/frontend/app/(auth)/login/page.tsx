/**
 * 로그인 페이지
 * - 서버 컴포넌트 (기본값)
 * - LoginForm 클라이언트 컴포넌트를 렌더링
 */

import { LoginForm } from '@/components/features/auth/login-form'
import {Metadata} from "next";

// 페이지 메타데이터 (SEO)
export const metadata: Metadata = {
  title: '로그인',
  description: '계정에 로그인하세요',
}

export default function LoginPage() {
  return <LoginForm />
}
