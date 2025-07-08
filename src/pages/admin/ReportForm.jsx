import { useState } from "react";

const ReportForm = ({ reporterId, reportedId, targetId, onSubmit }) => {
  const [reportType, setReportType] = useState("");
  const [detail, setDetail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportDto = {
      reporterId,
      reportedId,
      targetId,
      reportType,
      detail,
    };
    onSubmit(reportDto); // 부모 컴포넌트나 서비스로 전달
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: "1rem", border: "1px solid #ccc" }}
    >
      <h3>신고하기</h3>

      <div>
        <label>신고 사유</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          required
        >
          <option value="">선택하세요</option>
          <option value="가짜/조작된 리뷰">가짜/조작된 리뷰</option>
          <option value="부적절한 표현 및 혐오 콘텐츠">
            부적절한 표현 및 혐오 콘텐츠
          </option>
          <option value="스팸 및 상업적 광고">스팸 및 상업적 광고</option>
          <option value="민감한 주제의 표현">민감한 주제의 표현</option>
        </select>
      </div>

      <div>
        <label>상세 내용</label>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="신고 내용을 자세히 입력해주세요"
          rows={5}
          required
        />
      </div>

      <button type="submit">신고 제출</button>
    </form>
  );
};

export default ReportForm;
