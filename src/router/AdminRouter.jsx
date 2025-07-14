import { Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import AdminMain from "../pages/admin/AdminMain.jsx";
import ReportList from "../pages/admin/ReportList.jsx";
import AdminMemberRouter from "./AdminMemberRouter.jsx";
import AdminRoute from "../components/common/AdminRoute.jsx";
import ReportDetail from "../pages/admin/ReportDetail.jsx";
import AdminReviewDetail from "../pages/admin/AdminReviewDetail.jsx";
import AdminReviewList from "../pages/admin/AdminReviewList.jsx";
import ReportReviewDetail from "../pages/admin/ReportReviewDetail.jsx";
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
        path: "report/review/:tno/:reportId",
        element: (
          <AdminRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <ReportReviewDetail />
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
    ],
  };
};

export default AdminRouter;
