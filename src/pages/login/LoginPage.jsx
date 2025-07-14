"use client";

import { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Card,
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  GitHub as GitHubIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { signin, socialLogin } from "../../service/member/ApiService.js";
import { useDispatch } from "react-redux";
import { login } from "../../slice/memberSlice.jsx";

// 색상 테마
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
}));

const LoginCard = styled(Card)(({ theme }) => ({
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
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.dark})`,
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

const RightSection = styled(Box)(({ theme }) => ({
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

const WelcomeText = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 300,
  marginBottom: theme.spacing(1),
  opacity: 0.9,
  [theme.breakpoints.down("md")]: {
    fontSize: "1.2rem",
  },
}));

const SubText = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 400,
  opacity: 0.8,
  lineHeight: 1.6,
  maxWidth: 300,
  [theme.breakpoints.down("md")]: {
    fontSize: "0.9rem",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
    backgroundColor: "#fafafa",
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

const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  minWidth: 48,
  width: 48,
  height: 48,
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

const SocialSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(2),
}));

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 일반 로그인 시 실행되는 함수
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData(event.target);
    const memberId = data.get("memberId");
    const password = data.get("password");

    // 입력 검증
    if (!memberId || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const response = await signin({ memberId, password });

      // 토큰 저장
      localStorage.setItem("ACCESS_TOKEN", response.token);

      // Redux에 로그인 정보 저장
      dispatch(login(response));

      // 로그인 후 메인 페이지로 이동
      navigate("/");
    } catch (err) {
      console.error("로그인 오류:", err);
      // 블랙리스트 에러 처리 추가
      if (err.message && err.message.includes("이용이 제한되어 있습니다")) {
        alert(
          "해당 계정은 이용이 제한되어 있습니다.\n고객센터(1588-0000)로 문의해주세요."
        );
      } else {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 소셜 로그인 버튼 클릭 시 실행되는 함수
  const handleSocialLogin = (provider) => {
    socialLogin(provider);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={sobiTheme}>
      <MainContainer>
        <LoginCard>
          {/* 왼쪽 브랜딩 섹션 */}
          <LeftSection>
            <Box>
              <BrandLogo>SOBI</BrandLogo>
              <WelcomeText>Welcome to SOBI</WelcomeText>
              <SubText>
                지금 로그인하고 최적의 서비스 경험을 시작하세요. 안전하고 편리한
                로그인 시스템으로 여러분을 보호합니다.
              </SubText>
            </Box>
          </LeftSection>

          {/* 오른쪽 로그인 폼 섹션 */}
          <RightSection>
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                color="text.primary"
              >
                로그인
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                계정에 로그인하여 서비스를 이용하세요.
              </Typography>

              {/* 에러 알림 */}
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* 아이디 입력 */}
                <StyledTextField
                  variant="outlined"
                  required
                  fullWidth
                  id="memberId"
                  label="아이디를 입력하세요"
                  name="memberId"
                  autoComplete="username"
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* 비밀번호 입력 */}
                <StyledTextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="비밀번호를 입력하세요"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          disabled={loading}
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

                {/* 비밀번호 찾기 링크
                <Box sx={{ textAlign: "right", mb: 2 }}>
                  <MuiLink
                    component="button"
                    variant="body2"
                    color="primary"
                    sx={{ textDecoration: "none", cursor: "pointer" }}
                  >
                    비밀번호를 잊으셨나요?
                  </MuiLink>
                </Box> */}

                {/* 로그인 버튼 */}
                <LoginButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <LoginIcon />
                    )
                  }
                >
                  {loading ? "로그인 중..." : "로그인"}
                </LoginButton>

                {/* 소셜 로그인 */}
                <SocialSection>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    또는 소셜 계정으로 로그인
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <SocialButton
                      onClick={() => handleSocialLogin("google")}
                      disabled={loading}
                    >
                      <GoogleIcon />
                    </SocialButton>
                    <SocialButton
                      onClick={() => handleSocialLogin("github")}
                      disabled={loading}
                    >
                      <GitHubIcon />
                    </SocialButton>
                  </Box>
                </SocialSection>

                {/* 회원가입 링크 */}
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    계정이 없으신가요?{" "}
                    <Link
                      to="/join"
                      style={{
                        color: sobiTheme.palette.primary.main,
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      회원가입
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </RightSection>
        </LoginCard>
      </MainContainer>
    </ThemeProvider>
  );
}

export default Login;
