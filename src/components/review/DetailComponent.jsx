"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Button,
  ThemeProvider,
  createTheme,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Stack,
  Chip,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Report as ReportIcon, //추가
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getReview } from "../../service/review/ReviewService.js";
import { deleteReview } from "../../service/review/ReviewService.js";
import {
  sobiTheme,
  MainContainer,
  HeaderSection,
  DetailCard,
  InfoTable,
  LabelCell,
  ContentCell,
  CategoryChip,
  ContentArea,
  BackButton,
  ActionButton,
  StatusChip,
} from "../../assets/styles/sobiThemeReview";

function DetailComponent({ tno: propTno,moveToList }) {
  const { tno: paramTno } = useParams();
  const tno = propTno || paramTno;
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = useSelector((state) => state.member);

  // 실제 API를 통한 데이터 조회
  useEffect(() => {
    const fetchReviewDetail = async () => {
      if (!tno) {
        setError("후기 번호가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("후기 상세 조회 시작:", tno);
        const data = await getReview(tno);
        console.log("후기 상세 조회 결과:", data);

        setReviewData(data);
        setLoading(false);
      } catch (err) {
        console.error("후기 상세 조회 실패:", err);
        setError("후기를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchReviewDetail();
  }, [tno]);

  const handleReport = () => {
    // 로그인 체크
    if (!currentUser?.memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 본인 글 신고 방지
    if (currentUser.memberId === reviewData.memberId) {
      alert("본인이 작성한 글은 신고할 수 없습니다.");
      return;
    }

    // ReportForm으로 이동하면서 필요한 데이터 전달
    navigate("/report", {
      state: {
        reviewId: reviewData.tno, // 후기 번호
        writerId: reviewData.memberId, // 작성자 ID
        reporterId: currentUser.memberId, // 신고자 ID
      },
    });
  };

  const handleBack = () => {
    if (moveToList) {
      moveToList(); // 쿼리 파라미터 유지하며 이동
    } else {
      navigate("/review/list"); // fallback
    }
  };


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: reviewData.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  const handleEdit = () => {
    navigate(`/review/modify/${tno}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      console.log("후기 삭제 시작:", tno);

      // 삭제 API 호출
      await deleteReview(tno);

      // 성공 메시지 표시
      alert("삭제되었습니다.");

      // 목록 페이지로 이동
      navigate("/review/list");
    } catch (error) {
      console.error("후기 삭제 실패:", error);

      // 에러 메시지 표시
      alert(error.message || "후기 삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isAuthor = currentUser?.memberId === reviewData?.memberId;

  // 승인 상태에 따른 칩 컴포넌트
  const getStatusChip = (confirmed) => {
    switch (confirmed) {
      case "Y":
        return (
          <StatusChip
            label="승인됨"
            sx={{
              backgroundColor: "#e8f5e8",
              color: "#2e7d32",
              border: "1px solid #4caf5030",
            }}
            size="small"
          />
        );
      case "R":
        return (
          <StatusChip
            label="반려됨"
            sx={{
              backgroundColor: "#ffebee",
              color: "#d32f2f",
              border: "1px solid #f4433630",
            }}
            size="small"
          />
        );
      case "W":
        return (
          <StatusChip
            label="대기중"
            sx={{
              backgroundColor: "#fff3e0",
              color: "#f57c00",
              border: "1px solid #ff980030",
            }}
            size="small"
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={48} color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <MainContainer>
          <Alert
            severity="error"
            sx={{
              mt: 4,
              borderRadius: 2,
              "& .MuiAlert-message": {
                fontWeight: 500,
              },
            }}
          >
            {error}
          </Alert>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <ActionButton variant="outlined" onClick={handleBack}>
              목록으로 돌아가기
            </ActionButton>
          </Box>
        </MainContainer>
      </ThemeProvider>
    );
  }

  if (!reviewData) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <MainContainer>
          <Alert
            severity="warning"
            sx={{
              mt: 4,
              borderRadius: 2,
              "& .MuiAlert-message": {
                fontWeight: 500,
              },
            }}
          >
            후기를 찾을 수 없습니다.
          </Alert>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <ActionButton variant="outlined" onClick={handleBack}>
              목록으로 돌아가기
            </ActionButton>
          </Box>
        </MainContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={sobiTheme}>
      <MainContainer>
        <HeaderSection>
          <BackButton startIcon={<ArrowBackIcon />} onClick={handleBack}>
            목록으로
          </BackButton>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              color="text.primary"
              gutterBottom
            >
              후기 상세보기
            </Typography>
          </Box>
        </HeaderSection>

        <DetailCard>
          <InfoTable component={Paper} elevation={0}>
            <Table>
              <TableBody>
                <TableRow>
                  <LabelCell>작성자</LabelCell>
                  <ContentCell>
                    <Typography variant="body1" fontWeight={500}>
                      {reviewData.memberId || "익명"}
                    </Typography>
                  </ContentCell>
                  <LabelCell sx={{ width: "140px" }}>작성일</LabelCell>
                  <ContentCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(reviewData.createdAt)}
                    </Typography>
                  </ContentCell>
                </TableRow>

                <TableRow>
                  <LabelCell>제목</LabelCell>
                  <ContentCell colSpan={3}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Typography variant="body1" fontWeight={500}>
                        {reviewData.title}#{reviewData.tno}
                      </Typography>
                      {getStatusChip(reviewData.confirmed)}
                    </Box>
                  </ContentCell>
                </TableRow>

                <TableRow>
                  <LabelCell>카테고리</LabelCell>
                  <ContentCell colSpan={3}>
                    {reviewData.category ? (
                      <CategoryChip
                        label={reviewData.category.name}
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        카테고리 없음
                      </Typography>
                    )}
                  </ContentCell>
                </TableRow>
              </TableBody>
            </Table>
          </InfoTable>

          <Divider />

          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="primary.dark"
              sx={{ mb: 2 }}
            >
              내용
            </Typography>
            <ContentArea
              dangerouslySetInnerHTML={{ __html: reviewData.content }}
            />
          </CardContent>
        </DetailCard>

        <Box sx={{ mb: 4 }}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
          >
            {isAuthor && (
              <ActionButton
                variant="contained"
                color="primary"
                onClick={handleEdit}
                startIcon={<EditIcon />}
              >
                수정
              </ActionButton>
            )}
            {isAuthor && (
              <ActionButton
                variant="contained"
                color="error"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
              >
                삭제
              </ActionButton>
            )}
            <ActionButton
              variant="outlined"
              color="primary"
              onClick={handleShare}
              startIcon={<ShareIcon />}
            >
              공유
            </ActionButton>

            {currentUser?.memberId && (
              <ActionButton
                variant="outlined"
                color="warning"
                onClick={handleReport}
                startIcon={<ReportIcon />}
              >
                신고
              </ActionButton>
            )}
          </Stack>
        </Box>

        {/* <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body1"
            color="primary"
            sx={{
              cursor: "pointer",
              fontWeight: 600,
              textDecoration: "underline",
              "&:hover": {
                color: "primary.dark",
              },
            }}
            onClick={handleBack}
          >
            목록 보기
          </Typography>
        </Box> */}
      </MainContainer>
    </ThemeProvider>
  );
}

export default DetailComponent;
