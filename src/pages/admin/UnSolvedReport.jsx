"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Container,
  Card,
  Chip,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Report as ReportIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import jwtAxios from "../../service/util/JwtUtil";

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
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UnSolvedReport = () => {
  const [reportList, setReportList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await jwtAxios.get(
          "http://localhost:8080/api/admin/report"
        );
        setReportList(res.data || []);
      } catch (err) {
        console.error("신고 목록 조회 오류:", err);
        setError("신고 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
        <Container maxWidth="lg" sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={sobiTheme}>
      <Container maxWidth="lg" sx={{ p: 2 }}>
        {/* 헤더 */}
        <SectionTitle variant="h6">
          <ReportIcon />
          미해결 신고 목록 ({reportList.length}건)
        </SectionTitle>

        {/* 신고 목록 테이블 */}
        <Card>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600 }}>신고 대상 ID</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    신고일자
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    신고 유형
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>상세 내용</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    타겟 번호
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportList.length > 0 ? (
                  reportList.map((report, index) => (
                    <StyledTableRow key={index}>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {report.reportedId}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {new Date(report.createdAt).toLocaleDateString(
                            "ko-KR"
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={report.reportCategory}
                          color={getReportTypeColor(report.reportCategory)}
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {report.detail}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={report.targetId}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box sx={{ py: 4 }}>
                        <WarningIcon
                          sx={{ fontSize: 48, color: "grey.400", mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          신고 내역이 없습니다.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default UnSolvedReport;
