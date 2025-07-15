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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Pagination,
  Grid,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Report as ReportIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { getReportList } from "../../service/admin/ApiService";
import { useNavigate } from "react-router-dom";

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const FilterSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
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

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
}));

const ReportList = ({ onViewDetail, onViewReportReview }) => {
  const navigate = useNavigate();

  const handleReportClick = (report, event) => {
    event.preventDefault();
    // onViewDetail prop이 있으면 상세 페이지로, 없으면 기존 방식으로
    if (onViewDetail) {
      console.log("신고 상세 페이지로 이동:", report);
      onViewDetail(report);
    } else {
      // AdminMain 밖에서 사용될 때는 기존 방식 유지
      navigate(`/admin/report/${report.reportId}`);
    }
  };
  const handleReportReviewClick = (report, event) => {
    event.preventDefault();
    event.stopPropagation(); // 부모 클릭 이벤트 방지

    if (onViewReportReview) {
      console.log("신고된 리뷰 보기:", report);
      onViewReportReview(report);
    } else {
      `/admin/report/review/${report.targetId}/${report.reportId}`;
    }
  };

  // 신고 목록과 페이징 상태
  const [reportList, setReportList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    hasNext: false,
    hasPrevious: false,
  });

  // 필터링 상태
  const [filters, setFilters] = useState({
    status: "PENDING", // 기본값: 미해결 신고
    reportType: "",
    sortBy: "createdAt",
    sortDir: "desc",
  });

  // 임시 필터 상태 (적용 전)
  const [tempFilters, setTempFilters] = useState({ ...filters });

  // 신고 상태 옵션
  const statusOptions = [
    { value: "", label: "전체" },
    { value: "PENDING", label: "미해결" },
    { value: "APPROVE", label: "처리완료" },
    { value: "REJECT", label: "반려" },
  ];

  // 신고 유형 옵션
  const reportTypeOptions = [
    { value: "", label: "전체" },
    { value: "가짜/조작된 리뷰", label: "가짜/조작된 리뷰" },
    {
      value: "부적절한 표현 및 혐오 콘텐츠",
      label: "부적절한 표현 및 혐오 콘텐츠",
    },
    { value: "스팸 및 상업적 광고", label: "스팸 및 상업적 광고" },
    { value: "민감한 주제의 표현", label: "민감한 주제의 표현" },
  ];

  // 정렬 옵션
  const sortOptions = [
    { value: "createdAt", label: "신고일자" },
    { value: "status", label: "처리 상태" },
    { value: "reportType", label: "신고 유형" },
  ];

  // 페이지 크기 옵션
  const pageSizeOptions = [5, 10, 20, 50];

  // 신고 목록 조회
  const fetchReports = async (page = pageInfo.currentPage) => {
    try {
      setLoading(true);

      const searchParams = {
        page: page,
        size: pageInfo.pageSize,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
        status: filters.status || null,
        reportType: filters.reportType || null,
      };

      console.log("🔍 API 호출 파라미터:", searchParams);
      const response = await getReportList(searchParams);
      console.log("📥 API 응답:", response);

      if (response?.reports && Array.isArray(response.reports)) {
        setReportList(response.reports);
        setPageInfo({
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0,
          currentPage: response.currentPage || 0,
          pageSize: response.pageSize || 10,
          hasNext: response.hasNext || false,
          hasPrevious: response.hasPrevious || false,
        });
        console.log("✅ 신고 목록 설정 완료:", response.reports.length, "건");
      } else {
        console.log("❌ 예상하지 못한 응답 구조:", response);
        setReportList([]);
      }
    } catch (err) {
      console.error("❌ 신고 목록 조회 오류:", err);
      setError("신고 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchReports(0);
  }, [filters, pageInfo.pageSize]);

  // 필터 적용
  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
    setPageInfo((prev) => ({ ...prev, currentPage: 0 })); // 첫 페이지로 이동
  };

  // 필터 초기화
  const handleResetFilters = () => {
    const resetFilters = {
      status: "",
      reportType: "",
      sortBy: "createdAt",
      sortDir: "desc",
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
  };

  // 페이지 변경
  const handlePageChange = (event, newPage) => {
    fetchReports(newPage - 1); // MUI Pagination은 1부터 시작
  };

  // 페이지 크기 변경
  const handlePageSizeChange = (event) => {
    setPageInfo((prev) => ({
      ...prev,
      pageSize: event.target.value,
      currentPage: 0,
    }));
  };

  // 정렬 방향 토글
  const handleSortToggle = () => {
    const newSortDir = filters.sortDir === "desc" ? "asc" : "desc";
    setFilters((prev) => ({ ...prev, sortDir: newSortDir }));
    setTempFilters((prev) => ({ ...prev, sortDir: newSortDir }));
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

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "APPROVE":
        return "success";
      case "REJECT":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "미해결";
      case "APPROVE":
        return "처리완료";
      case "REJECT":
        return "반려";
      default:
        return status;
    }
  };

  if (loading) {
    return (
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
    );
  }
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ p: 2 }}>
      {/* 헤더 */}
      <SectionTitle variant="h6">
        <ReportIcon />
        신고 관리 ({pageInfo.totalElements}건)
      </SectionTitle>

      {/* 필터링 섹션 */}
      <FilterSection>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <FilterIcon />
          필터
        </Typography>

        <Grid container spacing={2} alignItems="center">
          {/* 첫 번째 행: 필터 선택 */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>처리 상태</InputLabel>
              <Select
                value={tempFilters.status}
                label="처리 상태"
                onChange={(e) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>신고 유형</InputLabel>
              <Select
                value={tempFilters.reportType}
                label="신고 유형"
                onChange={(e) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    reportType: e.target.value,
                  }))
                }
              >
                {reportTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>정렬 기준</InputLabel>
              <Select
                value={tempFilters.sortBy}
                label="정렬 기준"
                onChange={(e) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value,
                  }))
                }
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant="outlined"
              onClick={handleSortToggle}
              size="small"
              fullWidth
            >
              {filters.sortDir === "desc" ? "내림차순" : "오름차순"}
            </Button>
          </Grid>

          {/* 두 번째 행: 버튼들 */}
          <Grid item xs={12} md={12}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleApplyFilters}
                size="small"
              >
                검색
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleResetFilters}
                size="small"
              >
                초기화
              </Button>
            </Box>
          </Grid>
        </Grid>
      </FilterSection>

      {/* 신고 목록 테이블 */}
      <Card>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600 }}>신고자 ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>신고 대상 ID</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  신고일자
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  신고 유형
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  타겟 번호
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  처리 상태
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportList.length > 0 ? (
                reportList.map((report, index) => (
                  <StyledTableRow
                    key={index}
                    onClick={(event) => handleReportClick(report, event)}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {report.reporterId || "N/A"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {report.reportedId || "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString(
                              "ko-KR"
                            )
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={report.reportType || "N/A"}
                        color={getReportTypeColor(report.reportType)}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={report.targetId || "N/A"}
                        color="primary"
                        size="small"
                        variant="outlined"
                        onClick={(event) =>
                          handleReportReviewClick(report, event)
                        }
                        sx={{ cursor: "pointer" }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusLabel(report.status)}
                        color={getStatusColor(report.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box sx={{ py: 4 }}>
                      <WarningIcon
                        sx={{ fontSize: 48, color: "grey.400", mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        조건에 맞는 신고 내역이 없습니다.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>

        {/* 페이징 컨트롤 */}
        <PaginationContainer>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              총 {pageInfo.totalElements}건 | 페이지 {pageInfo.currentPage + 1}{" "}
              / {pageInfo.totalPages}
            </Typography>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>페이지 크기</InputLabel>
              <Select
                value={pageInfo.pageSize}
                label="페이지 크기"
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}개씩
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {pageInfo.totalPages > 1 && (
            <Pagination
              count={pageInfo.totalPages}
              page={pageInfo.currentPage + 1}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          )}
        </PaginationContainer>
      </Card>
    </Container>
  );
};

export default ReportList;
