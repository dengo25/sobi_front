import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import { getStatus } from "../../service/admin/ApiService";

const AdminMain = () => {
  const navigate = useNavigate();

  const [memberCount, setMemberCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [unresolvedReports, setUnresolvedReports] = useState(0);
  const [memberLogList, setMemberLogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getStatus();

        setMemberCount(res.totalMemberCount);
        setBlockedCount(res.blockedCount);
        setReviewCount(res.reviewCount);
        setUnresolvedReports(res.unSolvedReportCount);
        setMemberLogList(res.memberLogs);
      } catch (err) {
        console.error("admin main fetch error", err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStatus();
  }, []);

  // Handler functions for card clicks
  const handleMemberClick = () => navigate("/admin/member");
  const handleTodayJoinClick = () => navigate("/admin/today-join"); // Add appropriate route
  const handleBlockedClick = () => navigate("/admin/blocked"); // Add appropriate route
  const handleReviewClick = () => navigate("/admin/reviews"); // Add appropriate route

  if (loading) {
    return (
      <main className="admin">
        <div className="admin-header">
          <h3 className="main-header">메인</h3>
          <AdminSidebar />
        </div>
        <div className="loading">데이터를 불러오는 중...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin">
        <div className="admin-header">
          <h3 className="main-header">메인</h3>
          <AdminSidebar />
        </div>
        <div className="error">{error}</div>
      </main>
    );
  }

  return (
    <main className="admin">
      <div className="admin-header">
        <h3 className="main-header">메인</h3>
        <AdminSidebar />
      </div>

      {/* 요약 통계 */}
      <div className="stats">
        <div className="card" onClick={handleMemberClick}>
          <h3>회원 관리</h3>
          <p>{memberCount.toLocaleString()}</p>
        </div>
        <div className="card" onClick={handleTodayJoinClick}>
          <h3>신고 관리</h3>
          <p>{unresolvedReports.toLocaleString()}</p>
        </div>
        <div className="card" onClick={handleBlockedClick}>
          <h3>블랙리스트</h3>
          <p>{blockedCount.toLocaleString()}</p>
        </div>
        <div className="card" onClick={handleReviewClick}>
          <h3>후기 관리</h3>
          <p>{reviewCount.toLocaleString()}</p>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="section">
        <h4>🕓 최근 활동 로그</h4>
        <table className="log-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>메뉴</th>
              <th>활동</th>
              <th>접근일자</th>
            </tr>
          </thead>
          <tbody>
            {memberLogList && memberLogList.length > 0 ? (
              memberLogList.map((log, index) => (
                <tr key={log.id || index}>
                  <td>{log.memberId}</td>
                  <td>{log.accessedMenu}</td>
                  <td>{log.memberActionType}</td>
                  <td>{new Date(log.memberLogCreated).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">최근 활동 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminMain;
