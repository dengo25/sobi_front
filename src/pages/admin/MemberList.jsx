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
  Card,
  Pagination,
  Stack,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  People as PeopleIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { getList } from "../../service/admin/ApiService";
import useCustomMove from "../../hooks/admin/UseCustomMove";

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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const SortControls = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "center",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const MemberList = () => {
  const [memberList, setMemberList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("memberReg");
  const [sortDir, setSortDir] = useState("desc");

  const navigate = useNavigate();
  const { page, size, moveToList } = useCustomMove();

  const sortOptions = [
    { value: "memberReg", label: "가입일" },
    { value: "memberName", label: "이름" },
    { value: "memberId", label: "아이디" },
    { value: "memberReviewCount", label: "게시글수" },
    { value: "memberReportCount", label: "신고이력" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("🔍 요청 파라미터:", {
          page: page ?? 0,
          size: size ?? 10,
          sortBy,
          sortDir,
        });

        const data = await getList({
          page: page ?? 0,
          size: size ?? 10,
          sortBy,
          sortDir,
        });

        setMemberList(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error("❌ 데이터 로딩 실패:", error);
        setMemberList([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size, sortBy, sortDir]);

  const handleHeaderClick = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
    // moveToList 호출 제거 - URL 변경하지 않음
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
    // moveToList 호출 제거 - URL 변경하지 않음
  };

  const handleSortDirChange = (event) => {
    setSortDir(event.target.value);
    // moveToList 호출 제거 - URL 변경하지 않음
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <SortIcon fontSize="small" />;
    return sortDir === "asc" ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    );
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

  return (
    <ThemeProvider theme={sobiTheme}>
      <Container maxWidth="lg" sx={{ p: 2 }}>
        {/* 헤더 영역 */}
        <HeaderBox>
          <Box>
            <SectionTitle variant="h6">
              <PeopleIcon />
              회원 관리 ({totalElements.toLocaleString()}명)
            </SectionTitle>
            <Typography variant="body2" color="text.secondary">
              페이지 {(page || 0) + 1} / {totalPages}
            </Typography>
          </Box>

          {/* 정렬 컨트롤 */}
          <SortControls>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>정렬 기준</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortByChange}
                label="정렬 기준"
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>순서</InputLabel>
              <Select
                value={sortDir}
                onChange={handleSortDirChange}
                label="순서"
              >
                <MenuItem value="desc">내림차순</MenuItem>
                <MenuItem value="asc">오름차순</MenuItem>
              </Select>
            </FormControl>
          </SortControls>
        </HeaderBox>

        {/* 회원 목록 테이블 */}
        <Card>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell
                    onClick={() => handleHeaderClick("memberName")}
                    sx={{ cursor: "pointer", fontWeight: 600 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      이름 {getSortIcon("memberName")}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleHeaderClick("memberId")}
                    sx={{ cursor: "pointer", fontWeight: 600 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      아이디 {getSortIcon("memberId")}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleHeaderClick("memberReg")}
                    sx={{ cursor: "pointer", fontWeight: 600 }}
                    align="center"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      가입일 {getSortIcon("memberReg")}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleHeaderClick("memberReviewCount")}
                    sx={{ cursor: "pointer", fontWeight: 600 }}
                    align="center"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      게시글수 {getSortIcon("memberReviewCount")}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleHeaderClick("memberReportCount")}
                    sx={{ cursor: "pointer", fontWeight: 600 }}
                    align="center"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      신고이력 {getSortIcon("memberReportCount")}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  if (!Array.isArray(memberList)) {
                    return (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Alert severity="error">데이터 형식 오류</Alert>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (memberList.length === 0) {
                    return (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Box sx={{ py: 4 }}>
                            <PeopleIcon
                              sx={{ fontSize: 48, color: "grey.400", mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              회원 정보가 없습니다.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return memberList.map((member) => (
                    <StyledTableRow
                      key={member.memberId}
                      onClick={() =>
                        navigate(`/admin/member/${member.memberId}`)
                      }
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {member.memberName}
                      </TableCell>
                      <TableCell>{member.memberId}</TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {new Date(member.memberReg).toLocaleDateString(
                            "ko-KR"
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={member.memberReviewCount}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={member.memberReportCount}
                          color={
                            member.memberReportCount > 0 ? "error" : "default"
                          }
                          size="small"
                          variant={
                            member.memberReportCount > 0 ? "filled" : "outlined"
                          }
                        />
                      </TableCell>
                    </StyledTableRow>
                  ));
                })()}
              </TableBody>
            </Table>
          </StyledTableContainer>

          {/* 페이지네이션 */}
          {totalPages > 0 && (
            <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
              <Stack spacing={2} alignItems="center">
                <Pagination
                  count={totalPages}
                  page={(page || 0) + 1}
                  onChange={(event, value) =>
                    moveToList({ page: value - 1, size })
                  }
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                />
                <Typography variant="caption" color="text.secondary">
                  총 {totalElements}개 항목
                </Typography>
              </Stack>
            </Box>
          )}
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default MemberList;
