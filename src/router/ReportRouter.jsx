import { Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ReportForm from "../pages/admin/ReportForm";
import ReportList from "../pages/admin/ReportList";

const ReportRouter = () => {
  return {
    path: "report",
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ReportForm />
          </Suspense>
        ),
      },
      {
        path: "list",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ReportList />
          </Suspense>
        ),
      },
    ],
  };
};
export default ReportRouter;
