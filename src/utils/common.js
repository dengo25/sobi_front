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
