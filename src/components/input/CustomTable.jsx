import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const CustomTable = ({
  // 데이터 관련
  columns = [],
  data = [],

  // 테이블 스타일
  size = "small",
  stickyHeader = false,

  // 컨테이너 스타일
  elevation = 0,
  containerSx = {},

  // 헤더 스타일
  headerSx = {},

  // 바디 스타일
  bodySx = {},

  // 행 관련
  onRowClick,
  rowHover = true,
  getRowSx,

  // 빈 상태
  emptyMessage = "데이터가 없습니다.",
  emptyIcon = "📋",

  // 기타 props
  ...otherProps
}) => {
  const defaultContainerSx = {
    border: "1px solid #e0e0e0",
    borderRadius: 1,
    overflow: "hidden",
    ...containerSx,
  };

  const defaultHeaderSx = {
    backgroundColor: "#f5f5f5",
    ...headerSx,
  };

  const defaultCellSx = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#333",
    borderBottom: "1px solid #e0e0e0",
  };

  const defaultBodyCellSx = {
    fontSize: "13px",
    borderBottom: "1px solid #f0f0f0",
  };

  // 빈 상태 렌더링
  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: "48px",
            color: "#ccc",
            mb: 1,
          }}
        >
          {emptyIcon}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            fontSize: "14px",
          }}
        >
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={elevation}
      sx={defaultContainerSx}
    >
      <Table size={size} stickyHeader={stickyHeader} {...otherProps}>
        <TableHead>
          <TableRow sx={defaultHeaderSx}>
            {columns.map((column, index) => (
              <TableCell
                key={column.key || index}
                align={column.align || "left"}
                sx={{
                  ...defaultCellSx,
                  ...(column.width && { width: column.width }),
                  ...(column.headerSx || {}),
                }}
                padding={column.padding}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={bodySx}>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.id || rowIndex}
              hover={rowHover}
              onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
              sx={{
                cursor: onRowClick ? "pointer" : "default",
                "&:hover": rowHover
                  ? {
                      backgroundColor: "#f8f9fa",
                    }
                  : {},
                ...(getRowSx ? getRowSx(row, rowIndex) : {}),
              }}
            >
              {columns.map((column, colIndex) => (
                <TableCell
                  key={column.key || colIndex}
                  align={column.align || "left"}
                  sx={{
                    ...defaultBodyCellSx,
                    ...(column.cellSx || {}),
                  }}
                  padding={column.padding}
                >
                  {column.render
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// 미리 정의된 테이블 variants
const CustomTableVariants = {
  // 메시지 테이블 (받은쪽지/보낸쪽지용)
  message: ({ messages, onMessageClick, onDeleteClick, ...props }) => {
    const messageColumns = [
      {
        key: "checkbox",
        label: "",
        padding: "checkbox",
        width: "50px",
        render: (value, row) => row.checkboxComponent,
      },
      {
        key: "status",
        label: "상태",
        align: "center",
        width: "50px",
        render: (value, row) => row.statusIcon,
      },
      {
        key: "name",
        label: "이름",
        render: (value, row) => (
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: row.isRead === "N" ? 600 : 400,
              color: row.isRead === "N" ? "#000" : "#666",
            }}
          >
            {value}
          </Typography>
        ),
      },
      {
        key: "title",
        label: "제목",
        render: (value, row) => (
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: row.isRead === "N" ? 600 : 400,
              color: row.isRead === "N" ? "#000" : "#666",
              maxWidth: "300px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography>
        ),
      },
      {
        key: "date",
        label: "시간",
        align: "center",
        width: "100px",
        cellSx: { fontSize: "12px", color: "#666" },
      },
      {
        key: "actions",
        label: "삭제",
        align: "center",
        width: "60px",
        render: (value, row) => row.deleteButton,
      },
    ];

    return (
      <CustomTable
        columns={messageColumns}
        data={messages}
        onRowClick={onMessageClick}
        getRowSx={(row) => ({
          backgroundColor: row.isRead === "N" ? "#f8f9ff" : "transparent",
          "&:hover": {
            backgroundColor: row.isRead === "N" ? "#f0f2ff" : "#f8f9fa",
          },
        })}
        emptyIcon="📧"
        emptyMessage="쪽지가 없습니다."
        {...props}
      />
    );
  },

  // 후기 테이블
  review: ({ reviews, onReviewClick, ...props }) => {
    const reviewColumns = [
      {
        key: "number",
        label: "번호",
        width: "80px",
      },
      {
        key: "title",
        label: "제목",
        render: (value) => (
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#333",
              maxWidth: "300px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography>
        ),
      },
      {
        key: "status",
        label: "상태",
        align: "center",
        width: "100px",
        render: (value, row) => row.statusChip,
      },
      {
        key: "date",
        label: "작성일",
        align: "center",
        width: "120px",
        cellSx: { fontSize: "12px", color: "#666" },
      },
    ];

    return (
      <CustomTable
        columns={reviewColumns}
        data={reviews}
        onRowClick={onReviewClick}
        emptyIcon="📝"
        emptyMessage="작성한 후기가 없습니다."
        {...props}
      />
    );
  },
};

// 메인 컴포넌트에 variants 추가
CustomTable.Message = CustomTableVariants.message;
CustomTable.Review = CustomTableVariants.review;

export default CustomTable;
