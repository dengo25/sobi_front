"use client";

import { useState } from "react";
import {
  Typography,
  Box,
  Alert,
  CircularProgress,
  ThemeProvider,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
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
import {
  sobiTheme,
  MainContainer,
  LoginCard,
  LeftSection,
  BrandLogo,
  WelcomeText,
  SubText,
  RightSection,
  StyledTextField,
  LoginButton,
  SocialButton,
  SocialSection,
} from "../../assets/styles/sobiThemeLogin";

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
      if (
        error.message &&
        error.message.includes(
          "해당 계정은 이용이 제한되어 있습니다. 관리자에게 문의해주세요."
        )
      ) {
        alert(error.message);
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
