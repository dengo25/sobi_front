import axios from "axios";
import { API_BASE_URL } from "./api-config";

// 먼저 beforeReq 정의
const beforeReq = (config) => {
    console.log("before request.............");

    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (!accessToken) {
        console.log("Token Not Found");
        return Promise.reject(new Error("REQUIRE_LOGIN"));
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
};

//  다음에 jwtAxios 만들고 인터셉터 등록
const jwtAxios = axios.create({
    baseURL: API_BASE_URL
});
jwtAxios.interceptors.request.use(beforeReq);

export default jwtAxios;
