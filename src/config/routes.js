import { lazy } from "react"

// 페이지 컴포넌트들을 lazy로 불러오기
const Home = lazy(() => import("../pages/main/Main"))
const Faq = lazy(() => import("../pages/community/Faq"))
const Notice = lazy(() => import("../pages/community/Notice"))
const Review = lazy(() => import("../pages/review/Review"))
const Admin = lazy(() => import("../pages/admin/Admin"))
const Login = lazy(() => import("../pages/member/Login"))
const Join = lazy(() => import("../pages/member/Join"))
const Mypage = lazy(() => import("../pages/mypage/Mypage"))

// 라우팅 설정을 배열로 관리
export const routes = [
  {
    path: "/",
    element: Home,
    title: "홈",
  },
  {
    path: "/faq",
    element: Faq,
    title: "FAQ",
  },
    {
    path: "/notice",
    element: Notice,
    title: "공지사항",
  },
  {
    path: "/review",
    element: Review,
    title: "후기",
  },
  {
    path: "/admin",
    element: Admin,
    title: "관리자",
  },
  {
    path: "/login",
    element: Login,
    title: "로그인",
  },
  {
    path: "/join",
    element: Join,
    title: "회원가입",
  },
  {
    path: "/mypage",
    element: Mypage,
    title: "마이페이지",
  },
  

  
  // 동적 라우팅
//   {
//     path: "/blog/:postId",
//     element: BlogPost,
//     title: "블로그 포스트",
//   },
//   {
//     path: "/user/:userId",
//     element: UserProfile,
//     title: "사용자 프로필",
//   },
 ]
