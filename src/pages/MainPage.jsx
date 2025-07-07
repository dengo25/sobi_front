import { useSelector } from "react-redux";
import { useEffect } from "react";

const MainPage = () => {
    const member = useSelector((state) => state.memberSlice);

    useEffect(() => {
        console.log("현재 로그인 상태:", member);
    }, [member]);
  return (
      <div>
        <h1>메인 페이지</h1>
          <p>환영합니다, {member?.memberName || "방문자"}님!</p>
      </div>
  );
};

export default MainPage;