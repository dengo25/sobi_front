"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../slice/memberSlice";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Divider,
  Badge,
  Alert,
  Snackbar,
  CircularProgress,
  Button,
  Card,
  CardContent,
  ThemeProvider,
} from "@mui/material";
import {
  RateReview as ReviewIcon,
  Comment as CommentIcon,
  Mail as MailIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import DeleteProfile from "./DeleteProfile";
import SendMessage from "./SendMessage";
import ReceivedMessages from "./ReceivedMessages";
import SentMessages from "./SentMessages";
import MyReviews from "./MyReviews";
import AccountInfo from "./AccountInfo";
import {
  MainContainer,
  MainCard,
  Sidebar,
  ProfileSection,
  StyledAvatar,
  MenuSection,
  MenuLabel,
  MainContent,
  TabsContainer,
  ContentArea,
  MessageTabsContainer,
  DefaultContent,
  sobiTheme,
} from "../../assets/styles/sobiTheme";

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
  const [reviewCount, setReviewCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxUserInfo = useSelector((state) => state.member);

  const [searchParams, setSearchParams] = useSearchParams();

  const generateUserInfo = (memberId) => {
    const baseInfo = {
      id: memberId === "admin" ? 1 : 2,
      memberId: memberId,
      role: memberId === "admin" ? "ROLE_ADMIN" : "ROLE_USER",
      memberName: memberId === "admin" ? "관리자" : "사용자",
      memberEmail: memberId === "admin" ? "admin@sobi.com" : "user@sobi.com",
      memberGender: memberId === "admin" ? "M" : "F",
      memberBirth: memberId === "admin" ? "900101" : "950615",
      memberAddr:
        memberId === "admin"
          ? "서울특별시 강남구 테헤란로 123"
          : "서울특별시 마포구 홍익로 456",
      memberZip: memberId === "admin" ? "12345" : "54321",
    };
    return baseInfo;
  };

  const menuItems = [
    { text: "계정 정보", count: "", icon: <CommentIcon /> },
    { text: "내가 쓴 후기", count: `${reviewCount}건`, icon: <ReviewIcon /> },
    {
      text: "쪽지",
      count:
        unreadMessageCount > 0
          ? `미확인 ${unreadMessageCount}건`
          : "미확인 0건",
      icon: <MailIcon />,
    },
  ];

  const tabLabels = ["계정 정보", "내가 쓴 후기", "쪽지"];
  const messageTabLabels = ["받은쪽지", "보낸쪽지", "쪽지보내기"];

  const isLoggedIn = () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    return token !== null;
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const tabParam = searchParams.get("tab");
    if (tabParam !== null) {
      const tabIndex = Number.parseInt(tabParam, 10);
      if (tabIndex >= 0 && tabIndex < tabLabels.length) {
        setSelectedTab(tabIndex);
      }
      setSearchParams({});
    }

    fetchUserInfo();
  }, [navigate, searchParams, setSearchParams]);

  const fetchUnreadMessageCount = async () => {
    try {
      const count = reduxUserInfo.memberId === "admin" ? 3 : 1;
      setUnreadMessageCount(count);
    } catch (err) {
      console.error("읽지 않은 쪽지 수 조회 오류:", err);
      setUnreadMessageCount(0);
    }
  };

  const fetchReviewCount = async () => {
    try {
      const count = reduxUserInfo.memberId === "admin" ? 15 : 3;
      setReviewCount(count);
    } catch (err) {
      console.error("후기 수 조회 오류:", err);
      setReviewCount(0);
    }
  };

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (reduxUserInfo && reduxUserInfo.memberId) {
        const mockUserInfo = generateUserInfo(reduxUserInfo.memberId);
        setUserInfo(mockUserInfo);

        dispatch(
          login({
            token: reduxUserInfo.token,
            memberId: reduxUserInfo.memberId,
            role: reduxUserInfo.role,
            ...mockUserInfo,
          })
        );

        await Promise.all([fetchUnreadMessageCount(), fetchReviewCount()]);
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
    if (newValue !== 2) {
      setSelectedMessageTab(0);
    }

    if (newValue === 2) {
      fetchUnreadMessageCount();
    }

    if (newValue === 1) {
      fetchReviewCount();
    }
  };

  const handleMessageTabChange = (event, newValue) => {
    setSelectedMessageTab(newValue);

    if (newValue === 0) {
      fetchUnreadMessageCount();
    }
  };

  const handleSidebarItemClick = (index) => {
    setSelectedTab(index);
    if (index === 2) {
      fetchUnreadMessageCount();
    }
    if (index === 1) {
      fetchReviewCount();
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
    localStorage.removeItem("ACCESS_TOKEN");
    navigate("/login");
  };

  const handleProfileUpdate = (updatedUserInfo, message) => {
    setUserInfo(updatedUserInfo);

    dispatch(
      login({
        token: reduxUserInfo.token,
        role: reduxUserInfo.role,
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

  const handleMessageAction = () => {
    fetchUnreadMessageCount();
  };

  const handleReviewAction = () => {
    fetchReviewCount();
  };

  const renderTabContent = () => {
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
          <MyReviews onReviewAction={handleReviewAction} />
        </Box>
      );
    }

    // 쪽지 탭
    if (selectedTab === 2) {
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
                {userInfo?.role === "ROLE_ADMIN" ? "관리자" : "일반 회원"}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {userInfo?.memberName || "사용자"}#{userInfo?.id || "0"}
              </Typography>
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
                        {index === 2 && unreadMessageCount > 0 ? (
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
                        primaryTypographyProps={{
                          variant: "body2",
                          color: selectedTab === index ? "inherit" : "inherit",
                        }}
                        secondaryTypographyProps={{
                          variant: "caption",
                          color:
                            selectedTab === index
                              ? "inherit"
                              : "text.secondary",
                        }}
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
