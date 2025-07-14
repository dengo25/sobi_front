"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  ThemeProvider,
  createTheme,
  Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
  LocationOn,
  CheckCircle,
  Cancel,
  ArrowBack,
  Close,
} from "@mui/icons-material";
import DaumPostcode from "react-daum-postcode";

// 실제 API 서비스 import
import {
  signup,
  checkEmailDuplicate,
} from "../../service/member/ApiService.js";

// SOBI 테마 설정
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
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: "#ffffff",
}));

const SignUpCard = styled(Card)(({ theme }) => ({
  maxWidth: 1000,
  width: "100%",
  borderRadius: theme.spacing(2),
  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  overflow: "hidden",
  display: "flex",
  minHeight: 600,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    maxWidth: 400,
  },
}));

const LeftSection = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: "white",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4),
  },
}));

const RightSection = styled(Box)(({ theme }) => ({
  flex: 1,
  background: `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    right: "-50%",
    width: "200%",
    height: "200%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
    animation: "float 6s ease-in-out infinite",
  },
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-20px)" },
  },
  [theme.breakpoints.down("md")]: {
    minHeight: 200,
    padding: theme.spacing(4),
  },
}));

const BrandLogo = styled(Typography)(({ theme }) => ({
  fontSize: "3rem",
  fontWeight: 800,
  letterSpacing: "3px",
  marginBottom: theme.spacing(2),
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

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

const SocialButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  margin: theme.spacing(0.5),
  height: 56,
  width: 56,
  minWidth: 56,
  border: "1px solid #e0e0e0",
  backgroundColor: "white",
  color: "#666",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
}));

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    memberId: "",
    password: "",
    confirmPassword: "",
    memberName: "",
    memberEmail: "",
    memberAddr: "",
    memberZip: "",
    detailAddress: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailCheck, setEmailCheck] = useState({
    checked: false,
    available: false,
    message: "",
    loading: false,
  });
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "memberEmail") {
      setEmailCheck({
        checked: false,
        available: false,
        message: "",
        loading: false,
      });
    }
  };

  const handleEmailCheck = async () => {
    const email = formData.memberEmail.trim();

    if (!email) {
      setEmailCheck({
        checked: true,
        available: false,
        message: "이메일을 입력해주세요.",
        loading: false,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailCheck({
        checked: true,
        available: false,
        message: "올바른 이메일 형식이 아닙니다.",
        loading: false,
      });
      return;
    }

    setEmailCheck((prev) => ({ ...prev, loading: true }));

    try {
      const result = await checkEmailDuplicate(email);
      setEmailCheck({
        checked: true,
        available: result.available,
        message: result.message,
        loading: false,
      });
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      setEmailCheck({
        checked: true,
        available: false,
        message: "이메일 확인 중 오류가 발생했습니다.",
        loading: false,
      });
    }
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

  const handleNextStep = () => {
    if (
      !formData.memberId ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.memberName
    ) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailCheck.checked) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }

    if (!emailCheck.available) {
      alert("사용 가능한 이메일을 입력해주세요.");
      return;
    }

    if (
      !formData.memberEmail ||
      !formData.memberZip ||
      !formData.memberAddr ||
      !formData.detailAddress
    ) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    setLoading(true);

    const finalAddress =
      `${formData.memberAddr} ${formData.detailAddress}`.trim();
    const sendData = {
      ...formData,
      memberAddr: finalAddress,
    };

    delete sendData.confirmPassword;
    delete sendData.detailAddress;

    console.log("제출 데이터:", sendData);

    try {
      const res = await signup(sendData);
      alert("회원가입 완료");
      window.location.href = "/login";
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={sobiTheme}>
      <MainContainer>
        <SignUpCard>
          {/* 왼쪽 섹션 (폼 영역) */}
          <LeftSection>
            <Box sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
              <Box sx={{ textAlign: "left", mb: 4 }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  gutterBottom
                  color="text.primary"
                >
                  회원가입
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  아래 정보를 입력해주세요.
                </Typography>
              </Box>

              <Box
                component="form"
                onSubmit={currentStep === 2 ? handleSubmit : handleNextStep}
                noValidate
              >
                {currentStep === 1 && (
                  <Box>
                    {/* 이름 */}
                    <StyledTextField
                      variant="outlined"
                      required
                      fullWidth
                      id="memberName"
                      label="이름"
                      name="memberName"
                      value={formData.memberName}
                      onChange={handleChange}
                      placeholder="이름을 입력하세요"
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* 아이디 */}
                    <StyledTextField
                      variant="outlined"
                      required
                      fullWidth
                      id="memberId"
                      label="아이디"
                      name="memberId"
                      value={formData.memberId}
                      onChange={handleChange}
                      placeholder="아이디를 입력하세요"
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* 비밀번호 */}
                    <StyledTextField
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="비밀번호"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="비밀번호를 입력하세요"
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              disabled={loading}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* 비밀번호 확인 */}
                    <StyledTextField
                      variant="outlined"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="비밀번호 확인"
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="비밀번호를 다시 입력하세요"
                      disabled={loading}
                      error={
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                      }
                      helperText={
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                          ? "비밀번호가 일치하지 않습니다."
                          : ""
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                              disabled={loading}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <ActionButton
                      type="button"
                      fullWidth
                      variant="contained"
                      onClick={handleNextStep}
                      disabled={loading}
                    >
                      다음
                    </ActionButton>
                  </Box>
                )}

                {currentStep === 2 && (
                  <Box>
                    {/* 이메일 및 중복확인 */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 2,
                        alignItems: "center",
                      }}
                    >
                      <StyledTextField
                        variant="outlined"
                        required
                        fullWidth
                        id="memberEmail"
                        label="이메일"
                        name="memberEmail"
                        type="email"
                        value={formData.memberEmail}
                        onChange={handleChange}
                        placeholder="이메일을 입력하세요"
                        disabled={loading}
                        error={emailCheck.checked && !emailCheck.available}
                        sx={{ mb: 0 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: emailCheck.checked && (
                            <InputAdornment position="end">
                              {emailCheck.available ? (
                                <CheckCircle sx={{ color: "success.main" }} />
                              ) : (
                                <Cancel sx={{ color: "error.main" }} />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                      <ActionButton
                        variant="outlined"
                        onClick={handleEmailCheck}
                        disabled={
                          emailCheck.loading ||
                          !formData.memberEmail.trim() ||
                          loading
                        }
                        sx={{ minWidth: 100, height: 56, mt: 0, mb: 0 }}
                      >
                        {emailCheck.loading ? (
                          <CircularProgress size={20} />
                        ) : (
                          "중복확인"
                        )}
                      </ActionButton>
                    </Box>

                    {/* 이메일 중복 확인 결과 메시지 */}
                    {emailCheck.checked && emailCheck.message && (
                      <Alert
                        severity={emailCheck.available ? "success" : "error"}
                        sx={{ mb: 2 }}
                      >
                        {emailCheck.message}
                      </Alert>
                    )}

                    {/* 우편번호 및 주소 검색 */}
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <StyledTextField
                        variant="outlined"
                        required
                        fullWidth
                        id="memberZip"
                        label="우편번호"
                        name="memberZip"
                        value={formData.memberZip}
                        placeholder="우편번호 검색"
                        disabled={loading}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOn color="action" />
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
                    </Box>

                    <StyledTextField
                      variant="outlined"
                      required
                      fullWidth
                      id="memberAddr"
                      label="주소"
                      name="memberAddr"
                      value={formData.memberAddr}
                      placeholder="주소를 검색으로 입력하세요"
                      disabled={loading}
                      InputProps={{
                        readOnly: true,
                      }}
                    />

                    <StyledTextField
                      variant="outlined"
                      required
                      fullWidth
                      id="detailAddress"
                      label="상세주소"
                      name="detailAddress"
                      value={formData.detailAddress}
                      onChange={handleChange} // <-- BUG FIX: use handleChange to update formData
                      placeholder="상세 주소를 입력하세요"
                      disabled={loading}
                    />

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <ActionButton
                        type="button"
                        fullWidth
                        variant="outlined"
                        onClick={handlePreviousStep}
                        disabled={loading}
                        startIcon={<ArrowBack />}
                        sx={{ height: 56, flex: 1 }}
                      >
                        이전
                      </ActionButton>
                      <ActionButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={
                          loading ||
                          !emailCheck.checked ||
                          !emailCheck.available
                        }
                        sx={{ flex: 1 }}
                      >
                        {loading ? (
                          <>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              sx={{ mr: 1 }}
                            />
                            가입 중...
                          </>
                        ) : (
                          "회원가입"
                        )}
                      </ActionButton>
                    </Box>
                  </Box>
                )}

                {/* 로그인 링크 */}
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    이미 계정이 있으신가요?{" "}
                    <Typography
                      component="a"
                      href="/login"
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        fontWeight: 600,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      로그인
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </LeftSection>

          {/* 오른쪽 섹션 (브랜딩 영역) */}
          <RightSection>
            <Box sx={{ position: "relative", zIndex: 10 }}>
              <BrandLogo>SOBI</BrandLogo>
            </Box>
          </RightSection>
        </SignUpCard>

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
              <Close />
            </IconButton>
            <DaumPostcode onComplete={handleAddressSelect} />
          </Box>
        </Modal>
      </MainContainer>
    </ThemeProvider>
  );
}
