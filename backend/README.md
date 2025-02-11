## 🎯 개요

본 프로젝트의 `backend` 디렉토리는 FastAPI를 기반으로 프리랜서와 기업 간의 매칭을 수행하는 REST API를 제공합니다.

## 🌳 File Tree 🌳

```bash
📂 backend/                          # Backend 코드 (FastAPI)
├── Dockerfile                   # 도커 파일
├── 📂 api/                          # 외부 API
│   ├── db.py
│   ├── huggingface.py
│   └── upstage.py
├── 📂 src/                          # FastAPI 애플리케이션
│   ├── 📂 models/                   # 데이터베이스 모델
│   │   ├── __init__.py
│   │   ├── category.py
│   │   ├── company.py
│   │   ├── feedback.py
│   │   ├── freelancer.py
│   │   ├── freelancerCategory.py
│   │   ├── freelancerSkill.py
│   │   ├── location.py
│   │   ├── project.py
│   │   ├── projectApplicants.py
│   │   ├── projectRanking.py
│   │   ├── projectSkill.py
│   │   └── skill.py
│   ├── 📂 routes/                    # API 라우트
│   │   ├── auth_route.py
│   │   ├── filter_route.py
│   │   ├── mymony_route.py
│   │   ├── project_route.py
│   │   ├── resource_route.py
│   │   └── websocket_route.py
│   ├── 📂 schemas/                   # Pydantic 데이터 스키마
│   │   ├── auth.py
│   │   ├── filter.py
│   │   ├── project.py
│   │   └── resource.py
│   ├── 📂 services/                  # 서비스 계층 (비즈니스 로직)
│   │   ├── auth_service.py
│   │   ├── filter_service.py
│   │   ├── project_service.py
│   │   └── resource_service.py
│   └── 📂 utils/                     # 공통 유틸리티 함수
│       ├── error_messages.py
│       ├── user_handler.py
│       └── utils.py
├── main.py                    # FastAPI 진입점 (라우터 정의)
├── requirements.txt           # Backend 의존성 정의
└── README.md                  # Backend 관련 설명
...
```

## 📌 API 문서
  ![image (9)](https://github.com/user-attachments/assets/ce703291-f463-47a6-9d25-6e7cc9211111)
- **Swagger UI**: https://hrmony.duckdns.org/docs
- **Notion에서 확인하기**: https://remember-us.notion.site/181b563074a680958d4ff792a7a51f5c?v=4adf1c5086074b9e9ac0fdcf709092d4&pvs=4
## 🔗 Oracle DB 연결 및 설정

본 프로젝트는 Oracle Database를 사용하며, Oracle Wallet을 통한 보안 연결을 지원합니다.

### 1️⃣ 환경 변수 설정

.env 파일에 Oracle DB 연결 정보 및 Hugging Face Token, Upstage Token 추가

```bash
### .env ###
# Database credentials
TNS_ADMIN={your_path}/.wallet                                                      # wallet 경로
ORACLE_USER={your_id}                                                              # Oracle 사용자 이름
ORACLE_PASSWORD={your_password}                                                    # Oracle 사용자 비밀번호

# JWT Token Secret Key
SECRET_KEY={your_jwt_token}                                                        # JWT 토큰

# Hugging Face Token
HUGGINGFACE_TOKEN={your_huggingface_token}                                         # 허깅페이스 토큰

# UPSTAGE TOKEN
UPSTAGE_TOKEN={your_upstage_token}                                                 # 업스테이지 토큰
```

### 2️⃣ Oracle Wallet 설정

backend/wallet/ 디렉토리에 Oracle Wallet 파일을 저장하고, `sqlent.ora`  설정을 적용해야합니다.

```bash
### sqlent.ora ###
WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="{your_path}/level4-recsys-finalproject-hackathon-recsys-03-lv3/.wallet")))
SSL_SERVER_DN_MATCH=yes
```

## 🚀 실행 방법

본 프로젝트는 도커를 활용해 서버를 배포합니다.

```bash
# docker-compose.yml에 정의된 서비스들의 이미지를 빌드
docker-compose build

# 빌드된 이미지를 기반으로 컨테이너를 백그라운드(-d)에서 실행
docker-compose up -d
```
