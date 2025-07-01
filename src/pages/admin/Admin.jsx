import { useState, useEffect } from "react";
import axios from "axios";
import { authHeader } from "../../utils/auth";

const Admin = () => {
  const [memberCount, setMemberCount] = useState(0);
  const [todayJoinCount, setTodayJoinCount] = useState(0);
  const [blackListCount, setBlackListCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [unresolvedReports, setUnresolvedReports] = useState(0);
  const [memberLogList, setMemberLogList] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    axios
      .get("http://localhost:8080/api/admin/member/count", {
        headers: {
          ...authHeader(),
        },
      })
      .then((res) => {
        setMemberCount(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error("에러 발생:", err); // 여기서 403 오류 확인 가능
      });
  }, []);

  return (
    <main className="admin">
      <div className="admin-header">
        <h3 className="main-header">메인</h3>
        {/* 사이드바 컴포넌트로 따로 분리 가능 */}
        {/* <AdminSidebar /> */}
      </div>

      {/* 요약 통계 */}
      <div className="stats">
        <div className="card" onClick={() => (window.location.href = "")}>
          <h3>전체 회원 수</h3>
          <p>{memberCount}</p>
        </div>
        <div className="card" onClick={() => (window.location.href = "")}>
          <h3>오늘 가입자</h3>
          {/* <p>{todayJoinCount}</p> */}
        </div>
        <div className="card" onClick={() => (window.location.href = "")}>
          <h3>블랙리스트</h3>
          {/* <p>{blackListCount}</p> */}
        </div>
        <div className="card" onClick={() => (window.location.href = "")}>
          <h3>총 후기 수</h3>
          {/* <p>{reviewCount}</p> */}
        </div>
      </div>

      {/* 미처리 신고 */}
      <div className="alert-box">
        {/* 🚨 미처리 신고가 <strong>{unresolvedReports}</strong>건 있습니다. 빠르게 */}
        확인해주세요!
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
            {/* {memberLogList && memberLogList.length > 0 ? (
              memberLogList.map((log, index) => (
                <tr key={index}>
                  <td>{log.memberId}</td>
                  <td>{log.accessedMenu}</td>
                  <td>{log.memberActionType}</td>
                  <td>{log.memberLogCreated}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">최근 활동 내역이 없습니다.</td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Admin;
