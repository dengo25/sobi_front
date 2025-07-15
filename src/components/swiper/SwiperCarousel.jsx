import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const SwiperCarousel = ({
  slides = [], // [데이터 배열]
  renderSlide, // (item, idx) => ReactNode
  modules = [Scrollbar, Pagination, Navigation, Autoplay], // Swiper 모듈 목록
  navigation = false,
  pagination = false,
  scrollbar = false,
  autoplay = false,
  loop = false,
  slidesPerView = 1,
  slidesPerGroup = 1,
  spaceBetween = 0, // 슬라이드 간격 추가
  centeredSlides= false,
  breakpoints, // 반응형 설정 추가
  onSlideChange,
  className = "",
  enableLazyLoading = true, // 네이티브 lazy loading 활성화
  preloaderClass = "swiper-lazy-preloader", // 로딩 스피너 클래스
  ...rest // 기타 Swiper props
}) => {
  // 데이터가 없을 때 처리
  if (!slides || slides.length === 0) {
    return (
      <div className={`swiper-empty ${className}`}>
        <p>표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <Swiper
        modules={modules}
        navigation={navigation}
        pagination={pagination}
        scrollbar={scrollbar}
        autoplay={autoplay}
        loop={loop && slides.length > 1} // 슬라이드가 1개일 때 loop 비활성화
        slidesPerView={slidesPerView}
        slidesPerGroup={slidesPerGroup}
        spaceBetween={spaceBetween}
        breakpoints={breakpoints}
        onSlideChange={onSlideChange}
        className={className}
        {...rest}
      >
        {slides.map((item, idx) => (
          <SwiperSlide key={item.id ?? idx}>
            {enableLazyLoading ? (
              <div className="swiper-slide-content">
                {renderSlide(item, idx, { enableLazyLoading })}
                {/* 로딩 스피너 (선택사항) */}
                <div className={preloaderClass}></div>
              </div>
            ) : (
              renderSlide(item, idx)
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SwiperCarousel;
