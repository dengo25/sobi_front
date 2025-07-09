import jwtAxios from "../util/JwtUtil";
import { API_BASE_URL } from "../util/api-config";

// Notice 목록
export const getNoticeList = async () => {
    const res = await jwtAxios.get(`${API_BASE_URL}/api/notice`);
    // console.log("응답 데이터 : ",res.data);
    return res.data;
}

// Notice 신규 등록
export const insertNoticeList = async (dto) => {
    const res  = await jwtAxios.post(`${API_BASE_URL}/api/notice`, dto);
    // console.log("신규 응답 데이터 : ",res.data);
    return res.data;
}

// Notice 상세
export const getNoticeDetail = async (noticeNo) => {
    const res = await jwtAxios.get(`${API_BASE_URL}/api/notice/${noticeNo}`);
    // console.log("상세 응답 데이터 : ",res.data);
    return res.data;
}

// Notice 수정
export const updateNoticeList = async (noticeData) => {
    const { noticeNo, ...updateData } = noticeData;
    const res  = await jwtAxios.put(`${API_BASE_URL}/api/notice/${noticeNo}` , updateData);
    // console.log("수정 응답 데이터 : ",res.data);
    return res.data;
}

// Notice 삭제
export const deleteNotice = async (noticeNo) => {
    const res = await jwtAxios.delete(`${API_BASE_URL}/api/notice/${noticeNo}`);
    // console.log("삭제 응답 데이터 : ", res.data);
    return res;
}