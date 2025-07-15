import { API_BASE_URL } from "../util/api-config.js";
import jwtAxios from "../util/JwtUtil.jsx";
import store from "../../store.jsx";
import { logout } from "../../slice/memberSlice.jsx";
import axios from "axios";

//API 호출을 위한 공통 함수 정의
export function call(api, method, request) {
  //HTTP 요청 헤더 생성 및 Content-Type 설정
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  //로컬 스토리지에서 ACCESS_TOKEN 가져오기
  const accessToken = localStorage.getItem("ACCESS_TOKEN");

  //토큰이 존재하면 Authorization 헤더에 추가
  if (accessToken && accessToken !== null && accessToken !== "null") {
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

  console.log("API 호출:", {
    url: options.url,
    method: options.method,
    headers: Object.fromEntries(headers.entries()),
    body: options.body,
  });

  //fetch로 API 호출
  return fetch(options.url, options)
    .then((response) => {
      console.log("API 응답 상태:", response.status);

      if (response.status === 200) {
        return response.json();
      } else if (response.status === 403) {
        //403오류시 로그인 페이지로 리다이렉트
        console.error("인증 오류 - 로그인 페이지로 이동");
        // window.location.href = "/login";
        return Promise.reject("Authentication failed");
      } else {
        // 에러 응답도 JSON으로 파싱해서 확인
        return response.text().then((text) => {
          console.error("API 에러 응답:", text);
          let errorData;
          try {
            errorData = JSON.parse(text);
          } catch (e) {
            errorData = { error: text };
          }
          throw new Error(
            errorData.error || `HTTP ${response.status}: ${text}`
          );
        });
      }
    })
    .catch((error) => {
      //네트워크 오류 또는 처리되지 않은 예외 발생 시 로그 출력
      console.error("API 호출 오류:", error);
      throw error; // 에러를 다시 throw해서 호출한 곳에서 처리할 수 있도록
    });
}

// 로그인 함수: userDTO를 post로 전달하여 로그인 시도
export async function signin(memberDTO) {
  const response = await call("/auth/login", "POST", memberDTO);
  return response;
}

//로그아웃 함수: 토큰 제거 후 로그인 페이지로 이동
export function signout() {
  // localStorage.setItem("ACCESS_TOKEN", null);
  localStorage.removeItem("ACCESS_TOKEN");
  localStorage.removeItem("LOGIN_USER");
  localStorage.removeItem("persist:root");

  // Redux 상태 초기화
  store.dispatch(logout());
  window.location.href = "/login";
}

//회원가입 함수: userDTO를 post로 전달
export function signup(memberDTO) {
  return call("/auth/signup", "POST", memberDTO);
}

// 소셜 로그인 함수: provider에 따라 OAuth2 인증시작
export function socialLogin(provider) {
  //현재 프론트엔드 url을 구성
  const frontendUrl = window.location.protocol + "//" + window.location.host;
  console.log("frontendUrl = " + frontendUrl);

  //소셜 로그인 url로 리다이렉트 (OAuth2 인증 시작)
  //프론트엔드에서 처리하지않고 백엔드에서 처리하도록 위임하는 구조
  window.location.href =
    API_BASE_URL +
    "/oauth2/authorization/" +
    provider +
    "?redirect_url=" +
    frontendUrl;
}

//로그인 후 헤더에서 로그인 삭제 함수
export function isLoggedIn() {
  const token = localStorage.getItem("ACCESS_TOKEN");
  return !!(token && token !== "null");
}

// 마이페이지 정보 조회 함수
export function getMypage() {
  return call("/api/mypage", "GET", null);
}

// 마이페이지 정보 수정 함수
export function updateMypage(memberDTO) {
  return call("/api/mypage", "PATCH", memberDTO);
}

// 회원 탈퇴 함수
export function deleteMypage(password) {
  return call("/api/mypage", "DELETE", { password: password });
}

// 쪽지 전송
export function sendMessage(messageDTO) {
  console.log("쪽지 전송 요청:", messageDTO);
  return call("/api/messages/send", "POST", messageDTO);
}

// 받은 쪽지 목록 조회
export function getReceivedMessages() {
  return call("/api/messages/received", "GET", null);
}

// 보낸 쪽지 목록 조회
export function getSentMessages() {
  return call("/api/messages/sent", "GET", null);
}

// 쪽지 읽음 처리
export function markMessageAsRead(messageId) {
  return call(`/api/messages/${messageId}/read`, "PATCH", null);
}

// 쪽지 삭제 (발신자)
export function deleteMessageBySender(messageId) {
  return call(`/api/messages/${messageId}/sender`, "DELETE", null);
}

// 쪽지 삭제 (수신자)
export function deleteMessageByReceiver(messageId) {
  return call(`/api/messages/${messageId}/receiver`, "DELETE", null);
}

// 읽지 않은 쪽지 개수 조회
export function getUnreadMessageCount() {
  return call("/api/messages/unread-count", "GET", null);
}

//-------------------------------------------------------------------
export const getList = async (pageParam) => {
  const res = await jwtAxios.get(`${API_BASE_URL}/api/review/list`, {
    params: pageParam,
  });
  return res.data;
};

// 토큰 없이 리스트 조회
export const getListWithoutToken = async (pageParam) => {
  const res = await axios.get(`${API_BASE_URL}/api/review/list`, {
    params: pageParam,
  });
  return res.data;
};

/**
 * 이메일 중복 확인 함수
 * @param {string} email - 확인할 이메일 주소
 * @returns {Promise<Object>} - { available: boolean, message: string }
 */
export async function checkEmailDuplicate(email) {
  try {
    const encodedEmail = encodeURIComponent(email);

    const response = await fetch(
      `${API_BASE_URL}/auth/check-email?email=${encodedEmail}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("이메일 중복 확인 API 응답 상태:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("이메일 중복 확인 결과:", data);
      return data;
    } else {
      // 에러 응답 처리
      const errorData = await response.json();
      console.error("이메일 중복 확인 API 에러:", errorData);
      return {
        available: false,
        message: errorData.message || "이메일 확인 중 오류가 발생했습니다.",
      };
    }
  } catch (error) {
    console.error("이메일 중복 확인 네트워크 오류:", error);
    return {
      available: false,
      message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
}
