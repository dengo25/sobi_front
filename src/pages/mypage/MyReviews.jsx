import React, { useState, useEffect } from "react";
import { getMyReviews } from "../../service/mypage/ApiService";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    titleCell: {
      maxWidth: "300px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontWeight: "500",
      color: "#333",
    },
    timeText: {
      fontSize: "12px",
      color: "#666",
    },
    statusBadge: {
      padding: "2px 8px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: "500",
    },
    confirmedBadge: {
      backgroundColor: "#e8f5e8",
      color: "#2e7d32",
    },
    pendingBadge: {
      backgroundColor: "#fff3e0",
      color: "#f57c00",
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
      maxWidth: "700px",
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
      maxHeight: "400px",
      overflowY: "auto",
    },
    reviewContent: {
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
    closeDialogButton: {
      backgroundColor: "transparent",
      color: "#666",
      border: "1px solid #ddd",
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
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyReviews();
      console.log("내가 쓴 후기 응답:", response);

      if (response && response.rnoList) {
        setReviews(response.rnoList);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("내가 쓴 후기 조회 오류:", err);
      setError("내가 쓴 후기를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedReview(null);
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

  const getStatusBadge = (confirmed) => {
    if (confirmed === "Y") {
      return (
        <span style={{ ...styles.statusBadge, ...styles.confirmedBadge }}>
          승인됨
        </span>
      );
    } else {
      return (
        <span style={{ ...styles.statusBadge, ...styles.pendingBadge }}>
          대기중
        </span>
      );
    }
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
        <button onClick={fetchMyReviews} style={styles.retryButton}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 헤더 영역 */}
      <div style={styles.header}>
        <h3 style={styles.title}>내가 쓴 후기 ({reviews.length})</h3>
      </div>

      {reviews.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📝</div>
          <p style={styles.emptyText}>작성한 후기가 없습니다.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.tableHeaderCell}>번호</th>
                <th style={styles.tableHeaderCell}>제목</th>
                <th
                  style={{
                    ...styles.tableHeaderCell,
                    ...styles.tableHeaderCellCenter,
                  }}
                >
                  상태
                </th>
                <th
                  style={{
                    ...styles.tableHeaderCell,
                    ...styles.tableHeaderCellCenter,
                  }}
                >
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr
                  key={review.tno}
                  style={styles.tableRow}
                  onClick={() => handleReviewClick(review)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td style={styles.tableCell}>{reviews.length - index}</td>
                  <td style={{ ...styles.tableCell, ...styles.titleCell }}>
                    {review.title}
                  </td>
                  <td
                    style={{ ...styles.tableCell, ...styles.tableCellCenter }}
                  >
                    {getStatusBadge(review.confirmed)}
                  </td>
                  <td
                    style={{
                      ...styles.tableCell,
                      ...styles.tableCellCenter,
                      ...styles.timeText,
                    }}
                  >
                    {formatDate(review.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 후기 상세 다이얼로그 */}
      {dialogOpen && selectedReview && (
        <div style={styles.dialogOverlay} onClick={handleCloseDialog}>
          <div
            style={styles.dialogContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.dialogHeader}>
              <div>
                <h3 style={styles.dialogTitle}>{selectedReview.title}</h3>
                <div style={styles.dialogMeta}>
                  <p>
                    작성일:{" "}
                    {new Date(selectedReview.createdAt).toLocaleString("ko-KR")}
                  </p>
                  <p>상태: {getStatusBadge(selectedReview.confirmed)}</p>
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
              <div style={styles.reviewContent}>
                <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {selectedReview.content}
                </p>
              </div>
            </div>

            <div style={styles.dialogActions}>
              <button
                onClick={handleCloseDialog}
                style={{
                  ...styles.dialogButton,
                  ...styles.closeDialogButton,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f8f9fa";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
