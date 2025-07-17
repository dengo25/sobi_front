"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Checkbox,
  IconButton,
  Chip,
  Pagination,
  Stack,
  Paper,
  ThemeProvider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Close as CloseIcon,
  CheckCircle as ReadIcon,
  Mail as UnreadIcon,
} from "@mui/icons-material";
import {
  sobiTheme,
  MessageContainer,
  MessageHeaderBox,
  MessageTableCard,
  StyledTableContainer,
  StyledTableRow,
  ReadTableRow,
  MessageEmptyState,
  LoadingBox,
  PaginationContainer,
  ActionButton,
} from "../../assets/styles/sobiTheme";

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

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [batchDeleteConfirmOpen, setBatchDeleteConfirmOpen] = useState(false);

  const reduxUserInfo = useSelector((state) => state.member);

  const generateSentMessagesData = (memberId) => {
    const baseDate = new Date();

    if (memberId === "admin") {
      return [
        {
          id: 5001,
          senderMemberId: "admin",
          senderName: "관리자",
          receiverMemberId: "user",
          receiverName: "사용자",
          title: "Re: 서비스 이용 문의드립니다",
          content:
            "안녕하세요! 문의해주신 내용에 대해 답변드립니다.\n\n1. 계정 정보 수정: 마이페이지 > 계정 정보에서 수정 가능합니다.\n2. 비밀번호 변경: 계정 정보 수정 시 함께 변경할 수 있습니다.\n3. 후기 작성: 허위 내용이나 부적절한 내용은 승인되지 않을 수 있습니다.\n\n추가 궁금한 점이 있으시면 언제든 문의해주세요!\n감사합니다.",
          sendDate: new Date(baseDate.getTime() - 1000 * 60 * 20).toISOString(), // 20분 전
          isRead: "Y",
        },
        {
          id: 5002,
          senderMemberId: "admin",
          senderName: "관리자",
          receiverMemberId: "user",
          receiverName: "사용자",
          title: "후기 승인 완료 안내",
          content:
            "안녕하세요!\n\n작성해주신 후기가 승인되었습니다.\n후기 작성해주셔서 감사합니다.\n\n앞으로도 좋은 의견 부탁드립니다! 😊",
          sendDate: new Date(
            baseDate.getTime() - 1000 * 60 * 60 * 3
          ).toISOString(), // 3시간 전
          isRead: "Y",
        },
        {
          id: 5003,
          senderMemberId: "admin",
          senderName: "관리자",
          receiverMemberId: "user",
          receiverName: "사용자",
          title: "서비스 이용 안내",
          content:
            "회원가입을 환영합니다!\n\n저희 서비스를 이용해주셔서 감사합니다.\n궁금한 점이 있으시면 언제든 문의해주세요.\n\n좋은 하루 되세요!",
          sendDate: new Date(
            baseDate.getTime() - 1000 * 60 * 60 * 24 * 2
          ).toISOString(), // 2일 전
          isRead: "Y",
        },
      ];
    } else {
      return [
        {
          id: 6001,
          senderMemberId: "user",
          senderName: "사용자",
          receiverMemberId: "admin",
          receiverName: "관리자",
          title: "서비스 이용 문의드립니다",
          content:
            "안녕하세요 관리자님!\n\n서비스를 이용하면서 몇 가지 궁금한 점이 있어서 문의드립니다.\n\n1. 계정 정보 수정은 어떻게 하나요?\n2. 비밀번호 변경이 가능한가요?\n3. 후기 작성 시 주의사항이 있나요?\n\n바쁘시겠지만 답변 부탁드립니다.\n감사합니다!",
          sendDate: new Date(baseDate.getTime() - 1000 * 60 * 35).toISOString(), // 35분 전
          isRead: "Y",
        },
        {
          id: 6002,
          senderMemberId: "user",
          senderName: "사용자",
          receiverMemberId: "admin",
          receiverName: "관리자",
          title: "후기 승인 관련 문의",
          content:
            "관리자님 안녕하세요.\n\n제가 어제 작성한 후기가 아직 승인 대기 상태인데, 보통 승인까지 얼마나 걸리나요?\n\n급하지는 않지만 궁금해서 문의드립니다.\n\n좋은 하루 되세요!",
          sendDate: new Date(
            baseDate.getTime() - 1000 * 60 * 60 * 2.5
          ).toISOString(), // 2.5시간 전
          isRead: "Y",
        },
      ];
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [reduxUserInfo]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (reduxUserInfo && reduxUserInfo.memberId) {
        const mockMessages = generateSentMessagesData(reduxUserInfo.memberId);

        // 최신순으로 정렬
        const sortedMessages = mockMessages.sort(
          (a, b) => new Date(b.sendDate) - new Date(a.sendDate)
        );

        setMessages(sortedMessages);
        setCurrentPage(1);

        console.log("생성된 보낸 쪽지 데이터:", sortedMessages);
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
      setSelectedMessages((prev) =>
        prev.filter((id) => !currentPageMessages.includes(id))
      );
    } else {
      setSelectedMessages((prev) => [
        ...prev.filter((id) => !currentPageMessages.includes(id)),
        ...currentPageMessages,
      ]);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleDeleteMessageConfirm = (message) => {
    setMessageToDelete(message);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteMessageExecute = async () => {
    if (!messageToDelete) return;

    try {
      // 삭제
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMessages((prev) => {
        const newMessages = prev.filter((msg) => msg.id !== messageToDelete.id);
        const totalPages = Math.ceil(newMessages.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        return newMessages;
      });

      setSelectedMessages((prev) =>
        prev.filter((id) => id !== messageToDelete.id)
      );

      if (selectedMessage && selectedMessage.id === messageToDelete.id) {
        setDialogOpen(false);
        setSelectedMessage(null);
      }

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

  const handleBatchDeleteConfirm = () => {
    setBatchDeleteConfirmOpen(true);
  };

  const handleBatchDeleteExecute = async () => {
    try {
      // 배치 삭제
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessages((prev) => {
        const newMessages = prev.filter(
          (msg) => !selectedMessages.includes(msg.id)
        );
        const totalPages = Math.ceil(newMessages.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        return newMessages;
      });

      setSelectedMessages([]);

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

  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = messages.slice(startIndex, endIndex);

  const currentPageMessageIds = currentMessages.map((msg) => msg.id);
  const isAllCurrentPageSelected =
    currentPageMessageIds.length > 0 &&
    currentPageMessageIds.every((id) => selectedMessages.includes(id));
  const isIndeterminate =
    currentPageMessageIds.some((id) => selectedMessages.includes(id)) &&
    !isAllCurrentPageSelected;

  if (loading) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <LoadingBox>
          <CircularProgress />
        </LoadingBox>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <MessageContainer>
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
        </MessageContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={sobiTheme}>
      <MessageContainer>
        <MessageHeaderBox>
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
            <ActionButton
              onClick={handleBatchDeleteConfirm}
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
            >
              선택 삭제 ({selectedMessages.length})
            </ActionButton>
          )}
        </MessageHeaderBox>

        {messages.length === 0 ? (
          <MessageEmptyState>
            <Typography variant="h1" sx={{ fontSize: 48, mb: 2 }}>
              📤
            </Typography>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              보낸 쪽지가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              새 쪽지를 작성해보세요.
            </Typography>
          </MessageEmptyState>
        ) : (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <MessageTableCard>
              <StyledTableContainer>
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
            </MessageTableCard>

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

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
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
                      {new Date(selectedMessage.sendDate).toLocaleString(
                        "ko-KR"
                      )}
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
                    p: 3,
                    backgroundColor: "grey.50",
                    minHeight: 200,
                    borderRadius: 2,
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

              <DialogActions sx={{ p: 2, gap: 1 }}>
                <ActionButton onClick={handleCloseDialog} variant="outlined">
                  닫기
                </ActionButton>
                <ActionButton
                  onClick={() => handleDeleteMessageConfirm(selectedMessage)}
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  삭제
                </ActionButton>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
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
                  sx={{
                    p: 2,
                    mt: 2,
                    backgroundColor: "grey.50",
                    borderRadius: 1,
                  }}
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
              <DialogActions sx={{ p: 2, gap: 1 }}>
                <ActionButton
                  onClick={() => setDeleteConfirmOpen(false)}
                  variant="outlined"
                >
                  취소
                </ActionButton>
                <ActionButton
                  onClick={handleDeleteMessageExecute}
                  variant="contained"
                  color="error"
                >
                  삭제하기
                </ActionButton>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog
          open={batchDeleteConfirmOpen}
          onClose={() => setBatchDeleteConfirmOpen(false)}
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
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
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <ActionButton
              onClick={() => setBatchDeleteConfirmOpen(false)}
              variant="outlined"
            >
              취소
            </ActionButton>
            <ActionButton
              onClick={handleBatchDeleteExecute}
              variant="contained"
              color="error"
            >
              모두 삭제하기
            </ActionButton>
          </DialogActions>
        </Dialog>

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
              borderRadius: 2,
            }}
          >
            {successMessage}
          </Alert>
        )}
      </MessageContainer>
    </ThemeProvider>
  );
};

export default SentMessages;
