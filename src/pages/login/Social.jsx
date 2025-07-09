import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { login } from "../../slice/memberSlice.jsx";
import { useDispatch } from "react-redux";

const SocialLogin = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);

      //토큰 해석해서 Redux에 로그인 상태 저장
      const decoded = jwtDecode(token);

      dispatch(
        login({
          token,
          memberId: decoded.sub,
          memberName: decoded.memberName,
          memberEmail: decoded.memberEmail,
          role: decoded.role,
        })
      );
    }
  }, [token, dispatch]);

  if (token) {
    // 소셜 로그인 성공 후 마이페이지의 계정 정보 탭으로 이동
    return <Navigate to="/mypage?tab=0" state={{ from: location }} />;
  } else {
    return <Navigate to="/login" state={{ from: location }} />;
  }
};

export default SocialLogin;
