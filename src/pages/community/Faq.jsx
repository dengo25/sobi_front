import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Stack,
  Box,
  Typography,
  ThemeProvider,
} from "@mui/material";

import {
  sobiTheme,
  MainContainer,
  HeaderSection,
} from "../../assets/styles/sobiThemeReview";

import CNTAccordion from "../../components/list/ControlledAccordions";
import CustomButton from "../../components/input/CustomButton";
import BasicPagination from "../../components/list/BasicPagination";
import {
  deleteFaq,
  getFaqListWithPaging,
} from "../../service/community/faqApiService";
import { getContent } from "../../utils/dataCommunity"; // 인라인 데이터용

const Faq = () => {
  const [selectedFaqs, setSelectedFaqs] = useState([]);
  const [list, setList] = useState(
    getContent('faq')
  );
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

  // 정렬 상태
  const [currentSort, setCurrentSort] = useState({
    sortBy: "faqCreateDate",
    sortDirection: "desc",
  });

  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  // const member = useSelector((state) => state.memberSlice);
  const member = useSelector((state) => state.member);
  console.log("[slice] 현재 유저 정보 :", member);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const toggleSelect = (faqNo) => {
    setSelectedFaqs((prev) =>
      prev.includes(faqNo)
        ? prev.filter((no) => no !== faqNo)
        : [...prev, faqNo]
    );
  };

  // Faq 목록 조회
  const fetchFaqs = async (params = {}) => {
    const requestParams = {
      page: params.page !== undefined ? params.page : pageInfo.currentPage,
      //size: pageInfo.pageSize,
      size: params.size !== undefined ? params.size : pageInfo.pageSize || 10,
      sortBy: params.sortBy || currentSort.sortBy,
      sortDirection: params.sortDirection || currentSort.sortDirection,
      ...params,
    };

    console.log("Request params:", requestParams); // 디버깅용
    const res = await getFaqListWithPaging(requestParams);

    // setList(res.content || []);
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
  };
  

  // 초기 로드
  useEffect(() => {
    // 첫 로드시 페이지 0번 데이터 조회
    fetchFaqs({ page: 0, size: 10 });
  }, []);


  // 페이지 변경
  const handlePageChange = (e, newPage) => {
    // MUI Pagination은 1부터 시작하므로 -1 해줘야 함
    const pageNumber = newPage - 1;
    setPageInfo((prev) => ({ ...prev, currentPage: pageNumber }));
    fetchFaqs({ page: pageNumber });
  };

  const handleClick = async (e) => {
    if (e === "insert") {
      navigate("/faq/insert");
    } else if (e === "update") {
      // console.log(e);
      if (selectedFaqs.length === 0) {
        alert("수정할 항목을 선택해 주세요.");
        return;
      }
      if (selectedFaqs.length > 1) {
        // console.log("선택 항목 : ",selectedFaqs.length);
        alert("하나의 항목만 선택해 주세요.");
        return;
      }
      const faqNo = selectedFaqs[0];
      const selectedItem = list.find((faq) => faq.faqNo === faqNo);

      navigate(`/faq/update/${faqNo}`, {
        state: { faqData: selectedItem },
      });
    } else if (e === "delete") {
      if (confirm("해당 게시글을 정말 삭제 하시겠습니까?") == false) {
        return;
      }

      try {
        for (let faqNo of selectedFaqs) {
          deleteFaq(faqNo).then(() => {
            console.log("삭제완료 : ", faqNo);
            // 초기화 처리
            // getFaqList 호출시, 정렬 안되는 이슈 발생
            fetchFaqs({ page: 0, size: 10 });
          });
        }
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  let dataList = list.map((faq, index) => {
    // console.log(`FAQ ${index}:`, faq);
    return (
      <CNTAccordion
        key={`${faq.faqNo}-${index}`}
        name={`panel` + faq.faqNo}
        title={faq.faqQuestion}
        content={faq.faqAnswer}
        expanded={expanded}
        handleChange={handleChange}
        faqNo={faq.faqNo}
        isChecked={selectedFaqs.includes(faq.faqNo)}
        onCheckToggle={toggleSelect}
        isAdmin={member.role === "ROLE_ADMIN"} // 체크박스 컨트롤은 관리자만 가능
      ></CNTAccordion>
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
                FAQ
              </Typography>
              <Typography variant="body1" color="text.secondary">
                SOBI의 FAQ 입니다.
              </Typography>
            </Box>
          </HeaderSection>

          {dataList}
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
          {/* {member?.role === "ROLE_ADMIN" && ( */}
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
              <CustomButton
                type="button"
                onClick={() => {
                  handleClick("update");
                }}
                size="medium"
                variant="contained"
                color="default"
                text="수정"
              />
              <CustomButton
                type="button"
                onClick={() => {
                  handleClick("delete");
                }}
                size="medium"
                variant="contained"
                color="danger"
                text="삭제"
              />
            </Stack>
          {/* )} */}
        </MainContainer>
      </ThemeProvider>
    </>
  );
};

export default Faq;
