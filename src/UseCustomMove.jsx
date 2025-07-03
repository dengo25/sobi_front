import { useNavigate, useSearchParams, createSearchParams } from "react-router-dom";
import { useState } from "react";

function useCustomMove() {
    const navigate = useNavigate();
    const [queryParams] = useSearchParams();
    const [refresh, setRefresh] = useState(false);

    const pageStr = queryParams.get("page");
    const sizeStr = queryParams.get("size");

    const page = pageStr ? Number(pageStr) : 1;
    const size = sizeStr ? Number(sizeStr) : 10;

    const queryDefault = createSearchParams({
        page: String(page),
        size: String(size),
    }).toString();

    const moveToRead = (rno) => {
        navigate({
            pathname: `../read/${rno}`,
            search: queryDefault,
        });
    };

    const moveToModify = (rno) => {
        navigate({
            pathname: `../modify/${rno}`,
            search: queryDefault,
        });
    };

    const moveToList = (pageParam) => {
        if (pageParam) {
            const queryStr = createSearchParams({
                page: String(pageParam.page),
                size: String(pageParam.size),
            }).toString();

            if (queryStr === queryDefault) {
                setRefresh(!refresh); // 강제 리렌더링
            }

            navigate({
                pathname: "../list",
                search: queryStr,
            });
        } else {
            navigate({
                pathname: "../list",
                search: queryDefault,
            });
        }
    };

    return { page, size, refresh, moveToRead, moveToModify, moveToList };
}

export default useCustomMove;
