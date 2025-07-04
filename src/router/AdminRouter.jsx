import { Suspense } from "react";
import ReviewList from "../pages/review/ReviewList";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { Navigate } from "react-router-dom";
import AdminMain from "../pages/admin/AdminMain.jsx";
import UnSolvedReport from "../pages/admin/UnSolvedReport.jsx";
import AdminMemberRouter from "./AdminMemberRouter.jsx";
const AdminRouter = () => {
  return {
    path: "admin",
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminMain />
          </Suspense>
        ),
      },
      {
        path: "report",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UnSolvedReport />
          </Suspense>
        ),
      },
      AdminMemberRouter,
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

export default AdminRouter;
