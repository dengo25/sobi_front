import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const member = useSelector((state) => state.member);
  const role = member?.role;
  console.log("role", role);
  return (
    <header>
      <div className="wrap">
        <nav>
          <h1>
            <Link to="/">
              <img src="../images/logo-color.png" alt="홈페이지 이동" />
            </Link>
          </h1>

          <ul className="menu-list">
            <li>
              <Link to="/review">후기</Link>
            </li>
            {role == "ROLE_ADMIN" && (
              <li>
                <Link to="/admin">관리자</Link>
              </li>
            )}
            <li>
              <Link to="/notice">공지사항</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
          </ul>

          <ul className="util-box">
            <li>
              <Link to="/login">로그인</Link>
            </li>
            <li>
              <Link to="/">로그아웃</Link>
            </li>
            <li>
              <Link to="/join">회원가입</Link>
            </li>
            <li>
              <Link to="/mypage">마이페이지</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
