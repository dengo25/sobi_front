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
// export const getList = async () => {
//   const res = await jwtAxios.get(`${API_BASE_URL}/api/admin/member`, {});
//   return res.data;
// };

export const getList = async () => {
  const res = await jwtAxios.get("http://localhost:8080/api/admin/member");
  return res.data;
};
export const getMember = async (memberId) => {
  const res = await jwtAxios.get(
    API_BASE_URL + `/api/admin/member/${memberId}`
  );
  return res.data;
};
// export const getList = async (pageParam) => {
//     const res = await jwtAxios.get(`${prefix}/list`, { params: pageParam });
//     return res.data;
// };
