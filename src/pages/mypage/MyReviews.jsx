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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getMyReviews } from "../../service/mypage/ApiService";

// 스타일드 컴포넌트
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    <Container maxWidth="lg" sx={{ p: 2 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h3" fontWeight={600}>
          내가 쓴 후기 ({reviews.length})
        </Typography>
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
        <StyledTableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell>번호</TableCell>
                <TableCell>제목</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="center">작성일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review, index) => (
                <StyledTableRow
                  key={review.tno}
                  onClick={() => handleReviewClick(review)}
                >
                  <TableCell>{reviews.length - index}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: 500,
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
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
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
