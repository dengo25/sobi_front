import { Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { Navigate } from "react-router-dom";
import CommonPage from "../pages/common/Common.jsx";

const CommonRouter = () => {
  return {
    path: "common",
    children: [
      {
        path: "",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
              <CommonPage />
            </Suspense>
        ),
      },
    ],
  };
};

export default CommonRouter;
