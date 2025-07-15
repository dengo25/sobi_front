// import { incrementNoticeViewCount } from "../service/community/NoticeApiService";
// import { useNavigate } from "react-router-dom";


// 텍스트 추출 함수
export const stripHtml = (html) => {
  if (!html) return "";
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  } catch (error) {
    console.error("HTML 파싱 오류:", error);
    return html; // 파싱 실패 시 원본 반환
  }
};

// 단순 페이지 이동
// export const handleClickMove = async (type, no) => {
//   const navigate = useNavigate();
//   if (type == "notice") {
//     await incrementNoticeViewCount(no);
//     navigate(`/notice/${no}`);
//   } else if (type == "review") {
//     navigate(`/review/detail/${no}?page=1&size=10`);
//   } else if (type == "faq") {
//     navigate(`/faq`);
//   }
//   console.log(`${type}! -->>>> `, `/review/detail/${no}?page=1&size=10`);
// };
