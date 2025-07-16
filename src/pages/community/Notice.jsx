import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  sobiTheme,
  MainContainer,
  HeaderSection,
  FilterSection,
  BlogCard,
  AuthorSection,
  AuthorAvatar,
  AuthorInfo,
  PostTitle,
  PostContent,
  ThumbnailImage,
  StatsSection,
  CategoryChip,
  WriteButton,
  FloatingWriteButton,
  StyledTextField,
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableBody,
  NumberTableCell,
  ContentTableCell,
  // ViewCountCell,
  // DateTableCell,
} from "../../assets/styles/sobiThemeReview";

import {
  Stack,
  Box,
  Button,
  CardContent,
  TextField,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  ThemeProvider,
  InputAdornment,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@mui/material";

import {
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import CustomButton from "../../components/input/CustomButton";
import BasicPagination from "../../components/list/BasicPagination";
import {
  getNoticeList,
  getNoticeListWithPaging,
  incrementNoticeViewCount,
  getTotalCount,
  getSearchCount,
} from "../../service/community/noticeApiService";
import { formatDate } from "../../utils/common";

const Notice = () => {
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false,
  });
  const [searchParams, setSearchParams] = useState({
    searchKeyword: "",
    searchType: "all",
  });

  // 정렬 상태
  const [currentSort, setCurrentSort] = useState({
    sortBy: "noticeCreateDate",
    sortDirection: "desc",
  });

  // 전체/검색 카운트 상태
  const [totalCount, setTotalCount] = useState(0);
  const [searchCount, setSearchCount] = useState(null);

  const navigate = useNavigate();
  const member = useSelector((state) => state.member);
  console.log("[slice] 현재 유저 정보 :", member);

  // 공지사항 목록 조회
  const fetchNotices = async (params = {}) => {
    const requestParams = {
      page: params.page !== undefined ? params.page : pageInfo.currentPage,
      size: params.size !== undefined ? params.size : pageInfo.pageSize || 10,
      sortBy: params.sortBy || currentSort.sortBy,
      sortDirection: params.sortDirection || currentSort.sortDirection,
      // size: pageInfo.pageSize,
      // sortBy: "noticeCreateDate",
      // sortDirection: "desc",
      ...searchParams,
      ...params,
    };

    console.log("Request params:", requestParams); // 디버깅용
    const res = await getNoticeListWithPaging(requestParams);

    setList(res.content || []);
    setPageInfo({
      currentPage: res.currentPage || 0,
      totalPages: res.totalPages || 0,
      totalElements: res.totalElements || 0,
      pageSize: res.pageSize || 10,
      first: res.first || false,
      last: res.last || false,
      hasNext: res.hasNext || false,
      hasPrevious: res.hasPrevious || false,
    });

    // 현재 정렬 상태 업데이트
    setCurrentSort({
      sortBy: requestParams.sortBy,
      sortDirection: requestParams.sortDirection,
    });

    setTotalCount(res.totalElements); // 토탈 카운트 셋팅
  };

  // 마운트 시: 목록만 가져와서 totalCount 세팅
  useEffect(() => {
    // (async () => {
    //   const resp = await getNoticeListWithPaging({
    //     page: 0,
    //     size: pageInfo.pageSize,
    //   });
    //   setList(resp.content);
    //   setPageInfo({
    //     ...pageInfo,
    //     currentPage: resp.currentPage,
    //     totalPages: resp.totalPages,
    //     totalElements: resp.totalElements,
    //   });
    //   setTotalCount(resp.totalElements); // 토탈 카운트 셋팅
    // })();

    // 첫 로드시 페이지 0번 데이터 조회
    fetchNotices({ page: 0, size: 10 });
  }, []);

  // 검색
  const handleSearch = async () => {
    setPageInfo((p) => ({ ...p, currentPage: 0 }));
    await fetchNotices({ page: 0 });
    const cnt = await getSearchCount(
      searchParams.searchType,
      searchParams.searchKeyword
    );
    setSearchCount(cnt); // 검색 엔진 카운트
  };

  // 검색 초기화
  const handleSearchReset = async () => {
    setSearchParams({
      searchKeyword: "",
      searchType: "all",
    });
    const newPageInfo = { ...pageInfo, currentPage: 0 };

    const resp = await getNoticeListWithPaging({
      page: 0,
      size: pageInfo.pageSize,
    });
    setList(resp.content);
    setPageInfo({
      ...pageInfo,
      currentPage: resp.currentPage,
      totalPages: resp.totalPages,
      totalElements: resp.totalElements,
    });
    setTotalCount(resp.totalElements); // 초기화 후 다시 전체 카운트
    setSearchCount(null);
  };

  // 페이지 변경
  const handlePageChange = (e, newPage) => {
    // MUI Pagination은 1부터 시작하므로 -1 해줘야 함
    const pageNumber = newPage - 1;
    setPageInfo((prev) => ({ ...prev, currentPage: pageNumber }));
    fetchNotices({ page: pageNumber });
  };

  const handleClick = (e) => {
    if (e === "insert") {
      navigate("/notice/insert");
    }
  };

  // 조회수 증가
  const handleNoticeClick = async (noticeNo) => {
    await incrementNoticeViewCount(noticeNo);
    navigate(`/notice/${noticeNo}`);
  };

  let dataList = list.map((notice, index) => {
    // console.log(`Notice ${index}:`, notice);
    return (
      <TableRow key={notice.noticeNo}>
        <NumberTableCell>{notice.noticeNo}</NumberTableCell>
        <ContentTableCell onClick={() => handleNoticeClick(notice.noticeNo)} sx={{ cursor: "pointer" }}>
            {notice.noticeTitle}
        </ContentTableCell>
        <ContentTableCell sx={{ textAlign: "center" }}>{notice.count}</ContentTableCell>
        <ContentTableCell sx={{ textAlign: "center" }}>{formatDate(notice.noticeCreateDate)}</ContentTableCell>
      </TableRow>
    );
  });

  return (
    <>
      <ThemeProvider theme={sobiTheme}>
        <MainContainer maxWidth="lg">
          <HeaderSection>
            <Box
              sx={{
                mb: 3,
              }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                color="text.primary"
                gutterBottom
              >
                공지사항
              </Typography>
              <Typography variant="body1" color="text.secondary">
                SOBI의 공지사항 입니다.
              </Typography>
            </Box>

            {/* ── 전체/검색 카운트 영역 ── */}
            <FilterSection>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}
                >
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>검색 유형</InputLabel>
                    <Select
                      value={searchParams.searchType}
                      label="검색 유형"
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          searchType: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="all">전체</MenuItem>
                      <MenuItem value="title">제목</MenuItem>
                      <MenuItem value="content">내용</MenuItem>
                    </Select>
                  </FormControl>

                  <StyledTextField
                    fullWidth
                    size="small"
                    placeholder="검색어를 입력하세요"
                    value={searchParams.searchKeyword}
                    onChange={(e) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        searchKeyword: e.target.value,
                      }))
                    }
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            onClick={handleSearch}
                            sx={{ minWidth: "auto", p: 0.5 }}
                          >
                            검색
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* <TextField
                    size="small"
                    placeholder="검색어를 입력하세요"
                    value={searchParams.searchKeyword}
                    onChange={(e) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        searchKeyword: e.target.value,
                      }))
                    }
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    sx={{ minWidth: 200 }}
                  /> */}

                  {/* <CustomButton
                    type="button"
                    onClick={handleSearch}
                    size="small"
                    variant="contained"
                    color="primary"
                    text="검색"
                  /> */}

                  <CustomButton
                    type="button"
                    onClick={handleSearchReset}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    text="초기화"
                  />
                </Box>

                <Box
                  sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}
                >
                  {/* sx={{ mb: 2, display: "flex", gap: 4, alignItems: "center" }}
                > */}
                  {/* 검색 키워드 없으면 전체, 있으면 검색 건수 API 결과 */}
                  {!searchParams.searchKeyword ? (
                    <Typography variant="body2" color="text.secondary">
                      전체 게시글 수: <strong>{totalCount}</strong> 건
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      검색 결과: <strong>{searchCount}</strong> 건
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </FilterSection>
          </HeaderSection>

          <StyledTableContainer component={Paper}>
            <StyledTable>
              <StyledTableHead>
                <TableRow>
                  <TableCell sx={{ width: "100px", textAlign: "center" }}>
                    글번호
                  </TableCell>
                  <TableCell sx={{ width: "900px", textAlign: "center" }}>
                    제목
                  </TableCell>
                  <TableCell sx={{ width: "90px", textAlign: "center" }}>
                    조회수
                  </TableCell>
                  <TableCell sx={{ width: "200px", textAlign: "center" }}>
                    작성일
                  </TableCell>
                </TableRow>
              </StyledTableHead>

              <StyledTableBody>{dataList}</StyledTableBody>
            </StyledTable>
          </StyledTableContainer>

          {/* <table>
            <colgroup>
              <col width={"90px"}></col>
              <col width={"300px"}></col>
              <col width={"100px"}></col>
              <col width={"200px"}></col>
            </colgroup>
            <thead>
              <tr>
                <th>글번호</th>
                <th>제목</th>
                <th>조회수</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>{dataList}</tbody>
          </table> */}

          {/* 페이징 컴포넌트 */}
          {pageInfo.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <BasicPagination
                count={pageInfo.totalPages}
                page={pageInfo.currentPage + 1} // MUI는 1부터 시작하므로 +1
                onChange={handlePageChange}
                color="primary"
                useCustomStyle={true}
                customColor="primary"
                showFirstButton={true}
                showLastButton={true}
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          )}

          {member?.role === "ROLE_ADMIN" && (
            <Stack direction="row" spacing={1} sx={{ justifyContent: "right" }}>
              <CustomButton
                type="button"
                onClick={() => {
                  handleClick("insert");
                }}
                size="medium"
                variant="contained"
                color="success"
                text="새글 등록"
              />
            </Stack>
          )}
        </MainContainer>
      </ThemeProvider>
    </>
  );
};

export default Notice;
