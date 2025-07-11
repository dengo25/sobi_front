import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Stack,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

import CustomButton from "../../components/input/CustomButton";
import BasicPagination from "../../components/list/BasicPagination";
import {
  getNoticeList,
  getNoticeListWithPaging,
  incrementNoticeViewCount,
  getTotalCount,
  getSearchCount,
} from "../../service/community/noticeApiService";

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

  // **추가: 전체/검색 카운트 상태**
  const [totalCount, setTotalCount] = useState(0);
  const [searchCount, setSearchCount] = useState(null);

  const navigate = useNavigate();
  const member = useSelector((state) => state.member);
  console.log("[slice] 현재 유저 정보 :", member);


  // 마운트 시: 목록만 가져와서 totalCount 세팅
  useEffect(() => {
    (async () => {
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
      setTotalCount(resp.totalElements); // 토탈 카운트 셋팅
    })();
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

  // 공지사항 목록 조회
  const fetchNotices = async (params = {}) => {
    const requestParams = {
      page: params.page !== undefined ? params.page : pageInfo.currentPage,
      size: pageInfo.pageSize,
      sortBy: "noticeCreateDate",
      sortDirection: "desc",
      ...searchParams,
      ...params,
    };

    console.log("Request params:", requestParams); // 디버깅용
    const response = await getNoticeListWithPaging(requestParams);

    setList(response.content);
    setPageInfo({
      currentPage: response.currentPage,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
      pageSize: response.pageSize,
      first: response.first,
      last: response.last,
      hasNext: response.hasNext,
      hasPrevious: response.hasPrevious,
    });
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
      <tr key={notice.noticeNo}>
        <td>{notice.noticeNo}</td>
        <td>
          <span onClick={() => handleNoticeClick(notice.noticeNo)}>
            {notice.noticeTitle}
          </span>
        </td>
        <td>{notice.count}</td>
        <td>{notice.noticeCreateDate}</td>
      </tr>
    );
  });

  return (
    <>
      <h2>공지사항</h2>

      {/* ── 전체/검색 카운트 영역 ── */}
      <Box sx={{ mb: 2, display: "flex", gap: 4, alignItems: "center" }}>
        {/* 검색 키워드 없으면 전체, 있으면 검색 건수 API 결과 */}
        {!searchParams.searchKeyword ? (
          <Typography>
            전체 게시글 수: <strong>{totalCount}</strong> 건
          </Typography>
        ) : (
          <Typography>
            검색 결과: <strong>{searchCount}</strong> 건
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
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

        <TextField
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
        />

        <CustomButton
          type="button"
          onClick={handleSearch}
          size="small"
          variant="contained"
          color="primary"
          text="검색"
        />

        <CustomButton
          type="button"
          onClick={handleSearchReset}
          size="small"
          variant="outlined"
          color="secondary"
          text="초기화"
        />
      </Box>

      <table>
        <colgroup>
          <col width={"100px"}></col>
          <col width={"auto"}></col>
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
      </table>

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
    </>
  );
};

export default Notice;
