import { Suspense } from "react";
import ReviewList from "../pages/review/ReviewList";
import LoadingSpinner from "../components/LoadingSpinner";
import { Navigate } from "react-router-dom";
import AdminTest from "../pages/admin/AdminTest.jsx";

const AdminRouter = () => {
  return {
    path: "admin",
    children: [
      {
        path: "",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
              <AdminTest />
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

export default AdminRouter;
