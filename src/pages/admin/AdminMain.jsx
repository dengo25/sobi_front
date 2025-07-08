import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { Link, useNavigate } from "react-router-dom";
import { getStatus } from "../../service/admin/ApiService";

const AdminMain = () => {
  const navigate = useNavigate();

  const [memberCount, setMemberCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [unresolvedReports, setUnresolvedReports] = useState(0);
  const [blacklist, setBlacklist] = useState([]);
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
        setBlacklist(res.blacklist);
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
  const handleBlockedClick = () => navigate("/admin/blocked/memberId"); // Add appropriate route
  const handleReviewClick = () => navigate("/admin/reviews"); // Add appropriate route
  const handleReportClick = () => navigate("/report");
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
      <div onClick={handleReportClick}>신고하기</div>
      <div className="stats">
        <div className="card" onClick={handleMemberClick}>
          <h3>회원 관리</h3>
          <p>{memberCount.toLocaleString()}</p>
        </div>
        <div className="card" onClick={handleTodayJoinClick}>
          <h3>신고 관리</h3>
          <p>{unresolvedReports.toLocaleString()}</p>
        </div>
        <div className="card" onClick={handleReviewClick}>
          <h3>리뷰 관리</h3>
          <p>{reviewCount.toLocaleString()}</p>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="section">
        <h4>{blockedCount}명의 사용자가 차단되었습니다.</h4>
        <table className="log-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>차단일자</th>
            </tr>
          </thead>
          <tbody>
            {blacklist && blacklist.length > 0 ? (
              blacklist.map((log, index) => (
                <tr key={log.id || index} onClick={handleBlockedClick}>
                  <td>{blacklist.memberId}</td>
                  <td>{new Date(blacklist.updateAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">차단된 사용자가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminMain;
