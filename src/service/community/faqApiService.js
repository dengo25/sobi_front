import jwtAxios from "../util/JwtUtil";
import { API_BASE_URL } from "../util/api-config";

// Faq 목록
export const getFaqList = async () => {
    const res = await jwtAxios.get(`${API_BASE_URL}/api/faq`);
    // console.log("응답 데이터 : ",res.data);
    return res.data;
}

// Faq 신규 등록
export const insertFaqList = async (dto) => {
    const res  = await jwtAxios.post(`${API_BASE_URL}/api/faq`, dto);
    // console.log("신규 응답 데이터 : ",res.data);
    return res.data;
}

// Faq 상세(수정시에만 사용)
export const getFaqDetail = async (faqNo) => {
    const res = await jwtAxios.get(`${API_BASE_URL}/api/faq/${faqNo}`);
    // console.log("수정 응답 데이터 : ",res.data);
    return res.data;
}

// Faq 수정
export const updateFaqList = async (faqNo, dto) => {
    const res  = await jwtAxios.put(`${API_BASE_URL}/api/faq/${faqNo}` , dto);
    return res.data;
}

// Faq 삭제
export const deleteFaq = async (faqNo) => {
    const res = await jwtAxios.delete(`${API_BASE_URL}/api/faq/${faqNo}`);
    // console.log("삭제 응답 데이터 : ", res.data);
    return res;
}