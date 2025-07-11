import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { processReport, getReview } from "../../service/admin/ApiService";

const ReportedReview = () => {
  const { targetId } = useParams();
  const [review, setReview] = useState(null);
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("reportId");
  const navigate = useNavigate();

  useEffect(() => {
    getReview(targetId).then((data) => {
      console.log(data);
      setReview(data);
    });
  }, [targetId]);

  const handleApprove = async () => {
    if (!window.confirm("이 리뷰를 정상 게시글로 승인 처리하시겠습니까?"))
      return;
    try {
      await processReport(reportId, {
        action: "REJECT", // 또는 "APPROVE"로 바꿔도 됨 (정책에 따라)
        reason: "게시글 문제 없음으로 관리자 승인",
      });
      alert("신고가 반려 처리되었습니다.");
      navigate("/admin/report");
    } catch (err) {
      console.error("승인 실패:", err);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2>리뷰 상세 보기</h2>

      {review && (
        <div className="content-area">
          <h3>{review.title}</h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: review.content }}
          />

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "flex-end", mt: 4 }}
          >
            {reportId && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                >
                  문제 없음 (신고 반려)
                </Button>
              </>
            )}
          </Stack>
        </div>
      )}
    </div>
  );
};

export default ReportedReview;
