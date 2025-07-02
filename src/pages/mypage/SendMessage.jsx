import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
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

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, backgroundColor: "#fafafa", borderRadius: 2 }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ mb: 2, color: "#333", fontSize: "16px", fontWeight: "600" }}
      >
        새 쪽지 보내기
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 1,
                fontSize: "14px",
                py: 0.5,
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                borderRadius: 1,
                fontSize: "14px",
                py: 0.5,
              }}
            >
              {success}
            </Alert>
          )}

          {/* 받는 사람과 제목을 한 줄에 배치 */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5, fontSize: "14px", fontWeight: "500" }}
              >
                받는 사람 *
              </Typography>
              <TextField
                name="receiverMemberId"
                value={formData.receiverMemberId}
                onChange={handleChange}
                required
                fullWidth
                disabled={loading}
                variant="outlined"
                placeholder="받는 사람 아이디"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    border: "1px solid rgb(255, 255, 255)",
                    backgroundColor: "white",
                    fontSize: "14px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              />
            </Box>

            <Box sx={{ flex: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5, fontSize: "14px", fontWeight: "500" }}
              >
                제목 * ({formData.title.length}/100)
              </Typography>
              <TextField
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
                disabled={loading}
                variant="outlined"
                placeholder="쪽지 제목"
                size="small"
                inputProps={{ maxLength: 100 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    border: "1px solid rgb(255, 255, 255)",
                    backgroundColor: "white",
                    fontSize: "14px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5, fontSize: "14px", fontWeight: "500" }}
            >
              내용 *
            </Typography>
            <TextField
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              disabled={loading}
              variant="outlined"
              placeholder="쪽지 내용을 입력하세요"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  backgroundColor: "white",
                  fontSize: "14px",
                },
              }}
              helperText="전달하고 싶은 메시지를 작성해주세요."
            />
          </Box>

          {/* 버튼 영역 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              mt: 1,
              pt: 1.5,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Button
              type="button"
              onClick={handleReset}
              disabled={loading}
              size="small"
              sx={{
                borderRadius: 1,
                px: 2,
                py: 0.5,
                color: "#666",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            >
              초기화
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                loading ||
                !formData.receiverMemberId ||
                !formData.title ||
                !formData.content
              }
              size="small"
              sx={{
                borderRadius: 1,
                px: 2,
                py: 0.5,
                fontSize: "14px",
                backgroundColor: "#4ecdc4",
                "&:hover": {
                  backgroundColor: "#26b5a8",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
              startIcon={
                loading ? <CircularProgress size={16} color="inherit" /> : null
              }
            >
              {loading ? "전송 중..." : "쪽지 보내기"}
            </Button>
          </Box>
        </Box>
      </form>

      {/* 안내 메시지 */}
      <Box sx={{ mt: 2, p: 1.5, backgroundColor: "#f0f8ff", borderRadius: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "13px", fontWeight: "600" }}
        >
          📌 쪽지 전송 안내
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "12px", mt: 0.5 }}
        >
          • 받는 사람의 아이디를 정확히 입력해주세요.
          <br />
          • 자기 자신에게도 쪽지를 보낼 수 있습니다. (메모 기능)
          <br />
          • 제목은 최대 100자까지 입력 가능합니다.
          <br />• 전송된 쪽지는 수정할 수 없으니 신중히 작성해주세요.
        </Typography>
      </Box>
    </Paper>
  );
};

export default SendMessage;
