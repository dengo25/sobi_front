import jwtAxios from "../util/JwtUtil.jsx";
import {API_BASE_URL} from "../util/api-config.js";
import {call} from "../member/ApiService.js";
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


export const updateReviewList = async (noticeData) => {
    const { tno, ...updateData } = noticeData;
    const res  = await jwtAxios.put(`${API_BASE_URL}/api/review/${tno}` , updateData);
    // console.log("수정 응답 데이터 : ",res.data);
    return res.data;
}

