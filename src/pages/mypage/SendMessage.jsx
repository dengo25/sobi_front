"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { sendMessage } from "../../service/member/ApiService";

const sobiTheme = createTheme({
  palette: {
    primary: {
      main: "#44C3AA",
      light: "#6FD4BB",
      dark: "#045242",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#045242",
      light: "#44C3AA",
      dark: "#033A30",
      contrastText: "#ffffff",
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginTop: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  borderRadius: theme.spacing(1.5),
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  marginTop: theme.spacing(3),
  boxShadow: "0 4px 12px rgba(68,195,170,0.3)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: 120,
}));

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

              {/* 성공 알림
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )} */}

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

        {/* 안내 메시지
        <InfoCard>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={600}>
                쪽지 전송 안내
              </Typography>
            </Box>
            <List dense>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <Typography variant="body2">•</Typography>
                </ListItemIcon>
                <ListItemText
                  primary="받는 사람의 아이디를 정확히 입력해주세요."
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <Typography variant="body2">•</Typography>
                </ListItemIcon>
                <ListItemText
                  primary="자기 자신에게도 쪽지를 보낼 수 있습니다. (메모 기능)"
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <Typography variant="body2">•</Typography>
                </ListItemIcon>
                <ListItemText
                  primary="제목은 최대 100자까지 입력 가능합니다."
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <Typography variant="body2">•</Typography>
                </ListItemIcon>
                <ListItemText
                  primary="전송된 쪽지는 수정할 수 없으니 신중히 작성해주세요."
                  primaryTypographyProps={{ variant: "body2" }}
                />
              </ListItem>
            </List>
          </CardContent>
        </InfoCard> */}
      </Container>
    </ThemeProvider>
  );
};

export default SendMessage;
