import { Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { Navigate } from "react-router-dom";

import MyPage from "../pages/mypage/MyPage.jsx";
import SignUpPage from "../pages/login/SignUpPage.jsx";

const JoinRouter = () => {
  return {
    path: "join",
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SignUpPage />
          </Suspense>
        ),
      },
    ],
  };
};

export default JoinRouter;
