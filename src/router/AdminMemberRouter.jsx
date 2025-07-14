import { Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MemberList from "../pages/admin/MemberList";
import MemberDetail from "../pages/admin/MemberDetail";

const AdminMemberRouter = {
  path: "member",
  children: [
    {
      path: "",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <MemberList />
        </Suspense>
      ),
    },
    {
      path: ":memberId", // ✅ 절대경로 아님 주의!
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <MemberDetail />
        </Suspense>
      ),
    },
  ],
};

export default AdminMemberRouter;
