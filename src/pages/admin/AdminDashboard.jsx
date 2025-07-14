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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
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
import { useState } from "react";

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
  memberNotBlockedCount,
  blockedCount,
  reviewCount,
  unresolvedReports,
  blacklist,
  onRefresh,
  onUnblockUser,
}) => {
  const navigate = useNavigate();

  const [openUnblockModal, setOpenUnblockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unblockReason, setUnblockReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  //해제 클릭
  const handleUnblockClick = (user, event) => {
    event.stopPropagation();
    setSelectedUser(user);
    setOpenUnblockModal(true);
    setError("");
    setUnblockReason("");
  };

  const handleCloseModal = () => {
    setOpenUnblockModal(false);
    setSelectedUser(null);
    setUnblockReason("");
    setError("");
  };

  const handleConfirmUnblock = async () => {
    if (!unblockReason.trim()) {
      setError("해제 사유를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await onUnblockUser(selectedUser.blackListNo, unblockReason);
      handleCloseModal();
    } catch (error) {
      setError("해제 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
              <StatNumber>{memberNotBlockedCount.toLocaleString()}</StatNumber>
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
                  <TableCell>사용자 이름</TableCell>
                  <TableCell align="center">차단일자</TableCell>
                  <TableCell align="center">상태</TableCell>
                  <TableCell align="center">작업</TableCell>
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
                      <TableCell>{user.memberName}</TableCell>
                      <TableCell align="center">
                        {new Date(user.updateAt).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell align="center">
                        <Chip label="차단됨" color="error" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        {" "}
                        {/* 추가 */}
                        <Button
                          size="small"
                          onClick={(e) => handleUnblockClick(user, e)}
                        >
                          해제
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
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
              {/* 차단 해제 모달 */}
              <Dialog
                open={openUnblockModal}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>차단 해제</DialogTitle>
                <DialogContent>
                  {selectedUser && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        사용자: {selectedUser.memberName} (
                        {selectedUser.memberId})
                      </Typography>
                    </Box>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="해제 사유"
                    value={unblockReason}
                    onChange={(e) => setUnblockReason(e.target.value)}
                    placeholder="차단 해제 사유를 입력해주세요..."
                    variant="outlined"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} disabled={loading}>
                    취소
                  </Button>
                  <Button
                    onClick={handleConfirmUnblock}
                    variant="contained"
                    color="success"
                    disabled={loading}
                  >
                    {loading ? "처리 중..." : "해제"}
                  </Button>
                </DialogActions>
              </Dialog>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </ContentArea>
  );
};

export default AdminDashboard;
