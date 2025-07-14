import { Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import AdminMain from "../pages/admin/AdminMain.jsx";
import ReportList from "../pages/admin/ReportList.jsx";
import AdminMemberRouter from "./AdminMemberRouter.jsx";
import AdminRoute from "../components/common/AdminRoute.jsx";
import ReportDetail from "../pages/admin/ReportDetail.jsx";
import AdminReviewDetail from "../pages/admin/AdminReviewDetail.jsx";
import AdminReviewList from "../pages/admin/AdminReviewList.jsx";
const AdminRouter = () => {
  return {
    path: "admin",
    children: [
      {
        path: "",
        element: (
          <AdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminMain />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: "report",
        element: (
          <AdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <ReportList />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: "report/:reportId",
        element: (
          <AdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <ReportDetail />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: "review/:tno",
        element: (
          <AdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminReviewDetail />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: "review/list",
        element: (
          <AdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminReviewList />
            </Suspense>
          </AdminRoute>
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
