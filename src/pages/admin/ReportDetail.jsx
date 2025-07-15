import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Button,
  TextField,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Report as ReportIcon,
  Person as PersonIcon,
  AccountCircle as AccountIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
  Assignment as AssignmentIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ReportHeaderSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  background: `linear-gradient(135deg, ${theme.palette.error.main}15, ${theme.palette.warning.light}08)`,
}));

const DetailSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}));

const ActionSection = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  border: `2px solid ${theme.palette.primary.light}`,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  fontSize: 32,
  fontWeight: "bold",
  backgroundColor: theme.palette.error.main,
  margin: "0 auto",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 0),
  minHeight: 60,
}));

const InfoLabel = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  minWidth: 140,
  marginRight: theme.spacing(2),
}));

const InfoValue = styled(Box)({
  flex: 1,
});

const ReportDetail = ({ data, onBack, onViewReportReview }) => {
  const [report, setReport] = useState(data || null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReportReviewClick = (report, event) => {
    event.preventDefault();
    event.stopPropagation(); // 부모 클릭 이벤트 방지
    console.log("asdasdasd", report.reportId);
    console.log("asdasdasd", report.targetId);
    if (onViewReportReview) {
      onViewReportReview(report);
    } else {
      navigate(`/admin/report/review/${report.targetId}/${report.reportId}`);
    }
  };
  useEffect(() => {
    if (data) {
      setReport(data);
      setReason(
        `[${data.reportType}] ${data.detail || data.description || ""}`
      );
      setLoading(false);
    } else {
      setError("신고 데이터가 없습니다.");
      setLoading(false);
    }
  }, [data]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "PROCESSED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "처리 대기";
      case "PROCESSED":
        return "처리 완료";
      case "REJECTED":
        return "반려";
      default:
        return status;
    }
  };

  const getReportTypeColor = (type) => {
    switch (type) {
      case "가짜/조작된 리뷰":
        return "error";
      case "부적절한 표현 및 혐오 콘텐츠":
        return "warning";
      case "스팸 및 상업적 광고":
        return "info";
      case "민감한 주제의 표현":
        return "secondary";
      default:
        return "default";
    }
  };

  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="error">신고 정보를 찾을 수 없습니다.</Alert>
        {onBack && (
          <Button onClick={onBack} sx={{ mt: 2 }}>
            목록으로 돌아가기
          </Button>
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
        {onBack && (
          <Button onClick={onBack} sx={{ mt: 2 }}>
            목록으로 돌아가기
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "md", margin: "0 auto" }}>
      {/* 신고 헤더 섹션 */}
      <ReportHeaderSection>
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          <StyledAvatar sx={{ mb: 3 }}>
            <ReportIcon fontSize="large" />
          </StyledAvatar>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            신고 #{report.reportId}
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            {report.createdAt
              ? new Date(report.createdAt).toLocaleString("ko-KR")
              : ""}
          </Typography>

          <Chip
            label={getStatusLabel(report.status)}
            color={getStatusColor(report.status)}
            size="large"
            sx={{ mt: 2, fontWeight: 600 }}
          />
        </CardContent>
      </ReportHeaderSection>

      {/* 신고 상세 정보 섹션 */}
      <DetailSection>
        <CardContent sx={{ p: 4 }}>
          <SectionTitle variant="h6">
            <AssignmentIcon />
            신고 상세 정보
          </SectionTitle>

          <Grid container spacing={4}>
            {/* 신고자 정보 */}
            <Grid item xs={12} md={6}>
              <InfoRow>
                <InfoLabel>
                  <PersonIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    신고자
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Typography variant="body2" fontWeight={500}>
                    {report.reporterId || "알 수 없음"}
                  </Typography>
                </InfoValue>
              </InfoRow>
            </Grid>

            {/* 피신고자 정보 */}
            <Grid item xs={12} md={6}>
              <InfoRow>
                <InfoLabel>
                  <AccountIcon color="error" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    피신고자
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Typography variant="body2" fontWeight={500}>
                    {report.reportedId || "알 수 없음"}
                  </Typography>
                </InfoValue>
              </InfoRow>
            </Grid>

            {/* 신고 유형 */}
            <Grid item xs={12} md={6}>
              <InfoRow>
                <InfoLabel>
                  <CategoryIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    신고 유형
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Chip
                    label={report.reportType || "미분류"}
                    color={getReportTypeColor(report.reportType)}
                    size="small"
                    variant="filled"
                  />
                </InfoValue>
              </InfoRow>
            </Grid>

            {/* 타겟 번호 */}
            <Grid item xs={12} md={6}>
              <InfoRow>
                <InfoLabel>
                  <FlagIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    후기 번호
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Chip
                    label={`#${report.targetId || "N/A"}`}
                    color="primary"
                    size="small"
                    variant="outlined"
                    onClick={(event) => handleReportReviewClick(report, event)}
                  />
                </InfoValue>
              </InfoRow>
            </Grid>

            {/* 신고일자 */}
            <Grid item xs={12}>
              <InfoRow>
                <InfoLabel>
                  <CalendarIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    신고일자
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Typography variant="body2" fontWeight={500}>
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString("ko-KR")
                      : "정보 없음"}
                  </Typography>
                </InfoValue>
              </InfoRow>
            </Grid>
          </Grid>
        </CardContent>
      </DetailSection>

      {/* 신고 내용*/}
      <DetailSection>
        <CardContent sx={{ p: 4 }}>
          <SectionTitle variant="h6">
            <BlockIcon />
            신고 내용
          </SectionTitle>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="신고 내용"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="블랙리스트 등록 사유를 입력해주세요..."
            variant="outlined"
            disabled
          />
        </CardContent>
      </DetailSection>
    </Box>
  );
};

export default ReportDetail;
