## 📌 treaXure: *어서와 서울은 처음이지?*

서울의 명소를 탐험하며, 미션을 수행하고 보물을 찾는 **탐험 기반 게임형 여행 앱**입니다.

### ■ 컨셉 키워드
- **탐험**
- **보물찾기**
- **서울**
- **사진 미션**
- **위치 기반**

### ■ 페르소나
서울을 처음 방문하거나, 친구들에게 **서울의 숨겨진 명소**와 **나만의 여행 스팟**을 소개하고 싶은 사용자

## 🧑‍🤝‍🧑 사용자 역할

### 1. 관리자
- 장소 및 미션 콘텐츠 기획/관리
- 보물찾기 프로그램 생성 및 유지

### 2. 유저 (참여자)
- 서울 내 명소 탐험
- 미션 수행을 통한 점수 획득
- 포토 미션 참여

## 🗂️ 주요 기능

### 필수 기능
- 회원가입/로그인
- 지도 기반 장소 탐색
- 위치 기반 방문 판별
- 미션 리스트 및 상세 확인
- 사진 업로드 및 점수 지급
- 장소 관리 (CRUD)
- 미션 등록 (CRUD)
- 미션 사진 수동 선정

### 추가 기능 (향후 구현)
- AI 유사도 판별 미션
- 주간 베스트 투표
- 리더보드 / 랭킹
- 댓글/좋아요
- 친구 초대 이벤트
- 자동 사진 선정 로직
- 사용자 신고 관리
- 통계 대시보드

## 📱 페이지 구성

### 유저 페이지
1. 🗺️ 지도 페이지 (홈 화면)
2. 📋 미션 리스트 페이지
3. 📸 미션 상세 페이지
4. 📁 업로드/미션 기록 페이지
5. ⭐ 주간 미션/사진 선정 페이지
6. 🧭 마이페이지

### 관리자 페이지
1. 🔧 관리자 대시보드
2. 📍 장소 관리 페이지
3. 🧩 미션 관리 페이지
4. 🏆 미션 사진 채택 페이지

### 공통 페이지
1. 🔐 로그인/회원가입
2. 📜 이용안내/가이드
3. 🚫 사진 신고/관리

## 🎯 미션 유형 및 점수 체계

### 기본 미션
- 장소 방문: 기본 점수 획득

### 사진 기반 미션
- 일반 업로드: 기본 점수
- 미션 사진 업로드: 추가 점수
- 랜덤 미션 사진 따라찍기: 높은 점수
- 포즈/구도 따라하기: AI 유사도 기반 점수

### 미션 선정 보너스
- 주간 베스트 미션 사진 3장 선정
  - 사용자 투표 또는 관리자 선정
  - 추가 점수 제공

## 🚀 향후 확장 계획
- 리더보드(순위표) 도입
- 시즌별 챌린지
- 친구 초대 보상
- 테마별 미션 (봄꽃 명소, 야경 명소 등)

## 🔧 개발 환경 설정

### AWS S3 이미지 업로드 설정
프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```
# AWS S3 설정
VUE_APP_AWS_REGION=ap-northeast-2
VUE_APP_S3_BUCKET_NAME=your-bucket-name
VUE_APP_AWS_ACCESS_KEY=your-access-key
VUE_APP_AWS_SECRET_KEY=your-secret-key
```

각 변수의 의미:
- `VUE_APP_AWS_REGION`: AWS 리전 (기본값: ap-northeast-2)
- `VUE_APP_S3_BUCKET_NAME`: S3 버킷 이름
- `VUE_APP_AWS_ACCESS_KEY`: AWS 액세스 키
- `VUE_APP_AWS_SECRET_KEY`: AWS 시크릿 키

> ⚠️ 보안 주의: `.env.local` 파일은 절대로 Git에 커밋하지 마세요!
