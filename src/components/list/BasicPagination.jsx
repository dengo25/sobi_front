import Pagination from "@mui/material/Pagination";

const BasicPagination = ({
    // 기본 props
    count,
    page,
    onChange,
    color,
    showFirstButton,
    showLastButton,
    siblingCount,
    boundaryCount,
}) => {
    const paginationProps = {
        count,
        page,
        onChange,
        color,
        showFirstButton,
        showLastButton,
        siblingCount,
        boundaryCount,
    }
    return (
        <Pagination {...paginationProps}/>
  );
};
export default BasicPagination;
