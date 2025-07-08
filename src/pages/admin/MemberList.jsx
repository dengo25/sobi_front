import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getList } from "../../service/admin/ApiService";
import useCustomMove from "../../hooks/admin/UseCustomMove";

const MemberList = () => {
  const [memberList, setMemberList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { page, size, moveToList } = useCustomMove();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("🔍 요청 파라미터:", { page: page || 1, size: size || 10 });

        const data = await getList({
          page: page || 1, // 현재 페이지가 1이면 그대로 1로 요청
          size: size || 10,
        });

        console.log("🔍 API 응답:", data);

        // API 응답에서 필요한 데이터 추출
        setMemberList(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);

        console.log("🔍 설정된 memberList:", data.content);
        console.log("🔍 memberList 길이:", data.content?.length);
      } catch (error) {
        console.error("❌ 데이터 로딩 실패:", error);
        setMemberList([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size]);

  return (
    <>
      {/* 로딩 표시 */}
      {loading && <div>로딩 중...</div>}

      {/* 총 회원 수 표시 */}
      <div style={{ marginBottom: "10px" }}>총 {totalElements}명의 회원</div>

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
          {(() => {
            console.log("🔍 렌더링 시점 memberList:", memberList);

            if (loading) {
              return (
                <tr>
                  <td colSpan="5">로딩 중...</td>
                </tr>
              );
            }

            if (!Array.isArray(memberList)) {
              return (
                <tr>
                  <td colSpan="5">❌ 데이터 형식 오류 (배열이 아님)</td>
                </tr>
              );
            }

            if (memberList.length === 0) {
              return (
                <tr>
                  <td colSpan="5">📄 회원 정보가 없습니다.</td>
                </tr>
              );
            }

            return memberList.map((member) => (
              <tr
                key={member.memberId}
                onClick={() => navigate(`/admin/member/${member.memberId}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{member.memberName}</td>
                <td>{member.memberId}</td>
                <td>
                  {new Date(member.memberReg).toLocaleDateString("ko-KR")}
                </td>
                <td>{member.memberReviewCount}</td>
                <td>{member.memberReportCount}</td>
              </tr>
            ));
          })()}
        </tbody>
      </table>

      {/* 페이징 */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {totalPages > 0 &&
          [...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => moveToList({ page: idx, size })}
              style={{
                fontWeight: idx === (page || 0) ? "bold" : "normal",
                margin: "0 5px",
                padding: "5px 10px",
              }}
            >
              {idx + 1}
            </button>
          ))}
      </div>

      {/* 페이지 정보 */}
      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        페이지 {(page || 0) + 1} / {totalPages} (총 {totalElements}개 항목)
      </div>
    </>
  );
};

export default MemberList;
