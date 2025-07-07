import React, { useState, useEffect } from "react";
import { Chip, CircularProgress } from "@mui/material";
import { getMyReviews } from "../../service/mypage/ApiService";
import CustomButton from "../../components/input/CustomButton";
import CustomAlert from "../../components/input/CustomAlert";
import CustomTypography from "../../components/input/CustomTypography";
import CustomLayout from "../../components/input/CustomLayout";
import CustomTable from "../../components/input/CustomTable";
import CustomDialog from "../../components/input/CustomDialog";

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
      return <Chip label="승인됨" size="small" sx={approvedChipSx} />;
    } else {
      return <Chip label="대기중" size="small" sx={pendingChipSx} />;
    }
  };

  // 스타일 정의
  const loadingContainerSx = {
    height: "200px",
  };

  const errorContainerSx = {
    p: 2,
  };

  const containerSx = {
    p: 2,
  };

  const headerSx = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  };

  const titleSx = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#333",
  };

  const approvedChipSx = {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
    fontSize: "11px",
    fontWeight: 500,
  };

  const pendingChipSx = {
    backgroundColor: "#fff3e0",
    color: "#f57c00",
    fontSize: "11px",
    fontWeight: 500,
  };

  const dialogTitleSx = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#333",
    mb: 1,
  };

  const dateTextSx = {
    fontSize: "14px",
    color: "#666",
    lineHeight: 1.4,
    mb: 0.5,
  };

  const contentContainerSx = {
    minHeight: "200px",
    p: 2,
    backgroundColor: "#fafafa",
    borderRadius: 1,
    border: "1px solid #e0e0e0",
  };

  const contentTextSx = {
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    lineHeight: 1.6,
  };

  // 테이블용 데이터 변환
  const transformedReviews = reviews.map((review, index) => ({
    id: review.tno,
    number: reviews.length - index,
    title: review.title,
    statusChip: getStatusChip(review.confirmed),
    date: formatDate(review.createdAt),
    originalData: review,
  }));

  if (loading) {
    return (
      <CustomLayout.Center sx={loadingContainerSx}>
        <CircularProgress size={32} />
      </CustomLayout.Center>
    );
  }

  if (error) {
    return (
      <CustomLayout sx={errorContainerSx}>
        <CustomAlert.Error
          message={error}
          action={
            <CustomButton
              text="다시 시도"
              onClick={fetchMyReviews}
              size="small"
              variant="outlined"
              color="error"
            />
          }
        />
      </CustomLayout>
    );
  }

  return (
    <CustomLayout sx={containerSx}>
      {/* 헤더 영역 */}
      <CustomLayout sx={headerSx}>
        <CustomTypography sx={titleSx}>
          내가 쓴 후기 ({reviews.length})
        </CustomTypography>
      </CustomLayout>

      {/* 테이블 */}
      <CustomTable.Review
        reviews={transformedReviews}
        onReviewClick={(review) => handleReviewClick(review.originalData)}
      />

      {/* 후기 상세 다이얼로그 */}
      <CustomDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        title={
          selectedReview && (
            <CustomLayout>
              <CustomTypography sx={dialogTitleSx}>
                {selectedReview.title}
              </CustomTypography>
              <CustomLayout.Stack spacing={0.5}>
                <CustomTypography sx={dateTextSx}>
                  작성일:{" "}
                  {new Date(selectedReview.createdAt).toLocaleString("ko-KR")}
                </CustomTypography>
                <CustomLayout>
                  상태: {getStatusChip(selectedReview.confirmed)}
                </CustomLayout>
              </CustomLayout.Stack>
            </CustomLayout>
          )
        }
        showCloseButton={true}
        actions={
          <CustomButton
            text="닫기"
            onClick={handleCloseDialog}
            variant="outlined"
            color="default"
            size="medium"
          />
        }
      >
        {selectedReview && (
          <CustomLayout sx={contentContainerSx}>
            <CustomTypography sx={contentTextSx}>
              {selectedReview.content}
            </CustomTypography>
          </CustomLayout>
        )}
      </CustomDialog>
    </CustomLayout>
  );
};

export default MyReviews;
