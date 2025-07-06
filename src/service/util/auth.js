import * as jwtDecode from "jwt-decode";

export function getUserRoleFromToken() {
  const token = localStorage.getItem("token");
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode.default(token); // CommonJS 모듈 접근 방식
      console.log("📦 디코딩된 JWT Payload:", decoded);
      // userRole = decoded.role;
      userRole = decoded.auth?.role;
      // userRole = decoded.roles?.[0]; // 첫 번째 권한

    } catch (error) {
      console.error("토큰 디코딩 실패:", error);
    }
  }

  return userRole;
}
