"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Checkbox,
  Container,
  Card,
  CardContent,
  IconButton,
  Chip,
  Pagination,
  Stack,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Close as CloseIcon,
  CheckCircle as ReadIcon,
  Mail as UnreadIcon,
} from "@mui/icons-material";
import {
  HeaderBox,
  StyledTableContainer,
  StyledTableRow,
  ReadTableRow,
  EmptyStateBox,
  LoadingBox,
  PaginationContainer,
} from "../../assets/styles/sobiTheme";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        // 데이터가 새로 로드되면 첫 페이지로 이동
        setCurrentPage(1);
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
    const currentPageMessages = currentMessages.map((msg) => msg.id);
    const isAllCurrentPageSelected = currentPageMessages.every((id) =>
      selectedMessages.includes(id)
    );

    if (isAllCurrentPageSelected) {
      // 현재 페이지의 모든 항목이 선택되어 있으면 선택 해제
      setSelectedMessages((prev) =>
        prev.filter((id) => !currentPageMessages.includes(id))
      );
    } else {
      // 현재 페이지의 모든 항목 선택
      setSelectedMessages((prev) => [
        ...prev.filter((id) => !currentPageMessages.includes(id)),
        ...currentPageMessages,
      ]);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
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
      setMessages((prev) => {
        const newMessages = prev.filter((msg) => msg.id !== messageToDelete.id);

        // 현재 페이지에서 삭제 후 페이지 조정
        const totalPages = Math.ceil(newMessages.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }

        return newMessages;
      });

      // 선택된 메시지에서도 제거
      setSelectedMessages((prev) =>
        prev.filter((id) => id !== messageToDelete.id)
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
      setMessages((prev) => {
        const newMessages = prev.filter(
          (msg) => !selectedMessages.includes(msg.id)
        );

        // 현재 페이지에서 삭제 후 페이지 조정
        const totalPages = Math.ceil(newMessages.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }

        return newMessages;
      });

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

  const getStatusIcon = (isRead) => {
    if (isRead === "Y") {
      return <ReadIcon color="primary" titleAccess="상대방이 읽음" />;
    } else {
      return <UnreadIcon color="disabled" titleAccess="읽지 않음" />;
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = messages.slice(startIndex, endIndex);

  // 현재 페이지의 체크박스 상태 계산
  const currentPageMessageIds = currentMessages.map((msg) => msg.id);
  const isAllCurrentPageSelected =
    currentPageMessageIds.length > 0 &&
    currentPageMessageIds.every((id) => selectedMessages.includes(id));
  const isIndeterminate =
    currentPageMessageIds.some((id) => selectedMessages.includes(id)) &&
    !isAllCurrentPageSelected;

  if (loading) {
    return (
      <LoadingBox>
        <CircularProgress />
      </LoadingBox>
    );
  }

  if (error) {
    return (
      <Container sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchMessages}>
              다시 시도
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {/* 헤더 영역 */}
      <HeaderBox>
        <Box>
          <Typography variant="h6" component="h3" fontWeight={600}>
            보낸 쪽지 ({messages.length})
          </Typography>
          {messages.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              페이지 {currentPage} / {totalPages}
            </Typography>
          )}
        </Box>

        {selectedMessages.length > 0 && (
          <Button
            onClick={handleBatchDeleteConfirm}
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
          >
            선택 삭제 ({selectedMessages.length})
          </Button>
        )}
      </HeaderBox>

      {messages.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyStateBox>
              <Typography variant="h1" sx={{ fontSize: 48, mb: 1 }}>
                📤
              </Typography>
              <Typography variant="body2" color="text.secondary">
                보낸 쪽지가 없습니다.
              </Typography>
            </EmptyStateBox>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <StyledTableContainer component={Paper} sx={{ flex: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAll}
                      indeterminate={isIndeterminate}
                    />
                  </TableCell>
                  <TableCell align="center">상태</TableCell>
                  <TableCell>받는사람</TableCell>
                  <TableCell>제목</TableCell>
                  <TableCell align="center">보낸시간</TableCell>
                  <TableCell align="center">삭제</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentMessages.map((message) => {
                  const RowComponent =
                    message.isRead === "Y" ? ReadTableRow : StyledTableRow;
                  return (
                    <RowComponent key={message.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedMessages.includes(message.id)}
                          onChange={() => handleSelectMessage(message.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        onClick={() => handleMessageClick(message)}
                      >
                        {getStatusIcon(message.isRead)}
                      </TableCell>
                      <TableCell
                        onClick={() => handleMessageClick(message)}
                        sx={{
                          fontWeight: message.isRead === "Y" ? 600 : 400,
                          color:
                            message.isRead === "Y"
                              ? "text.primary"
                              : "text.secondary",
                        }}
                      >
                        {message.receiverName}
                      </TableCell>
                      <TableCell
                        onClick={() => handleMessageClick(message)}
                        sx={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: message.isRead === "Y" ? 600 : 400,
                          color:
                            message.isRead === "Y"
                              ? "text.primary"
                              : "text.secondary",
                        }}
                      >
                        {message.title}
                      </TableCell>
                      <TableCell
                        align="center"
                        onClick={() => handleMessageClick(message)}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(message.sendDate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessageConfirm(message);
                          }}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </RowComponent>
                  );
                })}
              </TableBody>
            </Table>
          </StyledTableContainer>

          {/* 페이지네이션 */}
          <PaginationContainer>
            {totalPages > 1 ? (
              <Stack spacing={2} alignItems="center">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                />
                <Typography variant="caption" color="text.secondary">
                  {startIndex + 1}-{Math.min(endIndex, messages.length)} /{" "}
                  {messages.length}개 표시
                </Typography>
              </Stack>
            ) : (
              messages.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  총 {messages.length}개
                </Typography>
              )
            )}
          </PaginationContainer>
        </Box>
      )}

      {/* 쪽지 상세 다이얼로그 */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedMessage && (
          <>
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    component="div"
                    fontWeight={600}
                    gutterBottom
                  >
                    {selectedMessage.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    받는사람: {selectedMessage.receiverName} (
                    {selectedMessage.receiverMemberId})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    보낸시간:{" "}
                    {new Date(selectedMessage.sendDate).toLocaleString("ko-KR")}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={
                        selectedMessage.isRead === "Y" ? "읽음" : "읽지 않음"
                      }
                      color={
                        selectedMessage.isRead === "Y" ? "primary" : "default"
                      }
                      size="small"
                    />
                  </Box>
                </Box>
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  minHeight: 200,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {selectedMessage.content}
                </Typography>
              </Paper>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog} variant="outlined">
                닫기
              </Button>
              <Button
                onClick={() => handleDeleteMessageConfirm(selectedMessage)}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
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
      >
        {messageToDelete && (
          <>
            <DialogTitle>쪽지 삭제 확인</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                정말 이 쪽지를 삭제하시겠습니까?
              </Typography>

              <Paper
                variant="outlined"
                sx={{ p: 2, mt: 2, backgroundColor: "grey.50" }}
              >
                <Typography variant="body2" color="text.secondary">
                  제목: {messageToDelete.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  받는사람: {messageToDelete.receiverName}
                </Typography>
              </Paper>

              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 2, fontWeight: 500 }}
              >
                삭제된 쪽지는 복구할 수 없습니다.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteConfirmOpen(false)}
                variant="outlined"
              >
                취소
              </Button>
              <Button
                onClick={handleDeleteMessageExecute}
                variant="contained"
                color="error"
              >
                삭제하기
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 일괄 삭제 확인 다이얼로그 */}
      <Dialog
        open={batchDeleteConfirmOpen}
        onClose={() => setBatchDeleteConfirmOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>선택된 쪽지 삭제 확인</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            선택된 {selectedMessages.length}개의 쪽지를 모두 삭제하시겠습니까?
          </Typography>
          <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
            삭제된 쪽지는 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBatchDeleteConfirmOpen(false)}
            variant="outlined"
          >
            취소
          </Button>
          <Button
            onClick={handleBatchDeleteExecute}
            variant="contained"
            color="error"
          >
            모두 삭제하기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 성공 메시지 스낵바 */}
      {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={handleCloseSuccessAlert}
          sx={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1300,
          }}
        >
          {successMessage}
        </Alert>
      )}
    </Container>
  );
};

export default SentMessages;
