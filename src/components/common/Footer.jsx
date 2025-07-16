import { useState } from "react";
import { Link } from "react-router-dom";
import FooterTOS from "./FooterTOS";
import FooterPP from "./FooterPP";

const Footer = () => {
  const [tosOpen, setTosOpen] = useState(false);
  const [ppOpen, setPpOpen] = useState(false);

  const handleTosOpen = () => {
    setTosOpen(true);
  };

  const handleTosClose = () => {
    setTosOpen(false);
  };

  const handlePpOpen = () => {
    setPpOpen(true);
  };

  const handlePpClose = () => {
    setPpOpen(false);
  };

  return (
    <>
      <footer>
        <div className="wrap">
          <nav>
            <ul className="footer-list">
              <li>
                <Link to="/faq">서비스 운영정책</Link>
              </li>
              <li>
                <a
                  href="#none"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTosOpen();
                  }}
                >
                  이용약관
                </a>
              </li>
              <li>
                <a
                  href="#none"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePpOpen();
                  }}
                >
                  <strong>개인정보처리방침</strong>
                </a>
              </li>
              <li>
                <Link to="/notice">공지사항</Link>
              </li>
            </ul>
          </nav>
          <p className="copyright">Copyright 2025. 4doc All Rights Reserved.</p>
        </div>
      </footer>

      {/* 서비스 운영정책 모달 */}
      <FooterTOS open={tosOpen} onClose={handleTosClose} />

      {/* 개인정보 처리방침 모달 */}
      <FooterPP open={ppOpen} onClose={handlePpClose} />
    </>
  );
};

export default Footer;
