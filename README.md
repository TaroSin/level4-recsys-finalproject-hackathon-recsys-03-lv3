<h1 align="center"><a href=’https://ginger-scion-7bd.notion.site/HRmony-170b563074a680b29360f7c273f82311?pvs=4’>HRmony</a></h1>

[![image](https://github.com/user-attachments/assets/eef56b60-1577-4ddd-aff1-9969e6b1d1d9)](https://hrmony.vercel.app/)


>추천 시스템을 활용한 기업-프리랜서 매칭 플랫폼, HRmony



본 서비스는 AI 기반 추천 시스템을 활용하여 기업과 프리랜서를 빠르고 정확하게 매칭하는 플랫폼입니다. 기업의 인재 탐색 비용을 절감하고, 프리랜서에게 적합한 프로젝트 기회를 제공함으로써 양측의 만족도를 극대화하는 것을 목표로 합니다.

- [HRmony 체험하기](https://hrmony.vercel.app/ "HRmony")
- [HRmony 시연 영상 보러 가기](https://www.youtube.com/watch?v=JYaz8wUgork)
<br></br>

## 📽️ 소개영상 📽️



https://github.com/user-attachments/assets/cf92e300-b3e2-4781-b832-478be2efba86


<br></br>

## 🛎️주요 기능🛎️
### 1️⃣ AI 기반 프리랜서 및 프로젝트 추천

![2025-02-104 55 48-ezgif com-crop](https://github.com/user-attachments/assets/60f4595f-ce42-4888-9be7-b6fb6c8fd0c0)

기업의 공고 내용과 프리랜서의 정보를 **AI 모델로 학습** 하여 **매칭 점수**를 제공

### 2️⃣ AI 프로젝트 **요약** 및 **필요 스킬**에 대한 태그 생성

![-Clipchamp-ezgif com-video-to-gif-converter (1)](https://github.com/user-attachments/assets/d1493e0f-0695-40e7-813f-f38eb8473723)


AI Chat을 활용해 등록할 프로젝트에 대한 요약 정보 및 필요 스킬에 대한 태그 생성

### 3️⃣ 기업 피드백을 반영한 스킬 숙련도

![ezgif com-video-to-gif-converter (1)](https://github.com/user-attachments/assets/cb975644-1862-47ee-b21a-8f621baeb0df)


프로젝트 종료 후 **기업 피드백을 반영**하여 프리랜서의 보유 **스킬 숙련도** 점수 조정
<br></br>
## 🪂 데이터셋 🪂

### 프리랜서 데이터

- [Stackoverflow 사용자 대상 설문조사(2024)](https://survey.stackoverflow.co/)를 바탕으로 한 개발자 정보 데이터
- 65,437개의 데이터 중 프리랜서에 적합한 조건을 가진 5488개 데이터 추출

### 프로젝트 데이터

- [위시캣(wishket)](https://www.wishket.com/) 사이트에 기업이 게시한 개발 관련 프로젝트 공고 데이터
- 총 22892개의 외주, 기간제 프로젝트 데이터

<br></br>

## 🖼️ Information Architecture🖼️

![image](https://github.com/user-attachments/assets/ea1ae9df-178d-4702-934a-237e04de8622)

<br></br>

## 🛠️ Service Architecture 🛠️

![image (1)](https://github.com/user-attachments/assets/701217e2-267c-412d-a7f4-d832317f1a39)

<br></br>

## 💾 ERD 💾

![image](https://github.com/user-attachments/assets/0d0a131a-7e95-4010-a17a-e1b369d08e9f)
<br></br>

## 🌳 File Tree 🌳
```bash
{level4-recsys-finalproject-hackathon-recsys-03-lv3}
├── 📂 frontend/                      # Frontend 코드 (React)
│   ├── 📂 public/                    # 정적 파일 (HTML, Favicon 등)
│   ├── 📂 src/                       # React 소스 코드
│   │   ├── 📂 assets/                # 정적 이미지나 로고 등 파일 저장
│   │   ├── 📂 components/            # UI 컴포넌트
│   │   ├── 📂 pages/                 # 페이지
│   │   ├── 📂 styles/                # css 파일 모음        
│   │   ├── App.css                    # 전역 스타일 정의 파일
│   │   ├── App.js                     # 메인화면 + React 진입점
│   │   ├── index.css                  # 기본 스타일 정의 파일
│   │   └── index.js                   # React 렌더링 진입점
│   ├── package-lock.json              # 의존성 잠금 파일 (버전 관리)
│   ├── package.json                   # Frontend 의존성 정의
│   └── README.md                      # Frontend 관련 설명
│
├── 📂 backend/                        # Backend 코드 (FastAPI)
│   ├── Dockerfile                     # 도커 파일
│   ├── 📂 api/                        # 외부 API
│   ├── 📂 src/                        # FastAPI 애플리케이션
│   │   ├── 📂 models/                 # 데이터베이스 모델
│   │   ├── 📂 routes/                 # API 라우트
│   │   ├── 📂 schemas/                # Pydantic 데이터 스키마
│   │   ├── 📂 services/               # 서비스 계층 (비즈니스 로직)
│   │   └── 📂 utils/                  # 공통 유틸리티 함수
│   ├── main.py                        # FastAPI 진입점 (라우터 정의)
│   ├── requirements.txt               # Backend 의존성 정의
│   └── README.md                      # Backend 관련 설명
│
├── 📂 model_training/                 # 모델 서버 코드
│   ├── 📂 api/                        # API 라우트 정의
│   ├── 📂 config/
│   ├── 📂 src/
│   │   ├── 📂 CB/
│   │   └── 📂 Recbole/
│   ├── main.py                        # 메인 실행파일
│   ├── model_upload.py                # 모델 업로드 파일
│   ├── requirements.txt               # 모델 서버 의존성 정의
│   └── README.md                      # ML 관련 설명
├── .gitignore
├── docker-compose.yml                 # 도커 컴포즈 파일
└── README.md                          # 프로젝트 설명 (서버별 실행 구문 포함)
```
<br></br>

## 👨‍👩‍👧‍👦 팀 소개 👨‍👩‍👧‍👦 
|강성택|김다빈|김윤경|
|:--:|:--:|:--:|
|<a href='https://github.com/TaroSin'><img src='https://github.com/user-attachments/assets/75682bd3-bcff-433e-8fe5-6515a72361d6' width='200px'/></a>|<a href='https://github.com/BinnieKim'><img src='https://github.com/user-attachments/assets/ff639e97-91c9-47e1-a0c8-a5fc09c025a6' width='200px'/></a>|<a href='https://github.com/luck-kyv'><img src='https://github.com/user-attachments/assets/015ec963-d1b4-4365-91c2-d513e94c2b8a' width='200px'/></a>|
| 데이터 크롤링 및 전처리<br> Content-Based 모델 개발 <br> 모델 및 서비스 배포<br>API 개발 | DB 설계 및 API 개발 <br> 모델 파이프라인 설계 <br> LightGCN,<br>Wide&Deep 모델 개발 | 웹 페이지 개발 및 API 연동 <br> 모델 파이프라인 설계 <br> EASE, SLIM 모델 개발 | 

|김희수|노근서|박영균|
|:--:|:--:|:--:|
|<a href='https://github.com/0k8h2s5'><img src='https://github.com/user-attachments/assets/526dc87c-0122-4829-8e94-bce6f15fc068' width='200px'/></a>|<a href='https://github.com/geunsseo'><img src='https://github.com/user-attachments/assets/0a1a27c1-4c91-4fdf-b350-1540c835ee72' width='200px'/></a>|<a href='https://github.com/0-virus'><img src='https://github.com/user-attachments/assets/98470105-260e-443d-8592-c139d7918b5e' width='200px'/></a>|
| 데이터 전처리 및 EDA <br> 웹 페이지 개발 | 데이터 전처리 <br> 웹 페이지 개발 및 API 연동 <br> FM 모델 개발 | 데이터 전처리 <br> 웹 페이지 개발 및 API 연동 <br> Content-Based 모델 개발 |

