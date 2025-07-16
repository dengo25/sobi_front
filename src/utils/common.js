// 텍스트 추출 함수
export const stripHtml = (html) => {
  if (!html) return "";
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  } catch (error) {
    console.error("HTML 파싱 오류:", error);
    return html; // 파싱 실패 시 원본 반환
  }
};

// 날짜 포맷팅 함수
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, "-")
    .replace(/\s/g, "")
    .slice(0, -1); // 2024-01-01 형식
};


// [인풋용] 빈값 알림 함수
export const isEmptyAndAlert = (item, message) => {
  if(!item.trim()){
    alert(message)
    return true;
  }
  return false;
}


// [에디터 컨텐츠용] 빈값 알림 함수 (HTML 태그 제거 후 체크)
export const isEditorEmptyAndAlert = (editorContent, message) => {
  // HTML 태그 제거하고 공백 문자들 제거
  const textContent = editorContent
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/&nbsp;/g, ' ') // &nbsp; 공백 문자 변환
    .replace(/\s+/g, ' ') // 연속된 공백을 하나로
    .trim();
  
  console.log("에디터 원본 내용:", editorContent);
  console.log("텍스트만 추출:", textContent);
  
  if (!textContent) {
    alert(message);
    return true;
  }
  return false;
};