import axios from "axios";
import jwtAxios from "../util/JwtUtil";
import { API_BASE_URL } from "../util/api-config";

// 토큰 판별 인스턴스 선택
const getInstance = (token) => {
  return token ? jwtAxios : axios.create({ baseURL: API_BASE_URL });
};

// Notice 목록
export const getNoticeList = async (token) => {
  try {
    const instance = getInstance(token);
    const res = await instance.get(`${API_BASE_URL}/api/notice`);
    // const res = await jwtAxios.get(`${API_BASE_URL}/api/notice`);
    // console.log("응답 데이터 : ",res.data);
    return res.data;
  } catch (error) {
    console.error("목록 조회 실패:", error);
    throw error;
  }
};

// Notice 페이징 목록
export const getNoticeListWithPaging = async (params = {}, token) => {
  try {
    const {
      page = 0,
      size = 10,
      sortBy = "noticeCreateDate",
      sortDirection = "desc",
      searchKeyword = "",
      searchType = "",
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    queryParams.append("sortBy", sortBy);
    queryParams.append("sortDirection", sortDirection);

    if (searchKeyword && searchKeyword.trim() !== "") {
      queryParams.append("searchKeyword", searchKeyword);
      if (searchType) {
        queryParams.append("searchType", searchType);
      }
    }

    const instance = getInstance(token);
    const res = await instance.get(
      `${API_BASE_URL}/api/notice/page?${queryParams.toString()}`
    );
    // const res = await jwtAxios.get(
    //   `${API_BASE_URL}/api/notice/page?${queryParams.toString()}`
    // );
    console.log("페이징 목록 조회:", res.data);
    if (!res.data) {
      throw new Error("응답 데이터가 없습니다.");
    }
    return res.data;
  } catch (error) {
    if (error.res) {
      console.error("에러 상세:", error.res.data);
      console.error("상태 코드:", error.res.status);
    }
    throw error;
  }
};

// 조회수 증가
export const incrementNoticeViewCount = async (noticeNo) => {
  try {
    const res = await jwtAxios.patch(
      `${API_BASE_URL}/api/notice/${noticeNo}/views`
    );
    return res.data;
  } catch (error) {
    console.error("조회수 증가 실패:", error);
    throw error;
  }
};

// 전체 게시글 카운트
export const getTotalCount = async () => {
  try {
    const res = await jwtAxios.get(`${API_BASE_URL}/api/notice/count`);
    console.log("전체 게시글 수:", res.data.totalElements);
    return res.data.totalElements;
  } catch (error) {
    console.error("카운트 조회 실패:", error);
  }
};

// 검색된 게시글 카운트
export const getSearchCount = async (searchType, keyword) => {
  try {
    const res = await jwtAxios.get(`${API_BASE_URL}/api/notice/search/count`, {
      params: { searchType, keyword },
    });
    // console.log('검색 결과 수:', res.data.searchCount);
    return res.data.searchCount;
  } catch (error) {
    console.error("검색 카운트 조회 실패:", error);
  }
};

// Notice 신규 등록
export const insertNoticeList = async (dto) => {
  try {
    const res = await jwtAxios.post(`${API_BASE_URL}/api/notice`, dto);
    console.log("신규 응답 데이터 : ", res.data);
    console.log("dto try : ", dto);
    return res.data;
  } catch (error) {
    console.log("dto erro : ", dto);
    console.error("신규 등록 실패:", error);
    throw error;
  }
};

// Notice 상세
export const getNoticeDetail = async (noticeNo) => {
  try {
    const res = await jwtAxios.get(`${API_BASE_URL}/api/notice/${noticeNo}`);
    // console.log("상세 응답 데이터 : ",res.data);
    return res.data;
  } catch (error) {
    console.error("상세페이지 조회 실패:", error);
    throw error;
  }
};

// Notice 수정
export const updateNoticeList = async (noticeData) => {
  try {
    const { noticeNo, ...updateData } = noticeData;
    const res = await jwtAxios.put(
      `${API_BASE_URL}/api/notice/${noticeNo}`,
      updateData
    );
    // console.log("수정 응답 데이터 : ",res.data);
    return res.data;
  } catch (error) {
    console.error("수정 실패:", error);
    throw error;
  }
};

// Notice 삭제
export const deleteNotice = async (noticeNo) => {
  try {
    const res = await jwtAxios.delete(`${API_BASE_URL}/api/notice/${noticeNo}`);
    // console.log("삭제 응답 데이터 : ", res.data);
    return res;
  } catch (error) {
    console.error("삭제 실패:", error);
    throw error;
  }
};
