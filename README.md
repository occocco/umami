# Study

TypeScript 풀스택 모노레포 프로젝트

## 기술 스택

| 영역 | 기술 |
|-----|-----|
| 모노레포 | Turborepo + pnpm workspaces |
| 백엔드 | NestJS 11, Prisma 7, PostgreSQL 16 |
| 프론트엔드 | Next.js 16, React 19, Tailwind CSS 4 |
| 캐싱 | Redis 7 |
| 언어 | TypeScript 5.x |

## 프로젝트 구조

```
apps/
├── backend/          # NestJS API 서버 (포트 3000)
└── frontend/         # Next.js 웹앱 (포트 3001)

packages/
├── ui/               # 공유 React 컴포넌트 (@repo/ui)
├── eslint-config/    # 공유 ESLint 설정
└── typescript-config/# 공유 TypeScript 설정
```

## 시작하기

### 필수 조건

- Node.js 18+
- pnpm 9+
- Docker & Docker Compose

### 설치

```bash
# 의존성 설치
pnpm install

# 인프라 실행 (PostgreSQL, Redis)
docker compose up -d

# 환경변수 설정
cp apps/backend/.env.example apps/backend/.env
```

### 개발 서버 실행

```bash
# 전체 앱 실행
pnpm dev

# 개별 앱 실행
pnpm dev --filter=backend
pnpm dev --filter=frontend
```

## 주요 명령어

```bash
pnpm dev              # 개발 서버 실행
pnpm build            # 프로덕션 빌드
pnpm lint             # ESLint 검사
pnpm check-types      # TypeScript 타입 검사
pnpm format           # Prettier 포맷팅

# 데이터베이스
pnpm db:migrate       # Prisma 마이그레이션
pnpm db:studio        # Prisma Studio GUI

# 테스트 (backend)
cd apps/backend
pnpm test             # 단위 테스트
pnpm test:e2e         # E2E 테스트
pnpm test:cov         # 커버리지 리포트
```

## 환경 변수

### Backend (`apps/backend/.env`)

```env
DATABASE_URL=postgresql://myuser:secret@localhost:5432/mydatabase
REDIS_HOST=localhost
REDIS_PORT=6379
```

## API 문서

백엔드 서버 실행 후 Swagger UI 접속:
- http://localhost:3000/api