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
  const categoryStr = queryParams.get("category");
  const keyword = queryParams.get("keyword");
  const sort = queryParams.get("sort");

  const page = pageStr ? Number(pageStr) : 1;
  const size = sizeStr ? Number(sizeStr) : 10;
  const category =
    categoryStr && categoryStr !== "" ? Number(categoryStr) : null;

  const createQueryParams = (params = {}) => {
    const defaultParams = {
      page: String(params.page ?? page),
      size: String(params.size ?? size),
    };

    if (params.hasOwnProperty("category")) {
      if (params.category && params.category > 0) {
        defaultParams.category = String(params.category);
      }
    } else {
      if (category && category > 0) {
        defaultParams.category = String(category);
      }
    }

    if (params.hasOwnProperty("keyword")) {
      if (params.keyword && params.keyword.trim()) {
        defaultParams.keyword = params.keyword.trim();
      }
    } else {
      if (keyword && keyword.trim()) {
        defaultParams.keyword = keyword.trim();
      }
    }

    if (params.hasOwnProperty("sort")) {
      if (params.sort && params.sort !== "latest") {
        defaultParams.sort = params.sort;
      }
    } else {
      if (sort && sort !== "latest") {
        defaultParams.sort = sort;
      }
    }

    console.log("생성된 쿼리 파라미터:", defaultParams); // 디버깅용
    return createSearchParams(defaultParams).toString();
  };

  const queryDefault = createQueryParams();

  const moveToDetail = (rno, pageParam) => {
    const queryStr = createQueryParams(pageParam);
    navigate({
      pathname: `../detail/${rno}`,
      search: queryStr,
    });
  };

  const moveToModify = (rno) => {
    navigate({
      pathname: `../modify/${rno}`,
      search: queryDefault,
    });
  };

  const moveToList = (pageParam) => {
    const queryStr = createQueryParams(pageParam);

    if (queryStr === queryDefault) {
      setRefresh(!refresh);
    }

    navigate({
      pathname: "../list",
      search: queryStr,
    });
  };

  const moveToListWithFilter = (filterParams) => {
    const queryStr = createQueryParams({
      page: filterParams.page || 1,
      size,
      ...filterParams,
    });

    navigate({
      pathname: "../list",
      search: queryStr,
    });
  };

  return {
    page,
    size,
    category,
    keyword,
    sort,
    refresh,
    moveToDetail,
    moveToModify,
    moveToList,
    moveToListWithFilter,
  };
}

export default useCustomMove;
