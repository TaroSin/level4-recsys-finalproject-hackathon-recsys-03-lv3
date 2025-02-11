## 🎯 개요

본 프로젝트의 `model_training` 디렉토리는 프리랜서와 기업 간의 매칭을 위한 추천 시스템을 구축하는 머신러닝 모델을 포함합니다. Recbole 기반의 추천 모델과 CatBoost를 활용한 예측 모델을 포함하며, 데이터 전처리, 학습, 평가 기능을 수행합니다.

## 🌳 File Tree 🌳
```
📂 model_training/                    # 모델 서버 코드
├── 📂 api/                           # API 라우트 정의
│   ├── db.py                      # DB 연결 설정
│   └── huggingface.py             # HuggingFace 연결 설정
├── 📂 datasets/                      # 학습에 필요한 데이터셋 (csv 파일 또는 Recbole 데이터 파일))
├── 📂 log_tensorboard/               # Tensorboard 로그
├── 📂 output/                        # 모델 저장 위치
├── 📂 config/
│   ├── config.yaml                # 기본 설정 파일
│   ├── {model_name}.yaml          # Recbole 모델별 설정 파일
│   └── Recbole.yaml               # Recbole 공통 설정 파일
├── 📂 src/
│   ├── dataset.py                 # 학습 데이터 조회 및 csv 저장
│   ├── preprocessing.py           # 데이터 전처리 함수 정의
│   ├── utils.py                   # 유틸리티 함수 정의
│   ├── 📂 CB/
│   │   ├── catboost_trainer.py    # CatBoost 모델 트레이너
│   │   ├── logistic_trainer.py    # logistic 모델 트레이너
│   │   ├── xgboost_trainer.py     # XGBoost 모델 트레이너
│   │   ├── optuna_optimizer.py    # CB 모델 파라미터 최적화 파일
│   │   └── loader.py              # CB 관련 모델 Dataloader
│   └── 📂 Recbole/
│       ├── loader.py              # Dataloader 생성
│       └── trainer.py             # 모델 학습
├── main.py                        # 메인 실행파일
├── model_upload.py                # 모델 업로드 파일
├── requirements.txt               # 모델 서버 의존성 정의
└── README.md                      # ML 관련 설명
```

## 📌 모델 개요

본 프로젝트는 추천 모델을 활용하여 프리랜서와 기업 간의 매칭을 최적화합니다.

- **Recbole 모델**: 일반 추천, 순차 추천, 컨텍스트 기반 추천을 포함한 다양한 추천 모델을 학습할 수 있습니다.
- **CatBoost 모델**: 프리랜서와 프로젝트의 매칭 점수를 예측하는 머신러닝 모델로, 주어진 특성을 활용해 최적의 프리랜서를 추천합니다.

## 🚀 모델 훈련
| 옵션 | 축약형 | 타입 | 설명 |
| --- | --- | --- | --- |
| `--config` | `-c` | str | 설정 파일 경로 지정 (기본값: `config/config.yaml`) |
| `--data` | `-d` | bool | DB 데이터 로드 여부 (갱신 시 `True` 설정) |
| `--type` | `-t` | str | Recbole 모델 유형 지정 (`g`: 일반 추천, `s`: 순차 추천, `c`: 컨텍스트 추천) |
| `--model` | `-m` | str | 학습할 추천 모델 이름 |
| `--n_components` | `-dn` | int | PCA를 활용한 텍스트 임베딩 차원 수 |
| `--embed` | `-de` | bool | 멀티-핫 인코딩된 범주형 데이터를 임베딩 여부 설정 (기본값: `True`) |
| `--similarity` | `-ds` | str | 유사도 계산 방식 (`cosine`, `dot_product`, `jaccard`) |
| `--optuna` | `-o` | bool | Optuna를 사용하여 하이퍼파라미터 최적화 수행 여부 (기본값: `False`) |
| `--cb_data` | `-cd` | bool | 트리 모델 사용 시 train/test 데이터 업데이트 여부 (기본값: `False`) |

**Recbole 모델**

```bash
cd model_training
python main.py -t g -m EASE #t와 m은 모델에 따라 변경 (-t → g:general, s:sequential, c:context-aware)
```

**CB 모델**

```bash
cd model_training
python main.py --model catboost #(catboost, logistic, xgboost)
```

## 📊 로그 및 모니터링

- 모델 학습 과정은 `log_tensorboard/`에서 확인할 수 있습니다.
- TensorBoard를 실행하여 시각화 가능

```bash
tensorboard --logdir log_tensorboard
```

## 📤 모델 업로드

- 학습된 모델을 Hugging Face Hub에 업로드

```bash
# 로그인
cd model_training/api
python huggingface.py

# 업로드
cd ..
python model_upload.py -f {model_name}.pth
```

