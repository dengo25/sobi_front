import React, { useState, useEffect } from "react";
import { call, updateMemberInfo } from "../../service/member/ApiService";
import "../../assets/styles/style.css";
import "../../index.css";

const Mypage = () => {
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchMemberInfo();
  }, []);

  const fetchMemberInfo = async () => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const memberId = "testuser"; // 실제 구현시 JWT에서 추출

      const response = await call(`/api/mypage/${memberId}`, "GET");
      setMemberInfo(response);
      setEditForm(response); // 수정 폼 초기값 설정
      setLoading(false);
    } catch (err) {
      setError("회원 정보를 불러오는데 실패했습니다.");
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(memberInfo); // 원래 값으로 되돌리기
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const memberId = "testuser"; // 실제 구현시 JWT에서 추출

      const response = await updateMemberInfo(memberId, editForm);
      setMemberInfo(response);
      setIsEditing(false);
      alert("회원 정보가 성공적으로 수정되었습니다.");
    } catch (err) {
      alert("회원 정보 수정에 실패했습니다.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  const formatGender = (gender) => {
    if (gender === "M") return "남성";
    if (gender === "F") return "여성";
    return "-";
  };

  const formatBirth = (birth) => {
    if (!birth || birth.length !== 6) return "-";
    return `${birth.substring(0, 2)}년 ${birth.substring(
      2,
      4
    )}월 ${birth.substring(4, 6)}일`;
  };

  if (loading) {
    return (
      <div>
        <div>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          {/* 헤더 */}
          <div>
            <h1>마이페이지</h1>
            <p>회원 정보를 확인하고 관리하세요</p>
          </div>

          {/* 회원 정보 */}
          <div>
            <div>
              {/* 기본 정보 */}
              <div>
                <h2>기본 정보</h2>

                <div>
                  <div>
                    <label>아이디:</label>
                    <span>{memberInfo?.memberId || "-"}</span>
                  </div>

                  <div>
                    <label>이름:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="memberName"
                        value={editForm.memberName || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span>{memberInfo?.memberName || "-"}</span>
                    )}
                  </div>

                  <div>
                    <label>성별:</label>
                    {isEditing ? (
                      <select
                        name="memberGender"
                        value={editForm.memberGender || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">선택</option>
                        <option value="M">남성</option>
                        <option value="F">여성</option>
                      </select>
                    ) : (
                      <span>{formatGender(memberInfo?.memberGender)}</span>
                    )}
                  </div>

                  <div>
                    <label>생년월일:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="memberBirth"
                        value={editForm.memberBirth || ""}
                        onChange={handleInputChange}
                        placeholder="YYMMDD"
                        maxLength="6"
                      />
                    ) : (
                      <span>{formatBirth(memberInfo?.memberBirth)}</span>
                    )}
                  </div>

                  <div>
                    <label>가입일:</label>
                    <span>{formatDate(memberInfo?.memberReg)}</span>
                  </div>
                </div>
              </div>

              {/* 연락처 정보 */}
              <div>
                <h2>연락처 정보</h2>

                <div>
                  <div>
                    <label>이메일:</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="memberEmail"
                        value={editForm.memberEmail || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span>{memberInfo?.memberEmail || "-"}</span>
                    )}
                  </div>

                  <div>
                    <label>우편번호:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="memberZip"
                        value={editForm.memberZip || ""}
                        onChange={handleInputChange}
                        maxLength="5"
                      />
                    ) : (
                      <span>{memberInfo?.memberZip || "-"}</span>
                    )}
                  </div>

                  <div>
                    <label>주소:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="memberAddr"
                        value={editForm.memberAddr || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span>{memberInfo?.memberAddr || "-"}</span>
                    )}
                  </div>

                  <div>
                    <label>계정상태:</label>
                    <span>
                      {memberInfo?.isActive === "Y" ? "활성" : "비활성"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div>
              <div>
                {isEditing ? (
                  <>
                    <button onClick={handleSaveEdit}>저장</button>
                    <button onClick={handleCancelEdit}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={handleEditClick}>정보 수정</button>
                    <button>비밀번호 변경</button>
                    <button>회원 탈퇴</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
