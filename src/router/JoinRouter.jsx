import { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Navigate } from "react-router-dom";

import MyPageTest from "../pages/mypage/MyPageTest.jsx";
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
