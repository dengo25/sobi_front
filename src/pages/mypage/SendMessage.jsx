"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Alert,
  Grid,
  CircularProgress,
  CardContent,
  Container,
  ThemeProvider,
} from "@mui/material";
import { Send as SendIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import {
  sobiTheme,
  StyledCard,
  StyledButton,
} from "../../assets/styles/sobiTheme";

const SendMessage = ({ onMessageSent }) => {
  const [formData, setFormData] = useState({
    receiverMemberId: "",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reduxUserInfo = useSelector((state) => state.member);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    // 유효한 사용자 아이디 체크 (admin, user만 허용)
    const validUsers = ["admin", "user"];
    if (!validUsers.includes(formData.receiverMemberId.trim())) {
      setError("존재하지 않는 사용자입니다. (admin 또는 user만 가능)");
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
      await new Promise((resolve) => setTimeout(resolve, 500));

      const messageDTO = {
        id: Date.now(),
        senderMemberId: reduxUserInfo.memberId,
        senderName: reduxUserInfo.memberName,
        receiverMemberId: formData.receiverMemberId.trim(),
        receiverName:
          formData.receiverMemberId.trim() === "admin" ? "관리자" : "사용자",
        title: formData.title.trim(),
        content: formData.content.trim(),
        sendDate: new Date().toISOString(),
        isRead: "N",
      };
      setSuccess("쪽지가 성공적으로 전송되었습니다!");

      setFormData({
        receiverMemberId: "",
        title: "",
        content: "",
      });

      if (onMessageSent) {
        onMessageSent(messageDTO);
      }

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("쪽지 전송 오류:", err);
      setError("쪽지 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
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

  const isFormValid =
    formData.receiverMemberId && formData.title && formData.content;

  return (
    <ThemeProvider theme={sobiTheme}>
      <Container maxWidth="md" sx={{ p: 2 }}>
        <StyledCard>
          <CardContent>
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              fontWeight={600}
            >
              새 쪽지 보내기
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              {/* 에러 알림 */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* 성공 알림 */}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              {/* 받는 사람과 제목 */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="받는 사람"
                    name="receiverMemberId"
                    value={formData.receiverMemberId}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="받는 사람 아이디"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label={`제목 (${formData.title.length}/100)`}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="쪽지 제목"
                    inputProps={{ maxLength: 100 }}
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* 내용 */}
              <TextField
                fullWidth
                label="내용"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="쪽지 내용을 입력하세요"
                multiline
                rows={4}
                helperText="전달하고 싶은 메시지를 작성해주세요."
                sx={{ mb: 3 }}
              />

              {/* 버튼 영역 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  pt: 3,
                  borderTop: 1,
                  borderColor: "divider",
                  mt: 2,
                }}
              >
                <StyledButton
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                >
                  초기화
                </StyledButton>
                <StyledButton
                  type="submit"
                  disabled={loading || !isFormValid}
                  variant="contained"
                  startIcon={
                    loading ? <CircularProgress size={16} /> : <SendIcon />
                  }
                >
                  {loading ? "전송 중..." : "쪽지 보내기"}
                </StyledButton>
              </Box>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </ThemeProvider>
  );
};

export default SendMessage;
