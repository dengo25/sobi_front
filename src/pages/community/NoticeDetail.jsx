import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
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
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Report as ReportIcon, //추가
  Delete as DeleteIcon,
} from "@mui/icons-material";
import CustomButton from "../../components/input/CustomButton.jsx";
import {
  getNoticeDetail,
  deleteNotice,
} from "../../service/community/noticeApiService";

const NoticeDetail = () => {
  const { noticeNo } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const member = useSelector((state) => state.member);
  console.log("[slice] 현재 유저 정보 :", member);

  useEffect(() => {
    if (!noticeNo) return;
    getNoticeDetail(noticeNo)
      .then((res) => {
        setDetail(res);
        console.log("[상세호출] res : ", res);
      })
      .catch((err) => {
        console.error("공지 사항 상세 조회 실패 : ", err);
      });
  }, [noticeNo]);

  const handleClick = async (e) => {
    if (e === "update") {
      navigate(`/notice/update/${noticeNo}`, {
        state: { noticeData: detail },
      });
    } else if (e === "delete") {
      if (confirm("해당 게시글을 정말 삭제 하시겠습니까?") == false) {
        return;
      }

      try {
        await deleteNotice(noticeNo);
        console.log("삭제완료 : ", noticeNo);
        navigate("/notice");
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    } else if (e === "list") {
      navigate("/notice");
    }
  };

  if (!detail) return <div>로딩 중...</div>;
  return (
    <>
      <ThemeProvider theme={sobiTheme}>
        <MainContainer>
          <HeaderSection>
            <BackButton
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                handleClick("list");
              }}
            >
              목록으로
            </BackButton>

            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                color="text.primary"
                gutterBottom
              >
                공지사항 상세보기
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
                        {detail.memberId} (관리자)
                      </Typography>
                    </ContentCell>

                    <LabelCell sx={{ width: "140px" }}>글번호</LabelCell>
                    <ContentCell>
                      <Typography variant="body2" color="text.secondary">
                        {noticeNo}
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
                          {detail.noticeTitle}
                        </Typography>
                      </Box>
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
                dangerouslySetInnerHTML={{ __html: detail.noticeContent }}
              />
            </CardContent>
          </DetailCard>

          {member?.role === "ROLE_ADMIN" && (
        <Stack direction="row" spacing={1} sx={{ justifyContent: "right" }}>
          <CustomButton
            type="button"
            onClick={() => {
              handleClick("list");
            }}
            size="medium"
            variant="contained"
            color="success"
            text="목록"
          />
          <CustomButton
            type="button"
            onClick={() => {
              handleClick("update");
            }}
            size="medium"
            variant="contained"
            color="default"
            text="수정"
          />
          <CustomButton
            type="button"
            onClick={() => {
              handleClick("delete");
            }}
            size="medium"
            variant="contained"
            color="danger"
            text="삭제"
          />
        </Stack>
      )}
        </MainContainer>
      </ThemeProvider>
    </>
  );
};

export default NoticeDetail;
