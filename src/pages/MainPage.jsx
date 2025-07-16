import { useSelector } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import { getNoticeList } from "../service/community/noticeApiService";
import { noticeLimit3List, reviewLimit5List, reviewLimit5ListfromCateogry1, reviewLimit5ListfromCateogry2 } from "../service/main/MainApiService";

import SwiperCarousel from "../components/swiper/SwiperCarousel";
import ImageWithTitleList from "../components/list/ImageWithTitleList";
import { stripHtml } from "../utils/common";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const MainPage = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  const member = useSelector((state) => state.member);
  const [notice3List, setNotice3List] = useState([]);
  const [noticeTest, setNoticeTest] = useState([]);

  useEffect(() => {
    console.log("현재 로그인 상태:", member);

    noticeLimit3List().then((res) => {
      console.log("불러왓!,", res);
      setNotice3List(res || []);
    });

    getNoticeList().then((res) => {
      setNoticeTest(res || []);
    });
  }, [member]);

  // 파싱 결과만 memoize
  const plainContents = useMemo(() => {
    if (!Array.isArray(notice3List)) return [];
    return notice3List.map((n) => ({
      ...n,
      plain: stripHtml(n.noticeContent),
    }));
  }, [notice3List]);

  // 파싱 결과만 memoize
  const plainContents2 = useMemo(() => {
    if (!Array.isArray(noticeTest)) return [];
    const firstImages = noticeTest
      //.filter(test => test.imageUrls && test.imageUrls.length > 0) // 이미지가 있는 게시글만
      .sort(
        (a, b) => new Date(b.noticeCreateDate) - new Date(a.noticeCreateDate)
      ) // 최신순 정렬
      .map((test) => ({
        img: test.imageUrls[0],
        title: test.noticeTitle,
        author: test.memberId,
      }));
    return firstImages;
  }, [noticeTest]);

  // 불필요한 렌더링 줄이기 (useCallback)
  const renderSlide = useCallback(
    ({ noticeNo, noticeTitle, imageUrls, plain }, idx) => (
      <ul key={idx}>
        <li>{noticeTitle}</li>
        <li>{plain}</li>
        <li>
          {(imageUrls || []).map((url, idx) => (
            <img
              key={url ?? idx}
              src={url}
              alt={`notice-${noticeNo}-img-${idx}`}
              style={{ maxWidth: "100%", margin: "0.5rem 0" }}
            />
          ))}
        </li>
      </ul>
    ),
    [] // notice3List
  );
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Item>
              <h1>메인 페이지</h1>
              <p>환영합니다, {member?.memberName || "방문자"}님!</p>
              <p>
                {member?.memberName || "방문자"}은 '{member.role}' 회원 입니다.
              </p>
            </Item>
          </Grid>
          <Grid size={8}>
            <Item>
              <SwiperCarousel
                slides={plainContents}
                renderSlide={renderSlide}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                enableLazyLoading={true}
                slidesPerView={1}
                slidesPerGroup={1}
              />
            </Item>
          </Grid>
          <Grid size={4}>
            <Item>
              <h3 className="">📝 SOBI 리뷰</h3>
              {plainContents2.length > 0 ? (
                <ImageWithTitleList items={plainContents2} cols={1} gap={10} />
              ) : (
                <p>리뷰가 없습니다.</p>
              )}
            </Item>
          </Grid>
          {/* <Grid size={8}>
            <Item>size=8</Item>
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
};

export default MainPage;
