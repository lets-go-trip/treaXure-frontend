# treaXure

![treaXure 배너](https://github.com/user-attachments/assets/a4d0a9f0-1495-4ab4-8bd1-0676621e7298)


서울 배경의 **탐방 소셜 플랫폼**

재미있는 경험을 추구하는 젊은 세대를 위해, 서울을 무대로 탐험하고 즐기며 경험할 수 있는 **참여형 여행 게임 플랫폼**

## 목표

> "호랑이는 죽어서 가죽을 남기고 **서울은 탐험하며 사진을 남긴다**"

서울 명소에 기반한 탐험 미션과 보상을 통해 이용자에게 **재미 + 여행 정보 + 성취감 + 인스타 감성 사진**을 동시에 제공하는 게임형 관광 플랫폼 구현

## 기획 배경

- K-관광의 성장

  - 2024년 서울 방문 외국인 관광객은 1,314만 명
  - 코로나19 이전보다 폭발적으로 성장

- 여행 트렌드의 변화

  - 기존의 단순 관광에서 벗어나 체험형 컨텐츠를 원하는 수요 증가

- Alpha세대·MZ세대
  - 스토리텔링 기반의 콘텐츠, SNS 인증 요소, 게임 점수 같은 흥미 요소 선호

## 컨셉

1. 탐험(Exploration)

   - 단순한 방문이 아닌, 지도를 따라 장소를 탐색하며 미션을 수행

2. 게임화(Gamification)

   - 미션 완료, AI 유사도 평가, 랭킹, 보상 등 게임 요소 접목

3. 참여(Participation)

   - 사진 인증, SNS 스타일 게시판, 좋아요 등 사용자 주도형 콘텐츠 생성

4. AI 기술 활용

   - 인증 사진과 미션 원본의 이미지 유사도 분석을 통한 정밀 평가

5. 위치 기반(Location-based)

   - KakaoMap을 활용한 지도 중심 UI, 현 위치 기반 미션 추천

6. 서울 기반 콘텐츠

   - 경복궁, 남산타워, 이화마을 등 서울의 랜드마크를 주 무대로 구성

## 기술 스택

- **UI/UX**: Figma
- **Frontend**: Vue.js
- **Backend**: Spring Boot
- **Database**: MySQL
- **Infra/Deployment**: AWS EC2/RDS/S3/CloudFront/Lambda/SQS
- **AI**: OpenAI API

## 개발 일정

```mermaid
gantt
    title 내 프로젝트 개발 일정
    dateFormat  YYYY-MM-DD
    axisFormat %m-%d

    section 기획
    개발 환경 설정        :done, des1, 2025-05-05, 2d
    업무 분담             :done, des2, after des1, 1d
    REST API 명세서 작성  :done, des3, after des2, 4d
    UX 조사 및 UI 제작    :done, des4, 2025-05-05, 7d

    section 백엔드
    DB 스키마 및 더미 데이터 생성 :done, b1, 2025-05-12, 3d
    사용자 인증 구현              :active, b2, after b1, 4d
    이미지 업로드 구현            :active, b3, after b1, 4d
    백엔드 API 구현               :active, b4, 2025-05-12, 5d
    Swagger 테스트              :active, b5, after b4, 2d

    section 프론트엔드
    프론트엔드 API 연결          : f1, 2025-05-19, 5d
    UI/UX 피드백 및 리팩토링    : f2, after f1, 2d
    인프라 구축 및 Vue와 연결    : f3, 2025-05-19, 4d
    프론트 배포 준비             : f4, after f3, 3d

    section 배포
    백엔드 리팩토링           : c1, 2025-05-26, 2d
    프론트엔드 리팩토링         : c2, 2025-05-26, 2d
    최종 배포                 : c3, after c1, 1d
    발표 준비                 : c4, 2025-05-26, 3d
```

## 배포

- **EC2**: Spring Boot 기반 백엔드 서버 운영
- **S3**: 미션/게시물/사용자 프로필 이미지 저장소
- **RDS**: MySQL 기반 관계형 데이터베이스
- **도메인 연결**: `treaxure.netlify.app` (프론트) + EC2 (백엔드) 연동
- **HTTPS 적용**: 보안 인증서 발급 및 혼합 콘텐츠 방지 처리 완료

## 페이지별 기능

### [로그인/회원가입]

| 온보딩 | 로그인 | 회원가입 |
| -------- | -------- | -------- |
| <img src="https://github.com/user-attachments/assets/c1d8c1b3-9284-4a49-ab76-0d633ec29696" width="400px" /> | <img src="https://github.com/user-attachments/assets/77013281-c13a-45e4-9a2d-e551b0d78fec" width="400px" /> | <img src="https://github.com/user-attachments/assets/ae7c4fe1-6a52-48b6-ac70-93dc3890a710" width="400px" /> | 

### [소셜 로그인]

| 카카오 로그인 | 네이버 로그인 |
| -------- | -------- |
| <img src="https://github.com/user-attachments/assets/7e4061e2-a829-46c7-8154-a3267b45128a" width="400px" /> | <img src="https://github.com/user-attachments/assets/81b7249c-1d09-4781-a7e8-9e5835294925" width="400px" /> |

### [탐험]

| 탐험 (1) | 탐험 (2) | 탐험 (3) |
| -------- | -------- | -------- |
| <img src="https://github.com/user-attachments/assets/3398451c-f38b-498c-80b1-cab07a0a4561" width="400px" /> | <img src="https://github.com/user-attachments/assets/b8336a3a-b48a-4b14-8a11-da92a9e822d2" width="400px" /> | <img src="https://github.com/user-attachments/assets/70a87959-0341-4e47-a34a-8763da62c2b0" width="400px" /> |

### [미션 확인]

| 장소 클릭 | 장소 미션 확인 |
| -------- | -------- |
| <img src="https://github.com/user-attachments/assets/65a03981-05ae-44c5-bae9-08fc1258b15a" width="400px" /> | <img src="https://github.com/user-attachments/assets/0a99e487-2684-4758-bd6f-33fa571b697c" width="400px" /> |

### [미션 수행]

| 미션 수행 전 | 미션 이미지 업로드 |
| -------- | -------- |
| <img src="https://github.com/user-attachments/assets/d89c6d84-aa62-495e-b308-ccc6a4a1307c" width="400px" /> | <img src="https://github.com/user-attachments/assets/867618bc-780c-4670-abf1-fcff246247d0" width="400px" /> |

### [미션 결과]

| 미션 이미지 유사도 측정 | 유사도 측정 결과 |
| -------- | -------- |
| <img src="https://github.com/user-attachments/assets/d359d59d-b4d9-40ee-9d8e-6fe9efa8d608" width="400px" /> | <img src="https://github.com/user-attachments/assets/744b2c3a-8732-47df-84d6-203b8d864b8a" width="400px" /> |

### [기록]

| 탐험 기록 전 | 탐험 기록 후 | 상세보기(완료 미션) | 상세보기(미완료 미션) |
| -------- | -------- | -------- | -------- |
| <img src="https://github.com/user-attachments/assets/76cd8bd1-07fa-4c00-9b0c-610ed6b10318" width="400px" /> | <img src="https://github.com/user-attachments/assets/b588737c-5bb0-4610-9479-2a2586b9f8d7" width="400px" /> | <img src="https://github.com/user-attachments/assets/858a1ae9-1392-4191-93e1-688f7ea9aa07" width="400px" /> | <img src="https://github.com/user-attachments/assets/bbcf03a9-fbd5-4f40-941b-77dcf6715759" width="400px" /> |  

### [탐색]

| 탐색 | 검색 |
| -------- | -------- |
| <img src="https://github.com/user-attachments/assets/e4dc2db5-0d83-4993-8760-bc91948a1fb8" width="400px" /> | <img src="https://github.com/user-attachments/assets/f3e2b0e4-d812-4ee5-bb6a-3277d4a257ca" width="400px" /> |

### [랭킹]

| 랭킹 | 랭킹 좋아요 |
| -------- | -------- |
| <img src="https://github.com/user-attachments/assets/d11880db-2ab6-461c-be3a-7faac63dc289" width="400px" /> | <img src="https://github.com/user-attachments/assets/c9879bc9-a06f-4418-a8d9-9120410a95c2" width="400px" /> |

### [마이]

| 내 정보 | 정보 수정 전 | 정보 수정 | 좋아요한 사진 |
| -------- | -------- | -------- | -------- |
| <img src="https://github.com/user-attachments/assets/a075ecab-2297-4f4d-9fab-146bcf319a39" width="400px" /> | <img src="https://github.com/user-attachments/assets/0fdebb9e-8472-4acd-b058-6a6447d6b9db" width="400px" /> | <img src="https://github.com/user-attachments/assets/2fa04268-a8ee-4861-aa76-af83d3ba5424" width="400px" /> | <img src="https://github.com/user-attachments/assets/e59d0bd4-7d8a-4f8c-8e28-a730233fea49" width="400px" /> |

## 개발자

<div align="center">

|                                                          **노다빈**                                                          |                                                           **유소은**                                                            |
| :--------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
| [<img src="https://avatars.githubusercontent.com/u/71473708?v=4" height=150 width=150> <br/> @nodb](https://github.com/nodb) | [<img src="https://avatars.githubusercontent.com/u/68419318?v=4" height=150 width=150> <br/> @YuSoeun](https://github.com/YuSoeun) |
|                                                       FE │ BE │ UI/UX                                                        |                                                         FE │ BE │ INFRA                                                         |
</div>

## 라이선스

이 프로젝트는 MIT 라이선스로 배포됩니다.
상세한 라이선스 정보는 LICENSE 파일에서 확인할 수 있습니다.
