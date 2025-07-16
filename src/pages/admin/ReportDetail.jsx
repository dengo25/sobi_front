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
import { Card, CardContent, Paper, Divider, Chip } from "@mui/material";
import {
  RateReview as ReviewIcon,
  Report as ReportIcon,
  Person as PersonIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectIcon,
  CalendarToday as CalendarIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ReportDetail = ({ data, onBack, onViewReportReview }) => {
  const [report, setReport] = useState(data || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [review, setReview] = useState(null);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const navigate = useNavigate();

  const handleReportReviewClick = (report, event) => {
    event.preventDefault();
    event.stopPropagation(); // 부모 클릭 이벤트 방지
    if (onViewReportReview) {
      onViewReportReview(report);
    } else {
      navigate(`/admin/report/review/${report.targetId}/${report.reportId}`);
    }
  };
  useEffect(() => {
    if (data && data.targetId) {
      setReport(data);
      // console.log("report", report);
      const id = parseInt(data.targetId);
      getReview(id).then((reviewData) => {
        setReview(reviewData);
      });
      setLoading(false);
    } else {
      setError("신고 데이터가 없습니다.");
      setLoading(false);
    }
  }, [data]);

  const handleReject = async () => {
    if (!window.confirm("이 신고를 반려하시겠습니까?")) return;
    try {
      await rejectReport(report.reportId);
      alert("신고가 반려 처리되었습니다.");
      if (onBack) onBack();
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
      await approveReport(report.reportId, report.targetId, blockReason);
      alert("리뷰가 차단되고 블랙리스트에 등록되었습니다.");
      setReview({ ...review, confirmed: "B", isDeleted: "Y" });
      handleCloseModal();
      if (onBack) onBack();
    } catch (err) {
      console.error("차단 실패:", err);
      setError("차단 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const getStatusChip = (confirmed) => {
    switch (confirmed) {
      case "Y":
        return <Chip icon={<ApprovedIcon />} label="승인" color="success" />;
      case "R":
        return (
          <Chip
            icon={<RejectIcon />}
            label="반려"
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
        <Alert severity="error">신고 데이터를 찾을 수 없습니다.</Alert>
        {onBack && (
          <Button onClick={onBack} sx={{ mt: 2 }}>
            목록으로 돌아가기
          </Button>
        )}
      </Box>
    );
  }

  if (!review) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>삭제된 게시물입니다.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "lg", margin: "0 auto" }}>
      {/* 신고 정보 섹션 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <ReportIcon />
            신고 정보 #{report.reportId}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Chip
              icon={<PersonIcon />}
              label={`신고자: ${report.reporterId}`}
              variant="outlined"
            />
            <Chip label={report.reportType} color="warning" variant="filled" />
            <Chip label={formatDate(report.createdAt)} variant="outlined" />
          </Box>
          {(report.detail || report.description) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                신고 사유:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap", // 줄바꿈 허용
                  wordBreak: "break-word", // 긴 단어 줄바꿈
                  maxWidth: "100%", // 최대 너비 설정
                  overflow: "visible", // 잘림 방지
                }}
              >
                {report.detail || report.description}
              </Typography>
            </Box>
          )}
        </CardContent>
        <Divider sx={{ my: 2 }} />
        {/* 신고된 리뷰 헤더 섹션 */}

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
              제목: {review?.title || "제목 없음"}
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

        {/* 리뷰 내용 섹션 */}

        <CardContent>
          <Divider sx={{ mb: 2 }} />
          <Paper
            sx={{ p: 2, backgroundColor: "grey.50", minHeight: 200 }}
            dangerouslySetInnerHTML={{
              __html: review?.content || "내용이 없습니다.",
            }}
          />
        </CardContent>
        <CardContent>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "center", mt: 2 }}
          >
            <Button
              variant="contained"
              color="error"
              startIcon={<ApprovedIcon />}
              onClick={handleOpenBlockModal}
              disabled={loading}
            >
              승인 (차단)
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
          </Stack>
        </CardContent>
      </Card>

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
    </Box>
  );
};
export default ReportDetail;
