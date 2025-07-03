import React, { useState, useEffect } from "react";
import { updateMypage } from "../../service/member/ApiService";

const EditProfile = ({ open, onClose, userInfo, onUpdate }) => {
  const [formData, setFormData] = useState({
    memberName: "",
    memberEmail: "",
    memberGender: "",
    memberBirth: "",
    memberAddr: "",
    memberZip: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // userInfo가 변경될 때마다 폼 데이터 초기화
  useEffect(() => {
    if (userInfo) {
      setFormData({
        memberName: userInfo.memberName || "",
        memberEmail: userInfo.memberEmail || "",
        memberGender: userInfo.memberGender || "",
        memberBirth: userInfo.memberBirth || "",
        memberAddr: userInfo.memberAddr || "",
        memberZip: userInfo.memberZip || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [userInfo]);

  // 다이얼로그가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setError("");
      if (userInfo) {
        setFormData({
          memberName: userInfo.memberName || "",
          memberEmail: userInfo.memberEmail || "",
          memberGender: userInfo.memberGender || "",
          memberBirth: userInfo.memberBirth || "",
          memberAddr: userInfo.memberAddr || "",
          memberZip: userInfo.memberZip || "",
          password: "",
          confirmPassword: "",
        });
      }
    }
  }, [open, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 메시지 초기화
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.memberName.trim()) {
      setError("이름을 입력해주세요.");
      return false;
    }

    if (!formData.memberEmail.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.memberEmail)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return false;
    }

    // 생년월일 형식 검증
    if (formData.memberBirth && !/^\d{6}$/.test(formData.memberBirth)) {
      setError("생년월일은 6자리 숫자(YYMMDD)로 입력해주세요.");
      return false;
    }

    // 우편번호 형식 검증 (5자리 숫자)
    if (formData.memberZip && !/^\d{5}$/.test(formData.memberZip)) {
      setError("우편번호는 5자리 숫자로 입력해주세요.");
      return false;
    }

    // 비밀번호가 입력된 경우에만 검증
    if (formData.password) {
      if (formData.password.length < 4) {
        setError("비밀번호는 4자 이상이어야 합니다.");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 수정할 데이터 준비
      const updateData = {
        memberName: formData.memberName,
        memberEmail: formData.memberEmail,
        memberGender: formData.memberGender,
        memberBirth: formData.memberBirth,
        memberAddr: formData.memberAddr,
        memberZip: formData.memberZip,
      };

      // 비밀번호가 입력된 경우에만 포함
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await updateMypage(updateData);

      if (response) {
        // 부모 컴포넌트에 업데이트된 정보 전달 및 성공 메시지 표시
        onUpdate(response, "회원정보가 성공적으로 수정되었습니다!");

        // 바로 다이얼로그 닫기
        onClose();
      }
    } catch (err) {
      console.error("회원정보 수정 오류:", err);
      setError("회원정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const styles = {
    // 오버레이
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 50,
      padding: "16px",
    },

    // 다이얼로그 컨테이너
    dialog: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      maxWidth: "600px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },

    // 헤더
    header: {
      padding: "32px 32px 16px 32px",
      textAlign: "center",
      borderBottom: "1px solid #f0f0f0",
      position: "relative",
    },

    closeButton: {
      position: "absolute",
      right: "16px",
      top: "16px",
      backgroundColor: "transparent",
      border: "none",
      color: "#666",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "4px",
      fontSize: "18px",
      fontWeight: "bold",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s",
    },

    closeButtonHover: {
      backgroundColor: "#f0f0f0",
    },

    // 프로필 아바타
    avatar: {
      width: "64px",
      height: "64px",
      margin: "0 auto 16px",
      backgroundColor: "#4ecdc4",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "24px",
      fontWeight: "bold",
    },

    // 타이틀
    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      margin: "0 0 4px 0",
    },

    subtitle: {
      fontSize: "14px",
      color: "#6b7280",
      margin: 0,
    },

    // 컨텐츠
    content: {
      padding: "32px",
      flex: 1,
      overflowY: "auto",
    },

    // 폼 컨테이너
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },

    // 알림
    alert: {
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      backgroundColor: "#ffebee",
      border: "1px solid #ffcdd2",
      color: "#d32f2f",
    },

    // 입력 그룹
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },

    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
    },

    required: {
      color: "#dc2626",
    },

    // 입력 필드들
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "14px",
      color: "#111827",
      backgroundColor: "white",
      transition: "all 0.2s ease",
      outline: "none",
      boxSizing: "border-box",
    },

    inputFocus: {
      borderColor: "#4ecdc4",
      boxShadow: "0 0 0 3px rgba(78, 205, 196, 0.1)",
    },

    inputDisabled: {
      backgroundColor: "#f9fafb",
      color: "#6b7280",
      cursor: "not-allowed",
    },

    inputError: {
      borderColor: "#dc2626",
    },

    // Select
    select: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "14px",
      color: "#111827",
      backgroundColor: "white",
      transition: "all 0.2s ease",
      outline: "none",
      boxSizing: "border-box",
      cursor: "pointer",
    },

    selectFocus: {
      borderColor: "#4ecdc4",
      boxShadow: "0 0 0 3px rgba(78, 205, 196, 0.1)",
    },

    // 헬퍼 텍스트
    helperText: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "4px",
    },

    helperTextError: {
      color: "#dc2626",
    },

    // 구분선
    divider: {
      height: "1px",
      backgroundColor: "#e5e7eb",
      margin: "8px 0",
    },

    // 액션 버튼들
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      marginTop: "32px",
      paddingTop: "24px",
      borderTop: "1px solid #f0f0f0",
    },

    button: {
      padding: "10px 24px",
      fontSize: "14px",
      fontWeight: "500",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      minWidth: "80px",
      justifyContent: "center",
    },

    cancelButton: {
      backgroundColor: "transparent",
      color: "#6b7280",
      border: "1px solid #d1d5db",
    },

    cancelButtonHover: {
      backgroundColor: "#f8f9fa",
    },

    submitButton: {
      backgroundColor: "#4ecdc4",
      color: "white",
    },

    submitButtonHover: {
      backgroundColor: "#26b5a8",
    },

    submitButtonDisabled: {
      backgroundColor: "#d1d5db",
      color: "#9ca3af",
      cursor: "not-allowed",
    },

    // 스피너
    spinner: {
      width: "16px",
      height: "16px",
      border: "2px solid transparent",
      borderTop: "2px solid currentColor",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },

    // 2열 레이아웃
    twoColumnRow: {
      display: "flex",
      gap: "16px",
    },

    halfWidth: {
      flex: 1,
    },
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
          {/* 헤더 */}
          <div style={styles.header}>
            <button
              onClick={onClose}
              style={styles.closeButton}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, styles.closeButtonHover);
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              ✕
            </button>

            <div style={styles.avatar}>
              {userInfo?.memberName?.charAt(0).toUpperCase() || "U"}
            </div>

            <h2 style={styles.title}>회원정보 수정</h2>
            <p style={styles.subtitle}>
              {userInfo?.memberName || "사용자"}#{userInfo?.id || "N/A"}
            </p>
          </div>

          {/* 컨텐츠 */}
          <div style={styles.content}>
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* 에러 알림 */}
              {error && <div style={styles.alert}>{error}</div>}

              {/* 사용자 ID (읽기 전용) */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>사용자 ID</label>
                <input
                  type="text"
                  value={userInfo?.memberId || ""}
                  disabled
                  style={{
                    ...styles.input,
                    ...styles.inputDisabled,
                  }}
                />
                <div style={styles.helperText}>
                  사용자 ID는 변경할 수 없습니다.
                </div>
              </div>

              {/* 이름과 이메일 */}
              <div style={styles.twoColumnRow}>
                <div style={{ ...styles.inputGroup, ...styles.halfWidth }}>
                  <label style={styles.label}>
                    이름 <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="memberName"
                    value={formData.memberName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    style={{
                      ...styles.input,
                      ...(loading ? styles.inputDisabled : {}),
                    }}
                    onFocus={(e) => {
                      if (!loading) {
                        Object.assign(e.target.style, styles.inputFocus);
                      }
                    }}
                    onBlur={(e) => {
                      Object.assign(e.target.style, {
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                      });
                    }}
                  />
                </div>

                <div style={{ ...styles.inputGroup, ...styles.halfWidth }}>
                  <label style={styles.label}>
                    이메일 <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    name="memberEmail"
                    value={formData.memberEmail}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    style={{
                      ...styles.input,
                      ...(loading ? styles.inputDisabled : {}),
                    }}
                    onFocus={(e) => {
                      if (!loading) {
                        Object.assign(e.target.style, styles.inputFocus);
                      }
                    }}
                    onBlur={(e) => {
                      Object.assign(e.target.style, {
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                      });
                    }}
                  />
                </div>
              </div>

              {/* 성별과 생년월일 */}
              <div style={styles.twoColumnRow}>
                <div style={{ ...styles.inputGroup, ...styles.halfWidth }}>
                  <label style={styles.label}>성별</label>
                  <select
                    name="memberGender"
                    value={formData.memberGender}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      ...styles.select,
                      ...(loading ? styles.inputDisabled : {}),
                    }}
                    onFocus={(e) => {
                      if (!loading) {
                        Object.assign(e.target.style, styles.selectFocus);
                      }
                    }}
                    onBlur={(e) => {
                      Object.assign(e.target.style, {
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                      });
                    }}
                  >
                    <option value="">선택</option>
                    <option value="M">남성</option>
                    <option value="F">여성</option>
                  </select>
                </div>

                <div style={{ ...styles.inputGroup, ...styles.halfWidth }}>
                  <label style={styles.label}>생년월일</label>
                  <input
                    type="text"
                    name="memberBirth"
                    value={formData.memberBirth}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="YYMMDD (예: 901225)"
                    style={{
                      ...styles.input,
                      ...(loading ? styles.inputDisabled : {}),
                    }}
                    onFocus={(e) => {
                      if (!loading) {
                        Object.assign(e.target.style, styles.inputFocus);
                      }
                    }}
                    onBlur={(e) => {
                      Object.assign(e.target.style, {
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                      });
                    }}
                  />
                  <div style={styles.helperText}>
                    6자리 숫자로 입력해주세요 (예: 901225)
                  </div>
                </div>
              </div>

              {/* 우편번호와 주소 */}
              <div style={styles.twoColumnRow}>
                <div style={{ ...styles.inputGroup, ...styles.halfWidth }}>
                  <label style={styles.label}>우편번호</label>
                  <input
                    type="text"
                    name="memberZip"
                    value={formData.memberZip}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="12345"
                    style={{
                      ...styles.input,
                      ...(loading ? styles.inputDisabled : {}),
                    }}
                    onFocus={(e) => {
                      if (!loading) {
                        Object.assign(e.target.style, styles.inputFocus);
                      }
                    }}
                    onBlur={(e) => {
                      Object.assign(e.target.style, {
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                      });
                    }}
                  />
                  <div style={styles.helperText}>5자리 숫자로 입력해주세요</div>
                </div>

                <div style={{ ...styles.inputGroup, ...styles.halfWidth }}>
                  <label style={styles.label}>주소</label>
                  <input
                    type="text"
                    name="memberAddr"
                    value={formData.memberAddr}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      ...styles.input,
                      ...(loading ? styles.inputDisabled : {}),
                    }}
                    onFocus={(e) => {
                      if (!loading) {
                        Object.assign(e.target.style, styles.inputFocus);
                      }
                    }}
                    onBlur={(e) => {
                      Object.assign(e.target.style, {
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                      });
                    }}
                  />
                </div>
              </div>

              {/* 구분선 */}
              <div style={styles.divider}></div>

              {/* 새 비밀번호 */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>새 비밀번호 (선택사항)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    ...styles.input,
                    ...(loading ? styles.inputDisabled : {}),
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      Object.assign(e.target.style, styles.inputFocus);
                    }
                  }}
                  onBlur={(e) => {
                    Object.assign(e.target.style, {
                      borderColor: "#d1d5db",
                      boxShadow: "none",
                    });
                  }}
                />
                <div style={styles.helperText}>
                  비밀번호를 변경하지 않으려면 비워두세요.
                </div>
              </div>

              {/* 비밀번호 확인 */}
              {formData.password && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>비밀번호 확인</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      ...styles.input,
                      ...(loading ? styles.inputDisabled : {}),
                      ...(formData.password !== formData.confirmPassword &&
                      formData.confirmPassword !== ""
                        ? styles.inputError
                        : {}),
                    }}
                    onFocus={(e) => {
                      if (!loading) {
                        Object.assign(e.target.style, styles.inputFocus);
                      }
                    }}
                    onBlur={(e) => {
                      Object.assign(e.target.style, {
                        borderColor:
                          formData.password !== formData.confirmPassword &&
                          formData.confirmPassword !== ""
                            ? "#dc2626"
                            : "#d1d5db",
                        boxShadow: "none",
                      });
                    }}
                  />
                  {formData.password !== formData.confirmPassword &&
                    formData.confirmPassword !== "" && (
                      <div
                        style={{
                          ...styles.helperText,
                          ...styles.helperTextError,
                        }}
                      >
                        비밀번호가 일치하지 않습니다.
                      </div>
                    )}
                </div>
              )}

              {/* 액션 버튼들 */}
              <div style={styles.actions}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    ...styles.button,
                    ...styles.cancelButton,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      Object.assign(e.target.style, styles.cancelButtonHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      Object.assign(e.target.style, {
                        backgroundColor: "transparent",
                      });
                    }
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.button,
                    ...styles.submitButton,
                    ...(loading ? styles.submitButtonDisabled : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      Object.assign(e.target.style, styles.submitButtonHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      Object.assign(e.target.style, {
                        backgroundColor: "#4ecdc4",
                      });
                    }
                  }}
                >
                  {loading && <div style={styles.spinner}></div>}
                  {loading ? "수정 중..." : "수정"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 스피너 애니메이션 */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default EditProfile;
