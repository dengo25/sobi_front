"use client";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Container,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Report as ReportIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { report } from "../../service/admin/ApiService";
import { useNavigate, useLocation } from "react-router-dom";

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
  },
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  justifyContent: "flex-end",
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const ReportForm = () => {
  // props 제거
  const location = useLocation();
  const navigate = useNavigate();

  // 전달받은 데이터 추출
  const { reviewId, writerId, reporterId } = location.state || {};

  console.log("reviewId:", reviewId);
  console.log("writerId:", writerId);
  console.log("reporterId:", reporterId);

  const [reportType, setReportType] = useState("");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reportOptions = [
    "가짜/조작된 리뷰",
    "부적절한 표현 및 혐오 콘텐츠",
    "스팸 및 상업적 광고",
    "민감한 주제의 표현",
    "기타",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportType || !detail.trim()) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    const reportDto = {
      reporterId, // location.state에서 받은 값
      reportedId: writerId, // location.state에서 받은 값
      targetId: reviewId, // location.state에서 받은 값
      reportType,
      detail: detail.trim(),
    };

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // 직접 API 호출
      await report(reportDto);

      setSuccess("신고가 성공적으로 제출되었습니다.");

      // 2초 후 이전 페이지로 이동
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("신고 제출 실패: ", error);
      setError("신고 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReportType("");
    setDetail("");
    setError("");
    setSuccess("");
  };

  return (
    <ThemeProvider theme={sobiTheme}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <SectionTitle variant="h5">
              <ReportIcon />
              신고하기
            </SectionTitle>

            {/* 에러/성공 알림 */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              {/* 신고 사유 선택 */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>신고 사유</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="신고 사유"
                  required
                  disabled={loading}
                >
                  <MenuItem value="">선택하세요</MenuItem>
                  {reportOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 상세 내용 */}
              <TextField
                fullWidth
                label="상세 내용"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="신고 내용을 자세히 입력해주세요"
                multiline
                rows={3}
                required
                disabled={loading}
                inputProps={{ maxLength: 200 }} // 200글자 제한
                helperText={`신고 사유에 대한 구체적인 설명을 작성해주세요. (${detail.length}/200)`}
                sx={{ mb: 3 }}
              />

              {/* 신고 정보 표시 */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  borderRadius: 1,
                  mb: 3,
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  신고 정보
                </Typography>
                <Typography variant="body2">
                  • 신고자 ID: {reporterId}
                </Typography>
                <Typography variant="body2">
                  • 신고 대상 ID: {writerId}
                </Typography>
                <Typography variant="body2">• 대상 번호: {reviewId}</Typography>
              </Box>

              {/* 액션 버튼들 */}
              <ActionButtons>
                <Button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                >
                  초기화
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !reportType || !detail.trim()}
                  variant="contained"
                  startIcon={
                    loading ? <CircularProgress size={16} /> : <SendIcon />
                  }
                >
                  {loading ? "제출 중..." : "신고 제출"}
                </Button>
              </ActionButtons>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </ThemeProvider>
  );
};

export default ReportForm;
