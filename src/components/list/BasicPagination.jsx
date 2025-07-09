import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";

// 커스텀 컬러
const StyledButton = styled(Pagination, {
  shouldForwardProp: (prop) => !["customColor"].includes(prop),
})(({ customColor }) => ({
  // 페이지네이션 버튼들에 스타일 적용
  "& .MuiPaginationItem-root": {
    ...(customColor === "primary" && {
      backgroundColor: "#ffffff",
      color: "#333333",
      "&:hover": {
        color: "white",
        backgroundColor: "#37AA7C",
      },
      "&.Mui-selected": {
        backgroundColor: "#1e8449",
        color: "white",
        "&:hover": {
          backgroundColor: "#27AE60",
        },
      },
    }),
    ...(customColor === "default" && {
      backgroundColor: "#ffffff",
      color: "#333333",
      "&:hover": {
        color: "white",
        backgroundColor: "#4d4d4d",
      },
      "&.Mui-selected": {
        backgroundColor: "#333333",
        color: "white",
        "&:hover": {
          backgroundColor: "#4d4d4d",
        },
      },
    }),
  },
}));

const BasicPagination = ({
  // 기본 props
  count = 10,
  page = 1,
  onChange,
  color = "primary", // "primary", "secondary", "success", "error", "info", "warning"
  showFirstButton = false,
  showLastButton = false,
  siblingCount = 1,
  boundaryCount = 1,
  disabled = false,

  // 커스텀 색상 (StyledButton 사용시)
  customColor, // "primary", "default"
  useCustomStyle = false,

  // 기타 props
  ...otherProps
}) => {
  const customColors = ["primary", "default"];
  const needsCustomStyle = useCustomStyle && customColors.includes(color);
  const PaginationComponent = needsCustomStyle ? StyledButton : Pagination;
  const { customColor: _, ...cleanOtherProps } = otherProps;

  const paginationProps = {
    count,
    page,
    onChange,
    color: needsCustomStyle ? undefined : color,
    ...(needsCustomStyle && {
      customColor: customColor || color,
    }),
    showFirstButton,
    showLastButton,
    siblingCount,
    boundaryCount,
    ...cleanOtherProps,
  };
  return <PaginationComponent {...paginationProps} />;
};
export default BasicPagination;
