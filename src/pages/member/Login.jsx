import React from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { signin, socialLogin } from "../../service/member/ApiService"

function Login() {

    //일반 로그인 시 실행되는 함수
    const handleSubmit = (event) => {
        event.preventDefault();// 폼 기본 제출 동작 방지

        const data = new FormData(event.target); //폼 요소로부터 데이터 수집
        const username = data.get("username");
        const password = data.get("password");

        //로그인 API 호출
        signin({ username: username, password: password });
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
                            id="username"
                            label="아이디"
                            name="username"
                            autoComplete="username"
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
