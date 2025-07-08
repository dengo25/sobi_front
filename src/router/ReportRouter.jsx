import { Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ReportForm from "../pages/admin/ReportForm";

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
