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

    // category 처리 - undefined로 명시적으로 전달된 경우 제외
    if (params.hasOwnProperty("category")) {
      if (
        params.category !== undefined &&
        params.category &&
        params.category > 0
      ) {
        defaultParams.category = String(params.category);
      }
      // params.category가 undefined인 경우 defaultParams에 추가하지 않음
    } else {
      // params에 category가 없는 경우 기존 값 사용
      if (category && category > 0) {
        defaultParams.category = String(category);
      }
    }

    // keyword 처리 - undefined로 명시적으로 전달된 경우 제외
    if (params.hasOwnProperty("keyword")) {
      if (
        params.keyword !== undefined &&
        params.keyword &&
        params.keyword.trim()
      ) {
        defaultParams.keyword = params.keyword.trim();
      }
      // params.keyword가 undefined인 경우 defaultParams에 추가하지 않음
    } else {
      // params에 keyword가 없는 경우 기존 값 사용
      if (keyword && keyword.trim()) {
        defaultParams.keyword = keyword.trim();
      }
    }

    // sort 처리 - undefined로 명시적으로 전달된 경우 제외
    if (params.hasOwnProperty("sort")) {
      if (
        params.sort !== undefined &&
        params.sort &&
        params.sort !== "latest"
      ) {
        defaultParams.sort = params.sort;
      }
      // params.sort가 undefined인 경우 defaultParams에 추가하지 않음
    } else {
      // params에 sort가 없는 경우 기존 값 사용
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
