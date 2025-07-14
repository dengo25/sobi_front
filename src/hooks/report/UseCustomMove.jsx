import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import { useState } from "react";

function useCustomMove() {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const [refresh, setRefresh] = useState(false);

  const pageStr = queryParams.get("page");
  const sizeStr = queryParams.get("size");
  const statusStr = queryParams.get("status");

  const page = pageStr ? Number(pageStr) : 1;
  const size = sizeStr ? Number(sizeStr) : 5; // 10에서 5로 변경
  const status = statusStr || "ALL";

  const queryDefault = createSearchParams({
    page: String(page),
    size: String(size),
    ...(status !== "ALL" && { status }),
  }).toString();

  const moveToDetail = (rno, pageParam) => {
    const queryStr = createSearchParams({
      page: String(pageParam?.page ?? page),
      size: String(pageParam?.size ?? size),
      ...(status !== "ALL" && { status }),
    }).toString();
    navigate({
      pathname: `/admin/review/${rno}`, // 절대 경로로 수정
      search: queryStr,
    });
  };

  const moveToModify = (rno) => {
    navigate({
      pathname: `/admin/review/modify/${rno}`, // 절대 경로로 수정
      search: queryDefault,
    });
  };

  const moveToList = (pageParam) => {
    const nextPage = pageParam?.page ?? page;
    const nextSize = pageParam?.size ?? size;

    const queryStr = createSearchParams({
      page: String(nextPage),
      size: String(nextSize),
      ...(status !== "ALL" && { status }),
    }).toString();

    if (queryStr === queryDefault) {
      setRefresh(!refresh); // 강제 리렌더링
    }

    navigate({
      pathname: "/admin/review/list", // 라우터 설정에 맞게 수정
      search: queryStr,
    });
  };

  // 페이지 크기 변경 함수 추가
  const changePageSize = (newSize) => {
    const queryStr = createSearchParams({
      page: "1", // 페이지 크기 변경 시 첫 페이지로 이동
      size: String(newSize),
      ...(status !== "ALL" && { status }),
    }).toString();

    navigate({
      pathname: "/admin/review/list", // 라우터 설정에 맞게 수정
      search: queryStr,
    });
  };

  // 페이지 변경 함수 추가
  const changePage = (newPage) => {
    const queryStr = createSearchParams({
      page: String(newPage),
      size: String(size),
      ...(status !== "ALL" && { status }),
    }).toString();

    navigate({
      pathname: "/admin/review/list", // 라우터 설정에 맞게 수정
      search: queryStr,
    });
  };

  return {
    page,
    size,
    status,
    refresh,
    moveToDetail,
    moveToModify,
    moveToList,
    changePageSize, // 새로 추가
    changePage, // 새로 추가
  };
}

export default useCustomMove;
