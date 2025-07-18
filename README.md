# 📝 SOBI - 내돈내산 리뷰 플랫폼

> **신뢰 기반 후기 문화 형성**을 위한 리뷰 중심 블로그 플랫폼  
> React 기반의 프론트엔드와 Spring Boot 백엔드로 구성된 팀 프로젝트입니다.

---

## 👥 팀원 소개 - 4℃

| 이름   | 역할             | GitHub ID                                  |
|--------|------------------|---------------------------------------------|
| 오창진 | 로그인 및 회원가   | [dengo25](https://github.com/dengo25)       |
| 최완빈 | 관리자 기능 구현 | [wanbinchoi](https://github.com/wanbinchoi) |
| 엄지원 | 마이페이지       | [umg1](https://github.com/umg1)             |
| 왕시은 | 커뮤니티 구현    | [alo-wang](https://github.com/alo-wang)     |

---

# 🛍️ Sobi Front - 프론트엔드

> **React + Vite + TailwindCSS + MUI 기반의 프론트엔드 저장소**  
> 빠르고 반응형이며 확장 가능한 소비자 후기 중심 UI를 제공합니다.

---

## 📌 프로젝트 개요
- 배경 소비자는 더 나은 결정을 통해 후회 없는 소비를 위해 요즘 제품을 직접 비교&분석 하고 검정하는 "체크슈머(Check-sumer)"가 늘고 있다. 이러한 소비자의 행동을 반영해, '실사용 후기 기반
  중심의 큐레이션 플랫폼' 이라는 주제 선정
- 목적: 광고나 협찬 후기처럼 조작된 정보가 넘치는 시장에서, 구매자가 실사용자의 진솔한 후기를 통해 현명한 소비를 할 수 있도록 돕는 큐레이션 기반 플랫폼 구축.
- 후기 기반 신뢰성 있는 소비자 추천 문화 조성을 목표
- 커뮤니티형 소비 경험 제공
  
## 화면 기능
- 로그인/회원가입
- 후기 등록, 신고 기능
- 사용자간 쪽지 기능
- 커뮤니티(공지사항&FAQ)
- 회원/리뷰 관리 및 차단 기능 
---

## 🚀 기술 스택

| 영역       | 기술 |
|------------|------|
| 언어       | JavaScript (ES6+), JSX |
| 프레임워크 | React 19.1.0 |
| 빌드 도구  | Vite 6.3.5 |
| UI 라이브러리 | Material-UI (MUI), Emotion |
| 스타일링   | Tailwind CSS 4.1.11 |
| 라우팅     | React Router DOM 7.6.2 |
| 개발 도구  | ESLint, Prettier |

---

## 📁 폴더 구조

```bash
sobi_front/
├── public/                     # 정적 파일 (favicon 등)
├── src/
│   ├── assets/                 # 이미지 및 정적 리소스
│   ├── components/            # 재사용 가능한 공통 컴포넌트
│   ├── hooks/                 # 사용자 정의 Hook
│   ├── layout/                # 공통 레이아웃 (Header/Footer 등)
│   ├── pages/                 # 라우팅 되는 주요 화면들
│   ├── router/                # React Router 설정
│   ├── service/               # API 호출 모듈
│   ├── slice/                 # 상태 관리 (Redux 또는 Context 등)
│   ├── utils/                 # 공통 유틸리티 함수
│   ├── App.jsx                # 메인 앱 컴포넌트
│   ├── main.jsx               # React 진입점
│   ├── App.css / index.css   # 전역 스타일 파일
├── package.json               # 프로젝트 메타 정보 및 의존성
├── vite.config.js             # Vite 설정
└── README.md                  # 프로젝트 소개 문서
```
---

## 주요 화면

### 로그인
<img width="800" height="600" alt="image" src="https://github.com/user-attachments/assets/f89d74b3-ab04-4f06-b8b1-a27d6fca5d4f" />

- 일반 사용자 로그인
- 구글 및 Github 소셜 로그인

### 메인 화면
<img width="1000" height="800" alt="image" src="https://github.com/user-attachments/assets/fc2dfd6f-9fa3-4bce-8726-e6628e876b1b" />

- 사용자 맞춤 인사 메시지 제공
- 최근 작성된 리뷰 강조

### 리뷰 상세
<img width="300" height="500" alt="image" src="https://github.com/user-attachments/assets/b8e48512-3363-46eb-a671-e58f73a37649" />
<img width="300" height="500" alt="image" src="https://github.com/user-attachments/assets/8b031126-7b7f-4830-8632-16685f0eaa15" />
<img width="300" height="500" alt="image" src="https://github.com/user-attachments/assets/d04c1bed-e904-414f-82bb-60ad723c7ece" />

- 작성자 정보/ 작성일/ 카테고리 등 카드형으로 표시
- 시각적 강조 처리
- 신고 및 공유 기능
- '목록으로' 버튼 클릭 시 목록으로 이동
    
### FAQ
<img width="1235" height="867" alt="image" src="https://github.com/user-attachments/assets/b31e5ccd-8c1e-4ca7-abf1-19b2ca101e23" />

- 아코디언 방식 UI 구성
- 페이징 처리
- 자주 묻는 기능 항목 정리

### 마이페이지
<img width="1292" height="756" alt="image" src="https://github.com/user-attachments/assets/a4c46008-2093-4544-b84c-026f0400ed7e" />

- 사용자 본인 정보 확인
- 사용자가 작성한 후기 확인
- 쪽지 기능으로 다른 사용자와 커뮤니케이션
- 회원 탈퇴

### 관리자 페이지
<img width="1320" height="732" alt="image" src="https://github.com/user-attachments/assets/a2d1b111-0889-44e3-99da-802eee288422" />

- 간략화된 정보 확인
- 차단된 사용자 목록
- 회원/리뷰/신고 관리  
---

