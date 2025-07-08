import { useState, useEffect } from "react";
import { getMember } from "../../service/admin/ApiService";
import { useParams } from "react-router-dom";
const MemberDetail = () => {
  const [member, setMember] = useState({});
  const [recentReviews, setRecentReviews] = useState([]);
  const { memberId } = useParams();
  useEffect(() => {
    getMember(memberId).then((data) => {
      setMember(data);
      setRecentReviews(data.recentReviews || []);
    });
  }, [memberId]);
  return (
    <>
      <table key={member.memberId}>
        <tr>
          <th>이름</th>
          <td>{member.memberName}</td>
        </tr>
        <tr>
          <th>아이디</th>
          <td>{member.memberId}</td>
        </tr>
        <tr>
          <th>성별</th>
          <td>{member.memberGender}</td>
        </tr>
        <tr>
          <th>주소</th>
          <td>{member.memberAddr}</td>
        </tr>
        <tr>
          <th>이메일</th>
          <td>{member.memberEmail}</td>
        </tr>
        <tr>
          <th>가입일</th>
          <td>{new Date(member.memberReg).toLocaleDateString("ko-KR")}</td>
        </tr>
        <tr>
          <th>게시글수</th>
          <td>{member.memberReviewCount}</td>
        </tr>
      </table>

      {recentReviews.length >= 0 && (
        <>
          <h3>📝 최근 작성한 게시물</h3>
          <table>
            <thead>
              <tr>
                <th>제목</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {recentReviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.title}</td>
                  <td>
                    {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default MemberDetail;
