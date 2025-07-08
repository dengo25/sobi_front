"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Container,
  ThemeProvider,
  createTheme,
  FormControl,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { updateMypage } from "../../service/member/ApiService";

// SOBI 브랜드 색상 테마
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

// 스타일드 컴포넌트
const ProfileSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.light}08)`,
}));

const BasicInfoSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: 48,
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  margin: "0 auto",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 0),
  minHeight: 60,
}));

const InfoLabel = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  minWidth: 80,
  marginRight: theme.spacing(2),
}));

const InfoValue = styled(Box)({
  flex: 1,
});

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  justifyContent: "flex-end",
}));

const AccountInfo = ({ userInfo, onUpdate, onDeleteAccount }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    memberName: userInfo?.memberName || "",
    memberEmail: userInfo?.memberEmail || "",
    memberGender: userInfo?.memberGender || "",
    memberBirth: userInfo?.memberBirth || "",
    memberAddr: userInfo?.memberAddr || "",
    memberZip: userInfo?.memberZip || "",
    password: "",
    confirmPassword: "",
  });

  const handleEditToggle = () => {
    if (editMode) {
      // 취소 시 원래 데이터로 복원
      setFormData({
        memberName: userInfo?.memberName || "",
        memberEmail: userInfo?.memberEmail || "",
        memberGender: userInfo?.memberGender || "",
        memberBirth: userInfo?.memberBirth || "",
        memberAddr: userInfo?.memberAddr || "",
        memberZip: userInfo?.memberZip || "",
        password: "",
        confirmPassword: "",
      });
      setError("");
    }
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.memberEmail)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return false;
    }

    if (formData.memberBirth && !/^\d{6}$/.test(formData.memberBirth)) {
      setError("생년월일은 6자리 숫자(YYMMDD)로 입력해주세요.");
      return false;
    }

    if (formData.memberZip && !/^\d{5}$/.test(formData.memberZip)) {
      setError("우편번호는 5자리 숫자로 입력해주세요.");
      return false;
    }

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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updateData = {
        memberName: formData.memberName,
        memberEmail: formData.memberEmail,
        memberGender: formData.memberGender,
        memberBirth: formData.memberBirth,
        memberAddr: formData.memberAddr,
        memberZip: formData.memberZip,
      };

      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await updateMypage(updateData);

      if (response) {
        onUpdate(response, "회원정보가 성공적으로 수정되었습니다!");
        setEditMode(false);
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (err) {
      console.error("회원정보 수정 오류:", err);
      setError("회원정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const formatGender = (gender) => {
    if (gender === "M") return "남성";
    if (gender === "F") return "여성";
    return "설정 안함";
  };

  const formatBirth = (birth) => {
    if (!birth || birth.length !== 6) return "설정 안함";
    const year = `20${birth.substring(0, 2)}`;
    const month = birth.substring(2, 4);
    const day = birth.substring(4, 6);
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <ThemeProvider theme={sobiTheme}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* 프로필 섹션 */}
        <ProfileSection>
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <StyledAvatar sx={{ mb: 3 }}>
              {userInfo?.memberName?.charAt(0).toUpperCase() || "U"}
            </StyledAvatar>

            {editMode ? (
              <TextField
                fullWidth
                label="이름"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                sx={{ mb: 2, maxWidth: 300 }}
                size="small"
              />
            ) : (
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {userInfo?.memberName || "사용자"}
              </Typography>
            )}

            <Typography variant="body1" color="text.secondary" gutterBottom>
              @{userInfo?.memberId || "unknown"}
            </Typography>

            <Typography variant="body2" color="primary.main" fontWeight={600}>
              {userInfo?.role === "ROLE_USER" ? "일반 회원" : "관리자"}
            </Typography>
          </CardContent>
        </ProfileSection>

        {/* 에러 알림 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 기본 정보 섹션 */}
        <BasicInfoSection>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <SectionTitle variant="h6">
                <PersonIcon />
                기본 정보
              </SectionTitle>
              <Button
                onClick={handleEditToggle}
                startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                variant={editMode ? "outlined" : "contained"}
                color={editMode ? "inherit" : "primary"}
                disabled={loading}
              >
                {editMode ? "취소" : "수정"}
              </Button>
            </Box>

            {/* 첫 번째 행: 이메일, 성별, 생년월일 */}
            <Grid container spacing={4} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <InfoRow>
                  <InfoLabel>
                    <EmailIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      이메일
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    {editMode ? (
                      <TextField
                        fullWidth
                        type="email"
                        name="memberEmail"
                        value={formData.memberEmail}
                        onChange={handleChange}
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {userInfo?.memberEmail || "설정 안함"}
                      </Typography>
                    )}
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12} md={4}>
                <InfoRow>
                  <InfoLabel>
                    <GenderIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      성별
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    {editMode ? (
                      <FormControl fullWidth size="small">
                        <Select
                          name="memberGender"
                          value={formData.memberGender}
                          onChange={handleChange}
                        >
                          <MenuItem value="">선택</MenuItem>
                          <MenuItem value="M">남성</MenuItem>
                          <MenuItem value="F">여성</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {formatGender(userInfo?.memberGender)}
                      </Typography>
                    )}
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12} md={4}>
                <InfoRow>
                  <InfoLabel>
                    <CakeIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      생년월일
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    {editMode ? (
                      <TextField
                        fullWidth
                        name="memberBirth"
                        value={formData.memberBirth}
                        onChange={handleChange}
                        placeholder="YYMMDD"
                        size="small"
                        helperText="6자리 숫자"
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {formatBirth(userInfo?.memberBirth)}
                      </Typography>
                    )}
                  </InfoValue>
                </InfoRow>
              </Grid>
            </Grid>

            {/* 두 번째 행: 우편번호, 주소 */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <InfoRow>
                  <InfoLabel>
                    <LocationIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      우편번호
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    {editMode ? (
                      <TextField
                        fullWidth
                        name="memberZip"
                        value={formData.memberZip}
                        onChange={handleChange}
                        placeholder="12345"
                        size="small"
                        helperText="5자리 숫자"
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {userInfo?.memberZip || "설정 안함"}
                      </Typography>
                    )}
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12} md={8}>
                <InfoRow>
                  <InfoLabel>
                    <HomeIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      주소
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    {editMode ? (
                      <TextField
                        fullWidth
                        name="memberAddr"
                        value={formData.memberAddr}
                        onChange={handleChange}
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {userInfo?.memberAddr || "설정 안함"}
                      </Typography>
                    )}
                  </InfoValue>
                </InfoRow>
              </Grid>
            </Grid>

            {/* 비밀번호 변경 섹션 (편집 모드일 때만 표시) */}
            {editMode && (
              <>
                <Divider sx={{ my: 3 }} />
                <SectionTitle variant="h6">
                  <SecurityIcon />
                  비밀번호 변경 (선택사항)
                </SectionTitle>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      label="새 비밀번호"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      size="small"
                      helperText="변경하지 않으려면 비워두세요"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      label="비밀번호 확인"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      size="small"
                      error={
                        formData.password !== formData.confirmPassword &&
                        formData.confirmPassword !== ""
                      }
                      helperText={
                        formData.password !== formData.confirmPassword &&
                        formData.confirmPassword !== ""
                          ? "비밀번호가 일치하지 않습니다"
                          : ""
                      }
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* 저장 버튼 (편집 모드일 때만 표시) */}
            {editMode && (
              <ActionButtons>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  startIcon={
                    loading ? <CircularProgress size={16} /> : <SaveIcon />
                  }
                  disabled={loading}
                  size="large"
                >
                  {loading ? "저장 중..." : "저장"}
                </Button>
              </ActionButtons>
            )}
          </CardContent>
        </BasicInfoSection>
      </Container>
    </ThemeProvider>
  );
};

export default AccountInfo;
