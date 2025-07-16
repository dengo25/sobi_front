import axios from "axios";
import { API_BASE_URL } from "../util/api-config.js";

// beforeReq 인터셉터 정의
const beforeReq = (config) => {
  console.log("before request.............");

  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  console.log("token:" + accessToken);
  if (!accessToken) {
    console.log("Token Not Found");
    return Promise.reject(new Error("REQUIRE_LOGIN"));
  }

  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
};

// jwtAxios 생성 및 인터셉터 등록
const jwtAxios = axios.create();
jwtAxios.interceptors.request.use(beforeReq);

//관리자 메인 페이지 요청
export const getStatus = async () => {
  const res = await jwtAxios.get(`${API_BASE_URL}/api/admin/main`);
  return res.data;
};

export const getList = async (pageParam) => {
  const {
    page = 0,
    size = 10,
    sortBy = "memberReg",
    sortDir = "desc",
  } = pageParam || {};

  // console.log("API 요청 파라미터:", { page, size, sortBy, sortDir });

  try {
    const params = {
      page: page,
      size: size,
      sortBy: sortBy,
      sortDir: sortDir,
    };

    const res = await jwtAxios.get(`${API_BASE_URL}/api/admin/member`, {
      params: params,
    });

    // console.log("API 응답:", res.data);
    return res.data;
  } catch (error) {
    console.error("회원 목록 조회 API 오류:", error);
    throw error;
  }
};

//신고
export const report = async (reportParam) => {
  const res = await jwtAxios.put(`${API_BASE_URL}/api/report`, reportParam);
  return res.data;
};

// 신고 목록 조회 (페이징 + 필터링)
export const getReportList = async (searchParams) => {
  const {
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDir = "desc",
    status = null,
    reportType = null,
  } = searchParams || {};

  // console.log("신고 목록 API 요청 파라미터:", searchParams);

  try {
    const params = {};

    // 기본 페이징 파라미터
    params.page = page;
    params.size = size;
    params.sortBy = sortBy;
    params.sortDir = sortDir;

    // 필터 파라미터 (값이 있을 때만 추가)
    if (status) params.status = status;
    if (reportType) params.reportType = reportType;

    const res = await jwtAxios.get(`${API_BASE_URL}/api/admin/report`, {
      params: params,
    });

    // console.log("신고 목록 API 응답:", res.data);
    return res.data;
  } catch (error) {
    console.error("신고 목록 조회 API 오류:", error);
    throw error;
  }
};
// 신고 승인
export const approveReport = async (reportId, tno, detail) => {
  try {
    const res = await jwtAxios.put(
      `${API_BASE_URL}/api/admin/report/${reportId}`,
      {
        tno: parseInt(tno),
        detail: detail.trim(),
      }
    );
    return res.data;
  } catch (error) {
    console.error("승인 요청 실패:", error.response?.data);
    throw error;
  }
};

export const rejectReport = async (reportId) => {
  try {
    const res = await jwtAxios.patch(
      `${API_BASE_URL}/api/admin/report/${reportId}`
    );
    return res.data;
  } catch (error) {
    console.error("승인 요청 실패:", error.response?.data);
    throw error;
  }
};
//블랙리스트(차단) 해제
export const unblockUser = async (blacklistNo, reason) => {
  try {
    const response = await jwtAxios.post(
      `${API_BASE_URL}/api/admin/blacklist/unblock/${blacklistNo}`,
      {
        reason: reason,
      }
    );
    return response.data;
  } catch (error) {
    console.error("차단 해제 실패:", error);
    throw error;
  }
};

//관리자 review 조회
export async function getReview(tno) {
  const response = await jwtAxios.get(
    `${API_BASE_URL}/api/admin/review/${tno}`
  );
  return response.data;
}
//관리자 Review List
export const getReviewList = async (pageParam) => {
  const {
    page = 1,
    size = 10,
    sortBy = "createdAt",
    sortDir = "desc",
    confirmed = null,
  } = pageParam || {};

  // console.log("리뷰 목록 API 요청 파라미터:", {
  //   page,
  //   size,
  //   sortBy,
  //   sortDir,
  //   confirmed,
  // });

  try {
    const params = {
      page: page,
      size: size,
      sortBy: sortBy,
      sortDir: sortDir,
    };

    // confirmed가 유효한 값일 때만 추가 ("all", null, undefined는 제외)
    if (
      confirmed &&
      confirmed !== "all" &&
      confirmed !== null &&
      confirmed !== undefined
    ) {
      params.confirmed = confirmed;
      // console.log("confirmed 필터 적용:", confirmed);
    } else {
      console.log("confirmed 필터 없음 (전체 조회)");
    }

    // console.log("실제 전송 파라미터:", params);

    const res = await jwtAxios.get(`${API_BASE_URL}/api/admin/review/list`, {
      params: params,
    });

    // console.log("리뷰 목록 API 응답:", res.data);
    // console.log("조회된 리뷰 개수:", res.data?.reviews?.length || 0);

    return res.data;
  } catch (error) {
    console.error("리뷰 목록 조회 API 오류:", error);
    console.error("오류 응답:", error.response?.data);
    console.error("오류 상태코드:", error.response?.status);
    throw error;
  }
};
// 리뷰 승인 (confirm = 'Y')
export const confirmedReview = async (tno) => {
  const response = await jwtAxios.patch(
    `${API_BASE_URL}/api/admin/review/${tno}/approve`
  );
  return response.data;
};
// 리뷰 반려 (confirm = 'R')
export const rejectedReview = async (tno) => {
  const response = await jwtAxios.patch(
    `${API_BASE_URL}/api/admin/review/${tno}/reject`
  );
  return response.data;
};
// 리뷰 차단 (is_deleted = 'Y' + 블랙리스트 등록)
export const blockedReview = async (tno, reason) => {
  const params = new URLSearchParams();
  if (reason) params.append("reason", reason);

  const response = await jwtAxios.patch(
    `${API_BASE_URL}/api/admin/review/${tno}/block?${params}`
  );
  return response.data;
};

export default jwtAxios;
