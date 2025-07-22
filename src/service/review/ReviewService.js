import jwtAxios from "../util/JwtUtil.jsx";
import { API_BASE_URL } from "../util/api-config.js";
import { call } from "../member/ApiService.js";
import axios from "axios";

export const insertReview = async (dto) => {
  try {
    const res = await jwtAxios.post(`${API_BASE_URL}/api/review`, dto);
    // console.log("신규 응답 데이터 : ",res.data);
    return res.data;
  } catch (error) {
    console.error("신규 등록 실패:", error);
    throw error;
  }
};

// export async function getReview(tno) {
//   const response = await axios.get(`${API_BASE_URL}/api/review/${tno}`);
//   return response.data;
// }
export async function getReview(tno) {
  const dummyReview = {
    tno: Number(tno),
    title: "맥북 프로 M2 사용기",
    content: "<p>성능은 물론 디자인까지 완벽합니다.</p>",
    memberId: "user",
    createdAt: "2025-07-20T12:00:00",
    confirmed: "Y",
    category: { id: 1, name: "전자기기" },
    images: [{ isThumbnail: "Y", fileUrl: "https://via.placeholder.com/150" }],
  };

  return Promise.resolve(dummyReview);
}


export async function getReviewListDummy() {
  const dummyData = {
    totalCount: 5,
    rnoList: [
      {
        tno: 1,
        title: "맥북 프로 M2 사용기",
        content: `
            <p>성능은 물론 디자인까지 완벽합니다.</p>
            <p><img src="/final/images/m2.jpeg" style="max-width: 100%; height: auto;" alt="맥북 프로 M2 이미지" /></p>
     
          `,
      memberId: "user",
        createdAt: "2025-07-20T12:00:00",
        confirmed: "Y",
        category: { id: 1, name: "전자기기" },
        images: [{ isThumbnail: "Y", fileUrl: "/final/images/m2.jpeg" }],
      },
      {
        tno: 2,
        title: "허먼밀러 의자 한 달 후기",
        content: "<p>허리는 편한데 가격은 부담돼요.</p>",
        memberId: "chairLover",
        createdAt: "2025-07-21T08:30:00",
        confirmed: "N",
        category: { id: 2, name: "가구" },
        images: [],
      },
      {
        tno: 3,
        title: "아이패드 프로 12.9 리뷰",
        content: "<p>필기용으로 최고! 하지만 무게는 감안해야 해요.</p>",
        memberId: "ipadFan",
        createdAt: "2025-07-18T15:45:00",
        confirmed: "Y",
        category: { id: 1, name: "전자기기" },
        images: [{ isThumbnail: "Y", fileUrl: "https://via.placeholder.com/150" }],
      },
      {
        tno: 4,
        title: "책상 셀프 조립기",
        content: "<p>혼자 조립했는데 생각보다 쉽네요.</p>",
        memberId: "diyMaster",
        createdAt: "2025-07-19T09:00:00",
        confirmed: "N",
        category: { id: 2, name: "가구" },
        images: [],
      },
      {
        tno: 5,
        title: "로지텍 마우스 후기",
        content: "<p>정말 부드럽고 클릭감도 좋아요.</p>",
        memberId: "mouseGuy",
        createdAt: "2025-07-22T10:00:00",
        confirmed: "Y",
        category: { id: 1, name: "전자기기" },
        images: [{ isThumbnail: "Y", fileUrl: "https://via.placeholder.com/150" }],
      },
    ],
    pageNumList: [1],
    pageRequestDTO: {
      page: 1,
      size: 10,
      category: null,
      keyword: null,
      sort: null,
    },
    prev: false,
    next: false,
    totalPage: 1,
    current: 1,
    prevPage: 0,
    nextPage: 0,
  };

  return Promise.resolve(dummyData);
}


// export function getCategoryList() {
//   return call("/api/category", "GET", null);
// }

export function getCategoryList() {
  const dummyCategories = [
    { id: 1, name: "전자기기" },
    { id: 2, name: "가구" },
    { id: 3, name: "생활용품" },
    { id: 4, name: "의류" },
    { id: 5, name: "기타" },
  ];
  return Promise.resolve(dummyCategories);
}

//프론트에서 const { tno, ...updateData } = reviewData 코드를 사용하면 tno가 body에서 빠지므로, 백엔드 DTO에 tno가 null로 들어가게 된다.
//그래서 reviewData.tno 이렇게 보내줘야 tno가 넣어짐
// export const updateReview = async (reviewData) => {
//   const res = await jwtAxios.put(
//     `${API_BASE_URL}/api/review/${reviewData.tno}`,
//     reviewData
//   );
//   return res.data;
// };

export const updateReview = async (reviewData) => {
  console.log("더미 후기 수정 요청:", reviewData);
  return Promise.resolve({ ...reviewData });
};

export const deleteReview = async (tno) => {
  console.log("더미 후기 삭제 요청:", tno);
  return Promise.resolve("deleted");
};

// export const deleteReview = async (tno) => {
//   try {
//     console.log("리뷰 삭제 API 호출 - tno:", tno);
//
//     const res = await jwtAxios.delete(`${API_BASE_URL}/api/review/${tno}`);
//     console.log("리뷰 삭제 성공:", res.data);
//
//     return res.data;
//   } catch (error) {
//     console.error("리뷰 삭제 실패:", error);
//
//     if (error.response?.data?.error) {
//       throw new Error(error.response.data.error);
//     } else if (error.response?.data?.message) {
//       throw new Error(error.response.data.message);
//     } else {
//       throw new Error("리뷰 삭제 중 오류가 발생했습니다.");
//     }
//   }

