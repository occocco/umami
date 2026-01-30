/**
 * 인증 페이지 전용 레이아웃
 * - 로그인, 회원가입 페이지에서 공통으로 사용
 * - 중앙 정렬된 카드 형태의 레이아웃 제공
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
