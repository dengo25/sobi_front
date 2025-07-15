"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Container,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Badge,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  RateReview as ReviewIcon,
  Report as ReportIcon,
  Block as BlockIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { getStatus } from "../../service/admin/ApiService";
import AdminDashboard from "./AdminDashBoard";
import MemberList from "./MemberList";
import AdminReviewList from "./AdminReviewList";
import ReportList from "./ReportList";

//상세 페이지 컴포넌트들 import
import MemberDetail from "./MemberDetail";
import AdminReviewDetail from "./AdminReviewDetail";
import ReportDetail from "./ReportDetail";
// import ReportReviewDetail from "./ReportReviewDetail";

import { unblockUser } from "../../service/admin/ApiService";

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

const MainContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
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
  backgroundColor: theme.palette.secondary.main,
  fontSize: 32,
  fontWeight: "bold",
}));

const MenuSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
}));

const MenuLabel = styled(Typography)(({ theme }) => ({
  fontSize: 14,
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

const BreadcrumbContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[50],
}));

const AdminMain = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 기존 상태 관리
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 상세 페이지 상태 관리 추가
  const [currentView, setCurrentView] = useState("list"); // 'list' 또는 'detail'
  const [detailData, setDetailData] = useState(null);
  const [detailType, setDetailType] = useState(""); // 'member', 'review', 'report', 'reportReview'

  // 통계 데이터
  const [memberNotBlockedCount, setMemberNotBlockedCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [unresolvedReports, setUnresolvedReports] = useState(0);
  const [blacklist, setBlacklist] = useState([]);

  // 탭 라벨
  const tabLabels = ["대시보드", "회원 관리", "리뷰 관리", "신고 관리"];

  // 메뉴 아이템 데이터 - 동적으로 수치 반영
  const menuItems = [
    {
      text: "대시보드",
      count: "",
      icon: <DashboardIcon />,
    },
    {
      text: "회원 관리",
      count: `${memberNotBlockedCount.toLocaleString()}명`,
      icon: <PeopleIcon />,
    },
    {
      text: "리뷰 관리",
      count: `${reviewCount.toLocaleString()}건`,
      icon: <ReviewIcon />,
    },
    {
      text: "신고 관리",
      count:
        unresolvedReports > 0 ? `미해결 ${unresolvedReports}건` : "미해결 0건",
      icon: <ReportIcon />,
    },
  ];

  // 상세 페이지로 이동하는 함수
  const handleViewDetail = (type, data) => {
    setDetailType(type);
    setDetailData(data);
    setCurrentView("detail");
  };

  // 리스트로 돌아가는 함수
  const handleBackToList = () => {
    setCurrentView("list");
    setDetailData(null);
    setDetailType("");
  };

  const handleUnblockUser = async (blacklistNo, reason) => {
    try {
      await unblockUser(blacklistNo, reason);
      // 성공 시 데이터 새로고침
      await fetchAdminStatus();
      return true;
    } catch (error) {
      console.error("차단 해제 실패:", error);
      throw error;
    }
  };

  useEffect(() => {
    // URL 파라미터에서 탭 정보 확인
    const tabParam = searchParams.get("tab");
    if (tabParam !== null) {
      const tabIndex = Number.parseInt(tabParam, 10);
      if (tabIndex >= 0 && tabIndex < tabLabels.length) {
        setSelectedTab(tabIndex);
      }
      // URL 파라미터 제거 (깔끔한 URL 유지)
      setSearchParams({});
    }

    fetchAdminStatus();
  }, [searchParams, setSearchParams]);

  const fetchAdminStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getStatus();

      setMemberNotBlockedCount(res.memberNotBlockedCount || 0);
      setBlockedCount(res.blockedCount || 0);
      setReviewCount(res.reviewCount || 0);
      setUnresolvedReports(res.unSolvedReportCount || 0);
      setBlacklist(res.blacklistDto || []);
    } catch (err) {
      console.error("admin main fetch error", err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    // 탭 변경 시 상세 페이지에서 리스트로 돌아가기
    if (currentView === "detail") {
      handleBackToList();
    }
  };

  const handleSidebarItemClick = (index) => {
    setSelectedTab(index);
    // 사이드바 클릭 시 상세 페이지에서 리스트로 돌아가기
    if (currentView === "detail") {
      handleBackToList();
    }
  };

  // Breadcrumb 렌더링 함수
  const renderBreadcrumb = () => {
    if (currentView === "list") return null;

    const getDetailTitle = () => {
      switch (detailType) {
        case "member":
          return `회원 상세 (${
            detailData?.memberName || detailData?.memberId || detailData?.id
          })`;
        case "review":
          return `리뷰 상세 (${detailData?.reviewId || detailData?.id})`;
        case "report":
          return `신고 상세 (${detailData?.reportId || detailData?.id})`;
        case "reportReview":
          return `신고된 리뷰 상세 (${detailData?.targetId || detailData?.id})`;
        default:
          return "상세 정보";
      }
    };

    return (
      <BreadcrumbContainer>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToList}
            size="small"
            variant="outlined"
          >
            목록으로
          </Button>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link
              component="button"
              variant="body2"
              onClick={handleBackToList}
              sx={{ textDecoration: "none" }}
            >
              {tabLabels[selectedTab]}
            </Link>
            <Typography variant="body2" color="text.primary">
              {getDetailTitle()}
            </Typography>
          </Breadcrumbs>
        </Box>
      </BreadcrumbContainer>
    );
  };

  const renderTabContent = () => {
    // 상세 페이지인 경우
    if (currentView === "detail") {
      switch (detailType) {
        case "member":
          return <MemberDetail data={detailData} onBack={handleBackToList} />;
        case "review":
          return (
            <AdminReviewDetail data={detailData} onBack={handleBackToList} />
          );
        case "report":
          return (
            <ReportDetail
              data={detailData}
              onBack={handleBackToList}
              onViewReportReview={(data) =>
                handleViewDetail("reportReview", data)
              }
            />
          );
        // case "reportReview":
        //   return (
        //     <ReportReviewDetail data={detailData} onBack={handleBackToList} />
        //   );
        default:
          return (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography>상세 정보를 찾을 수 없습니다.</Typography>
              <Button onClick={handleBackToList} sx={{ mt: 2 }}>
                목록으로 돌아가기
              </Button>
            </Box>
          );
      }
    }

    // 기존 리스트 페이지 (onViewDetail 함수 전달)
    switch (selectedTab) {
      case 0:
        return (
          <AdminDashboard
            memberNotBlockedCount={memberNotBlockedCount}
            blockedCount={blockedCount}
            reviewCount={reviewCount}
            unresolvedReports={unresolvedReports}
            blacklist={blacklist}
            onRefresh={fetchAdminStatus}
            onUnblockUser={handleUnblockUser}
          />
        );
      case 1:
        return (
          <MemberList
            onViewDetail={(data) => handleViewDetail("member", data)}
          />
        );
      case 2:
        return (
          <AdminReviewList
            onViewDetail={(data) => handleViewDetail("review", data)}
          />
        );
      case 3:
        return (
          <ReportList
            onViewDetail={(data) => handleViewDetail("report", data)}
            onViewReportReview={(data) =>
              handleViewDetail("reportReview", data)
            }
          />
        );
      default:
        return <AdminDashboard />;
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
            <Button variant="contained" onClick={fetchAdminStatus}>
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
              <StyledAvatar>A</StyledAvatar>
              <Typography variant="h6" fontWeight={600}>
                Admin
              </Typography>
            </ProfileSection>

            {/* 메뉴 섹션 */}
            <MenuSection>
              <MenuLabel>• 관리 메뉴</MenuLabel>

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
                        {index === 3 && unresolvedReports > 0 ? (
                          <Badge badgeContent={unresolvedReports} color="error">
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
            </MenuSection>
          </Sidebar>

          {/* 메인 콘텐츠 영역 */}
          <MainContent>
            {/* Breadcrumb 추가 */}
            {renderBreadcrumb()}

            {/* 상단 탭 메뉴 - 상세 페이지에서는 숨김 */}
            {currentView === "list" && (
              <TabsContainer>
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  {tabLabels.map((label, index) => (
                    <Tab
                      key={index}
                      label={
                        index === 3 && unresolvedReports > 0 ? (
                          <Badge badgeContent={unresolvedReports} color="error">
                            {label}
                          </Badge>
                        ) : (
                          label
                        )
                      }
                    />
                  ))}
                </Tabs>
              </TabsContainer>
            )}

            {/* 콘텐츠 영역 */}
            <ContentArea>{renderTabContent()}</ContentArea>
          </MainContent>
        </MainCard>
      </MainContainer>
    </ThemeProvider>
  );
};

export default AdminMain;
