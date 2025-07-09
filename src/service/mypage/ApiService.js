import { API_BASE_URL } from "../util/api-config.js";
import jwtAxios from "../util/JwtUtil.jsx";

//API 호출을 위한 공통 함수 정의
function call(api, method, request) {
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

  console.log("Review API 호출:", {
    url: options.url,
    method: options.method,
    headers: Object.fromEntries(headers.entries()),
    body: options.body,
  });

  //fetch로 API 호출
  return fetch(options.url, options)
    .then((response) => {
      console.log("Review API 응답 상태:", response.status);

      if (response.status === 200) {
        return response.json();
      } else if (response.status === 403) {
        //403오류시 로그인 페이지로 리다이렉트
        console.error("인증 오류 - 로그인 페이지로 이동");
        return Promise.reject("Authentication failed");
      } else {
        // 에러 응답도 JSON으로 파싱해서 확인
        return response.text().then((text) => {
          console.error("Review API 에러 응답:", text);
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
      console.error("Review API 호출 오류:", error);
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
