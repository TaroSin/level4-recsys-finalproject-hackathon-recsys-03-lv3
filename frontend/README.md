## 🎯 개요

본 프로젝트의 `Frontend` 디렉토리는 React를 기반으로 구축된 프론트엔드 애플리케이션으로, 프리랜서와 기업 간의 매칭 프로세스를 직관적으로 제공합니다.

## 🌳 File Tree 🌳

```bash
📂 frontend/                             # Frontend 코드 (React)
├── 📂 public/                          # 정적 파일 (HTML, Favicon 등)
│   ├── favicon.ic                     
│   └── index.html
├── 📂 src/                            # React 소스 코드
│   ├── 📂 assets/                     # 정적 이미지나 로고 등 파일 저장
│   ├── 📂 components/                # 재사용 가능한 UI 컴포넌트
│   │   ├── Layout.js
│   │   ├── InfoCard.js
│   │   ├── ProfileIcon.js
│   │   ├── ... 
│   │   ├── SimilarProject.js
│   │   ├── Topbar.js
│   │   └── WebSocketContext.js
│   │
│   ├── 📂 pages/                       # 라우터 경로에 따른 각 페이지 구성 컴포넌트
│   │   ├── AppliedProjectPage.js
│   │   ├── CompanyMyPage.js
│   │   ├── FinishedProjectPage.js
│   │   ├── FreelancerDetailPage.js
│   │   ├── LoginPage.js
│   │   ├── MainPage.js
│   │   ├── ProjectDetailPage.js
│   │   ├── ProjectFeedback.js
│   │   ├── ProjectInputPage.js
│   │   ├── ProjectRegisterPage.js
│   │   ├── RecommendFreelancerPage.js
│   │   ├── RegisteredProjectsPage.js
│   │   ├── Router.js
│   │   ├── SearchFreelancerPage.js
│   │   ├── SearchProjectPage.js
│   │   ├── SignUpCompanyPage.js
│   │   ├── SignUpFreelancerPage.js
│   │   └── SignUpSelectPage.js
│   │
│   ├── 📂 style/          # css 스타일 파일 저장
│   ├── App.css            # 전역 스타일 정의 파일
│   ├── App.js             # 애플리케이션 메인 컴포넌트
│   ├── index.css          # 기본 스타일 정의 파일
│   └── index.js           # React 렌더링 진입점
│
├── package-lock.json      # 의존성 잠금 파일 (버전 관리)
├── package.json           # Frontend 의존성 및 스크립트 정의
└── README.md              # Frontend 관련 설명
```

## 🚀 실행 방법

### Vercel을 통한 배포된 서비스 이용

본 프로젝트는 Vercel을 통해 배포되었습니다. 아래 링크에서 바로 이용할 수 있습니다.

🔗 **배포된 서비스 URL**: https://hrmony.vercel.app
