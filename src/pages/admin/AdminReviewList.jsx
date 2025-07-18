"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  RateReview as ReviewIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Block as BlockIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import { getReviewList } from "../../service/admin/ApiService";

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

const AdminReviewList = ({ onViewDetail }) => {
  // 리뷰 목록과 페이징 상태
  const [reviewList, setReviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDisplayPage, setCurrentDisplayPage] = useState(1); // MUI 표시용 (1부터 시작)
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  });

  // 필터링 상태 (검색 제외, 정렬만)
  const [filters, setFilters] = useState({
    confirmed: "",
    sortBy: "createdAt",
    sortDir: "desc",
  });

  // 임시 필터 상태 (적용 전)
  const [tempFilters, setTempFilters] = useState({ ...filters });

  const navigate = useNavigate();

  const handleReviewClick = (review, event) => {
    event.preventDefault();

    // onViewDetail prop이 있으면 상세 페이지로, 없으면 기존 방식으로
    if (onViewDetail) {
      // console.log("리뷰 상세 페이지로 이동:", review);
      onViewDetail(review);
    } else {
      // AdminMain 밖에서 사용될 때는 기존 방식 유지
      navigate(`/admin/review/${review.tno}`);
    }
  };

  // 정렬 옵션 (Review 엔티티 기준)
  const sortOptions = [
    { value: "createdAt", label: "작성일" },
    { value: "title", label: "제목" },
    { value: "confirmed", label: "승인상태" },
  ];
  const confirmedOptions = [
    { value: "all", label: "전체" },
    { value: "Y", label: "승인" },
    { value: "N", label: "대기" },
    { value: "R", label: "반려" },
  ];
  // 페이지 크기 옵션
  const pageSizeOptions = [5, 10, 20, 50];

  // 리뷰 목록 조회
  const fetchReviews = async (currentPage = pageInfo.currentPage) => {
    try {
      setLoading(true);
      const response = {
        reviews: [
          {
            tno: 101,
            title: "이 제품 너무 좋아요!",
            memberId: "user1",
            createdAt: "2024-01-01T12:00:00",
            confirmed: "Y",
          },
          {
            tno: 102,
            title: "별로였어요.. 다시는 안살 듯",
            memberId: "user2",
            createdAt: "2024-02-10T15:20:00",
            confirmed: "N",
          },
          {
            tno: 103,
            title: "중간정도 만족입니다",
            memberId: "user3",
            createdAt: "2024-03-05T08:30:00",
            confirmed: "R",
          },
        ],
        totalElements: 3,
        totalPages: 1,
        currentPage: 0,
        pageSize: 10,
      };
      // 백엔드 API에 맞는 파라미터 구조
      const searchParams = {
        page: currentPage, // MUI에서 온 페이지 번호를 그대로 전달 (1부터 시작)
        size: pageInfo.pageSize,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
        //빈 문자열일 때는 undefined로 설정하여 파라미터에서 제외
        confirmed: filters.confirmed,
      };

      //console.log("🔍 리뷰 목록 API 호출 파라미터:", searchParams);
      //const response = await getReviewList(searchParams);
      // console.log("📥 리뷰 목록 API 응답:", response);
      // console.log(
      //   "🔍 confirmed 값:",
      //   filters.confirmed,
      //   "(빈 문자열?",
      //   filters.confirmed === "",
      //   ")"
      // );

      if (response) {
        // 응답 구조 확인 - reviews 속성 사용
        const reviewContent = response.reviews || response.content || [];
        setReviewList(reviewContent);

        setPageInfo({
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0,
          currentPage:
            response.currentPage !== undefined
              ? response.currentPage
              : response.number || 0,
          pageSize: response.pageSize || response.size || 10,
        });

        // console.log("리뷰 목록 설정 완료:", reviewContent.length, "개");
        // console.log("페이지 정보:", {
        //   totalElements: response.totalElements,
        //   totalPages: response.totalPages,
        //   currentPage: response.currentPage,
        //   pageSize: response.pageSize,
        // });
      } else {
        console.log("❌ 예상하지 못한 응답 구조:", response);
        setReviewList([]);
      }
    } catch (err) {
      console.error("❌ 리뷰 목록 조회 오류:", err);
      console.error("❌ 오류 세부 정보:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError("리뷰 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    setCurrentDisplayPage(1); // 초기 표시 페이지 설정
    fetchReviews(1); // 첫 페이지부터 시작
  }, [filters.confirmed, filters.sortBy, filters.sortDir, pageInfo.pageSize]);

  // 정렬 적용
  const handleApplySort = () => {
    // console.log("🔥 tempFilters.confirmed:", tempFilters.confirmed);
    setFilters({ ...tempFilters });
    setCurrentDisplayPage(1); // 첫 페이지로 표시 변경
  };

  // 필터 초기화
  const handleResetFilters = () => {
    const resetFilters = {
      confirmed: "all",
      sortBy: "createdAt",
      sortDir: "desc",
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setCurrentDisplayPage(1); // 첫 페이지로 표시 변경
  };

  // 페이지 변경
  const handlePageChange = (event, newPage) => {
    // console.log("🔥 페이지 클릭:", newPage);
    setCurrentDisplayPage(newPage); // 표시 페이지 즉시 업데이트
    fetchReviews(newPage);
  };

  // 페이지 크기 변경
  const handlePageSizeChange = (event) => {
    setPageInfo((prev) => ({
      ...prev,
      pageSize: event.target.value,
      currentPage: 0,
    }));
    setCurrentDisplayPage(1); // 첫 페이지로 표시 변경
  };

  // 정렬 방향 토글
  const handleSortToggle = () => {
    const newSortDir = filters.sortDir === "desc" ? "asc" : "desc";
    setFilters((prev) => ({ ...prev, sortDir: newSortDir }));
    setTempFilters((prev) => ({ ...prev, sortDir: newSortDir }));
  };

  // 승인 상태에 따른 칩 색상
  const getConfirmedChipColor = (confirmed) => {
    if (confirmed === "Y") return "success";
    return "warning";
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  // 제목 길이 제한
  const truncateTitle = (title, maxLength = 30) => {
    if (!title) return "제목 없음";
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
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
        <ReviewIcon />
        리뷰 관리 ({pageInfo.totalElements.toLocaleString()}개)
      </SectionTitle>

      {/* 정렬 섹션 */}
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
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>승인상태</InputLabel>
              <Select
                value={tempFilters.confirmed}
                label="승인상태"
                onChange={(e) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    confirmed: e.target.value,
                  }))
                }
              >
                {confirmedOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* 정렬 기준 */}
          <Grid item xs={12} sm={6} md={3}>
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

          {/* 정렬 방향 */}
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

          {/* 버튼들 */}
          <Grid item xs={12} sm={6} md={5}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleApplySort}
                size="small"
              >
                적용
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

      {/* 리뷰 목록 테이블 */}
      <Paper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600 }}>제목</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>작성자</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  작성일
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  승인상태
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewList.length > 0 ? (
                reviewList.map((review) => (
                  <StyledTableRow
                    key={review.tno}
                    onClick={(event) => handleReviewClick(review, event)}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {truncateTitle(review.title)}
                    </TableCell>
                    <TableCell>{review.memberId || "N/A"}</TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {review.confirmed === "Y" ? (
                        <Chip
                          icon={<ApprovedIcon />}
                          label="승인"
                          color="success"
                          size="small"
                          variant="filled"
                        />
                      ) : review.confirmed === "R" ? (
                        <Chip
                          icon={<RejectIcon />}
                          label="반려"
                          color="error"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          icon={<PendingIcon />}
                          label="대기"
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      )}
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
                        리뷰가 없습니다.
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
              총 {pageInfo.totalElements.toLocaleString()}개 | 페이지{" "}
              {currentDisplayPage} / {pageInfo.totalPages}
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
              page={currentDisplayPage}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          )}
        </PaginationContainer>
      </Paper>
    </Container>
  );
};

export default AdminReviewList;
