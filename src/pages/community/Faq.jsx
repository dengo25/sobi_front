import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Stack, Box } from "@mui/material";

import CNTAccordion from "../../components/list/ControlledAccordions";
import CustomButton from "../../components/input/CustomButton";
import BasicPagination from "../../components/list/BasicPagination";
import {
  getFaqList,
  deleteFaq,
  getFaqListWithPaging,
} from "../../service/community/FaqApiService";

const Faq = () => {
  const [selectedFaqs, setSelectedFaqs] = useState([]);
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
      size: params.size !== undefined ? params.size : (pageInfo.pageSize || 10),
      sortBy: "faqCreateDate",
      sortDirection: "desc",
      // ...searchParams,
      ...params,
    };

    console.log("Request params:", requestParams); // 디버깅용
    const res = await getFaqListWithPaging(requestParams);

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
  };

  // 초기 로드
  useEffect(() => {
    // getFaqList().then((data) => {
    //     setList(data);
    //     console.log("api 통신 데이터 : ",data);
    // })

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

  const handleClick = (e) => {
    if (e === "insert") {
      navigate("/faq/insert");
    } else if (e === "update") {
      // console.log(e);
      if (selectedFaqs.length === 0) {
        alert("수정할 항목을 선택해 주세요.");
        return;
      }
      if (selectedFaqs.length > 1) {
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

            // 삭제 후 현재 페이지 다시 로드
            // 만약 현재 페이지에 아이템이 없다면 이전 페이지로 이동
            const currentPageItems = list.length - selectedFaqs.length;
            const shouldGoToPrevPage =
              currentPageItems === 0 && pageInfo.currentPage > 0;

            setSelectedFaqs([]); // 선택 초기화

            if (shouldGoToPrevPage) {
              fetchFaqs({ page: pageInfo.currentPage - 1 });
            } else {
              fetchFaqs({ page: pageInfo.currentPage });
            }

            // getFaqList().then((data) => {
            //   setList(data);
            //   setSelectedFaqs([]); // 선택 초기화도 함께
            // });
          });
        }
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  let dataList = list.map((faq, index) => {
    console.log(`FAQ ${index}:`, faq);
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
      <h2>FAQ</h2>
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
      )}
    </>
  );
};

export default Faq;
