import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const member = useSelector((state) => state.memberSlice);
  const role = member?.role;

  return role === "ROLE_ADMIN" ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
