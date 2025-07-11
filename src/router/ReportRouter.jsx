import { Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ReportForm from "../pages/admin/ReportForm";
import ReportList from "../pages/admin/ReportList";
import ReportDetail from "../pages/admin/ReportDetail";

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
    ],
  };
};
export default ReportRouter;
