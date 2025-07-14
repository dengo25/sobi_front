import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { getReportDetail } from "../../service/admin/ApiService";

const sobiTheme = createTheme({
  palette: {
    primary: {
      main: "#44C3AA",
      light: "#6FD4BB",
      dark: "#045242",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#045242",
      light: "#44C3AA",
      dark: "#033A30",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    success: {
      main: "#4caf50",
    },
  },
});

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

const ReportDetail = () => {
  const [report, setReport] = useState(null);
  const { reportId } = useParams();
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getReportDetail(reportId);
        setReport(data);
        // 기본 사유로 초기값 세팅
        setReason(`[${data.reportType}] ${data.detail}`);
      } catch (err) {
        setError("신고 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  // 승인 처리
  const handleApprove = async () => {
    try {
      setActionLoading(true);

      await addToBlacklist({
        memberId: report.reportedId,
        reason: reason,
        reportType: report.reportType,
        reportId: parseInt(reportId),
      });

      await processReport(reportId, {
        action: "APPROVE",
        reason: "블랙리스트 등록 및 승인 처리",
      });

      alert("블랙리스트 등록 및 승인 완료되었습니다.");
      navigate("/admin/report");
    } catch (err) {
      console.error(err);
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setActionLoading(false);
      setApproveDialogOpen(false);
    }
  };

  // 반려 처리
  const handleReject = async () => {
    try {
      setActionLoading(true);

      await processReport(reportId, {
        action: "REJECT",
        reason: "관리자 판단에 의한 반려",
      });

      alert("신고가 반려되었습니다.");
      navigate("/admin/report");
    } catch (err) {
      console.error(err);
      alert("반려 처리 중 오류가 발생했습니다.");
    } finally {
      setActionLoading(false);
      setRejectDialogOpen(false);
    }
  };

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

  if (loading) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  if (!report) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Alert severity="warning">신고 데이터를 찾을 수 없습니다.</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={sobiTheme}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* 뒤로가기 버튼 */}
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/report")}
            variant="outlined"
          >
            목록으로 돌아가기
          </Button>
        </Box>

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
                      타겟 번호
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    <Chip
                      label={`#${report.targetId || "N/A"}`}
                      color="primary"
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        if (report.targetId) {
                          navigate(
                            `/admin/report/review/${report.targetId}/${report.reportId}`
                          );
                        } else {
                          alert("타겟 ID가 없습니다.");
                        }
                      }}
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
      </Container>
    </ThemeProvider>
  );
};

export default ReportDetail;
