import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";

import { styled, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { sobiTheme, MainContainer } from "../assets/styles/sobiTheme";

import {
  noticeLimit3List,
  reviewLimit10List,
  reviewLimit5List,
  reviewLimit5ListfromCateogry1,
  reviewLimit5ListfromCateogry2,
} from "../service/main/MainApiService";
import { incrementNoticeViewCount } from "../service/community/NoticeApiService";
import SwiperCarousel from "../components/swiper/SwiperCarousel";
import ImageWithTitleList from "../components/list/ImageWithTitleList";
import ImageCard from "../components/list/ImageCard";
import { stripHtml } from "../utils/common";

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
  const [reviewList, setReviewList] = useState([]);
  const [reviewTrandList, setReviewTrandList] = useState([]);
  const [reviewCT1List, setReviewCT1List] = useState([]);
  const [reviewCT2List, setReviewCT2List] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("현재 로그인 상태:", member);

    noticeLimit3List().then((res) => {
      // console.log(res)
      setNotice3List(res || []);
    });

    reviewLimit5List().then((res) => {
      // console.log("5건 res !! ", res.rnoList);
      setReviewTrandList(res.rnoList || []);
    });

    reviewLimit10List().then((res) => {
      // console.log(res.rnoList);
      setReviewList(res.rnoList || []);
    });

    reviewLimit5ListfromCateogry1().then((res) => {
      // console.log(res.rnoList);
      setReviewCT1List(res.rnoList || []);
    });

    reviewLimit5ListfromCateogry2().then((res) => {
      // console.log(res.rnoList);
      setReviewCT2List(res.rnoList || []);
    });
  }, [member]);

  // 페이지 이동
  const handleClickMove = async (type, no) => {
    if (type == "notice") {
      await incrementNoticeViewCount(no);
      navigate(`/notice/${no}`);
    } else if (type == "review") {
      navigate(`/review/detail/${no}?page=1&size=10`);
    } else if (type == "faq") {
      navigate(`/faq`);
    }
    console.log(`${type}! -->>>> `, `/review/detail/${no}?page=1&size=10`);
  };

  // 파싱 결과 : 공지사항 3건 스와이퍼용
  const noticeSwiperContent = useMemo(() => {
    if (!Array.isArray(notice3List)) return [];
    return notice3List.map((n) => ({
      ...n,
      plain: stripHtml(n.noticeContent),
    }));
  }, [notice3List]);

  // 파싱 결과 : 최신 리뷰 5건
  const reviewTrandContent = useMemo(() => {
    if (!Array.isArray(reviewTrandList)) return [];
    // const firstImages = reviewList
    return reviewTrandList
      .filter((review) => review.images && review.images.length > 0) // 이미지가 있는 게시글만
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신순 정렬
      .map((review) => ({
        tno: review.tno || review.id,
        reviewTitle: review.title,
        images: review.images || [],
        author: review.memberId || "익명",
        content: review.content || "",
      }));
    // return firstImages;
  }, [reviewTrandList]);

  // 파싱 결과 : 카테고리별1
  const reviewCT1Content = useMemo(() => {
    if (!Array.isArray(reviewCT1List)) return [];
    const category1 = reviewCT1List
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신순 정렬
      .map((review) => ({
        no: review.tno,
        img:
          review.images && review.images.length > 0
            ? review.images[0].fileUrl
            : null, // null 체크 추가
        title: review.title,
        author: review.memberId,
        content: review.content,
      }));
    return category1;
  }, [reviewCT1List]);

  // 파싱 결과 : 카테고리별2
  const reviewCT2Content = useMemo(() => {
    if (!Array.isArray(reviewCT2List)) return [];
    const category2 = reviewCT2List
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신순 정렬
      .map((review) => ({
        no: review.tno,
        img:
          review.images && review.images.length > 0
            ? review.images[0].fileUrl
            : null, // null 체크 추가
        title: review.title,
        author: review.memberId,
        content: review.content,
      }));
    return category2;
  }, [reviewCT2List]);

  // 파싱 결과 : 리뷰 10건
  const reviewAllContent = useMemo(() => {
    if (!Array.isArray(reviewList)) return [];
    const firstImages = reviewList
      //.filter(review => review.images && review.images.length > 0) // 이미지가 있는 게시글만
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신순 정렬
      .map((review) => ({
        no: review.tno,
        img:
          review.images && review.images.length > 0
            ? review.images[0].fileUrl
            : null, // null 체크 추가
        title: review.title,
        author: review.memberId,
        content: review.content,
      }));
    return firstImages;
  }, [reviewList]);

  // 파싱 결과 : 공지 사항 3건
  const noticeContent = useMemo(() => {
    if (!Array.isArray(notice3List)) return [];
    const list = notice3List
      .sort(
        (a, b) =>
          new Date(b.notice_create_date) - new Date(a.notice_create_date)
      ) // 최신순 정렬
      .map((notice3List) => ({
        no: notice3List.noticeNo,
        img:
          notice3List.imageUrls && notice3List.imageUrls.length > 0
            ? notice3List.imageUrls[0]
            : null, // null 체크 추가
        title: notice3List.noticeTitle,
        content: stripHtml(notice3List.noticeContent),
      }));
    return list;
  }, [notice3List]);

  // 불필요한 렌더링 줄이기 (useCallback)
  // 슬라이더 : 최신리뷰
  const renderSlide = useCallback(
    ({ tno, reviewTitle, images, content }, idx) => (
      <div key={tno || `slide-${idx}`} className="slide-box">
        <div className="slide-img">
          {images && images.length > 0 && (
            <p>
              {images.map((url, imgIdx) => (
                <img
                  // key={url || imgIdx}
                  key={`${tno}-img-${imgIdx}`}
                  src={url.fileUrl}
                  alt={`review-${tno}-img-${imgIdx}`}
                />
              ))}
            </p>
          )}
        </div>
        <p className="text">
          <a onClick={() => handleClickMove("review", tno)}>
            <span>{reviewTitle}</span>
            {stripHtml(content)}
          </a>
        </p>
      </div>
    ),
    []
  );

  // 슬라이더 : 공지사항
  const renderSlideNotice = useCallback(
    ({ noticeNo, noticeTitle, imageUrls, plain }, idx) => (
      <ul key={noticeNo || `slide-${idx}`}>
        {/* <li>{plain}</li> */}
        {/* <li>{noticeTitle}</li> */}
        <li>
          <a onClick={() => handleClickMove("notice", noticeNo)}>
            {(imageUrls || []).map((url, idx) => (
              <img
                key={url ?? idx}
                src={url}
                alt={`revive-${noticeNo}-img-${idx}`}
                // style={{ maxWidth: "100%", margin: "0.5rem 0" }}
              />
            ))}
          </a>
        </li>
      </ul>
    ),
    []
  );

  return (
    <ThemeProvider theme={sobiTheme}>
      <MainContainer maxWidth="xl">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Item>
                {/* <h1 className="blind">메인 페이지</h1> */}
                <p className="welcome-ment">
                  👋👋 환영합니다, {member?.memberName || "방문자"}님!
                </p>
                {/* <p>
                {member?.memberName || "방문자"}은 '{member.role}' 회원 입니다.
              </p> */}
              </Item>
            </Grid>
            <Grid size={8}>
              <Stack spacing={2}>
                <Item>
                  <h3 className="main-title">📝 SOBI 최신 리뷰</h3>
                  {reviewTrandContent.length > 0 ? (
                    <SwiperCarousel
                      slides={reviewTrandContent}
                      renderSlide={renderSlide}
                      // navigation
                      // pagination={{ clickable: true }}
                      scrollbar={{ draggable: true }}
                      autoplay={{ delay: 5000, disableOnInteraction: false }}
                      loop={true}
                      enableLazyLoading={true}
                      slidesPerView={1}
                      slidesPerGroup={1}
                      className="review-trand"
                    />
                  ) : (
                    <p>리뷰가 없습니다....</p>
                  )}
                </Item>
                <Item>
                  <h3 className="main-title">📝 SOBI 카테고리별 1</h3>
                  <ImageCard
                    items={reviewCT1Content}
                    type="review"
                    onItemClick={handleClickMove}
                  />
                </Item>
                <Item>
                  <h3 className="main-title">📝 SOBI 카테고리별 2</h3>
                  <ImageCard
                    items={reviewCT2Content}
                    type="review"
                    onItemClick={handleClickMove}
                  />
                </Item>

                <Item>
                  <h3 className="main-title">📢 SOBI 공지사항</h3>
                  {noticeSwiperContent.length > 0 ? (
                    <SwiperCarousel
                      slides={noticeSwiperContent}
                      renderSlide={renderSlideNotice}
                      scrollbar={{ draggable: true }}
                      autoplay={{ delay: 8000, disableOnInteraction: false }}
                      loop={true}
                      enableLazyLoading={true}
                      slidesPerView={2}
                      spaceBetween={15}
                      slidesPerGroup={1}
                      className="notice-swiper"
                    />
                  ) : (
                    <p>리뷰가 없습니다....</p>
                  )}
                </Item>

                <Item>
                  <h3 className="main-title">
                    <a
                      href="#"
                      onClick={() => {
                        handleClickMove("faq");
                      }}
                      className=""
                    >
                      📢 SOBI FAQ 바로가기
                    </a>
                  </h3>
                </Item>
              </Stack>
            </Grid>

            <Grid size={4}>
              <Item>
                <h3 className="main-title">📝 SOBI 리뷰</h3>
                {reviewAllContent.length > 0 ? (
                  <ImageWithTitleList
                    items={reviewAllContent}
                    cols={1}
                    gap={10}
                    type="review"
                    onItemClick={handleClickMove}
                  />
                ) : (
                  <p>리뷰가 없습니다.</p>
                )}
              </Item>
            </Grid>
          </Grid>
        </Box>
      </MainContainer>
    </ThemeProvider>
  );
};

export default MainPage;