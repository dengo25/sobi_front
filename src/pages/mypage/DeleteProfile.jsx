"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  IconButton,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  ErrorOutline as ErrorOutlineIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
import { deleteMypage, signout } from "../../service/member/ApiService";
import {
  sobiTheme,
  StyledDialog,
  HeaderSection,
  CloseButton,
  ContentSection,
  DangerZone,
  InputContainer,
  ActionButtons,
} from "../../assets/styles/sobiTheme";

const DeleteProfile = ({ open, onClose, onDelete }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError("");
    }
  }, [open]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("현재 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await deleteMypage(password);

      if (response && !response.error) {
        signout();
        onDelete();
      } else {
        setError(response.error || "회원 탈퇴 처리 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("회원 탈퇴 오류:", err);
      setError("비밀번호가 일치하지 않거나 탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={sobiTheme}>
      <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        {/* 헤더 */}
        <HeaderSection>
          <CloseButton onClick={onClose} disabled={loading}>
            <CloseIcon />
          </CloseButton>

          <ErrorOutlineIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            계정 삭제
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            이 작업은 되돌릴 수 없습니다
          </Typography>
        </HeaderSection>

        {/* 컨텐츠 */}
        <ContentSection>
          {/* 에러 알림 */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 1.5,
                border: "1px solid #ffcdd2",
              }}
            >
              {error}
            </Alert>
          )}

          {/* 위험 구역 */}
          <DangerZone>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ShieldIcon sx={{ color: "#d32f2f", mr: 1.5, fontSize: 24 }} />
              <Typography variant="h6" fontWeight={700} color="error.main">
                위험 구역
              </Typography>
            </Box>
            <Typography variant="body2" color="error.dark" fontWeight={500}>
              계정을 영구적으로 삭제하려면 현재 비밀번호를 입력하세요.
            </Typography>
          </DangerZone>

          {/* 비밀번호 입력 */}
          <InputContainer>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <SecurityIcon
                sx={{ color: "primary.main", mr: 1.5, fontSize: 20 }}
              />
              <Typography variant="subtitle2" fontWeight={600}>
                본인 확인
              </Typography>
            </Box>

            <TextField
              fullWidth
              type="password"
              label="현재 비밀번호"
              value={password}
              onChange={handlePasswordChange}
              required
              disabled={loading}
              autoFocus
              error={!!error && !password}
              placeholder="계정 비밀번호를 입력하세요"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: 1,
                },
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              보안을 위해 현재 비밀번호 확인이 필요합니다
            </Typography>
          </InputContainer>

          {/* 액션 버튼들 */}
          <ActionButtons>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outlined"
              size="large"
              fullWidth
              sx={{
                borderColor: "grey.300",
                color: "grey.700",
                "&:hover": {
                  borderColor: "grey.400",
                  backgroundColor: "grey.50",
                },
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !password.trim()}
              variant="contained"
              color="error"
              size="large"
              fullWidth
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <DeleteIcon />
                )
              }
              sx={{
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(244, 67, 54, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(244, 67, 54, 0.4)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  boxShadow: "none",
                  transform: "none",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {loading ? "삭제 중..." : "계정 삭제"}
            </Button>
          </ActionButtons>
        </ContentSection>
      </StyledDialog>
    </ThemeProvider>
  );
};

export default DeleteProfile;
