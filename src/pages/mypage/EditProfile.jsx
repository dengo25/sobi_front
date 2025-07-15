"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Avatar,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon, Save as SaveIcon } from "@mui/icons-material";
import { updateMypage } from "../../service/member/ApiService";
import {
  sobiTheme,
  StyledDialog,
  HeaderBox,
  CloseButton,
  StyledAvatar,
  ContentBox,
  ActionsBox,
} from "../../assets/styles/sobiTheme";

const EditProfile = ({ open, onClose, userInfo, onUpdate }) => {
  const [formData, setFormData] = useState({
    memberName: "",
    memberEmail: "",
    memberGender: "",
    memberBirth: "",
    memberAddr: "",
    memberZip: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // userInfo가 변경될 때마다 폼 데이터 초기화
  useEffect(() => {
    if (userInfo) {
      setFormData({
        memberName: userInfo.memberName || "",
        memberEmail: userInfo.memberEmail || "",
        memberGender: userInfo.memberGender || "",
        memberBirth: userInfo.memberBirth || "",
        memberAddr: userInfo.memberAddr || "",
        memberZip: userInfo.memberZip || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [userInfo]);

  // 다이얼로그가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setError("");
      if (userInfo) {
        setFormData({
          memberName: userInfo.memberName || "",
          memberEmail: userInfo.memberEmail || "",
          memberGender: userInfo.memberGender || "",
          memberBirth: userInfo.memberBirth || "",
          memberAddr: userInfo.memberAddr || "",
          memberZip: userInfo.memberZip || "",
          password: "",
          confirmPassword: "",
        });
      }
    }
  }, [open, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 메시지 초기화
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.memberName.trim()) {
      setError("이름을 입력해주세요.");
      return false;
    }

    if (!formData.memberEmail.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.memberEmail)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return false;
    }

    // 생년월일 형식 검증
    if (formData.memberBirth && !/^\d{6}$/.test(formData.memberBirth)) {
      setError("생년월일은 6자리 숫자(YYMMDD)로 입력해주세요.");
      return false;
    }

    // 우편번호 형식 검증 (5자리 숫자)
    if (formData.memberZip && !/^\d{5}$/.test(formData.memberZip)) {
      setError("우편번호는 5자리 숫자로 입력해주세요.");
      return false;
    }

    // 비밀번호가 입력된 경우에만 검증
    if (formData.password) {
      if (formData.password.length < 4) {
        setError("비밀번호는 4자 이상이어야 합니다.");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
        return false;
      }
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

    try {
      // 수정할 데이터 준비
      const updateData = {
        memberName: formData.memberName,
        memberEmail: formData.memberEmail,
        memberGender: formData.memberGender,
        memberBirth: formData.memberBirth,
        memberAddr: formData.memberAddr,
        memberZip: formData.memberZip,
      };

      // 비밀번호가 입력된 경우에만 포함
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await updateMypage(updateData);

      if (response) {
        // 부모 컴포넌트에 업데이트된 정보 전달 및 성공 메시지 표시
        onUpdate(response, "회원정보가 성공적으로 수정되었습니다!");

        // 바로 다이얼로그 닫기
        onClose();
      }
    } catch (err) {
      console.error("회원정보 수정 오류:", err);
      setError("회원정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const isPasswordMismatch =
    formData.password !== formData.confirmPassword &&
    formData.confirmPassword !== "";

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* 헤더 */}
      <HeaderBox>
        <CloseButton onClick={onClose} disabled={loading}>
          <CloseIcon />
        </CloseButton>

        <StyledAvatar>
          {userInfo?.memberName?.charAt(0).toUpperCase() || "U"}
        </StyledAvatar>

        <Typography variant="h6" component="h2" fontWeight={600} gutterBottom>
          회원정보 수정
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userInfo?.memberName || "사용자"}#{userInfo?.id || "N/A"}
        </Typography>
      </HeaderBox>

      {/* 컨텐츠 */}
      <ContentBox>
        <Box component="form" onSubmit={handleSubmit}>
          {/* 에러 알림 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            {/* 사용자 ID (읽기 전용) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="사용자 ID"
                value={userInfo?.memberId || ""}
                disabled
                helperText="사용자 ID는 변경할 수 없습니다."
                size="small"
              />
            </Grid>

            {/* 이름과 이메일 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="이름"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                required
                disabled={loading}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="이메일"
                name="memberEmail"
                value={formData.memberEmail}
                onChange={handleChange}
                required
                disabled={loading}
                size="small"
              />
            </Grid>

            {/* 성별과 생년월일 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" disabled={loading}>
                <InputLabel>성별</InputLabel>
                <Select
                  name="memberGender"
                  value={formData.memberGender}
                  onChange={handleChange}
                  label="성별"
                >
                  <MenuItem value="">선택</MenuItem>
                  <MenuItem value="M">남성</MenuItem>
                  <MenuItem value="F">여성</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="생년월일"
                name="memberBirth"
                value={formData.memberBirth}
                onChange={handleChange}
                disabled={loading}
                placeholder="YYMMDD (예: 901225)"
                helperText="6자리 숫자로 입력해주세요 (예: 901225)"
                size="small"
              />
            </Grid>

            {/* 우편번호와 주소 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="우편번호"
                name="memberZip"
                value={formData.memberZip}
                onChange={handleChange}
                disabled={loading}
                placeholder="12345"
                helperText="5자리 숫자로 입력해주세요"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="주소"
                name="memberAddr"
                value={formData.memberAddr}
                onChange={handleChange}
                disabled={loading}
                size="small"
              />
            </Grid>

            {/* 구분선 */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  my: 2,
                  "&::before, &::after": {
                    content: '""',
                    flex: 1,
                    height: "1px",
                    backgroundColor: "divider",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2, fontWeight: 500 }}
                >
                  비밀번호 변경 (선택사항)
                </Typography>
              </Box>
            </Grid>

            {/* 새 비밀번호 */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="새 비밀번호 (선택사항)"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                helperText="비밀번호를 변경하지 않으려면 비워두세요."
                size="small"
              />
            </Grid>

            {/* 비밀번호 확인 */}
            {formData.password && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="비밀번호 확인"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  error={isPasswordMismatch}
                  helperText={
                    isPasswordMismatch ? "비밀번호가 일치하지 않습니다." : ""
                  }
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </ContentBox>

      {/* 액션 버튼들 */}
      <ActionsBox>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          color="inherit"
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
        >
          {loading ? "수정 중..." : "수정"}
        </Button>
      </ActionsBox>
    </StyledDialog>
  );
};

export default EditProfile;
