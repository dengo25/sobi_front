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
  getSentMessages,
  deleteMessageBySender,
} from "../../service/member/ApiService";

const SentMessages = () => {
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

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getSentMessages();
      console.log("보낸 쪽지 응답:", response);

      if (Array.isArray(response)) {
        setMessages(response);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("보낸 쪽지 조회 오류:", err);
      setError("보낸 쪽지를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);
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
      await deleteMessageBySender(messageToDelete.id);

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
        selectedMessages.map((messageId) => deleteMessageBySender(messageId))
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
          보낸 쪽지 ({messages.length})
        </Typography>

        {selectedMessages.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleBatchDeleteConfirm}
            sx={{ fontSize: "12px" }}
          >
            선택 삭제 ({selectedMessages.length})
          </Button>
        )}
      </Box>

      {messages.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h4" sx={{ fontSize: 48, color: "#ccc", mb: 2 }}>
            📤
          </Typography>
          <Typography variant="body1" color="text.secondary">
            보낸 쪽지가 없습니다.
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
                  받는사람
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
                  보낸시간
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
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
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
                    <Tooltip
                      title={
                        message.isRead === "Y" ? "상대방이 읽음" : "읽지 않음"
                      }
                    >
                      <Typography
                        sx={{
                          fontSize: 18,
                          color: message.isRead === "Y" ? "#4caf50" : "#666",
                        }}
                      >
                        {message.isRead === "Y" ? "✅" : "📨"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "13px",
                      color: "#666",
                    }}
                    onClick={() => handleMessageClick(message)}
                  >
                    {message.receiverName}
                    <br />
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "13px",
                      color: "#666",
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "left",
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
                        handleDeleteMessageConfirm(message);
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
                  받는사람: {selectedMessage.receiverName} (
                  {selectedMessage.receiverMemberId})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  보낸시간:{" "}
                  {new Date(selectedMessage.sendDate).toLocaleString("ko-KR")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  읽음 상태:{" "}
                  {selectedMessage.isRead === "Y" ? "읽음" : "읽지 않음"}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDialog} sx={{ color: "#666" }}>
                ✕
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
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
                onClick={() => handleDeleteMessageConfirm(selectedMessage)}
              >
                삭제
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 개별 쪽지 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>쪽지 삭제 확인</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            정말 이 쪽지를 삭제하시겠습니까?
          </Typography>
          {messageToDelete && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                제목: {messageToDelete.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                받는사람: {messageToDelete.receiverName}
              </Typography>
            </Box>
          )}
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 2, fontWeight: "500" }}
          >
            삭제된 쪽지는 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>취소</Button>
          <Button
            onClick={handleDeleteMessageExecute}
            color="error"
            variant="contained"
          >
            삭제하기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 일괄 삭제 확인 다이얼로그 */}
      <Dialog
        open={batchDeleteConfirmOpen}
        onClose={() => setBatchDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>선택된 쪽지 삭제 확인</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            선택된 {selectedMessages.length}개의 쪽지를 모두 삭제하시겠습니까?
          </Typography>
          <Typography variant="body2" color="error" sx={{ fontWeight: "500" }}>
            삭제된 쪽지는 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatchDeleteConfirmOpen(false)}>취소</Button>
          <Button
            onClick={handleBatchDeleteExecute}
            color="error"
            variant="contained"
          >
            모두 삭제하기
          </Button>
        </DialogActions>
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

export default SentMessages;
