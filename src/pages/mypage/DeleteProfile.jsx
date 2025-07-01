import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { deleteMypage, signout } from "../../service/member/ApiService";

const DeleteAccountDialog = ({ open, onClose, onDelete }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 다이얼로그가 닫힐 때 상태 초기화
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

      // 응답이 성공적이고 error가 없으면 탈퇴 성공
      if (response && !response.error) {
        // 로그아웃 처리 (토큰 제거)
        signout();
        // 부모 컴포넌트에 성공 알림 (실제로는 로그인 페이지로 이동됨)
        onDelete();
      } else {
        // 서버에서 에러 메시지가 온 경우
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>회원 탈퇴</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <Alert severity="warning">
              <Typography variant="body2" fontWeight="bold">
                주의사항
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • 회원 탈퇴 시 모든 개인정보가 삭제됩니다.
                <br />
                • 작성한 게시글과 댓글은 유지될 수 있습니다.
                <br />
                • 탈퇴 후에는 같은 아이디로 재가입이 불가능할 수 있습니다.
                <br />• 이 작업은 되돌릴 수 없습니다.
              </Typography>
            </Alert>

            <Typography
              variant="body1"
              color="error"
              fontWeight="bold"
              textAlign="center"
            >
              탈퇴하려면 현재 비밀번호를 입력해주세요.
            </Typography>

            <TextField
              label="현재 비밀번호"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              fullWidth
              disabled={loading}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "탈퇴 처리 중..." : "탈퇴하기"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DeleteAccountDialog;
