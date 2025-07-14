import axios from "axios";
import jwtAxios from "../util/JwtUtil";
import { API_BASE_URL } from "../util/api-config";

// 토큰 판별 인스턴스 선택
const getInstance = (token) => {
  return token ? jwtAxios : axios.create({ baseURL: API_BASE_URL });
};

/* 메인 표출용 */
// 후기 : 최신 10건
export const reviewLimit10List = async (token) => {
  try {
    const instance = getInstance(token);
    const res = await instance.get(`${API_BASE_URL}/api/review/list?page=1&size=10`);
    console.log("10건 조회 응답 데이터 : ", res.data);
    return res.data;
  } catch (error) {
    console.error("10건 조회 실패:", error);
    throw error;
  }
};

// 후기 : 최신 5건
export const reviewLimit5List = async (token) => {
  try {
    const instance = getInstance(token);
    const res = await instance.get(`${API_BASE_URL}/api/review/list?page=1&size=5`);
    console.log("최신 5건 조회 응답 데이터 : ", res.data);
    return res.data;
  } catch (error) {
    console.error("최신 5건 조회 실패:", error);
    throw error;
  }
};

// 후기 : 최신 5건(카테고리1)
export const reviewLimit5ListfromCateogry1 = async (token) => {
  try {
    const instance = getInstance(token);
    const res = await instance.get(`${API_BASE_URL}/api/review/list?page=1&size=5&category=1`);
    console.log("[c1] 최신 5건 조회 응답 데이터 : ", res.data);
    return res.data;
  } catch (error) {
    console.error("[c1] 최신 5건 조회 실패:", error);
    throw error;
  }
};

// 후기 : 최신 5건(카테고리2)
export const reviewLimit5ListfromCateogry2 = async (token) => {
  try {
    const instance = getInstance(token);
    const res = await instance.get(`${API_BASE_URL}/api/review/list?page=1&size=5&category=2`);
    console.log("[c2] 최신 5건 조회 응답 데이터 : ", res.data);
    return res.data;
  } catch (error) {
    console.error("[c2] 최신 5건 조회 실패:", error);
    throw error;
  }
};

// 공지사항 : 최신 3건
export const noticeLimit3List = async (token) => {
  try {
    const instance = getInstance(token);
    const res = await instance.get(`${API_BASE_URL}/api/notice/main`);
    console.log("최신 3건 조회 응답 데이터 : ", res.data);
    return res.data;
  } catch (error) {
    console.error("최신 3건 조회 실패:", error);
    throw error;
  }
};

// http://localhost:8080/api/review/list?page=1&size=5
// http://localhost:8080/api/review/list?page=1&size=5&category=1
// http://localhost:8080/api/review/list?page=1&size=5&category=2
