import { useState, useEffect } from "react";
import jwtAxios from "../../service/util/JwtUtil";
const UnSolvedReport = () => {
  const [reportList, setReportList] = useState({});

  useEffect(() => {
    jwtAxios.get("http://localhost:8080/api/admin/report").then((res) => {
      setReportList(res.data);
    });
  }, []);
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>신고일자</th>
          <th>신고 유형</th>
          <th>카테고리</th>
          <th>타겟 번호</th>
        </tr>
      </thead>
      <tbody>
        {reportList.length > 0 ? (
          reportList.map((report, index) => (
            <tr key={index}>
              <td>{report.reportedId}</td>
              <td>{report.createdAt}</td>
              <td>{report.reportCategory}</td>
              <td>{report.detail}</td>
              <td>{report.targetId}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">신고 내역이 없습니다.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
export default UnSolvedReport;
