"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Redux 훅 추가
import { login } from "../../slice/memberSlice"; // login 액션 추가
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Paper,
  Divider,
  Badge,
  Alert,
  Snackbar,
  CircularProgress,
  Button,
  Container,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  RateReview as ReviewIcon,
  Comment as CommentIcon,
  Stars as PointIcon,
  EmojiEvents as BadgeIcon,
  Science as ExperimentIcon,
  Mail as MailIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  getMypage,
  isLoggedIn,
  getReceivedMessages,
} from "../../service/member/ApiService";
import DeleteProfile from "./DeleteProfile";
import SendMessage from "./SendMessage";
import ReceivedMessages from "./ReceivedMessages";
import SentMessages from "./SentMessages";
import MyReviews from "./MyReviews";
import AccountInfo from "./AccountInfo";

// SOBI 정확한 브랜드 색상
const sobiTheme = createTheme({
  palette: {
    primary: {
      main: "#44C3AA", // SOBI 연한색
      light: "#6FD4BB", // 더 밝은 버전
      dark: "#045242", // SOBI 진한색
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#045242", // SOBI 진한색을 보조색으로
      light: "#44C3AA",
      dark: "#033A30", // 더 어두운 버전
      contrastText: "#ffffff",
    },
  },
});

// 스타일드 컴포넌트
const MainContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.grey[50],
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const MainCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  minHeight: 700,
  display: "flex",
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: 280,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.primary.main}08)`,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: "0 auto 12px",
  backgroundColor: theme.palette.primary.main,
  fontSize: 32,
  fontWeight: "bold",
}));

const MenuSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
}));

const MenuLabel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(1),
}));

const MainContent = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

const TabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
}));

const ContentArea = styled(Box)({
  flex: 1,
  minHeight: 0,
});

const MessageTabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const DefaultContent = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(4),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Mypage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedMessageTab, setSelectedMessageTab] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux에서 사용자 정보 가져오기
  const reduxUserInfo = useSelector((state) => state.member);

  // URL 파라미터에서 탭 정보 가져오기
  const [searchParams, setSearchParams] = useSearchParams();

  // 메뉴 아이템 데이터
  const menuItems = [
    { text: "계정 정보", count: "", icon: <CommentIcon /> },
    { text: "내가 쓴 후기", count: "0건", icon: <ReviewIcon /> },
    { text: "포인트", count: "0P", icon: <PointIcon /> },
    { text: "뱃지", count: "0개", icon: <BadgeIcon /> },
    { text: "체험단", count: "0건?", icon: <ExperimentIcon /> },
    {
      text: "쪽지",
      count:
        unreadMessageCount > 0
          ? `미확인 ${unreadMessageCount}건`
          : "미확인 0건",
      icon: <MailIcon />,
    },
  ];

  const tabLabels = [
    "계정 정보",
    "내가 쓴 후기",
    "포인트",
    "뱃지",
    "체험단",
    "쪽지",
  ];
  const messageTabLabels = ["받은쪽지", "보낸쪽지", "쪽지보내기"];

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    // URL 파라미터에서 탭 정보 확인
    const tabParam = searchParams.get("tab");
    if (tabParam !== null) {
      const tabIndex = parseInt(tabParam, 10);
      if (tabIndex >= 0 && tabIndex < tabLabels.length) {
        setSelectedTab(tabIndex);
      }
      // URL 파라미터 제거 (깔끔한 URL 유지)
      setSearchParams({});
    }

    fetchUserInfo();
  }, [navigate, searchParams, setSearchParams]);

  // 읽지 않은 쪽지 수를 가져오는 함수
  const fetchUnreadMessageCount = async () => {
    try {
      const messages = await getReceivedMessages();
      if (Array.isArray(messages)) {
        const unreadCount = messages.filter(
          (message) => message.isRead === "N"
        ).length;
        setUnreadMessageCount(unreadCount);
      }
    } catch (err) {
      console.error("읽지 않은 쪽지 수 조회 오류:", err);
      setUnreadMessageCount(0);
    }
  };

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Redux 사용자 정보:", reduxUserInfo);

      const response = await getMypage();
      console.log("API 응답 사용자 정보:", response);

      if (response) {
        // API에서 가져온 정보를 상태에 저장
        setUserInfo(response);

        // Redux 상태도 API 응답으로 업데이트 (최신 정보로 동기화)
        dispatch(
          login({
            ...reduxUserInfo, // 기존 토큰 등은 유지
            ...response, // API에서 가져온 최신 정보로 덮어쓰기
          })
        );

        await fetchUnreadMessageCount();
      } else {
        setError("사용자 정보를 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error("마이페이지 조회 오류:", err);
      setError("사용자 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue !== 5) {
      setSelectedMessageTab(0);
    }

    // 쪽지 탭을 선택했을 때 읽지 않은 쪽지 수를 다시 가져옴
    if (newValue === 5) {
      fetchUnreadMessageCount();
    }
  };

  const handleMessageTabChange = (event, newValue) => {
    setSelectedMessageTab(newValue);

    // 받은쪽지 탭을 선택했을 때 읽지 않은 쪽지 수를 다시 가져옴
    if (newValue === 0) {
      fetchUnreadMessageCount();
    }
  };

  const handleSidebarItemClick = (index) => {
    setSelectedTab(index);
    if (index === 5) {
      fetchUnreadMessageCount();
    }
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    navigate("/login");
  };

  const handleProfileUpdate = (updatedUserInfo, message) => {
    // 로컬 상태 업데이트
    setUserInfo(updatedUserInfo);

    // Redux 상태도 업데이트
    dispatch(
      login({
        ...reduxUserInfo,
        ...updatedUserInfo,
      })
    );

    if (message) {
      setSuccessMessage(message);
      setShowSuccessAlert(true);
    }
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    setSuccessMessage("");
  };

  const handleMessageSent = (sentMessage) => {
    setSuccessMessage("쪽지가 성공적으로 전송되었습니다!");
    setShowSuccessAlert(true);
  };

  // 쪽지 관련 작업 후 읽지 않은 쪽지 수를 업데이트하는 함수
  const handleMessageAction = () => {
    fetchUnreadMessageCount();
  };

  const renderTabContent = () => {
    // 계정 정보 탭
    if (selectedTab === 0) {
      return (
        <Box sx={{ height: "100%", backgroundColor: "grey.50", p: 3 }}>
          <AccountInfo
            userInfo={userInfo}
            onUpdate={handleProfileUpdate}
            onDeleteAccount={handleDeleteAccount}
          />
        </Box>
      );
    }

    // 내가 쓴 후기 탭
    if (selectedTab === 1) {
      return (
        <Box sx={{ height: "100%", backgroundColor: "grey.50" }}>
          <MyReviews />
        </Box>
      );
    }

    // 쪽지 탭
    if (selectedTab === 5) {
      return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <MessageTabsContainer>
            <Tabs
              value={selectedMessageTab}
              onChange={handleMessageTabChange}
              variant="fullWidth"
            >
              {messageTabLabels.map((label, index) => (
                <Tab key={index} label={label} />
              ))}
            </Tabs>
          </MessageTabsContainer>

          <Box sx={{ flex: 1, backgroundColor: "grey.50", overflow: "hidden" }}>
            {selectedMessageTab === 0 && (
              <Box sx={{ height: "100%" }}>
                <ReceivedMessages onMessageAction={handleMessageAction} />
              </Box>
            )}

            {selectedMessageTab === 1 && (
              <Box sx={{ height: "100%" }}>
                <SentMessages />
              </Box>
            )}

            {selectedMessageTab === 2 && (
              <Box sx={{ height: "100%", p: 2 }}>
                <SendMessage onMessageSent={handleMessageSent} />
              </Box>
            )}
          </Box>
        </Box>
      );
    }

    return (
      <DefaultContent>
        <Box sx={{ maxWidth: 500, textAlign: "center" }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            콘텐츠 영역
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                선택된 탭별 리스트/테이블 출력
              </Typography>
              <Box sx={{ textAlign: "left", color: "text.secondary" }}>
                <Typography variant="body2" gutterBottom>
                  - 포인트: 히스토리 테이블
                </Typography>
                <Typography variant="body2" gutterBottom>
                  - 뱃지: 획득 조건 안내 카드
                </Typography>
                <Typography variant="body2" gutterBottom>
                  - 체험단: ?
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                이 영역에 실제 탭별 콘텐츠가 표시됩니다.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </DefaultContent>
    );
  };

  if (loading) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "grey.50",
          }}
        >
          <CircularProgress size={48} />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "grey.50",
            p: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={fetchUserInfo}>
              다시 시도
            </Button>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={sobiTheme}>
      <MainContainer maxWidth="xl">
        <MainCard elevation={2}>
          {/* 왼쪽 사이드바 */}
          <Sidebar>
            {/* 프로필 섹션 */}
            <ProfileSection>
              <StyledAvatar>
                {userInfo?.memberName?.charAt(0).toUpperCase() || "U"}
              </StyledAvatar>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {userInfo?.role === "ROLE_USER" ? "일반 회원" : "관리자"}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {userInfo?.memberName || "사용자"}#{userInfo?.id || "0"}
              </Typography>
              {/* 디버깅용 임시 정보 표시 */}
              {process.env.NODE_ENV === "development" && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  ID: {userInfo?.memberId}
                </Typography>
              )}
            </ProfileSection>

            {/* 활동 메뉴 섹션 */}
            <MenuSection>
              <MenuLabel>• 활동</MenuLabel>

              <List disablePadding>
                {menuItems.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      selected={selectedTab === index}
                      onClick={() => handleSidebarItemClick(index)}
                      sx={{
                        borderRadius: 1.5,
                        mb: 0.5,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateX(4px)",
                          boxShadow: "0 2px 8px rgba(68,195,170,0.2)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: selectedTab === index ? "inherit" : "inherit",
                        }}
                      >
                        {index === 5 && unreadMessageCount > 0 ? (
                          <Badge
                            badgeContent={unreadMessageCount}
                            color="error"
                          >
                            {item.icon}
                          </Badge>
                        ) : (
                          item.icon
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        secondary={item.count}
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* 설정 메뉴 */}
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleDeleteAccount}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 0.5,
                          backgroundColor: "error.light",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 12, color: "white" }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary="회원 탈퇴"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </MenuSection>
          </Sidebar>

          {/* 메인 콘텐츠 영역 */}
          <MainContent>
            {/* 상단 탭 메뉴 */}
            <TabsContainer>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="fullWidth"
              >
                {tabLabels.map((label, index) => (
                  <Tab key={index} label={label} />
                ))}
              </Tabs>
            </TabsContainer>

            {/* 콘텐츠 영역 */}
            <ContentArea>{renderTabContent()}</ContentArea>
          </MainContent>
        </MainCard>

        {/* 다이얼로그들 */}
        <DeleteProfile
          open={deleteDialogOpen}
          onClose={handleDeleteClose}
          onDelete={handleDeleteSuccess}
        />

        {/* 성공 메시지 스낵바 */}
        <Snackbar
          open={showSuccessAlert}
          autoHideDuration={4000}
          onClose={handleCloseSuccessAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSuccessAlert}
            severity="success"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleCloseSuccessAlert}
              >
                <CloseIcon fontSize="small" />
              </Button>
            }
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </MainContainer>
    </ThemeProvider>
  );
};

export default Mypage;
