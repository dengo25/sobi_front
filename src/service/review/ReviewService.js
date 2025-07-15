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

export async function getReview(tno) {
  const response = await axios.get(`${API_BASE_URL}/api/review/${tno}`);
  return response.data;
}

export function getCategoryList() {
  return call("/api/category", "GET", null);
}

//프론트에서 const { tno, ...updateData } = reviewData 코드를 사용하면 tno가 body에서 빠지므로, 백엔드 DTO에 tno가 null로 들어가게 된다.
//그래서 reviewData.tno 이렇게 보내줘야 tno가 넣어짐
export const updateReview = async (reviewData) => {
  const res = await jwtAxios.put(
    `${API_BASE_URL}/api/review/${reviewData.tno}`,
    reviewData
  );
  return res.data;
};

export const deleteReview = async (tno) => {
  try {
    console.log("리뷰 삭제 API 호출 - tno:", tno);

    const res = await jwtAxios.delete(`${API_BASE_URL}/api/review/${tno}`);
    console.log("리뷰 삭제 성공:", res.data);

    return res.data;
  } catch (error) {
    console.error("리뷰 삭제 실패:", error);

    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("리뷰 삭제 중 오류가 발생했습니다.");
    }
  }
};
