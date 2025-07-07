import React, { useState } from "react";
import { sendMessage } from "../../service/member/ApiService";

const SendMessage = ({ onMessageSent }) => {
  const [formData, setFormData] = useState({
    receiverMemberId: "",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const styles = {
    container: {
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
      padding: "16px",
      margin: "16px",
    },
    title: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "16px",
      color: "#333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    alert: {
      padding: "12px 16px",
      borderRadius: "4px",
      fontSize: "14px",
      marginBottom: "16px",
    },
    errorAlert: {
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
      color: "#721c24",
    },
    successAlert: {
      backgroundColor: "#d4edda",
      border: "1px solid #c3e6cb",
      color: "#155724",
    },
    inputRow: {
      display: "flex",
      gap: "16px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
    },
    inputGroupFlex1: {
      flex: 1,
    },
    inputGroupFlex2: {
      flex: 2,
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#555",
      marginBottom: "4px",
    },
    input: {
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "14px",
      backgroundColor: "white",
      transition: "border-color 0.2s, box-shadow 0.2s",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#4ecdc4",
      boxShadow: "0 0 0 2px rgba(78, 205, 196, 0.2)",
    },
    inputDisabled: {
      backgroundColor: "#f8f9fa",
      color: "#6c757d",
      cursor: "not-allowed",
    },
    textarea: {
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "14px",
      backgroundColor: "white",
      transition: "border-color 0.2s, box-shadow 0.2s",
      outline: "none",
      resize: "vertical",
      minHeight: "100px",
      fontFamily: "inherit",
    },
    textareaFocus: {
      borderColor: "#4ecdc4",
      boxShadow: "0 0 0 2px rgba(78, 205, 196, 0.2)",
    },
    helperText: {
      fontSize: "12px",
      color: "#666",
      marginTop: "4px",
    },
    characterCount: {
      fontSize: "12px",
      color: "#666",
      fontWeight: "500",
    },
    buttonRow: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      marginTop: "8px",
      paddingTop: "16px",
      borderTop: "1px solid #e0e0e0",
    },
    button: {
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    resetButton: {
      backgroundColor: "transparent",
      color: "#666",
      border: "1px solid transparent",
    },
    submitButton: {
      backgroundColor: "#4ecdc4",
      color: "white",
    },
    submitButtonHover: {
      backgroundColor: "#26b5a8",
    },
    submitButtonDisabled: {
      backgroundColor: "#ccc",
      color: "#666",
      cursor: "not-allowed",
    },
    spinner: {
      width: "16px",
      height: "16px",
      border: "2px solid transparent",
      borderTop: "2px solid currentColor",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    infoCard: {
      marginTop: "16px",
      padding: "16px",
      backgroundColor: "#f0f8ff",
      borderRadius: "4px",
      border: "1px solid #b8daff",
    },
    infoTitle: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    infoList: {
      fontSize: "12px",
      color: "#555",
      lineHeight: "1.5",
      margin: 0,
      paddingLeft: 0,
      listStyle: "none",
    },
    infoItem: {
      marginBottom: "4px",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 메시지 초기화
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!formData.receiverMemberId.trim()) {
      setError("받는 사람의 아이디를 입력해주세요.");
      return false;
    }

    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.");
      return false;
    }

    if (!formData.content.trim()) {
      setError("내용을 입력해주세요.");
      return false;
    }

    if (formData.title.length > 100) {
      setError("제목은 100자 이내로 입력해주세요.");
      return false;
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
    setSuccess("");

    try {
      const messageDTO = {
        receiverMemberId: formData.receiverMemberId.trim(),
        title: formData.title.trim(),
        content: formData.content.trim(),
      };

      console.log("쪽지 전송 시도:", messageDTO);
      const response = await sendMessage(messageDTO);
      console.log("쪽지 전송 응답:", response);

      if (response) {
        setSuccess("쪽지가 성공적으로 전송되었습니다!");
        setFormData({
          receiverMemberId: "",
          title: "",
          content: "",
        });

        // 부모 컴포넌트에 전송 완료 알림
        if (onMessageSent) {
          onMessageSent(response);
        }
      }
    } catch (err) {
      console.error("쪽지 전송 오류:", err);

      // 에러 메시지 처리
      let errorMessage = "쪽지 전송 중 오류가 발생했습니다.";
      if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      receiverMemberId: "",
      title: "",
      content: "",
    });
    setError("");
    setSuccess("");
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#4ecdc4";
    e.target.style.boxShadow = "0 0 0 2px rgba(78, 205, 196, 0.2)";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#ddd";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>새 쪽지 보내기</h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        {error && (
          <div style={{ ...styles.alert, ...styles.errorAlert }}>{error}</div>
        )}

        {success && (
          <div style={{ ...styles.alert, ...styles.successAlert }}>
            {success}
          </div>
        )}

        {/* 받는 사람과 제목을 한 줄에 배치 */}
        <div style={styles.inputRow}>
          <div style={{ ...styles.inputGroup, ...styles.inputGroupFlex1 }}>
            <label style={styles.label}>받는 사람 *</label>
            <input
              type="text"
              name="receiverMemberId"
              value={formData.receiverMemberId}
              onChange={handleChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
              disabled={loading}
              placeholder="받는 사람 아이디"
              style={{
                ...styles.input,
                ...(loading ? styles.inputDisabled : {}),
              }}
            />
          </div>

          <div style={{ ...styles.inputGroup, ...styles.inputGroupFlex2 }}>
            <label style={styles.label}>
              제목 *{" "}
              <span style={styles.characterCount}>
                ({formData.title.length}/100)
              </span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
              disabled={loading}
              placeholder="쪽지 제목"
              maxLength="100"
              style={{
                ...styles.input,
                ...(loading ? styles.inputDisabled : {}),
              }}
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>내용 *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
            disabled={loading}
            placeholder="쪽지 내용을 입력하세요"
            rows="4"
            style={{
              ...styles.textarea,
              ...(loading ? styles.inputDisabled : {}),
            }}
          />
          <div style={styles.helperText}>
            전달하고 싶은 메시지를 작성해주세요.
          </div>
        </div>

        {/* 버튼 영역 */}
        <div style={styles.buttonRow}>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            style={{
              ...styles.button,
              ...styles.resetButton,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#f8f9fa";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "transparent";
              }
            }}
          >
            초기화
          </button>
          <button
            type="submit"
            disabled={
              loading ||
              !formData.receiverMemberId ||
              !formData.title ||
              !formData.content
            }
            style={{
              ...styles.button,
              ...styles.submitButton,
              ...(loading ||
              !formData.receiverMemberId ||
              !formData.title ||
              !formData.content
                ? styles.submitButtonDisabled
                : {}),
            }}
            onMouseEnter={(e) => {
              if (
                !loading &&
                formData.receiverMemberId &&
                formData.title &&
                formData.content
              ) {
                e.target.style.backgroundColor = "#26b5a8";
              }
            }}
            onMouseLeave={(e) => {
              if (
                !loading &&
                formData.receiverMemberId &&
                formData.title &&
                formData.content
              ) {
                e.target.style.backgroundColor = "#4ecdc4";
              }
            }}
          >
            {loading && <div style={styles.spinner}></div>}
            {loading ? "전송 중..." : "쪽지 보내기"}
          </button>
        </div>
      </form>

      {/* 안내 메시지 */}
      <div style={styles.infoCard}>
        <div style={styles.infoTitle}>📌 쪽지 전송 안내</div>
        <ul style={styles.infoList}>
          <li style={styles.infoItem}>
            • 받는 사람의 아이디를 정확히 입력해주세요.
          </li>
          <li style={styles.infoItem}>
            • 자기 자신에게도 쪽지를 보낼 수 있습니다. (메모 기능)
          </li>
          <li style={styles.infoItem}>
            • 제목은 최대 100자까지 입력 가능합니다.
          </li>
          <li style={styles.infoItem}>
            • 전송된 쪽지는 수정할 수 없으니 신중히 작성해주세요.
          </li>
        </ul>
      </div>

      {/* 스피너 애니메이션을 위한 CSS */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SendMessage;
