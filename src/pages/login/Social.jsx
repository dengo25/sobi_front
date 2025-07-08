import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const SocialLogin = () => {
    const location = useLocation();

    // 쿼리 파라미터에서 토큰 가져오기
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    console.log("토큰 파싱: " + token);

    if (token) {
        localStorage.setItem("ACCESS_TOKEN", token);
        return <Navigate to="/" state={{ from: location }} />;
    } else {
        return <Navigate to="/login" state={{ from: location }} />;
    }
};

export default SocialLogin;