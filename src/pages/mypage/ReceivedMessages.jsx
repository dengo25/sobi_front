import React, { useState, useEffect } from "react";
import { CircularProgress, Tooltip } from "@mui/material";
import {
  getReceivedMessages,
  markMessageAsRead,
  deleteMessageByReceiver,
} from "../../service/member/ApiService";
import CustomButton from "../../components/input/CustomButton";
import CustomCheckbox from "../../components/input/CustomCheckbox";
import CustomAlert from "../../components/input/CustomAlert";
import CustomTypography from "../../components/input/CustomTypography";
import CustomLayout from "../../components/input/CustomLayout";
import CustomTable from "../../components/input/CustomTable";
import CustomDialog from "../../components/input/CustomDialog";

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
    setSelectedMessage(message.originalData);
    setDialogOpen(true);

    // 읽지 않은 쪽지인 경우 읽음 처리
    if (message.originalData.isRead === "N") {
      try {
        await markMessageAsRead(message.originalData.id);
        // 로컬 상태 업데이트
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.originalData.id ? { ...msg, isRead: "Y" } : msg
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
    setMessageToDelete(message.originalData || message);
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

  // 스타일 정의
  const loadingContainerSx = {
    height: "200px",
  };

  const errorContainerSx = {
    p: 2,
  };

  const containerSx = {
    p: 2,
  };

  const headerSx = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  };

  const titleSx = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#333",
  };

  const statusIconSx = {
    fontSize: 18,
  };

  const unreadIconSx = {
    ...statusIconSx,
    color: "#1976d2",
  };

  const readIconSx = {
    ...statusIconSx,
    color: "#666",
  };

  const deleteButtonSx = {
    minWidth: "auto",
    fontSize: "12px",
    p: 0.5,
  };

  const dialogTitleSx = {
    fontSize: "18px",
    fontWeight: 600,
    mb: 1,
  };

  const senderInfoSx = {
    fontSize: "14px",
    color: "#666",
    mb: 0.5,
  };

  const dateInfoSx = {
    fontSize: "14px",
    color: "#666",
  };

  const contentContainerSx = {
    minHeight: "200px",
    p: 2,
    backgroundColor: "#fafafa",
    borderRadius: 1,
    border: "1px solid #e0e0e0",
  };

  const contentTextSx = {
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
    fontSize: "14px",
  };

  const deleteInfoContainerSx = {
    p: 2,
    backgroundColor: "#f5f5f5",
    borderRadius: 1,
    border: "1px solid #e0e0e0",
    mb: 2,
  };

  const warningTextSx = {
    fontWeight: 500,
    color: "#dc2626",
  };

  // 테이블용 데이터 변환
  const transformedMessages = messages.map((message) => ({
    id: message.id,
    checkboxComponent: (
      <CustomCheckbox
        checked={selectedMessages.includes(message.id)}
        onChange={() => handleSelectMessage(message.id)}
        size="small"
        color="success"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    statusIcon: (
      <Tooltip title={message.isRead === "N" ? "읽지 않음" : "읽음"}>
        <CustomTypography
          sx={message.isRead === "N" ? unreadIconSx : readIconSx}
        >
          {message.isRead === "N" ? "✉️" : "💌"}
        </CustomTypography>
      </Tooltip>
    ),
    name: message.senderName,
    title: message.title,
    date: formatDate(message.sendDate),
    deleteButton: (
      <CustomButton
        text="삭제"
        size="small"
        variant="text"
        color="danger"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteMessageConfirm(message);
        }}
        sx={deleteButtonSx}
      />
    ),
    isRead: message.isRead,
    originalData: message,
  }));

  if (loading) {
    return (
      <CustomLayout.Center sx={loadingContainerSx}>
        <CircularProgress size={32} />
      </CustomLayout.Center>
    );
  }

  if (error) {
    return (
      <CustomLayout sx={errorContainerSx}>
        <CustomAlert.Error
          message={error}
          action={
            <CustomButton
              text="다시 시도"
              onClick={fetchMessages}
              size="small"
              variant="outlined"
              color="error"
            />
          }
        />
      </CustomLayout>
    );
  }

  return (
    <CustomLayout sx={containerSx}>
      {/* 헤더 영역 */}
      <CustomLayout sx={headerSx}>
        <CustomTypography sx={titleSx}>
          받은 쪽지 ({messages.length})
        </CustomTypography>

        {selectedMessages.length > 0 && (
          <CustomButton
            text={`선택 삭제 (${selectedMessages.length})`}
            onClick={handleBatchDeleteConfirm}
            variant="outlined"
            color="danger"
            size="small"
          />
        )}
      </CustomLayout>

      {/* 테이블 */}
      <CustomTable.Message
        messages={transformedMessages}
        onMessageClick={handleMessageClick}
        emptyIcon="📧"
        emptyMessage="받은 쪽지가 없습니다."
      />

      {/* 쪽지 상세 다이얼로그 */}
      <CustomDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        title={
          selectedMessage && (
            <CustomLayout>
              <CustomTypography sx={dialogTitleSx}>
                {selectedMessage.title}
              </CustomTypography>
              <CustomLayout.Stack spacing={0.5}>
                <CustomTypography sx={senderInfoSx}>
                  보낸사람: {selectedMessage.senderName} (
                  {selectedMessage.senderMemberId})
                </CustomTypography>
                <CustomTypography sx={dateInfoSx}>
                  받은시간:{" "}
                  {new Date(selectedMessage.sendDate).toLocaleString("ko-KR")}
                </CustomTypography>
              </CustomLayout.Stack>
            </CustomLayout>
          )
        }
        showCloseButton={true}
        actions={
          <CustomLayout.Row spacing={1}>
            <CustomButton
              text="닫기"
              onClick={handleCloseDialog}
              variant="outlined"
              color="default"
              size="medium"
            />
            <CustomButton
              text="삭제"
              onClick={() => handleDeleteMessageConfirm(selectedMessage)}
              variant="outlined"
              color="danger"
              size="medium"
            />
          </CustomLayout.Row>
        }
      >
        {selectedMessage && (
          <CustomLayout sx={contentContainerSx}>
            <CustomTypography sx={contentTextSx}>
              {selectedMessage.content}
            </CustomTypography>
          </CustomLayout>
        )}
      </CustomDialog>

      {/* 개별 쪽지 삭제 확인 다이얼로그 */}
      <CustomDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="쪽지 삭제 확인"
        maxWidth="sm"
        actions={
          <CustomLayout.Row spacing={1}>
            <CustomButton
              text="취소"
              onClick={() => setDeleteConfirmOpen(false)}
              variant="outlined"
              color="default"
            />
            <CustomButton
              text="삭제하기"
              onClick={handleDeleteMessageExecute}
              variant="contained"
              color="danger"
            />
          </CustomLayout.Row>
        }
      >
        <CustomLayout.Stack spacing={2}>
          <CustomTypography>정말 이 쪽지를 삭제하시겠습니까?</CustomTypography>
          {messageToDelete && (
            <CustomLayout sx={deleteInfoContainerSx}>
              <CustomTypography preset="bodySecondary">
                제목: {messageToDelete.title}
              </CustomTypography>
              <CustomTypography preset="bodySecondary">
                보낸사람: {messageToDelete.senderName}
              </CustomTypography>
            </CustomLayout>
          )}
          <CustomTypography sx={warningTextSx}>
            삭제된 쪽지는 복구할 수 없습니다.
          </CustomTypography>
        </CustomLayout.Stack>
      </CustomDialog>

      {/* 일괄 삭제 확인 다이얼로그 */}
      <CustomDialog
        open={batchDeleteConfirmOpen}
        onClose={() => setBatchDeleteConfirmOpen(false)}
        title="선택된 쪽지 삭제 확인"
        maxWidth="sm"
        actions={
          <CustomLayout.Row spacing={1}>
            <CustomButton
              text="취소"
              onClick={() => setBatchDeleteConfirmOpen(false)}
              variant="outlined"
              color="default"
            />
            <CustomButton
              text="모두 삭제하기"
              onClick={handleBatchDeleteExecute}
              variant="contained"
              color="danger"
            />
          </CustomLayout.Row>
        }
      >
        <CustomLayout.Stack spacing={2}>
          <CustomTypography>
            선택된 {selectedMessages.length}개의 쪽지를 모두 삭제하시겠습니까?
          </CustomTypography>
          <CustomTypography sx={warningTextSx}>
            삭제된 쪽지는 복구할 수 없습니다.
          </CustomTypography>
        </CustomLayout.Stack>
      </CustomDialog>

      {/* 성공 메시지 토스트 */}
      <CustomAlert.SuccessToast
        open={showSuccessAlert}
        onClose={handleCloseSuccessAlert}
        message={successMessage}
      />
    </CustomLayout>
  );
};

export default ReceivedMessages;
