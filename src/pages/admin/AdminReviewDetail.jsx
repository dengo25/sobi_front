import { useEffect, useState } from "react";
import {
  getReview,
  confirmedReview,
  rejectedReview,
  blockedReview,
} from "../../service/admin/ApiService.js";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router-dom";

const AdminReviewDetail = () => {
  const [review, setReview] = useState(null);
  const { tno } = useParams();

  useEffect(() => {
    const id = parseInt(tno);
    getReview(id).then((data) => {
      console.log(data);
      setReview(data);
    });
  }, [tno]);

  const handleConfirm = async () => {
    try {
      await confirmedReview(review.tno);
      alert("리뷰가 승인 처리되었습니다.");
      setReview({ ...review, confirmed: "Y" });
    } catch (err) {
      console.error("승인 실패:", err);
      alert("승인 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async () => {
    if (!window.confirm("이 리뷰를 반려하시겠습니까?")) return;
    try {
      await rejectedReview(review.tno);
      alert("리뷰가 반려 처리되었습니다.");
      setReview({ ...review, confirmed: "R" });
    } catch (err) {
      console.error("반려 실패:", err);
      alert("반려 중 오류가 발생했습니다.");
    }
  };

  const handleBlock = async () => {
    const detail = prompt("차단 사유를 입력해주세요:");
    if (!detail) return;
    try {
      await blockedReview(review.tno, detail);
      alert("리뷰가 차단되고 블랙리스트에 등록되었습니다.");
      setReview({ ...review, confirmed: "B", isDeleted: "Y" });
    } catch (err) {
      console.error("차단 실패:", err);
      alert("차단 중 오류가 발생했습니다.");
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
            spacing={1}
            sx={{ justifyContent: "flex-end", mt: 2 }}
          >
            {review.confirmed === "N" && (
              <>
                <button onClick={handleConfirm} style={btnStyle("#44C3AA")}>
                  승인
                </button>
                <button onClick={handleReject} style={btnStyle("#FFA000")}>
                  반려
                </button>
                <button onClick={handleBlock} style={btnStyle("#E53935")}>
                  차단
                </button>
              </>
            )}
          </Stack>
        </div>
      )}
    </div>
  );
};

const btnStyle = (bg) => ({
  padding: "8px 16px",
  backgroundColor: bg,
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
});

export default AdminReviewDetail;
