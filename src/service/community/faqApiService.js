import axios from "axios";
import jwtAxios from "../util/JwtUtil";

const axiosConfig = {
    headers:{
        "Content-Type" : "application/json"
    }
}

// Faq 목록
export const getFaqList = async () => {
    const res = await jwtAxios.get("/api/faq");
    console.log("응답 데이터 : ",res.data);
    return res.data;
}

// Faq 신규 등록
export const insertFaqList = async () => {
    const res  = await jwtAxios.post("/api/faq", dto, axiosConfig);
    return res.data;
}

// Faq 수정



// Faq 삭제


