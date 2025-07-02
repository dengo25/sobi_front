import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Checkbox,
  Snackbar,
} from "@mui/material";
import {
  getReceivedMessages,
  markMessageAsRead,
  deleteMessageByReceiver,
} from "../../service/member/ApiService";

const ReceivedMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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

  // 개별 쪽지 삭제
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessageByReceiver(messageId);

      // 메시지 목록에서 삭제된 메시지 제거
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

      // 다이얼로그가 열려있고 삭제된 메시지라면 닫기
      if (selectedMessage && selectedMessage.id === messageId) {
        setDialogOpen(false);
        setSelectedMessage(null);
      }

      // 성공 메시지 표시
      setSuccessMessage("쪽지가 삭제되었습니다.");
      setShowSuccessAlert(true);
    } catch (err) {
      console.error("쪽지 삭제 오류:", err);
      setError("쪽지 삭제 중 오류가 발생했습니다.");
    }
  };

  // 선택된 쪽지들 일괄 삭제
  const handleDeleteSelected = async () => {
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
    } catch (err) {
      console.error("선택 쪽지 삭제 오류:", err);
      setError("쪽지 삭제 중 오류가 발생했습니다.");
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Button onClick={fetchMessages} sx={{ ml: 2 }}>
          다시 시도
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* 헤더 영역 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#333", fontSize: "16px" }}>
          받은 쪽지 ({messages.length})
        </Typography>

        {selectedMessages.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleDeleteSelected}
            sx={{ fontSize: "12px" }}
          >
            선택 삭제 ({selectedMessages.length})
          </Button>
        )}
      </Box>

      {messages.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h4" sx={{ fontSize: 48, color: "#ccc", mb: 2 }}>
            📧
          </Typography>
          <Typography variant="body1" color="text.secondary">
            받은 쪽지가 없습니다.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid #e0e0e0" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selectedMessages.length === messages.length &&
                      messages.length > 0
                    }
                    indeterminate={
                      selectedMessages.length > 0 &&
                      selectedMessages.length < messages.length
                    }
                    onChange={handleSelectAll}
                    size="small"
                  />
                </TableCell>
                <TableCell
                  sx={{
                    width: "50px",
                    textAlign: "center",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  상태
                </TableCell>
                <TableCell sx={{ fontSize: "13px", fontWeight: "600" }}>
                  보낸사람
                </TableCell>
                <TableCell sx={{ fontSize: "13px", fontWeight: "600" }}>
                  제목
                </TableCell>
                <TableCell
                  sx={{
                    width: "100px",
                    textAlign: "center",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  받은시간
                </TableCell>
                <TableCell
                  sx={{
                    width: "60px",
                    textAlign: "center",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  삭제
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((message) => (
                <TableRow
                  key={message.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      message.isRead === "N" ? "#f8f9ff" : "transparent",
                    "&:hover": {
                      backgroundColor:
                        message.isRead === "N" ? "#f0f2ff" : "#f8f9fa",
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => handleSelectMessage(message.id)}
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center" }}
                    onClick={() => handleMessageClick(message)}
                  >
                    {message.isRead === "N" ? (
                      <Tooltip title="읽지 않음">
                        <Typography sx={{ fontSize: 18, color: "#1976d2" }}>
                          ✉️
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Tooltip title="읽음">
                        <Typography sx={{ fontSize: 18, color: "#666" }}>
                          💌
                        </Typography>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "13px",
                      fontWeight: message.isRead === "N" ? "600" : "400",
                      color: message.isRead === "N" ? "#000" : "#666",
                    }}
                    onClick={() => handleMessageClick(message)}
                  >
                    {message.senderName}
                    <br />
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "13px",
                      fontWeight: message.isRead === "N" ? "600" : "400",
                      color: message.isRead === "N" ? "#000" : "#666",
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => handleMessageClick(message)}
                  >
                    {message.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontSize: "12px",
                      color: "#666",
                    }}
                    onClick={() => handleMessageClick(message)}
                  >
                    {formatDate(message.sendDate)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(message.id);
                      }}
                      sx={{
                        color: "#999",
                        minWidth: "auto",
                        fontSize: "12px",
                        padding: "4px 8px",
                        "&:hover": {
                          color: "#d32f2f",
                          backgroundColor: "#ffebee",
                        },
                      }}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 쪽지 상세 다이얼로그 */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "80vh",
          },
        }}
      >
        {selectedMessage && (
          <>
            <DialogTitle
              sx={{
                pb: 1,
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "18px", fontWeight: "600" }}
                >
                  {selectedMessage.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  보낸사람: {selectedMessage.senderName} (
                  {selectedMessage.senderMemberId})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  받은시간:{" "}
                  {new Date(selectedMessage.sendDate).toLocaleString("ko-KR")}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDialog} sx={{ color: "#666" }}>
                ✕
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              <Box
                sx={{
                  minHeight: "200px",
                  p: 2,
                  backgroundColor: "#fafafa",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    fontSize: "14px",
                  }}
                >
                  {selectedMessage.content}
                </Typography>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
              <Button onClick={handleCloseDialog} sx={{ mr: 1 }}>
                닫기
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteMessage(selectedMessage.id)}
              >
                삭제
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 성공 메시지 스낵바 */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={3000}
        onClose={handleCloseSuccessAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccessAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReceivedMessages;
