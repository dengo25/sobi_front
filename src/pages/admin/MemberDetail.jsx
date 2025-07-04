import { useState, useEffect } from "react";
import { getMember } from "../../service/admin/ApiService";
import { useParams } from "react-router-dom";
const MemberDetail = () => {
  const [member, setMember] = useState({});
  const [report, getReport] = useState({});
  const { memberId } = useParams();
  useEffect(() => {
    getMember(memberId).then((data) => {
      setMember(data);
    });
  }, [memberId]);
  return (
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
        <td>{member.memberReg}</td>
      </tr>
      <tr>
        <th>현재상태</th>
        {member.isActive} ==='Y' ? (<td></td>)
      </tr>
      <tr>
        <th>게시글수</th>
        <td>{member.memberReviewCount}</td>
      </tr>
    </table>
  );
};

export default MemberDetail;
