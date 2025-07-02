import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { getMypage, isLoggedIn } from "../../service/member/ApiService";
import { useNavigate } from "react-router-dom";
import EditProfile from "./EditProfile";
import DeleteProfile from "./DeleteProfile";
import SendMessage from "./SendMessage";
import ReceivedMessages from "./ReceivedMessages";
import SentMessages from "./SentMessages";

const Mypage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedMessageTab, setSelectedMessageTab] = useState(0); // 쪽지 하위 탭
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    // 마이페이지 정보 조회
    fetchUserInfo();
  }, [navigate]);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMypage();
      if (response) {
        setUserInfo(response);
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
    // 쪽지 탭이 아닌 다른 탭으로 이동할 때 쪽지 하위 탭 초기화
    if (newValue !== 5) {
      setSelectedMessageTab(0);
    }
  };

  const handleMessageTabChange = (event, newValue) => {
    setSelectedMessageTab(newValue);
  };

  const handleSidebarItemClick = (index) => {
    if (index === 0) {
      setEditDialogOpen(true);
    } else if (index === 1) {
      setDeleteDialogOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    navigate("/login");
  };

  const handleProfileUpdate = (updatedUserInfo, message) => {
    setUserInfo(updatedUserInfo);
    if (message) {
      setSuccessMessage(message);
      setShowSuccessAlert(true);
    }
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    setSuccessMessage("");
  };

  // 쪽지 전송 성공 핸들러
  const handleMessageSent = (sentMessage) => {
    setSuccessMessage("쪽지가 성공적으로 전송되었습니다!");
    setShowSuccessAlert(true);
  };

  const renderTabContent = () => {
    if (selectedTab === 5) {
      // 쪽지 탭
      return (
        <Box
          sx={{
            p: 4,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 쪽지 하위 탭 */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={selectedMessageTab}
              onChange={handleMessageTabChange}
              aria-label="message tabs"
            >
              <Tab label="받은쪽지" />
              <Tab label="보낸쪽지" />
              <Tab label="쪽지보내기" />
            </Tabs>
          </Box>

          {/* 쪽지 탭별 내용 */}
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "#fafafa",
              overflow: "auto",
              flex: 1, // 남은 공간 모두 사용
            }}
          >
            {selectedMessageTab === 0 && (
              <Box sx={{ p: 1, height: "100%" }}>
                <ReceivedMessages />
              </Box>
            )}

            {selectedMessageTab === 1 && (
              <Box sx={{ p: 1, height: "100%" }}>
                <SentMessages />
              </Box>
            )}

            {selectedMessageTab === 2 && (
              <Box sx={{ p: 2, height: "100%" }}>
                <SendMessage onMessageSent={handleMessageSent} />
              </Box>
            )}
          </Box>
        </Box>
      );
    }

    // 기존 탭 내용
    return (
      <Box sx={{ p: 4, height: "100%" }}>
        <Typography variant="h5" gutterBottom>
          콘텐츠 영역
        </Typography>

        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            p: 4,
            height: "calc(100% - 60px)", // 제목 높이 제외
            backgroundColor: "#fafafa",
            overflow: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            선택된 탭 별 리스트/테이블 출력
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            - 내 글: 작성한 후기 목록
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            - 내 댓글: 내가 작성한 댓글 목록
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            - 포인트: 히스토리 테이블
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            - 뱃지: 획득 조건 안내 카드
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            - 체험단: ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            - 쪽지: 수신/발신 리스트 + 팝업
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              이 영역에 실제 탭별 콘텐츠가 표시됩니다.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          p: 4,
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
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#f5f7fa",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 2,
          minHeight: "calc(100vh - 32px)", // padding 제외한 높이
        }}
      >
        {/* 왼쪽 사이드바 */}
        <Box sx={{ width: "280px", flexShrink: 0 }}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflow: "visible",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}
            >
              {/* 프로필 섹션 */}
              <Box
                sx={{
                  textAlign: "center",
                  p: 4,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2.5,
                    bgcolor: "#4ecdc4",
                    fontSize: "32px",
                    color: "white",
                  }}
                >
                  {userInfo?.memberName?.charAt(0).toUpperCase() || "U"}
                </Avatar>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    mt: 1,
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      {userInfo?.role === "ROLE_USER"
                        ? "일반 회원"
                        : userInfo?.role || "관리자?"}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {userInfo?.memberName || "사용자"}#{userInfo?.id || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* 메뉴 섹션 */}
              <Box sx={{ p: 2, flex: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2, py: 1, fontSize: "12px" }}
                >
                  • 활동
                </Typography>

                <List sx={{ py: 0 }}>
                  {[
                    { text: "내 글", count: "0건" },
                    { text: "내 댓글", count: "0건" },
                    { text: "포인트", count: "0P" },
                    { text: "뱃지", count: "0개" },
                    { text: "체험단", count: "0건?" },
                    { text: "쪽지", count: "미확인 0건" },
                  ].map((item, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        sx={{
                          py: 0.8,
                          px: 2,
                          borderRadius: 1,
                          mx: 1,
                          "&:hover": {
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      >
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontSize: "14px",
                            color: "#666",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", fontSize: "14px" }}
                        >
                          {item.count}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <List sx={{ py: 0 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleSidebarItemClick(0)}
                      sx={{
                        py: 1,
                        px: 2,
                        borderRadius: 1,
                        mx: 1,
                        "&:hover": {
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: "#e3f2fd",
                            borderRadius: 0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography sx={{ fontSize: "12px" }}>📝</Typography>
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary="정보 수정"
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "#666",
                        }}
                      />
                      <Typography sx={{ color: "#ccc", fontSize: "18px" }}>
                        ›
                      </Typography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleSidebarItemClick(1)}
                      sx={{
                        py: 1,
                        px: 2,
                        borderRadius: 1,
                        mx: 1,
                        "&:hover": {
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: "#ffebee",
                            borderRadius: 0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography sx={{ fontSize: "12px" }}>🗑️</Typography>
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary="회원 탈퇴"
                        primaryTypographyProps={{
                          fontSize: "14px",
                          color: "#666",
                        }}
                      />
                      <Typography sx={{ color: "#ccc", fontSize: "18px" }}>
                        ›
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* 메인 콘텐츠 영역 */}
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                p: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* 상단 탭 메뉴 */}
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  sx={{ px: 3, pt: 2 }}
                >
                  <Tab label="내 글" />
                  <Tab label="내 댓글" />
                  <Tab label="포인트" />
                  <Tab label="뱃지" />
                  <Tab label="체험단" />
                  <Tab label="쪽지" />
                </Tabs>
              </Box>

              {/* 콘텐츠 영역 */}
              <Box sx={{ flex: 1, overflow: "hidden" }}>
                {renderTabContent()}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 정보 수정 다이얼로그 */}
      <EditProfile
        open={editDialogOpen}
        onClose={handleEditClose}
        userInfo={userInfo}
        onUpdate={handleProfileUpdate}
      />

      {/* 회원 탈퇴 다이얼로그 */}
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
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Mypage;
