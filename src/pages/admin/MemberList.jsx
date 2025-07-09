import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getList } from "../../service/admin/ApiService";
import useCustomMove from "../../hooks/admin/UseCustomMove";

const MemberList = () => {
  const [memberList, setMemberList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("memberReg");
  const [sortDir, setSortDir] = useState("desc");

  const navigate = useNavigate();
  const { page, size, moveToList } = useCustomMove();

  // 정렬 옵션 설정
  const sortOptions = [
    { value: "memberReg", label: "가입일" },
    { value: "memberName", label: "이름" },
    { value: "memberId", label: "아이디" },
    { value: "memberReviewCount", label: "게시글수" },
    { value: "memberReportCount", label: "신고이력" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("🔍 요청 파라미터:", {
          page: page ?? 0,
          size: size ?? 10,
          sortBy,
          sortDir,
        });

        const data = await getList({
          page: page ?? 0, // 현재 페이지가 1이면 그대로 1로 요청
          size: size ?? 10,
          sortBy,
          sortDir,
        });

        // API 응답에서 필요한 데이터 추출
        setMemberList(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
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
  }, [page, size, sortBy, sortDir]);

  const handleHeaderClick = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
    moveToList({ page: 0, size });
  };

  const handleSoryByChange = (newSortBy) => {
    setSortBy(newSortBy);
    moveToList({ page: 0, size });
  };

  const handleSoryDirChange = (newSortDir) => {
    setSortDir(newSortDir);
    moveToList({ page: 0, size }); //정렬 후 첫 페이지로 이동
  };
  return (
    <>
      {/* 로딩 표시 */}
      {loading && <div>로딩 중...</div>}

      {/* 총 회원 수 표시 */}
      <div style={{ marginBottom: "10px" }}>총 {totalElements}명의 회원</div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleHeaderClick("memberName")}>이름</th>
            <th onClick={() => handleHeaderClick("memberId")}>아이디</th>
            <th onClick={() => handleHeaderClick("memberReg")}>가입일</th>
            <th onClick={() => handleHeaderClick("memberReviewCount")}>
              게시글수
            </th>
            <th onClick={() => handleHeaderClick("memberReportCount")}>
              신고이력
            </th>
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
