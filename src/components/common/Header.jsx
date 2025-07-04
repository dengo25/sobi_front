import { Link } from "react-router-dom";

const Header = () => {
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
  const role = getUserRole();
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
