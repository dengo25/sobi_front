import { useEffect, useState } from "react";
import {
  getReview,
  rejectReport,
  approveReport,
} from "../../service/admin/ApiService.js";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Button,
  Box,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router-dom";
const ReoprtReviewDetail = () => {
  const [review, setReview] = useState(null);
  const { tno, reportId } = useParams();
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const id = parseInt(tno);
    getReview(id).then((data) => {
      console.log(data);
      setReview(data);
    });
  }, [tno]);

  const handleReject = async () => {
    if (!window.confirm("이 신고를 반려하시겠습니까?")) return;
    try {
      await rejectReport(reportId);
      alert("신고가 반려 처리되었습니다.");
    } catch (err) {
      console.error("반려 실패:", err);
      alert("반려 중 오류가 발생했습니다.");
    }
  };
  const handleOpenBlockModal = () => {
    setOpenBlockModal(true);
    setBlockReason("");
    setError("");
  };

  const handleCloseModal = () => {
    setOpenBlockModal(false);
    setBlockReason("");
    setError("");
    setLoading(false);
  };

  const handleConfirmBlock = async () => {
    if (!blockReason.trim()) {
      setError("차단 사유를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await approveReport(reportId, tno, blockReason);
      alert("리뷰가 차단되고 블랙리스트에 등록되었습니다.");
      setReview({ ...review, confirmed: "B", isDeleted: "Y" });
      handleCloseModal();
    } catch (err) {
      console.error("차단 실패:", err);
      setError("차단 중 오류가 발생했습니다.");
      setLoading(false);
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
            <>
              <button onClick={handleOpenBlockModal}>승인</button>
              <button onClick={handleReject}>반려</button>
            </>
          </Stack>
        </div>
      )}
      {/* 차단 승인 모달 */}
      <Dialog
        open={openBlockModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>신고 승인</DialogTitle>
        <DialogContent>
          {review && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                리뷰: {review.title}
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="차단 사유"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="차단 사유를 입력해주세요..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={loading}>
            취소
          </Button>
          <Button
            onClick={handleConfirmBlock}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? "처리 중..." : "승인"}
          </Button>
        </DialogActions>
      </Dialog>
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

export default ReoprtReviewDetail;
