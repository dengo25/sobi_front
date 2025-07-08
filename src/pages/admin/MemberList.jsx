import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getList } from "../../service/admin/ApiService";
import useCustomMove from "../../hooks/review/UseCustomMove";

const MemberList = () => {
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();
  const { page, size, moveToList } = useCustomMove();
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    getList({ page, size }).then((data) => {
      setMemberList(data);
    });
  }, [page, size]);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>아이디</th>
            <th>가입일</th>
            <th>게시글수</th>
            <th>신고이력</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(memberList) && memberList.length > 0 ? (
            memberList.map((member) => (
              <tr
                key={member.memberId}
                onClick={() => navigate(`/admin/member/${member.memberId}`)}
              >
                <td>{member.memberName}</td>
                <td>{member.memberId}</td>
                <td>
                  {new Date(member.memberReg).toLocaleDateString("ko-KR")}
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
      <div>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => moveToList({ page: idx, size })}
            style={{ fontWeight: idx === page ? "bold" : "normal" }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default MemberList;
