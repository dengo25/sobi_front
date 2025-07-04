import { lazy, Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "../layout/BasicLayout";
import ReviewRouter from "./ReviewRouter";
import AdminRouter from "./AdminRouter.jsx";
import NoticeRouter from "./NoticeRouter.jsx";
import FaqRouter from "./FaqRouter.jsx";
import MypageRouter from "./MypageRouter.jsx";
import LoginRouter from "./LoginRouter.jsx";
import JoinRouter from "./JoinRouter.jsx";

const Loading = () => LoadingSpinner();

const Main = lazy(() => import("../pages/MainPage"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: BasicLayout, //컴포넌트는 레이아웃을 의미한다. 대문자로 시작하는 건 아직은 표준으로 통합이 되지 않았다.
    children: [
      //하위 경로가 Children이다.
      {//경로가 로딩하는 동안 Loading페이지를 보여줄거야. Suspense의미
        index: true, element: (<Suspense fallback={<LoadingSpinner />}><Main /></Suspense>),
      },
      ReviewRouter(), //    ReviewRouter(),  //구조 분리로 ReviewRouter.jsx를 갖고옴
      AdminRouter(),
      NoticeRouter(),
      FaqRouter(),
      MypageRouter(),
      LoginRouter(),
      JoinRouter(),

    ],
  },
]);

export default router;
