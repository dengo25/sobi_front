import { API_BASE_URL } from "../util/api-config.js";
import jwtAxios from "../util/JwtUtil.jsx";

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
        return Promise.reject("Authentication failed");
      } else {
        // Content-Type 확인하여 JSON인지 HTML인지 구분
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          // JSON 응답인 경우
          return response.json().then((errorData) => {
            console.error("API JSON 에러 응답:", errorData);
            throw new Error(
              errorData.error || errorData.message || `HTTP ${response.status}`
            );
          });
        } else {
          // HTML 또는 기타 형태의 응답인 경우
          return response.text().then((text) => {
            console.error("API 에러 응답 (비JSON):", text);

            // HTML 응답인 경우 사용자 친화적인 에러 메시지 제공
            if (text.includes("<!doctype") || text.includes("<html")) {
              // 상태 코드에 따른 적절한 에러 메시지
              let errorMessage;
              switch (response.status) {
                case 400:
                  errorMessage = "잘못된 요청입니다. 입력 정보를 확인해주세요.";
                  break;
                case 404:
                  errorMessage = "요청한 리소스를 찾을 수 없습니다.";
                  break;
                case 500:
                  errorMessage =
                    "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
                  break;
                default:
                  errorMessage = "요청 처리 중 오류가 발생했습니다.";
              }
              throw new Error(errorMessage);
            }

            // JSON 파싱 시도
            try {
              const errorData = JSON.parse(text);
              throw new Error(
                errorData.error ||
                  errorData.message ||
                  `HTTP ${response.status}: ${text}`
              );
            } catch (parseError) {
              // JSON 파싱 실패 시 원본 텍스트의 일부만 사용
              const shortText =
                text.length > 100 ? text.substring(0, 100) + "..." : text;
              throw new Error(`HTTP ${response.status}: ${shortText}`);
            }
          });
        }
      }
    })
    .catch((error) => {
      //네트워크 오류 또는 처리되지 않은 예외 발생 시 로그 출력
      console.error("API 호출 오류:", error);
      throw error; // 에러를 다시 throw해서 호출한 곳에서 처리할 수 있도록
    });
}

// 전체 후기 목록 조회 (페이징 포함)
export const getReviewList = async (pageParam) => {
  const res = await jwtAxios.get(`${API_BASE_URL}/api/review/list`, {
    params: pageParam,
  });
  return res.data;
};

// 내가 쓴 후기 목록 조회
export function getMyReviews() {
  return call("/api/review/my-reviews", "GET", null);
}

// 후기 상세 조회
export function getReview(reviewId) {
  return call(`/api/review/${reviewId}`, "GET", null);
}
