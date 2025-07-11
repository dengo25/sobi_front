"use client";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  RateReview as ReviewIcon,
  Report as ReportIcon,
  Block as BlockIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(3),
  overflow: "auto",
}));

const StatsGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StatCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  },
}));

const StatCardContent = styled(CardContent)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(3),
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const AdminDashboard = ({
  memberCount,
  blockedCount,
  reviewCount,
  unresolvedReports,
  blacklist,
  onRefresh,
}) => {
  const navigate = useNavigate();

  const handleMemberClick = () => {
    window.dispatchEvent(
      new CustomEvent("changeAdminTab", { detail: { tab: 1 } })
    );
  };

  const handleReviewClick = () => {
    window.dispatchEvent(
      new CustomEvent("changeAdminTab", { detail: { tab: 2 } })
    );
  };

  const handleReportClick = () => {
    window.dispatchEvent(
      new CustomEvent("changeAdminTab", { detail: { tab: 3 } })
    );
  };

  const handleBlockedClick = () => {
    window.dispatchEvent(
      new CustomEvent("changeAdminTab", { detail: { tab: 4 } })
    );
  };

  return (
    <ContentArea>
      {/* 페이지 제목 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <SectionTitle variant="h4">
          <DashboardIcon />
          관리자 대시보드
        </SectionTitle>
        <Button
          onClick={onRefresh}
          variant="outlined"
          startIcon={<RefreshIcon />}
          size="small"
        >
          새로고침
        </Button>
      </Box>

      {/* 통계 카드들 */}
      <StatsGrid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard onClick={handleMemberClick}>
            <StatCardContent>
              <PeopleIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
              <StatNumber>{memberCount.toLocaleString()}</StatNumber>
              <Typography variant="h6" color="text.secondary">
                총 회원 수
              </Typography>
            </StatCardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard onClick={handleReportClick}>
            <StatCardContent>
              <ReportIcon sx={{ fontSize: 48, color: "warning.main", mb: 1 }} />
              <StatNumber>{unresolvedReports.toLocaleString()}</StatNumber>
              <Typography variant="h6" color="text.secondary">
                미해결 신고
              </Typography>
            </StatCardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard onClick={handleReviewClick}>
            <StatCardContent>
              <ReviewIcon sx={{ fontSize: 48, color: "info.main", mb: 1 }} />
              <StatNumber>{reviewCount.toLocaleString()}</StatNumber>
              <Typography variant="h6" color="text.secondary">
                총 리뷰 수
              </Typography>
            </StatCardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard onClick={handleBlockedClick}>
            <StatCardContent>
              <BlockIcon sx={{ fontSize: 48, color: "error.main", mb: 1 }} />
              <StatNumber>{blockedCount.toLocaleString()}</StatNumber>
              <Typography variant="h6" color="text.secondary">
                차단된 사용자
              </Typography>
            </StatCardContent>
          </StatCard>
        </Grid>
      </StatsGrid>

      {/* 최근 차단된 사용자 목록 */}
      <Card>
        <CardContent>
          <SectionTitle variant="h6">
            <WarningIcon />
            차단된 사용자 ({blockedCount}명)
          </SectionTitle>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell>사용자 ID</TableCell>
                  <TableCell align="center">차단일자</TableCell>
                  <TableCell align="center">상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blacklist && blacklist.length > 0 ? (
                  blacklist.map((user, index) => (
                    <TableRow
                      key={user.id || index}
                      onClick={handleBlockedClick}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>{user.memberId}</TableCell>
                      <TableCell align="center">
                        {new Date(user.updateAt).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell align="center">
                        <Chip label="차단됨" color="error" size="small" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Box sx={{ py: 4 }}>
                        <CheckCircleIcon
                          sx={{ fontSize: 48, color: "success.main", mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          차단된 사용자가 없습니다.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </ContentArea>
  );
};

export default AdminDashboard;
