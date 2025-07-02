import { Outlet } from "react-router";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const BasicLayout = () => {
  return (
    <>
      <div>
        <Header />
        <>
          <Outlet />
          {/*    Outlet은 안에 내용물을 나타낸다 mainPage가 될 수도 있고 다른 페이지가 될 수도 있다.*/}
        </>
        <Footer />
      </div>
    </>
  );
};

export default BasicLayout;
