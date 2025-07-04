import React from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  signin,
  socialLogin,
  getMyInfo,
} from "../../service/member/ApiService.js";
import jwtAxios from "../../service/util/JwtUtil.jsx";
import useAuthStore from "../../store/authStore.js";
function Login() {
  const login = useAuthStore((state) => state.login);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target); //폼 요소로부터 데이터 수집
    const memberId = data.get("memberId");
    const password = data.get("password");

    try {
      // 1. 로그인 요청 → 토큰 받기
      const token = await signin({ memberId: memberId, password: password });
      console.log(token);

      localStorage.setItem("ACCESS_TOKEN", token); // 또는 localStorage 저장

      login(token); // Zustand에 토큰 저장

      // 2. 사용자 정보 조회 → role, memberId 저장
      const userRes = await getMyInfo();
      console.log("userRes 저장 됨", userRes.data);
      const { memberId: id, role } = userRes.data;
      console.log("role: ", role);
      setUserInfo({ memberId: id, role });

      alert("로그인 성공!");
      // navigate("/"); 등 라우팅 처리
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("로그인 실패!");
    }
  };
  //소셜 로그인 버튼 클릭 시 실행되는 함수
  const handleSocialLogin = (provider) => {
    socialLogin(provider); //전달된 provider로 로셜 로그인 실행
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
        </Grid>
      </Grid>
      <form noValidate onSubmit={handleSubmit}>
        {" "}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="memberId"
              label="아이디"
              name="memberId"
              autoComplete="memberId"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="패스워드"
              type="password"
              id="password"
              autoComplete="current-password"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              로그인
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => handleSocialLogin("google")}
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#000" }}
            >
              구글로 로그인하기
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => handleSocialLogin("naver")}
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#000" }}
            >
              네이버로 로그인하기
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => handleSocialLogin("kakao")}
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#000" }}
            >
              카카오로 로그인하기
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => handleSocialLogin("github")}
              fullWidth
              variant="contained"
              style={{ backgroundColor: "#000" }}
            >
              깃허브로 로그인하기
            </Button>
          </Grid>
          <Grid item>
            <Link to="/signup" variant="body2">
              계정이 없습니까? 여기서 가입 하세요.
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Login;
