import axios from "axios";

//원래 axios가 갖고 있는 것에 내가
//새로운 기능을 추가
const instance = axios.create();

//모든 axios요청을 가로 채어 동작한 함수를 만든다.
//인증이나 인가가 필요한 요청을 수행하기 전에 자동으로 동작하여ㅛ
//엑세스 토큰을 전달하도록 합니다.
//이와 같이 axios 요청을 가로채어 먼저 동작하는 것은 interceptor 라고 한다.

//요청을 가로 채어 수행하는 인터셉터
//인가나 인증이 필요한 요청인 경우 자동으로 엑세스토큰을 실어주려고

instance.interceptors.request.use((config /*요청 정보*/) => {
  //로컬스토리지에 저장된 토큰을 읽어온다
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    //토큰이 있다면 헤더에 토큰 정보를 담는다.
    config.headers.Authorization = `Bearer ${token}`;
  }
  //   //put이나 post 방식이면 ["Content-Type"]에 "multipart/form-data"을 저장
  //   if (config.method == "put" || config.method == "post") {
  //     config.headers["Content-Type"] = "multipart/form-data";
  //   }
  return config;
});

//응답을 가로 채어 수행하는 인터셉터
//만약 엑세스토큰이 만료되어 오류가 발생하는 경우
//자동으로 새로운 액세스 토큰 생성을 요청하려고
instance.interceptors.response.use(
  //성공적으로 응답이 오면 그대로 반환
  (response) => response,

  //백엔드로 부터 에러가 응답이 되었다면
  async (error) => {
    //에러 정보

    //원래 요청한 url 및 정보를 갖고 있는 객체를 갖고온다.
    //http://localhost:L8080/api/goods
    const originalRequest = error.config; //=>현재 응답한 정보를 담는다. 원래 내가 요청한 정보

    //오류가 403(권한 없음)이라면
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry /*!originalRequest._retry =>재시도 한경우가 아니라면*/
    ) {
      originalRequest._retry = true;

      try {
        //백엔드에 새로운 엑세스 토큰 발행을 요청한다.
        const res = await axios.post(
          "http://localhost:8080/refresh",
          {},
          { withCredentials: true } //=> 쿠키를 함께 보낸다
        );
        //새로 발급한 엑세스 토큰을 로컬스토리지에 저장한다.
        localStorage.setItem("token", res.data.token);

        //원래 하려던 요청정보 originalRequest 에는 만료된 엑세스 토큰이 있어서
        // 새로 발급한 엑세스 토큰으로 갱신 시킨다.
        originalRequest.headers.Authorization = `Bearer ${res.data.token}`;

        //원래 하려던 요청을 수행
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/";
      }
    }
    //이외의 에러는 그대로 처리
    return Promise.reject(error);
  }
);
export default instance;
