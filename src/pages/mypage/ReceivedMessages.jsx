import React, { useState, useEffect } from "react";
import {
  getReceivedMessages,
  markMessageAsRead,
  deleteMessageByReceiver,
} from "../../service/member/ApiService";

const ReceivedMessages = ({ onMessageAction }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // 삭제 확인 다이얼로그 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [batchDeleteConfirmOpen, setBatchDeleteConfirmOpen] = useState(false);

  // ... (이전의 모든 styles 객체는 동일하게 유지)
  const styles = {
    container: {
      padding: "16px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    title: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#333",
      margin: 0,
    },
    batchDeleteButton: {
      padding: "6px 12px",
      fontSize: "12px",
      border: "1px solid #dc3545",
      backgroundColor: "transparent",
      color: "#dc3545",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    emptyState: {
      textAlign: "center",
      padding: "32px",
    },
    emptyIcon: {
      fontSize: "48px",
      color: "#ccc",
      marginBottom: "8px",
    },
    emptyText: {
      color: "#666",
      fontSize: "14px",
    },
    tableContainer: {
      backgroundColor: "white",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "13px",
    },
    tableHead: {
      backgroundColor: "#f5f5f5",
    },
    tableHeaderCell: {
      padding: "12px 8px",
      textAlign: "left",
      fontSize: "13px",
      fontWeight: "600",
      color: "#333",
      borderBottom: "1px solid #e0e0e0",
    },
    tableHeaderCellCenter: {
      textAlign: "center",
    },
    tableRow: {
      cursor: "pointer",
      transition: "background-color 0.1s",
    },
    tableRowUnread: {
      backgroundColor: "#f8f9ff",
    },
    tableRowHover: {
      backgroundColor: "#f8f9fa",
    },
    tableCell: {
      padding: "12px 8px",
      borderBottom: "1px solid #f0f0f0",
      fontSize: "13px",
    },
    tableCellCenter: {
      textAlign: "center",
    },
    statusIcon: {
      fontSize: "18px",
    },
    unreadText: {
      fontWeight: "600",
      color: "#000",
    },
    readText: {
      fontWeight: "400",
      color: "#666",
    },
    titleCell: {
      maxWidth: "300px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    timeText: {
      fontSize: "12px",
      color: "#666",
    },
    deleteButton: {
      padding: "4px 8px",
      fontSize: "12px",
      color: "#999",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    checkbox: {
      margin: 0,
    },
    // 다이얼로그 스타일
    dialogOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    dialogContainer: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      maxWidth: "600px",
      width: "90%",
      maxHeight: "80vh",
      overflow: "hidden",
      margin: "16px",
    },
    dialogHeader: {
      padding: "20px",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    dialogTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#333",
      margin: "0 0 8px 0",
    },
    dialogMeta: {
      fontSize: "14px",
      color: "#666",
      lineHeight: "1.4",
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      fontSize: "20px",
      color: "#666",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
    },
    dialogContent: {
      padding: "20px",
    },
    messageContent: {
      minHeight: "200px",
      padding: "16px",
      backgroundColor: "#fafafa",
      borderRadius: "4px",
      border: "1px solid #e0e0e0",
      fontSize: "14px",
      lineHeight: "1.6",
      whiteSpace: "pre-wrap",
    },
    dialogActions: {
      padding: "16px 20px",
      borderTop: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px",
    },
    dialogButton: {
      padding: "8px 16px",
      fontSize: "14px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    cancelButton: {
      backgroundColor: "transparent",
      color: "#666",
      border: "1px solid transparent",
    },
    deleteDialogButton: {
      backgroundColor: "#dc3545",
      color: "white",
    },
    // 확인 다이얼로그 스타일
    confirmDialog: {
      maxWidth: "400px",
    },
    confirmContent: {
      padding: "20px",
    },
    confirmText: {
      fontSize: "14px",
      marginBottom: "16px",
      color: "#333",
    },
    messagePreview: {
      padding: "12px",
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
      border: "1px solid #e0e0e0",
      marginBottom: "16px",
    },
    previewText: {
      fontSize: "12px",
      color: "#666",
    },
    warningText: {
      fontSize: "12px",
      color: "#dc3545",
      fontWeight: "500",
    },
    // 성공 알림 스타일
    successAlert: {
      position: "fixed",
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1001,
      backgroundColor: "#d4edda",
      border: "1px solid #c3e6cb",
      color: "#155724",
      padding: "12px 16px",
      borderRadius: "4px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
    },
    alertCloseButton: {
      marginLeft: "16px",
      backgroundColor: "transparent",
      border: "none",
      color: "#155724",
      cursor: "pointer",
      fontSize: "16px",
    },
    // 로딩 스타일
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
    },
    spinner: {
      width: "32px",
      height: "32px",
      border: "3px solid #f3f3f3",
      borderTop: "3px solid #1976d2",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    // 에러 스타일
    errorAlert: {
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
      color: "#721c24",
      padding: "12px 16px",
      borderRadius: "4px",
      margin: "16px",
      fontSize: "14px",
    },
    retryButton: {
      marginLeft: "8px",
      textDecoration: "underline",
      background: "none",
      border: "none",
      color: "#721c24",
      cursor: "pointer",
    },
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getReceivedMessages();
      console.log("받은 쪽지 응답:", response);

      if (Array.isArray(response)) {
        setMessages(response);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("받은 쪽지 조회 오류:", err);
      setError("받은 쪽지를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);

    // 읽지 않은 쪽지인 경우 읽음 처리
    if (message.isRead === "N") {
      try {
        await markMessageAsRead(message.id);
        // 로컬 상태 업데이트
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id ? { ...msg, isRead: "Y" } : msg
          )
        );

        // 부모 컴포넌트에 변경 사항 알림
        if (onMessageAction) {
          onMessageAction();
        }
      } catch (err) {
        console.error("읽음 처리 오류:", err);
      }
    }
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages((prev) => {
      if (prev.includes(messageId)) {
        return prev.filter((id) => id !== messageId);
      } else {
        return [...prev, messageId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map((msg) => msg.id));
    }
  };

  // 개별 쪽지 삭제 확인 다이얼로그 열기
  const handleDeleteMessageConfirm = (message) => {
    setMessageToDelete(message);
    setDeleteConfirmOpen(true);
  };

  // 개별 쪽지 삭제 실행
  const handleDeleteMessageExecute = async () => {
    if (!messageToDelete) return;

    try {
      await deleteMessageByReceiver(messageToDelete.id);

      // 메시지 목록에서 삭제된 메시지 제거
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== messageToDelete.id)
      );

      // 다이얼로그가 열려있고 삭제된 메시지라면 닫기
      if (selectedMessage && selectedMessage.id === messageToDelete.id) {
        setDialogOpen(false);
        setSelectedMessage(null);
      }

      // 성공 메시지 표시
      setSuccessMessage("쪽지가 삭제되었습니다.");
      setShowSuccessAlert(true);

      // 부모 컴포넌트에 변경 사항 알림
      if (onMessageAction) {
        onMessageAction();
      }
    } catch (err) {
      console.error("쪽지 삭제 오류:", err);
      setError("쪽지 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleteConfirmOpen(false);
      setMessageToDelete(null);
    }
  };

  // 선택된 쪽지들 일괄 삭제 확인
  const handleBatchDeleteConfirm = () => {
    setBatchDeleteConfirmOpen(true);
  };

  // 선택된 쪽지들 일괄 삭제 실행
  const handleBatchDeleteExecute = async () => {
    try {
      // 모든 선택된 메시지 삭제
      await Promise.all(
        selectedMessages.map((messageId) => deleteMessageByReceiver(messageId))
      );

      // 삭제된 메시지들을 목록에서 제거
      setMessages((prev) =>
        prev.filter((msg) => !selectedMessages.includes(msg.id))
      );

      // 선택 상태 초기화
      setSelectedMessages([]);

      // 성공 메시지 표시
      setSuccessMessage(
        `${selectedMessages.length}개의 쪽지가 삭제되었습니다.`
      );
      setShowSuccessAlert(true);

      // 부모 컴포넌트에 변경 사항 알림
      if (onMessageAction) {
        onMessageAction();
      }
    } catch (err) {
      console.error("선택 쪽지 삭제 오류:", err);
      setError("쪽지 삭제 중 오류가 발생했습니다.");
    } finally {
      setBatchDeleteConfirmOpen(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "어제";
    } else {
      return date.toLocaleDateString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
    }
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    setSuccessMessage("");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMessage(null);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
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
  }

  if (error) {
    return (
      <div style={styles.errorAlert}>
        {error}
        <button onClick={fetchMessages} style={styles.retryButton}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 헤더 영역 */}
      <div style={styles.header}>
        <h3 style={styles.title}>받은 쪽지 ({messages.length})</h3>

        {selectedMessages.length > 0 && (
          <button
            onClick={handleBatchDeleteConfirm}
            style={styles.batchDeleteButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#dc3545";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#dc3545";
            }}
          >
            선택 삭제 ({selectedMessages.length})
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📧</div>
          <p style={styles.emptyText}>받은 쪽지가 없습니다.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.tableHeaderCell}>
                  <input
                    type="checkbox"
                    checked={
                      selectedMessages.length === messages.length &&
                      messages.length > 0
                    }
                    onChange={handleSelectAll}
                    style={styles.checkbox}
                  />
                </th>
                <th
                  style={{
                    ...styles.tableHeaderCell,
                    ...styles.tableHeaderCellCenter,
                  }}
                >
                  상태
                </th>
                <th style={styles.tableHeaderCell}>보낸사람</th>
                <th style={styles.tableHeaderCell}>제목</th>
                <th
                  style={{
                    ...styles.tableHeaderCell,
                    ...styles.tableHeaderCellCenter,
                  }}
                >
                  받은시간
                </th>
                <th
                  style={{
                    ...styles.tableHeaderCell,
                    ...styles.tableHeaderCellCenter,
                  }}
                >
                  삭제
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr
                  key={message.id}
                  style={{
                    ...styles.tableRow,
                    ...(message.isRead === "N" ? styles.tableRowUnread : {}),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      message.isRead === "N" ? "#f0f2ff" : "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      message.isRead === "N" ? "#f8f9ff" : "transparent";
                  }}
                >
                  <td style={styles.tableCell}>
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => handleSelectMessage(message.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={styles.checkbox}
                    />
                  </td>
                  <td
                    style={{ ...styles.tableCell, ...styles.tableCellCenter }}
                    onClick={() => handleMessageClick(message)}
                  >
                    {message.isRead === "N" ? (
                      <span
                        title="읽지 않음"
                        style={{ ...styles.statusIcon, color: "#1976d2" }}
                      >
                        ✉️
                      </span>
                    ) : (
                      <span
                        title="읽음"
                        style={{ ...styles.statusIcon, color: "#666" }}
                      >
                        💌
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      ...styles.tableCell,
                      ...(message.isRead === "N"
                        ? styles.unreadText
                        : styles.readText),
                    }}
                    onClick={() => handleMessageClick(message)}
                  >
                    {message.senderName}
                  </td>
                  <td
                    style={{
                      ...styles.tableCell,
                      ...styles.titleCell,
                      ...(message.isRead === "N"
                        ? styles.unreadText
                        : styles.readText),
                    }}
                    onClick={() => handleMessageClick(message)}
                  >
                    {message.title}
                  </td>
                  <td
                    style={{
                      ...styles.tableCell,
                      ...styles.tableCellCenter,
                      ...styles.timeText,
                    }}
                    onClick={() => handleMessageClick(message)}
                  >
                    {formatDate(message.sendDate)}
                  </td>
                  <td
                    style={{ ...styles.tableCell, ...styles.tableCellCenter }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessageConfirm(message);
                      }}
                      style={styles.deleteButton}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#dc3545";
                        e.target.style.backgroundColor = "#ffebee";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "#999";
                        e.target.style.backgroundColor = "transparent";
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 쪽지 상세 다이얼로그 */}
      {dialogOpen && selectedMessage && (
        <div style={styles.dialogOverlay} onClick={handleCloseDialog}>
          <div
            style={styles.dialogContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.dialogHeader}>
              <div>
                <h3 style={styles.dialogTitle}>{selectedMessage.title}</h3>
                <div style={styles.dialogMeta}>
                  <p>
                    보낸사람: {selectedMessage.senderName} (
                    {selectedMessage.senderMemberId})
                  </p>
                  <p>
                    받은시간:{" "}
                    {new Date(selectedMessage.sendDate).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseDialog}
                style={styles.closeButton}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                ✕
              </button>
            </div>

            <div style={styles.dialogContent}>
              <div style={styles.messageContent}>{selectedMessage.content}</div>
            </div>

            <div style={styles.dialogActions}>
              <button
                onClick={handleCloseDialog}
                style={{ ...styles.dialogButton, ...styles.cancelButton }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f8f9fa";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                닫기
              </button>
              <button
                onClick={() => handleDeleteMessageConfirm(selectedMessage)}
                style={{ ...styles.dialogButton, ...styles.deleteDialogButton }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#c82333";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#dc3545";
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 개별 쪽지 삭제 확인 다이얼로그 */}
      {deleteConfirmOpen && messageToDelete && (
        <div
          style={styles.dialogOverlay}
          onClick={() => setDeleteConfirmOpen(false)}
        >
          <div
            style={{ ...styles.dialogContainer, ...styles.confirmDialog }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.dialogHeader}>
              <h3 style={styles.dialogTitle}>쪽지 삭제 확인</h3>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>
            <div style={styles.confirmContent}>
              <p style={styles.confirmText}>정말 이 쪽지를 삭제하시겠습니까?</p>

              <div style={styles.messagePreview}>
                <p style={styles.previewText}>제목: {messageToDelete.title}</p>
                <p style={styles.previewText}>
                  보낸사람: {messageToDelete.senderName}
                </p>
              </div>

              <p style={styles.warningText}>
                삭제된 쪽지는 복구할 수 없습니다.
              </p>
            </div>
            <div style={styles.dialogActions}>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                style={{ ...styles.dialogButton, ...styles.cancelButton }}
              >
                취소
              </button>
              <button
                onClick={handleDeleteMessageExecute}
                style={{ ...styles.dialogButton, ...styles.deleteDialogButton }}
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 일괄 삭제 확인 다이얼로그 */}
      {batchDeleteConfirmOpen && (
        <div
          style={styles.dialogOverlay}
          onClick={() => setBatchDeleteConfirmOpen(false)}
        >
          <div
            style={{ ...styles.dialogContainer, ...styles.confirmDialog }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.dialogHeader}>
              <h3 style={styles.dialogTitle}>선택된 쪽지 삭제 확인</h3>
              <button
                onClick={() => setBatchDeleteConfirmOpen(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>
            <div style={styles.confirmContent}>
              <p style={styles.confirmText}>
                선택된 {selectedMessages.length}개의 쪽지를 모두
                삭제하시겠습니까?
              </p>
              <p style={styles.warningText}>
                삭제된 쪽지는 복구할 수 없습니다.
              </p>
            </div>
            <div style={styles.dialogActions}>
              <button
                onClick={() => setBatchDeleteConfirmOpen(false)}
                style={{ ...styles.dialogButton, ...styles.cancelButton }}
              >
                취소
              </button>
              <button
                onClick={handleBatchDeleteExecute}
                style={{ ...styles.dialogButton, ...styles.deleteDialogButton }}
              >
                모두 삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 성공 메시지 스낵바 */}
      {showSuccessAlert && (
        <div style={styles.successAlert}>
          <span style={{ fontSize: "14px" }}>{successMessage}</span>
          <button
            onClick={handleCloseSuccessAlert}
            style={styles.alertCloseButton}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ReceivedMessages;
