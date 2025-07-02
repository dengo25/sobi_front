import { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Navigate } from "react-router-dom";
import NoticeTest from "../pages/notice/NoticeTest.jsx";


const NoticeRouter = () => {
    return {
        path: "notice",
        children: [
            {
                path: "",
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <NoticeTest />
                    </Suspense>
                ),
            },
            // {
            //   path: "read/:tno",//아이디를 tno로 사용한다.
            //   element: <Suspense fallback={<LoadingSpinner/>}><ReviewRead/></Suspense>
            // },
            // {
            //   path: "modify/:rno",//아이디를 rno로 사용한다.
            //   element: <Suspense fallback={<LoadingSpinner/>}><ReviewModify/></Suspense>
            // },
            // {
            //   path: "add",//아이디를 tno로 사용한다.
            //   element: <Suspense fallback={<LoadingSpinner/>}><ReviewAdd/></Suspense>
            // },
            // {
            //   //아무것도 없는 경로로 들어오면 review의 list로 이동시켜
            //   path: "",
            //   element: <Navigate to={'/review/list'}></Navigate>
            // },
        ],
    };
};

export default NoticeRouter;
