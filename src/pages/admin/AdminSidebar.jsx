import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <ul>
        <li>
          <Link to="/admin">📊 대시보드</Link>
        </li>
        <li>
          <Link to="/admin/member">👤 회원 관리</Link>
        </li>
        <li>
          <Link to="/admin/reviews">📝 리뷰 관리</Link>
        </li>
        <li>
          <Link to="/admin/reports">🚨 신고 관리</Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
