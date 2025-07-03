import React, { useState, useEffect } from "react";
import { deleteMypage, signout } from "../../service/member/ApiService";

const DeleteProfile = ({ open, onClose, onDelete }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 다이얼로그가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setPassword("");
      setError("");
    }
  }, [open]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("현재 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await deleteMypage(password);

      // 응답이 성공적이고 error가 없으면 탈퇴 성공
      if (response && !response.error) {
        // 로그아웃 처리 (토큰 제거)
        signout();
        // 부모 컴포넌트에 성공 알림 (실제로는 로그인 페이지로 이동됨)
        onDelete();
      } else {
        // 서버에서 에러 메시지가 온 경우
        setError(response.error || "회원 탈퇴 처리 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("회원 탈퇴 오류:", err);
      setError("비밀번호가 일치하지 않거나 탈퇴 처리 중 오류가 발생했습니다.");
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
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      maxWidth: "500px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },

    // 헤더
    header: {
      padding: "24px 24px 16px 24px",
      borderBottom: "1px solid #e5e7eb",
    },

    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      margin: 0,
    },

    // 컨텐츠
    content: {
      padding: "24px",
      flex: 1,
      overflowY: "auto",
    },

    // 알림 박스들
    alert: {
      padding: "12px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      marginBottom: "16px",
      border: "1px solid",
    },

    errorAlert: {
      backgroundColor: "#fef2f2",
      borderColor: "#fecaca",
      color: "#dc2626",
    },

    warningAlert: {
      backgroundColor: "#fffbeb",
      borderColor: "#fed7aa",
      color: "#d97706",
    },

    // 주의사항 스타일
    warningTitle: {
      fontWeight: "bold",
      fontSize: "14px",
      marginBottom: "8px",
      display: "block",
    },

    warningList: {
      fontSize: "13px",
      lineHeight: "1.5",
      margin: 0,
      paddingLeft: "12px",
    },

    warningItem: {
      marginBottom: "4px",
    },

    // 강조 텍스트
    dangerText: {
      textAlign: "center",
      fontSize: "14px",
      fontWeight: "bold",
      color: "#dc2626",
      margin: "16px 0",
    },

    // 입력 필드 그룹
    inputGroup: {
      marginBottom: "24px",
    },

    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "6px",
    },

    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      color: "#111827",
      backgroundColor: "white",
      transition: "all 0.2s ease",
      outline: "none",
      boxSizing: "border-box",
    },

    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },

    inputDisabled: {
      backgroundColor: "#f9fafb",
      color: "#6b7280",
      cursor: "not-allowed",
    },

    // 액션 버튼들
    actions: {
      padding: "16px 24px",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },

    button: {
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "500",
      borderRadius: "6px",
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
      backgroundColor: "#f9fafb",
      borderColor: "#9ca3af",
    },

    deleteButton: {
      backgroundColor: "#dc2626",
      color: "white",
    },

    deleteButtonHover: {
      backgroundColor: "#b91c1c",
    },

    deleteButtonDisabled: {
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
  };

  return (
    <>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
          {/* 헤더 */}
          <div style={styles.header}>
            <h2 style={styles.title}>회원 탈퇴</h2>
          </div>

          {/* 컨텐츠 */}
          <div style={styles.content}>
            <form onSubmit={handleSubmit}>
              {/* 에러 알림 */}
              {error && (
                <div style={{ ...styles.alert, ...styles.errorAlert }}>
                  {error}
                </div>
              )}

              {/* 주의사항 */}
              <div style={{ ...styles.alert, ...styles.warningAlert }}>
                <span style={styles.warningTitle}>주의사항</span>
                <ul style={styles.warningList}>
                  <li style={styles.warningItem}>
                    회원 탈퇴 시 모든 개인정보가 삭제됩니다.
                  </li>
                  <li style={styles.warningItem}>
                    작성한 게시글과 댓글은 유지될 수 있습니다.
                  </li>
                  <li style={styles.warningItem}>
                    탈퇴 후에는 같은 아이디로 재가입이 불가능할 수 있습니다.
                  </li>
                  <li style={styles.warningItem}>
                    이 작업은 되돌릴 수 없습니다.
                  </li>
                </ul>
              </div>

              {/* 강조 텍스트 */}
              <div style={styles.dangerText}>
                탈퇴하려면 현재 비밀번호를 입력해주세요.
              </div>

              {/* 비밀번호 입력 */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>현재 비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  disabled={loading}
                  autoFocus
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
                        borderColor: "#d1d5db",
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
                    ...styles.deleteButton,
                    ...(loading ? styles.deleteButtonDisabled : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      Object.assign(e.target.style, styles.deleteButtonHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      Object.assign(e.target.style, {
                        backgroundColor: "#dc2626",
                      });
                    }
                  }}
                >
                  {loading && <div style={styles.spinner}></div>}
                  {loading ? "탈퇴 처리 중..." : "탈퇴하기"}
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

export default DeleteProfile;
