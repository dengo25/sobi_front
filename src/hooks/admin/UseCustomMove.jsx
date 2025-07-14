// src/hooks/review/useCustomMove.js
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

  const page = pageStr ? Number(pageStr) : 0;
  const size = sizeStr ? Number(sizeStr) : 10;

  const queryDefault = createSearchParams({
    page: String(page),
    size: String(size),
  }).toString();

  const moveToList = (pageParam) => {
    const finalPage = pageParam?.page ?? page;
    const finalSize = pageParam?.size ?? size;

    const queryStr = createSearchParams({
      page: String(finalPage),
      size: String(finalSize),
    }).toString();

    if (queryStr === queryDefault) {
      setRefresh(!refresh);
    }

    navigate({
      pathname: "/admin/member", // 경로를 명확하게 지정
      search: queryStr,
    });
  };

  return {
    page,
    size,
    refresh,
    moveToList,
  };
}

export default useCustomMove;
