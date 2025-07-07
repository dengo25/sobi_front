// components/common/AdminRoute.jsx
import { Navigate } from "react-router-dom";

function getUserRole() {
  const token = localStorage.getItem("ACCESS_TOKEN");
  //저장소에 저장된 토큰 조회

  if (!token) return null; //토큰이 없으면 null 반환

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null; //role값이 있으면 role 반환 없으면 null
  } catch (e) {
    console.error("토큰 파싱 오류: ", e);
    return null;
  }
}

const AdminRoute = ({ children }) => {
  const role = getUserRole();

  return role === "ROLE_ADMIN" ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
