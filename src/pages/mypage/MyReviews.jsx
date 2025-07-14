"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Container,
  Card,
  CardContent,
  Pagination,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getMyReviews } from "../../service/mypage/ApiService";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  "& .MuiTable-root": {
    tableLayout: "fixed",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const LoadingBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 200,
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  position: "sticky",
  bottom: 0,
  zIndex: 1,
  boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
}));

const MyReviews = ({ onReviewAction }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyReviews();
      console.log("내가 쓴 후기 응답:", response);

      if (response && response.rnoList) {
        setReviews(response.rnoList);
        // 데이터가 새로 로드되면 첫 페이지로 이동
        setCurrentPage(1);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("내가 쓴 후기 조회 오류:", err);
      setError("내가 쓴 후기를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedReview(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "어제";
    } else {
      return date.toLocaleDateString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
    }
  };

  const getStatusChip = (confirmed) => {
    if (confirmed === "Y") {
      return (
        <Chip label="승인됨" color="success" size="small" variant="filled" />
      );
    } else {
      return (
        <Chip label="대기중" color="warning" size="small" variant="filled" />
      );
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

  if (loading) {
    return (
      <LoadingBox>
        <CircularProgress />
      </LoadingBox>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchMyReviews}>
              다시 시도
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {/* 헤더 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h3" fontWeight={600}>
          내가 쓴 후기 ({reviews.length})
        </Typography>
        {reviews.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            페이지 {currentPage} / {totalPages} (총 {reviews.length}개)
          </Typography>
        )}
      </Box>

      {reviews.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyStateBox>
              <Typography variant="h1" sx={{ fontSize: 48, mb: 1 }}>
                📝
              </Typography>
              <Typography variant="body2" color="text.secondary">
                작성한 후기가 없습니다.
              </Typography>
            </EmptyStateBox>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <StyledTableContainer component={Paper} sx={{ flex: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ width: "80px" }}>번호</TableCell>
                  <TableCell sx={{ width: "auto" }}>제목</TableCell>
                  <TableCell align="center" sx={{ width: "100px" }}>
                    상태
                  </TableCell>
                  <TableCell align="center" sx={{ width: "120px" }}>
                    작성일
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentReviews.map((review, index) => {
                  // 전체 목록에서의 실제 번호 계산 (최신순)
                  const actualIndex = startIndex + index;
                  const displayNumber = reviews.length - actualIndex;

                  return (
                    <StyledTableRow
                      key={review.tno}
                      onClick={() => handleReviewClick(review)}
                    >
                      <TableCell>{displayNumber}</TableCell>
                      <TableCell
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: 500,
                          paddingRight: 1, // 우측 여백 추가
                        }}
                      >
                        {review.title}
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(review.confirmed)}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(review.createdAt)}
                        </Typography>
                      </TableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </StyledTableContainer>

          {/* 페이지네이션 */}
          <PaginationContainer>
            {totalPages > 1 ? (
              <Stack spacing={2} alignItems="center">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                  siblingCount={1}
                  boundaryCount={1}
                />
                <Typography variant="caption" color="text.secondary">
                  {startIndex + 1}-{Math.min(endIndex, reviews.length)} /{" "}
                  {reviews.length}개 표시
                </Typography>
              </Stack>
            ) : (
              reviews.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  총 {reviews.length}개
                </Typography>
              )
            )}
          </PaginationContainer>
        </Box>
      )}

      {/* 후기 상세 다이얼로그 */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        {selectedReview && (
          <>
            <DialogTitle>
              <Typography variant="h6" component="div" fontWeight={600}>
                {selectedReview.title}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  작성일:{" "}
                  {new Date(selectedReview.createdAt).toLocaleString("ko-KR")}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    상태:
                  </Typography>
                  <Box component="span" sx={{ ml: 1 }}>
                    {getStatusChip(selectedReview.confirmed)}
                  </Box>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  minHeight: 200,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {selectedReview.content}
                </Typography>
              </Paper>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} variant="outlined">
                닫기
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MyReviews;
