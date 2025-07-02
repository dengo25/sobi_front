import { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Navigate } from "react-router-dom";

import MyPageTest from "../pages/mypage/MyPageTest.jsx";


const MypageRouter = () => {
    return {
        path: "mypage",
        children: [
            {
                path: "",
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <MyPageTest />
                    </Suspense>
                ),
            },
            // {
            //   //아무것도 없는 경로로 들어오면 review의 list로 이동시켜
            //   path: "",
            //   element: <Navigate to={"/review/list"}></Navigate>,
            // },
            //   {
            //     path: "list",
            //     element: (
            //       <Suspense fallback={<LoadingSpinner />}>
            //         <ReviewList />
            //       </Suspense>
            //     ),
            //   },
        ],
    };
};

export default MypageRouter;
