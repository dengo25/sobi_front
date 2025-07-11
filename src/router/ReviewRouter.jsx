import { Suspense } from "react";
import ReviewList from "../pages/review/ReviewList";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { Navigate } from "react-router-dom";
import ReviewDetail from "../pages/review/ReviewDetail";
import ReviewModify from "../pages/review/ReviewModify";
//import ReviewWrite from "../pages/review/ReviewWrite.jsx";

const reviewRouter = () => {
  return {
    path: "review",
    children: [
      {
        path: "list",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ReviewList />
          </Suspense>
        ),
      },
      {
        // path: "write",
        // element: (
        //   <Suspense fallback={<LoadingSpinner />}>
        //     <ReviewWrite />
        //   </Suspense>
        // ),
      },
      {
        path: "detail/:tno",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ReviewDetail />
          </Suspense>
        ),
      },
      {
        path: "modify/:tno",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ReviewModify />
          </Suspense>
        ),
      },
      // {
      //   path: "modify/:tno",//아이디를 tno로 사용한다.
      //   element: <Suspense fallback={<LoadingSpinner />}><ReviewModify/></Suspense>),
      // },
      {
        //아무것도 없는 경로로 들어오면 review의 list로 이동시켜
        path: "",
        element: <Navigate to={"/review/list"}></Navigate>,
      },
    ],
  };
};

export default reviewRouter;
