let backendHost; //백엔드 주소를 담을 변수 선언

// 현재 브라우저의 호스트 이름을 가져옴
const hostname = window && window.location && window.location.hostname;

// 개발 환경일 경우 백엔드 주소를 로컬 서버로 설정
if (hostname === "localhost") {
    backendHost = "http://localhost:8080";
}


// 최종적으로 사용할 API 기본 URL을 export
export const API_BASE_URL = `${backendHost}`;
