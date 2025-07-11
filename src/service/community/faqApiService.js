import axios from "axios";
import jwtAxios from "../util/JwtUtil";
import { API_BASE_URL } from "../util/api-config";

// 토큰 판별 인스턴스 선택
const getInstance = (token) => {
  return token ? jwtAxios : axios.create({ baseURL: API_BASE_URL });
};

// Faq 목록
export const getFaqList = async (token) => {
  try {
    const instance = getInstance(token);
    const res = await instance.get(`${API_BASE_URL}/api/faq`);
    // const res = await jwtAxios.get(`${API_BASE_URL}/api/faq`);
    // console.log("응답 데이터 : ",res.data);
    return res.data;
  } catch (error) {
    console.error("목록 조회 실패:", error);
    throw error;
  }
};

// Faq 페이징 목록 (새로 추가)
export const getFaqListWithPaging = async (params = {}) => {
  try {
    const {
      page = 0,
      size = 10,
      sortBy = "faqCreateDate",
      sortDirection = "desc",
    } = params;

    // size가 0이거나 유효하지 않으면 기본값 사용
    const validSize = size > 0 ? size : 10;
    const validPage = page >= 0 ? page : 0;

    const queryParams = new URLSearchParams({
      page: validPage.toString(),
      size: validSize.toString(),
      sortBy,
      sortDirection,
    });

    const res = await jwtAxios.get(
      `${API_BASE_URL}/api/faq/page?${queryParams.toString()}`
    );
    console.log("페이징 목록 조회:", res.data);
    if (!res.data) {
      throw new Error("응답 데이터가 없습니다.");
    }
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("에러 상세:", error.response.data);
      console.error("상태 코드:", error.response.status);
    }
    throw error;
  }
};

// Faq 신규 등록
export const insertFaqList = async (dto) => {
  try {
    const res = await jwtAxios.post(`${API_BASE_URL}/api/faq`, dto);
    // console.log("신규 응답 데이터 : ",res.data);
    return res.data;
  } catch (erro) {
    console.error("신규 등록 실패:", error);
  }
};

// Faq 상세(수정시에만 사용)
export const getFaqDetail = async (faqNo) => {
  try {
    const res = await jwtAxios.get(`${API_BASE_URL}/api/faq/${faqNo}`);
    // console.log("수정 응답 데이터 : ",res.data);
    return res.data;
  } catch (erro) {
    console.error("상세 조회 실패:", error);
  }
};

// Faq 수정
export const updateFaqList = async (faqNo, dto) => {
  try {
    const res = await jwtAxios.put(`${API_BASE_URL}/api/faq/${faqNo}`, dto);
    return res.data;
  } catch (erro) {
    console.error("수정 실패:", error);
  }
};

// Faq 삭제
export const deleteFaq = async (faqNo) => {
  try {
    const res = await jwtAxios.delete(`${API_BASE_URL}/api/faq/${faqNo}`);
    // console.log("삭제 응답 데이터 : ", res.data);
    return res;
  } catch (erro) {
    console.error("삭제 실패:", error);
  }
};
