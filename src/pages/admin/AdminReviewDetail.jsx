import { useEffect, useState } from "react";
import {
  confirmedReview,
  rejectedReview,
  blockedReview,
} from "../../service/admin/ApiService.js";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Alert,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  CheckCircle as ApprovedIcon,
  Cancel as RejectIcon,
  Block as BlockIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

const AdminReviewDetail = ({ data, onBack }) => {
  const [review, setReview] = useState(data || null);
  const [loading, setLoading] = useState(false);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      setReview(data);
    }
  }, [data]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await confirmedReview(review.tno);
      alert("리뷰가 승인 처리되었습니다.");
      setReview({ ...review, confirmed: "Y" });
    } catch (err) {
      console.error("승인 실패:", err);
      alert("승인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm("이 리뷰를 반려하시겠습니까?")) return;
    setLoading(true);
    try {
      await rejectedReview(review.tno);
      alert("리뷰가 반려 처리되었습니다.");
      setReview({ ...review, confirmed: "R" });
    } catch (err) {
      console.error("반려 실패:", err);
      alert("반려 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    setOpenBlockModal(true);
    setError("");
    setBlockReason("");
  };
  const handleCloseModal = () => {
    setOpenBlockModal(false);
    setBlockReason("");
    setError("");
  };

  const handleConfirmBlock = async () => {
    if (!blockReason.trim()) {
      setError("차단 사유를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await blockedReview(review.tno, blockReason.trim());
      alert("리뷰가 차단되고 블랙리스트에 등록되었습니다.");
      setReview({ ...review, confirmed: "B", isDeleted: "Y" });
      handleCloseModal();
    } catch (err) {
      console.error("차단 실패:", err);
      setError("차단 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  const getStatusChip = (confirmed) => {
    switch (confirmed) {
      case "Y":
        return <Chip icon={<ApprovedIcon />} label="승인됨" color="success" />;
      case "R":
        return (
          <Chip
            icon={<RejectIcon />}
            label="반려됨"
            color="error"
            variant="outlined"
          />
        );
      case "B":
        return <Chip icon={<BlockIcon />} label="차단됨" color="error" />;
      default:
        return <Chip label="대기중" color="warning" variant="outlined" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("ko-KR");
  };
  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="error">리뷰 정보를 찾을 수 없습니다.</Alert>
        {onBack && (
          <Button onClick={onBack} sx={{ mt: 2 }}>
            목록으로 돌아가기
          </Button>
        )}
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3, maxWidth: "lg", margin: "0 auto" }}>
      {/* 헤더 섹션 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              {review?.title || "제목 없음"}
            </Typography>
            <Box>{getStatusChip(review?.confirmed)}</Box>
          </Box>

          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                작성자: {review?.memberId || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                작성일: {formatDate(review?.createdAt)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 내용 섹션 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            리뷰 내용
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Paper
            sx={{ p: 2, backgroundColor: "grey.50", minHeight: 200 }}
            dangerouslySetInnerHTML={{
              __html: review?.content || "내용이 없습니다.",
            }}
          />
        </CardContent>
      </Card>

      {/* 관리 버튼 섹션 */}
      <Card>
        <CardContent>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "center", mt: 2 }}
          >
            {review?.confirmed === "N" && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApprovedIcon />}
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  승인
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<RejectIcon />}
                  onClick={handleReject}
                  disabled={loading}
                >
                  반려
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<BlockIcon />}
                  onClick={handleBlock}
                  disabled={loading}
                >
                  차단
                </Button>
              </>
            )}

            {review?.confirmed !== "N" && (
              <Typography variant="body2" color="text.secondary">
                이미 처리된 리뷰입니다.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
      {/* 차단 확인 모달 추가 */}
      <Dialog
        open={openBlockModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>리뷰 차단</DialogTitle>
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
            {loading ? "처리 중..." : "차단"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default AdminReviewDetail;
