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

//API 호출을 위한 공통 함수 정의
export function call(api, method, request) {
  //HTTP 요청 헤더 생성 및 Content-Type 설정
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  //로컬 스토리지에서 ACCESS_TOKEN 가져오기
  const accessToken = localStorage.getItem("ACCESS_TOKEN");

  //토큰이 존재하면 Authorization 헤더에 추가
  if (accessToken && accessToken !== null) {
    headers.append("Authorization", "Bearer " + accessToken);
  }

  //fetch 요청 옵션 구성
  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method, //요청방식
  };

  //request 객체가 있으면 JSON 문자열로 변환하여 body에 추가
  if (request) {
    options.body = JSON.stringify(request);
  }

  //fetch로 API 호출
  return fetch(options.url, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 403) {
        //403오류시 로그인 페이지로 리다이렉트
        window.location.href = "/login";
      } else {
        new Error(response);
      }
    })
    .catch((error) => {
      //네트워크 오류 또는 처리되지 않은 예외 발생 시 로그 출력
      console.log("http error");
      console.log(error);
    });
}

//관리자 메인 페이지 요청
export const getStatus = async () => {
  const res = await jwtAxios.get(`${API_BASE_URL}/api/admin/main`);
  return res.data;
}; // 회원 목록 조회 (페이징 + 검색 통합)
export const getList = async (pageParam) => {
  const {
    page = 1,
    size = 10,
    sortBy = "memberReg",
    sortDir = "desc",
    keyword = "", // 검색어 추가
  } = pageParam || {};

  console.log("API 요청 파라미터:", { page, size, sortBy, sortDir, keyword });

  try {
    const params = {
      page: page,
      size: size,
      sortBy: sortBy,
      sortDir: sortDir,
    };

    // 검색어가 있을 때만 keyword 파라미터 추가
    if (keyword && keyword.trim()) {
      params.keyword = keyword.trim();
    }

    const res = await jwtAxios.get(`${API_BASE_URL}/api/admin/member`, {
      params: params,
    });

    console.log("API 응답:", res.data);
    return res.data;
  } catch (error) {
    console.error("회원 목록 조회 API 오류:", error);
    throw error;
  }
};
// 개별 회원 정보 조회
export const getMember = async (memberId) => {
  const res = await jwtAxios.get(
    `${API_BASE_URL}/api/admin/member/${memberId}`
  );
  return res.data;
};

export default jwtAxios;
