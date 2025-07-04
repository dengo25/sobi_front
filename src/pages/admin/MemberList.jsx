import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getList } from "../../service/admin/ApiService";
const MemberList = () => {
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getList().then((data) => {
      setMemberList(data);
    });
  }, []);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>아이디</th>
            <th>현재상태</th>
            <th>가입일</th>
            <th>게시글수</th>
            <th>신고이력</th>
          </tr>
        </thead>
        <tbody>
          {memberList.length > 0 ? (
            memberList.map((member) => (
              <tr
                key={member.memberId}
                onClick={() => navigate(`/admin/member/${member.memberId}`)}
              >
                <td>{member.memberName}</td>
                <td>{member.memberId}</td>
                <td>{member.isActive === "Y" ? "활동" : "탈퇴"}</td>
                <td>
                  {new Date(member.memberReg).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>

                <td>{member.memberReviewCount}</td>
                <td>{member.memberReportCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">회원 정보가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
export default MemberList;
