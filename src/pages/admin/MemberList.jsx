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
  ThemeProvider,
  createTheme,
  Paper,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  People as PeopleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { getList } from "../../service/admin/ApiService";

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

const MemberList = ({ onViewDetail }) => {
  // 회원 목록과 페이징 상태
  const [memberList, setMemberList] = useState([]);
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
    sortBy: "memberReg",
    sortDir: "desc",
  });

  // 임시 필터 상태 (적용 전)
  const [tempFilters, setTempFilters] = useState({ ...filters });

  const navigate = useNavigate();

  const handleMemberClick = (member, event) => {
    event.preventDefault();

    // onViewDetail prop이 있으면 상세 페이지로, 없으면 기존 방식으로
    if (onViewDetail) {
      // console.log("회원 상세 페이지로 이동:", member);
      onViewDetail(member);
    } else {
      // AdminMain 밖에서 사용될 때는 기존 방식 유지
      navigate(`/admin/member/${member.memberId}`);
    }
  };

  // 정렬 옵션 (계산된 필드 제외)
  const sortOptions = [
    { value: "memberReg", label: "가입일" },
    { value: "memberName", label: "이름" },
    { value: "memberId", label: "아이디" },
    // memberReviewCount, memberReportCount 제거 (계산된 필드라 정렬 불가)
  ];

  // 페이지 크기 옵션
  const pageSizeOptions = [5, 10, 20, 50];

  // 회원 목록 조회
  const fetchMembers = async (currentPage = pageInfo.currentPage) => {
    try {
      setLoading(true);
      const response = {
        content: [
          {
            memberId: "user1",
            memberName: "사용자1",
            memberReg: "2024-01-01T12:00:00",
            memberReviewCount: 5,
            memberReportCount: 0,
          },
          {
            memberId: "user2",
            memberName: "사용자2",
            memberReg: "2024-02-15T10:30:00",
            memberReviewCount: 2,
            memberReportCount: 1,
          },
          {
            memberId: "user3",
            memberName: "사용자3",
            memberReg: "2024-03-20T09:00:00",
            memberReviewCount: 8,
            memberReportCount: 3,
          },
        ],
        totalElements: 3,
        totalPages: 1,
        number: 0,
        size: 10,
      };
      // 백엔드 API에 맞는 파라미터 구조
      const searchParams = {
        page: currentPage, // MUI에서 온 페이지 번호를 그대로 전달 (1부터 시작)
        size: pageInfo.pageSize,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
      };

      // console.log("회원 목록 API 호출 파라미터:", searchParams);

      // console.log("회원 목록 API 응답:", response);
      //const response = await getList(searchParams); //실제 데이터
      if (response) {
        setMemberList(response.content || []);
        setPageInfo({
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0,
          currentPage: response.number || 0, // 백엔드는 0부터 시작
          pageSize: response.size || 10,
        });
        // console.log(
        //   "회원 목록 설정 완료:",
        //   (response.content || []).length,
        //   "명"
        // );
      } else {
        console.log("예상하지 못한 응답 구조:", response);
        setMemberList([]);
      }
    } catch (err) {
      console.error("회원 목록 조회 오류:", err);
      setError("회원 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    setCurrentDisplayPage(1); // 초기 표시 페이지 설정
    fetchMembers(1); // 첫 페이지부터 시작
  }, [filters, pageInfo.pageSize]);

  // 정렬 적용
  const handleApplySort = () => {
    setFilters({ ...tempFilters });
    setCurrentDisplayPage(1); // 첫 페이지로 표시 변경
    setTimeout(() => fetchMembers(1), 0); // 첫 페이지 명시적 호출
  };

  // 필터 초기화
  const handleResetFilters = () => {
    const resetFilters = {
      sortBy: "memberReg",
      sortDir: "desc",
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setCurrentDisplayPage(1); // 첫 페이지로 표시 변경
  };

  // 페이지 변경
  const handlePageChange = (event, newPage) => {
    // console.log("페이지 클릭:", newPage);
    setCurrentDisplayPage(newPage); // 표시 페이지 즉시 업데이트
    fetchMembers(newPage);
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

  // 신고 이력에 따른 칩 색상
  const getReportChipColor = (count) => {
    if (count === 0) return "default";
    if (count <= 2) return "warning";
    return "error";
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
        <Container maxWidth="xl" sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={sobiTheme}>
      <Container maxWidth="xl" sx={{ p: 2 }}>
        {/* 헤더 */}
        <SectionTitle variant="h6">
          <PeopleIcon />
          회원 관리 ({pageInfo.totalElements.toLocaleString()}명)
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
            {/* 정렬 기준 */}
            <Grid item xs={12} sm={6} md={4}>
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
            <Grid item xs={12} sm={6} md={3}>
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

        {/* 회원 목록 테이블 */}
        <Paper>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600 }}>이름</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>아이디</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    가입일
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    게시글수
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    신고이력
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {memberList.length > 0 ? (
                  memberList.map((member) => (
                    <StyledTableRow
                      key={member.memberId}
                      onClick={(event) => handleMemberClick(member, event)}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {member.memberName || "N/A"}
                      </TableCell>
                      <TableCell>{member.memberId || "N/A"}</TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {member.memberReg
                            ? new Date(member.memberReg).toLocaleDateString(
                                "ko-KR"
                              )
                            : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={member.memberReviewCount || 0}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={member.memberReportCount || 0}
                          color={getReportChipColor(
                            member.memberReportCount || 0
                          )}
                          size="small"
                          variant={
                            member.memberReportCount > 0 ? "filled" : "outlined"
                          }
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
                          회원이 없습니다.
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
                총 {pageInfo.totalElements.toLocaleString()}명 | 페이지{" "}
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
                      {size}명씩
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
    </ThemeProvider>
  );
};

export default MemberList;
