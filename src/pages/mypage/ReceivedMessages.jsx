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
  TextField,
  Pagination,
  Stack,
  Paper,
  ThemeProvider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Close as CloseIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
  MarkEmailRead as ReadIcon,
  MarkEmailUnread as UnreadIcon,
  DoneAll as BatchReadIcon,
} from "@mui/icons-material";
import {
  sobiTheme,
  MessageContainer,
  MessageHeaderBox,
  MessageTableCard,
  StyledTableContainer,
  StyledTableRow,
  UnreadTableRow,
  MessageEmptyState,
  LoadingBox,
  PaginationContainer,
  ActionButton,
} from "../../assets/styles/sobiTheme";

const ReceivedMessages = ({ onMessageAction }) => {
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
  const [batchReadConfirmOpen, setBatchReadConfirmOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const reduxUserInfo = useSelector((state) => state.member);

  const generateReceivedMessagesData = (memberId) => {
    const baseDate = new Date();

    if (memberId === "admin") {
      return [
        {
          id: 3001,
          senderMemberId: "user",
          senderName: "사용자",
          receiverMemberId: "admin",
          receiverName: "관리자",
          title: "서비스 이용 문의드립니다",
          content:
            "안녕하세요 관리자님!\n\n서비스를 이용하면서 몇 가지 궁금한 점이 있어서 문의드립니다.\n\n1. 계정 정보 수정은 어떻게 하나요?\n2. 비밀번호 변경이 가능한가요?\n3. 후기 작성 시 주의사항이 있나요?\n\n바쁘시겠지만 답변 부탁드립니다.\n감사합니다!",
          sendDate: new Date(baseDate.getTime() - 1000 * 60 * 30).toISOString(), // 30분 전
          isRead: "N",
        },
        {
          id: 3002,
          senderMemberId: "user",
          senderName: "사용자",
          receiverMemberId: "admin",
          receiverName: "관리자",
          title: "후기 승인 관련 문의",
          content:
            "관리자님 안녕하세요.\n\n제가 어제 작성한 후기가 아직 승인 대기 상태인데, 보통 승인까지 얼마나 걸리나요?\n\n급하지는 않지만 궁금해서 문의드립니다.\n\n좋은 하루 되세요!",
          sendDate: new Date(
            baseDate.getTime() - 1000 * 60 * 60 * 2
          ).toISOString(), // 2시간 전
          isRead: "Y",
        },
        {
          id: 3003,
          senderMemberId: "user",
          senderName: "사용자",
          receiverMemberId: "admin",
          receiverName: "관리자",
          title: "감사 인사",
          content:
            "관리자님께\n\n항상 좋은 서비스 제공해주셔서 감사합니다.\n덕분에 편리하게 이용하고 있어요.\n\n앞으로도 잘 부탁드립니다! 😊",
          sendDate: new Date(
            baseDate.getTime() - 1000 * 60 * 60 * 24
          ).toISOString(), // 1일 전
          isRead: "Y",
        },
      ];
    } else {
      return [
        {
          id: 4001,
          senderMemberId: "admin",
          senderName: "관리자",
          receiverMemberId: "user",
          receiverName: "사용자",
          title: "Re: 서비스 이용 문의드립니다",
          content:
            "안녕하세요! 문의해주신 내용에 대해 답변드립니다.\n\n1. 계정 정보 수정: 마이페이지 > 계정 정보에서 수정 가능합니다.\n2. 비밀번호 변경: 계정 정보 수정 시 함께 변경할 수 있습니다.\n3. 후기 작성: 허위 내용이나 부적절한 내용은 승인되지 않을 수 있습니다.\n\n추가 궁금한 점이 있으시면 언제든 문의해주세요!\n감사합니다.",
          sendDate: new Date(baseDate.getTime() - 1000 * 60 * 15).toISOString(), // 15분 전
          isRead: "N",
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
        const mockMessages = generateReceivedMessagesData(
          reduxUserInfo.memberId
        );

        const sortedMessages = mockMessages.sort(
          (a, b) => new Date(b.sendDate) - new Date(a.sendDate)
        );

        setMessages(sortedMessages);
        setCurrentPage(1);

        console.log("생성된 받은 쪽지 데이터:", sortedMessages);
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

    if (message.isRead === "N") {
      // 읽음 처리
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, isRead: "Y" } : msg
        )
      );
      setSelectedMessage((prev) => ({ ...prev, isRead: "Y" }));

      if (onMessageAction) {
        onMessageAction();
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

      if (onMessageAction) {
        onMessageAction();
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

      if (onMessageAction) {
        onMessageAction();
      }

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

  const handleBatchReadConfirm = () => {
    setBatchReadConfirmOpen(true);
  };

  const handleBatchReadExecute = async () => {
    try {
      const unreadSelectedMessages = selectedMessages.filter((messageId) => {
        const message = messages.find((msg) => msg.id === messageId);
        return message && message.isRead === "N";
      });

      if (unreadSelectedMessages.length === 0) {
        setSuccessMessage("선택된 쪽지는 모두 이미 읽음 처리되었습니다.");
        setShowSuccessAlert(true);
        setBatchReadConfirmOpen(false);
        return;
      }

      // 배치 읽음 처리
      await new Promise((resolve) => setTimeout(resolve, 800));

      setMessages((prev) =>
        prev.map((msg) =>
          unreadSelectedMessages.includes(msg.id)
            ? { ...msg, isRead: "Y" }
            : msg
        )
      );

      setSelectedMessages([]);

      if (onMessageAction) {
        onMessageAction();
      }

      setSuccessMessage(
        `${unreadSelectedMessages.length}개의 쪽지가 읽음 처리되었습니다.`
      );
      setShowSuccessAlert(true);
    } catch (err) {
      console.error("선택 쪽지 읽음 처리 오류:", err);
      setError("쪽지 읽음 처리 중 오류가 발생했습니다.");
    } finally {
      setBatchReadConfirmOpen(false);
    }
  };

  const handleReplyOpen = () => {
    setReplyContent("");
    setReplyDialogOpen(true);
  };

  const handleReplySend = async () => {
    if (!replyContent.trim() || !selectedMessage) return;

    setReplyLoading(true);
    try {
      // 답장 전송
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const replyData = {
        id: Date.now(),
        senderMemberId: reduxUserInfo.memberId,
        senderName: reduxUserInfo.memberName,
        receiverMemberId: selectedMessage.senderMemberId,
        receiverName: selectedMessage.senderName,
        title: `Re: ${selectedMessage.title}`,
        content: replyContent.trim(),
        sendDate: new Date().toISOString(),
        isRead: "N",
      };

      setReplyDialogOpen(false);
      setReplyContent("");
      setSuccessMessage("답장이 성공적으로 전송되었습니다!");
      setShowSuccessAlert(true);
    } catch (err) {
      console.error("답장 전송 오류:", err);
      setError("답장 전송 중 오류가 발생했습니다.");
    } finally {
      setReplyLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

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
      return <ReadIcon color="primary" titleAccess="읽음" />;
    } else {
      return <UnreadIcon color="error" titleAccess="읽지 않음" />;
    }
  };

  const unreadCount = messages.filter((msg) => msg.isRead === "N").length;

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

  const selectedUnreadCount = selectedMessages.filter((messageId) => {
    const message = messages.find((msg) => msg.id === messageId);
    return message && message.isRead === "N";
  }).length;

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
              받은 쪽지 ({messages.length})
            </Typography>
            {unreadCount > 0 && (
              <Typography variant="body2" color="error" fontWeight={500}>
                읽지 않은 쪽지 {unreadCount}개
              </Typography>
            )}
            {messages.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                페이지 {currentPage} / {totalPages}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* 전체 읽지 않은 메시지 읽음 처리 버튼 */}
            {unreadCount > 0 && selectedMessages.length === 0 && (
              <ActionButton
                onClick={() => {
                  const unreadMessageIds = messages
                    .filter((msg) => msg.isRead === "N")
                    .map((msg) => msg.id);
                  setSelectedMessages(unreadMessageIds);
                  handleBatchReadConfirm();
                }}
                variant="contained"
                color="primary"
                size="small"
                startIcon={<BatchReadIcon />}
              >
                모두 읽음 처리 ({unreadCount})
              </ActionButton>
            )}

            {/* 선택된 메시지 관련 버튼들 */}
            {selectedMessages.length > 0 && (
              <>
                {selectedUnreadCount > 0 && (
                  <ActionButton
                    onClick={handleBatchReadConfirm}
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<BatchReadIcon />}
                  >
                    읽음 처리 ({selectedUnreadCount})
                  </ActionButton>
                )}
                <ActionButton
                  onClick={handleBatchDeleteConfirm}
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                >
                  선택 삭제 ({selectedMessages.length})
                </ActionButton>
              </>
            )}
          </Box>
        </MessageHeaderBox>

        {messages.length === 0 ? (
          <MessageEmptyState>
            <Typography variant="h1" sx={{ fontSize: 48, mb: 2 }}>
              📬
            </Typography>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              받은 쪽지가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              새로운 쪽지가 도착하면 여기에 표시됩니다.
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
                      <TableCell align="center">상태</TableCell>
                      <TableCell>보낸사람</TableCell>
                      <TableCell>제목</TableCell>
                      <TableCell align="center">받은시간</TableCell>
                      <TableCell align="center">삭제</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentMessages.map((message) => {
                      const RowComponent =
                        message.isRead === "N"
                          ? UnreadTableRow
                          : StyledTableRow;
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
                              fontWeight: message.isRead === "N" ? 600 : 400,
                              color:
                                message.isRead === "N"
                                  ? "text.primary"
                                  : "text.secondary",
                            }}
                          >
                            {message.senderName}
                          </TableCell>
                          <TableCell
                            onClick={() => handleMessageClick(message)}
                            sx={{
                              maxWidth: 300,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontWeight: message.isRead === "N" ? 600 : 400,
                              color:
                                message.isRead === "N"
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
                      보낸사람: {selectedMessage.senderName} (
                      {selectedMessage.senderMemberId})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      받은시간:{" "}
                      {selectedMessage.sendDate
                        ? new Date(selectedMessage.sendDate).toLocaleString(
                            "ko-KR"
                          )
                        : "-"}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={
                          selectedMessage.isRead === "Y" ? "읽음" : "읽지 않음"
                        }
                        color={
                          selectedMessage.isRead === "Y" ? "primary" : "error"
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
                  onClick={handleReplyOpen}
                  variant="contained"
                  startIcon={<ReplyIcon />}
                >
                  답장
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
          open={replyDialogOpen}
          onClose={() => setReplyDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle>
            답장 보내기
            {selectedMessage && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                받는사람: {selectedMessage.senderName} (
                {selectedMessage.senderMemberId})
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="답장 내용"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답장 내용을 입력하세요..."
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <ActionButton
              onClick={() => setReplyDialogOpen(false)}
              variant="outlined"
            >
              취소
            </ActionButton>
            <ActionButton
              onClick={handleReplySend}
              disabled={!replyContent.trim() || replyLoading}
              variant="contained"
              startIcon={
                replyLoading ? <CircularProgress size={16} /> : <SendIcon />
              }
            >
              {replyLoading ? "전송 중..." : "답장 보내기"}
            </ActionButton>
          </DialogActions>
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
                    보낸사람: {messageToDelete.senderName}
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

        <Dialog
          open={batchReadConfirmOpen}
          onClose={() => setBatchReadConfirmOpen(false)}
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle>선택된 쪽지 읽음 처리 확인</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              선택된 쪽지 중 읽지 않은 {selectedUnreadCount}개의 쪽지를 모두
              읽음 처리하시겠습니까?
            </Typography>
            {selectedUnreadCount === 0 && (
              <Typography variant="body2" color="text.secondary">
                선택된 쪽지는 모두 이미 읽음 처리되었습니다.
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <ActionButton
              onClick={() => setBatchReadConfirmOpen(false)}
              variant="outlined"
            >
              취소
            </ActionButton>
            <ActionButton
              onClick={handleBatchReadExecute}
              variant="contained"
              color="primary"
              disabled={selectedUnreadCount === 0}
            >
              읽음 처리하기
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

export default ReceivedMessages;
