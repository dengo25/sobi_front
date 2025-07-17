"use client";

import { useState, useEffect } from "react";
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
  MenuItem,
  Alert,
  CircularProgress,
  Modal,
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
  Close as CloseIcon,
} from "@mui/icons-material";
import DaumPostcode from "react-daum-postcode";

// SOBI 테마 설정 (기존과 동일)
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

// 기존 스타일드 컴포넌트 유지
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

// SignUpPage.jsx에서 가져온 StyledTextField
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
    backgroundColor: "#fafafa",
    height: 56,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    "&.Mui-focused": {
      backgroundColor: "white",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
      },
    },
  },
}));

// SignUpPage.jsx에서 가져온 ActionButton
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 500,
  textTransform: "none",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  height: 56,
  boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
  },
}));

const AccountInfo = ({ userInfo, onUpdate, onDeleteAccount }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const [formData, setFormData] = useState({
    memberName: userInfo?.memberName || "",
    memberEmail: userInfo?.memberEmail || "",
    memberGender: userInfo?.memberGender || "",
    memberBirth: userInfo?.memberBirth || "",
    memberAddr: userInfo?.memberAddr || "",
    memberZip: userInfo?.memberZip || "",
    detailAddress: "",
    password: "",
    confirmPassword: "",
  });

  // userInfo prop이 변경될 때 formData 업데이트
  useEffect(() => {
    setFormData({
      memberName: userInfo?.memberName || "",
      memberEmail: userInfo?.memberEmail || "",
      memberGender: userInfo?.memberGender || "",
      memberBirth: userInfo?.memberBirth || "",
      memberAddr: userInfo?.memberAddr || "",
      memberZip: userInfo?.memberZip || "",
      detailAddress: "",
      password: "",
      confirmPassword: "",
    });
  }, [userInfo]);

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
        detailAddress: "",
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
      await new Promise((resolve) => setTimeout(resolve, 500));

      const finalAddress =
        `${formData.memberAddr} ${formData.detailAddress}`.trim();

      const updateData = {
        ...userInfo,
        memberName: formData.memberName,
        memberEmail: formData.memberEmail,
        memberGender: formData.memberGender,
        memberBirth: formData.memberBirth,
        memberAddr: finalAddress,
        memberZip: formData.memberZip,
      };

      if (formData.password.trim()) {
        console.log("비밀번호 변경 요청:", formData.password);
      }

      onUpdate(updateData, "회원정보가 성공적으로 수정되었습니다!");
      setEditMode(false);
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        detailAddress: "",
      }));
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

  const handleAddressSelect = (data) => {
    const fullAddress = data.address;
    const zonecode = data.zonecode;

    setFormData((prev) => ({
      ...prev,
      memberAddr: fullAddress,
      memberZip: zonecode,
    }));
    setIsPostcodeOpen(false);
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
              <StyledTextField
                fullWidth
                label="이름"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                sx={{ mb: 2, maxWidth: 300 }}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {userInfo?.memberName || "사용자"}#{userInfo?.id || "0"}
              </Typography>
            )}

            <Typography variant="body1" color="text.secondary" gutterBottom>
              @{userInfo?.memberId || "unknown"}
            </Typography>

            <Typography variant="body2" color="primary.main" fontWeight={600}>
              {userInfo?.role === "ROLE_ADMIN" ? "관리자" : "일반 회원"}
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
              <ActionButton
                onClick={handleEditToggle}
                startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                variant={editMode ? "outlined" : "contained"}
                color={editMode ? "inherit" : "primary"}
                disabled={loading}
                sx={{ height: 40, mt: 0, mb: 0 }}
              >
                {editMode ? "취소" : "수정"}
              </ActionButton>
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
                      <StyledTextField
                        fullWidth
                        type="email"
                        name="memberEmail"
                        value={formData.memberEmail}
                        onChange={handleChange}
                        size="small"
                        sx={{ mb: 0 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
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
                        <StyledTextField
                          select
                          name="memberGender"
                          value={formData.memberGender}
                          onChange={handleChange}
                          sx={{ mb: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <GenderIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        >
                          <MenuItem value="">선택 안함</MenuItem>
                          <MenuItem value="M">남성</MenuItem>
                          <MenuItem value="F">여성</MenuItem>
                        </StyledTextField>
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
                      <StyledTextField
                        fullWidth
                        name="memberBirth"
                        value={formData.memberBirth}
                        onChange={handleChange}
                        placeholder="YYMMDD"
                        size="small"
                        helperText="6자리 숫자"
                        sx={{ mb: 0 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CakeIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
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

            {/* 두 번째 행: 우편번호, 주소, 상세주소 */}
            <Grid container spacing={4}>
              {editMode && (
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
                      <StyledTextField
                        fullWidth
                        name="memberZip"
                        value={formData.memberZip}
                        placeholder="우편번호 검색"
                        disabled={loading}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: 0,
                          cursor: "pointer",
                          "& .MuiOutlinedInput-root": {
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => setIsPostcodeOpen(true)}
                      />
                    </InfoValue>
                  </InfoRow>
                </Grid>
              )}

              <Grid item xs={12} md={editMode ? 8 : 12}>
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
                      <StyledTextField
                        fullWidth
                        name="memberAddr"
                        value={formData.memberAddr}
                        onChange={handleChange}
                        placeholder="주소를 검색으로 입력하세요"
                        disabled={loading}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{ mb: 0 }}
                      />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>
                        {userInfo?.memberAddr || "설정 안함"}
                      </Typography>
                    )}
                  </InfoValue>
                </InfoRow>
              </Grid>
              <Grid item xs={12}>
                {editMode && (
                  <InfoRow>
                    <InfoLabel>
                      <HomeIcon color="primary" />
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        상세주소
                      </Typography>
                    </InfoLabel>
                    <InfoValue>
                      <StyledTextField
                        fullWidth
                        name="detailAddress"
                        value={formData.detailAddress}
                        onChange={handleChange}
                        placeholder="상세 주소를 입력하세요"
                        disabled={loading}
                        sx={{ mb: 0 }}
                      />
                    </InfoValue>
                  </InfoRow>
                )}
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
                    <StyledTextField
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      label="새 비밀번호"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      size="small"
                      helperText="변경하지 않으려면 비워두세요"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SecurityIcon color="action" />
                          </InputAdornment>
                        ),
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
                    <StyledTextField
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SecurityIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* 저장 버튼 (편집 모드일 때만 표시) */}
            {editMode && (
              <ActionButtons>
                <ActionButton
                  onClick={handleSave}
                  variant="contained"
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  disabled={loading}
                  sx={{ height: 56, mt: 0, mb: 0 }}
                >
                  {loading ? "저장 중..." : "저장"}
                </ActionButton>
              </ActionButtons>
            )}
          </CardContent>
        </BasicInfoSection>
      </Container>

      {/* Daum 주소 검색 모달 */}
      <Modal open={isPostcodeOpen} onClose={() => setIsPostcodeOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: "90%",
            maxWidth: 500,
          }}
        >
          <IconButton
            onClick={() => setIsPostcodeOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <DaumPostcode onComplete={handleAddressSelect} />
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default AccountInfo;
