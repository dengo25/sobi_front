import React from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {signin, socialLogin} from "../../service/member/ApiService.js";
import {useDispatch} from "react-redux";
import {login} from "../../slice/memberSlice.jsx";

function Login() {
    const dispatch=useDispatch();
    const navigate=useNavigate();

    //일반 로그인 시 실행되는 함수
    const handleSubmit =async (event) => {
        event.preventDefault();// 폼 기본 제출 동작 방지

        const data = new FormData(event.target); //폼 요소로부터 데이터 수집np
        const memberId = data.get("memberId");
        const password = data.get("password");

        //로그인 API 호출
        try {
            const response = await signin({ memberId, password });

            // 토큰 저장
            localStorage.setItem("ACCESS_TOKEN", response.token);

            // Redux에 로그인 정보 저장
            dispatch(login(response));


            // 로그인 후 메인 페이지로 이동
            navigate("/");
        } catch (err) {
            alert("로그인 실패");
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