"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Container,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Wc as GenderIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  RateReview as ReviewIcon,
} from "@mui/icons-material";
import { getMember } from "../../service/admin/ApiService";

const sobiTheme = createTheme({
  palette: {
    primary: {
      main: "#44C3AA",
      light: "#6FD4BB",
      dark: "#045242",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#045242",
      light: "#44C3AA",
      dark: "#033A30",
      contrastText: "#ffffff",
    },
  },
});

const ProfileSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.light}08)`,
}));

const BasicInfoSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: 48,
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  margin: "0 auto",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 0),
  minHeight: 60,
}));

const InfoLabel = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  minWidth: 120,
  marginRight: theme.spacing(2),
}));

const InfoValue = styled(Box)({
  flex: 1,
});

const MemberDetail = () => {
  const [member, setMember] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { memberId } = useParams();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const data = await getMember(memberId);
        setMember(data);
      } catch (err) {
        console.error("회원 정보 조회 오류:", err);
        setError("회원 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const formatGender = (gender) => {
    if (gender === "M") return "남성";
    if (gender === "F") return "여성";
    return "설정 안함";
  };

  if (loading) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={sobiTheme}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* 프로필 섹션 */}
        <ProfileSection>
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <StyledAvatar sx={{ mb: 3 }}>
              {member?.memberName?.charAt(0).toUpperCase() || "U"}
            </StyledAvatar>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              {member?.memberName || "사용자"}
            </Typography>

            <Typography variant="body1" color="text.secondary" gutterBottom>
              @{member?.memberId || "unknown"}
            </Typography>

            {/* <Chip
              label={`게시글 ${member?.memberReviewCount || 0}개`}
              color="primary"
              sx={{ mt: 1 }}
            /> */}
          </CardContent>
        </ProfileSection>

        {/* 기본 정보 섹션 */}
        <BasicInfoSection>
          <CardContent sx={{ p: 4 }}>
            <SectionTitle variant="h6">
              <PersonIcon />
              회원 정보
            </SectionTitle>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <InfoRow>
                  <InfoLabel>
                    <PersonIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      이름
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    <Typography variant="body2" fontWeight={500}>
                      {member?.memberName || "설정 안함"}
                    </Typography>
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoRow>
                  <InfoLabel>
                    <PersonIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      아이디
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    <Typography variant="body2" fontWeight={500}>
                      {member?.memberId || "설정 안함"}
                    </Typography>
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoRow>
                  <InfoLabel>
                    <GenderIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      성별
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    <Typography variant="body2" fontWeight={500}>
                      {formatGender(member?.memberGender)}
                    </Typography>
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoRow>
                  <InfoLabel>
                    <EmailIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      이메일
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    <Typography variant="body2" fontWeight={500}>
                      {member?.memberEmail || "설정 안함"}
                    </Typography>
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12}>
                <InfoRow>
                  <InfoLabel>
                    <HomeIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      주소
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    <Typography variant="body2" fontWeight={500}>
                      {member?.memberAddr || "설정 안함"}
                    </Typography>
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoRow>
                  <InfoLabel>
                    <CalendarIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      가입일
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    <Typography variant="body2" fontWeight={500}>
                      {member?.memberReg
                        ? new Date(member.memberReg).toLocaleDateString("ko-KR")
                        : "정보 없음"}
                    </Typography>
                  </InfoValue>
                </InfoRow>
              </Grid>

              <Grid item xs={12} md={6}>
                <InfoRow>
                  <InfoLabel>
                    <ReviewIcon color="primary" />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      게시글수
                    </Typography>
                  </InfoLabel>
                  <InfoValue>
                    <Chip
                      label={`${member?.memberReviewCount || 0}개`}
                      color="primary"
                      size="small"
                    />
                  </InfoValue>
                </InfoRow>
              </Grid>
            </Grid>
          </CardContent>
        </BasicInfoSection>

        {/* 최근 게시물 섹션 */}
        {/* {recentReviews.length > 0 && (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <SectionTitle variant="h6">
                <ReviewIcon />
                최근 작성한 게시물 ({recentReviews.length}개)
              </SectionTitle>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "grey.50" }}>
                      <TableCell sx={{ fontWeight: 600 }}>제목</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        작성일
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentReviews.map((review) => (
                      <TableRow key={review.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {review.title}
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )} */}
      </Container>
    </ThemeProvider>
  );
};

export default MemberDetail;
