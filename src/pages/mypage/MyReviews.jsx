"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
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
import {
  StyledTableContainer,
  StyledTableRow,
  EmptyStateBox,
  LoadingBox,
  PaginationContainer,
} from "../../assets/styles/sobiTheme";
import { stripHtml } from "../../utils/common";

const MyReviews = ({ onReviewAction }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;

  const reduxUserInfo = useSelector((state) => state.member);

  const generateReviewsData = (memberId) => {
    const baseDate = new Date();

    if (memberId === "admin") {
      return Array.from({ length: 15 }, (_, index) => {
        const reviewDate = new Date(baseDate);
        reviewDate.setDate(reviewDate.getDate() - index * 2);

        return {
          tno: 1000 + index,
          title: `[관리자] 서비스 ${
            index + 1
          }번째 후기 - 매우 만족스러운 경험이었습니다`,
          content: `안녕하세요, 관리자입니다.\n\n이번에 서비스를 이용해보았는데 정말 만족스러운 경험이었습니다.\n\n특히 다음과 같은 점들이 좋았습니다:\n1. 사용자 인터페이스가 매우 직관적입니다\n2. 응답 속도가 빠릅니다\n3. 고객 지원이 훌륭합니다\n\n앞으로도 계속 이용할 예정입니다. 추천드립니다!`,
          confirmed: index % 3 === 0 ? "N" : "Y",
          createdAt: reviewDate.toISOString(),
          memberId: "admin",
        };
      });
    } else {
      return Array.from({ length: 3 }, (_, index) => {
        const reviewDate = new Date(baseDate);
        reviewDate.setDate(reviewDate.getDate() - index * 5);

        return {
          tno: 2000 + index,
          title: `일반 사용자 후기 ${index + 1} - 좋은 서비스네요`,
          content: `안녕하세요!\n\n처음 이용해봤는데 생각보다 정말 좋네요.\n\n${
            index === 0
              ? "처음에는 좀 어려울 줄 알았는데 생각보다 쉽게 사용할 수 있었어요."
              : index === 1
              ? "친구 추천으로 사용하게 되었는데 만족스럽습니다."
              : "이미 몇 번째 이용인데 매번 만족스러워요."
          }\n\n다만 아쉬운 점이 있다면 더 다양한 기능이 있으면 좋겠어요.\n\n그래도 전반적으로 만족합니다! 👍`,
          confirmed: index === 0 ? "N" : "Y",
          createdAt: reviewDate.toISOString(),
          memberId: "user",
        };
      });
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, [reduxUserInfo]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError("");

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (reduxUserInfo && reduxUserInfo.memberId) {
        const mockReviews = generateReviewsData(reduxUserInfo.memberId);

        const sortedReviews = mockReviews.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setReviews(sortedReviews);
        setCurrentPage(1);

        console.log("생성된 후기 데이터:", sortedReviews);
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

  const safeStripHtml = (html) => {
    if (!html) return "";
    if (typeof stripHtml === "function") {
      return stripHtml(html);
    }
    return html.replace(/<[^>]*>/g, "");
  };

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
                          paddingRight: 1,
                        }}
                      >
                        {safeStripHtml(review.title)}
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
                {safeStripHtml(selectedReview.title)}
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
                  {safeStripHtml(selectedReview.content)}
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
