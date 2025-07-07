import { useState, useEffect } from "react";
import {
  Card,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  getMypage,
  isLoggedIn,
  getReceivedMessages,
} from "../../service/member/ApiService";
import { useNavigate } from "react-router-dom";
import EditProfile from "./EditProfile";
import DeleteProfile from "./DeleteProfile";
import SendMessage from "./SendMessage";
import ReceivedMessages from "./ReceivedMessages";
import SentMessages from "./SentMessages";
import MyReviews from "./MyReviews";
import CustomButton from "../../components/input/CustomButton";
import CustomAlert from "../../components/input/CustomAlert";
import CustomTypography from "../../components/input/CustomTypography";
import CustomLayout from "../../components/input/CustomLayout";
import CustomTabs from "../../components/input/CustomTabs";
import CustomAvatar from "../../components/input/CustomAvatar";

const Mypage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedMessageTab, setSelectedMessageTab] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    fetchUserInfo();
  }, [navigate]);

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
      const response = await getMypage();
      if (response) {
        setUserInfo(response);
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

  const handleMessageSent = (sentMessage) => {
    setSuccessMessage("쪽지가 성공적으로 전송되었습니다!");
    setShowSuccessAlert(true);
  };

  // 쪽지 관련 작업 후 읽지 않은 쪽지 수를 업데이트하는 함수
  const handleMessageAction = () => {
    fetchUnreadMessageCount();
  };

  // 스타일 정의
  const pageContainerSx = {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    p: 3,
  };

  const containerSx = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const cardSx = {
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    border: "1px solid #e0e0e0",
  };

  const splitLayoutSx = {
    display: "flex",
    minHeight: "700px",
  };

  const sidebarSx = {
    width: "280px",
    backgroundColor: "white",
    borderRight: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
  };

  const profileSectionSx = {
    p: 3,
    textAlign: "center",
    borderBottom: "1px solid #f0f0f0",
  };

  const avatarSx = {
    width: 80,
    height: 80,
    mx: "auto",
    mb: 1.5,
    backgroundColor: "#4ecdc4",
    fontSize: "32px",
    color: "white",
  };

  const userTypeSx = {
    mb: 0.5,
    fontSize: "14px",
    color: "#666",
  };

  const userNameSx = {
    fontWeight: 600,
    color: "#333",
  };

  const activitySectionSx = {
    p: 2,
    flex: 1,
  };

  const activityTitleSx = {
    fontSize: "12px",
    color: "#666",
    fontWeight: 500,
    mb: 1.5,
    px: 1.5,
  };

  const listSx = {
    py: 0,
  };

  const listItemButtonSx = {
    py: 1.5,
    px: 1.5,
    borderRadius: 1,
    mx: 0.5,
    "&.Mui-selected": {
      backgroundColor: "#f0f8ff",
      color: "#1976d2",
    },
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
  };

  const listItemTextSx = {
    fontSize: "14px",
  };

  const countTextSx = {
    fontSize: "12px",
    color: "#999",
    fontWeight: 400,
  };

  const settingsListItemSx = {
    py: 1,
    px: 1.5,
    borderRadius: 1,
    mx: 0.5,
    "&:hover": {
      backgroundColor: "#f8f9fa",
    },
  };

  const iconBoxSx = {
    width: 20,
    height: 20,
    borderRadius: 0.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  };

  const editIconBoxSx = {
    ...iconBoxSx,
    backgroundColor: "#e3f2fd",
  };

  const deleteIconBoxSx = {
    ...iconBoxSx,
    backgroundColor: "#ffebee",
  };

  const arrowSx = {
    color: "#ccc",
    fontSize: "18px",
  };

  const mainContentSx = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const contentAreaSx = {
    flex: 1,
    overflow: "hidden",
  };

  const reviewContentSx = {
    height: "100%",
    backgroundColor: "#f8f9fa",
  };

  const messageTabsContainerSx = {
    height: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const sendMessageContainerSx = {
    p: 2,
  };

  const placeholderContentSx = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 4,
  };

  const placeholderInnerSx = {
    maxWidth: 500,
    textAlign: "center",
  };

  const placeholderCardSx = {
    p: 3,
    backgroundColor: "white",
    borderRadius: 2,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e0e0e0",
  };

  const placeholderTitleSx = {
    fontWeight: 500,
    mb: 2,
    color: "#555",
  };

  const placeholderListSx = {
    textAlign: "left",
    color: "#666",
    lineHeight: 1.6,
  };

  const placeholderItemSx = {
    mb: 1,
    fontSize: "14px",
  };

  const placeholderFooterSx = {
    mt: 3,
    fontSize: "14px",
    color: "#666",
  };

  const errorContainerSx = {
    textAlign: "center",
  };

  const successToastSx = {
    anchorOrigin: { vertical: "top", horizontal: "center" },
  };

  const renderTabContent = () => {
    // 내가 쓴 후기 탭
    if (selectedTab === 0) {
      return (
        <CustomLayout sx={reviewContentSx}>
          <MyReviews />
        </CustomLayout>
      );
    }

    // 쪽지 탭
    if (selectedTab === 5) {
      return (
        <CustomLayout sx={messageTabsContainerSx}>
          <CustomTabs.Message
            selectedTab={selectedMessageTab}
            onTabChange={handleMessageTabChange}
            receivedContent={
              <ReceivedMessages onMessageAction={handleMessageAction} />
            }
            sentContent={<SentMessages />}
            sendContent={
              <CustomLayout sx={sendMessageContainerSx}>
                <SendMessage onMessageSent={handleMessageSent} />
              </CustomLayout>
            }
          />
        </CustomLayout>
      );
    }

    return (
      <CustomLayout sx={placeholderContentSx}>
        <CustomLayout sx={placeholderInnerSx}>
          <CustomTypography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }}
          >
            콘텐츠 영역
          </CustomTypography>
          <Card sx={placeholderCardSx}>
            <CustomTypography variant="h6" gutterBottom sx={placeholderTitleSx}>
              선택된 탭별 리스트/테이블 출력
            </CustomTypography>
            <CustomLayout sx={placeholderListSx}>
              <CustomTypography sx={placeholderItemSx}>
                - 내가 쓴 댓글: 내가 작성한 댓글 목록
              </CustomTypography>
              <CustomTypography sx={placeholderItemSx}>
                - 포인트: 히스토리 테이블
              </CustomTypography>
              <CustomTypography sx={placeholderItemSx}>
                - 뱃지: 획득 조건 안내 카드
              </CustomTypography>
              <CustomTypography sx={placeholderItemSx}>
                - 체험단: ?
              </CustomTypography>
            </CustomLayout>
            <CustomLayout sx={placeholderFooterSx}>
              <CustomTypography variant="body2">
                이 영역에 실제 탭별 콘텐츠가 표시됩니다.
              </CustomTypography>
            </CustomLayout>
          </Card>
        </CustomLayout>
      </CustomLayout>
    );
  };

  if (loading) {
    return (
      <CustomLayout sx={pageContainerSx}>
        <CustomLayout.Center>
          <CircularProgress size={48} />
        </CustomLayout.Center>
      </CustomLayout>
    );
  }

  if (error) {
    return (
      <CustomLayout sx={pageContainerSx}>
        <CustomLayout.Center>
          <CustomLayout sx={errorContainerSx}>
            <CustomAlert.Error message={error} sx={{ mb: 2 }} />
            <CustomButton
              text="다시 시도"
              variant="contained"
              onClick={fetchUserInfo}
            />
          </CustomLayout>
        </CustomLayout.Center>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout sx={pageContainerSx}>
      <CustomLayout sx={containerSx}>
        <Card sx={cardSx}>
          <CustomLayout sx={splitLayoutSx}>
            {/* 왼쪽 사이드바 */}
            <CustomLayout sx={sidebarSx}>
              {/* 프로필 섹션 */}
              <CustomLayout sx={profileSectionSx}>
                <CustomAvatar sx={avatarSx}>
                  {userInfo?.memberName?.charAt(0).toUpperCase() || "H"}
                </CustomAvatar>
                <CustomTypography variant="body2" sx={userTypeSx}>
                  일반 회원
                </CustomTypography>
                <CustomTypography variant="h6" sx={userNameSx}>
                  {userInfo?.memberName || "hh"}#{userInfo?.id || "9"}
                </CustomTypography>
              </CustomLayout>

              {/* 활동 메뉴 섹션 */}
              <CustomLayout sx={activitySectionSx}>
                <CustomTypography sx={activityTitleSx}>• 활동</CustomTypography>

                <List sx={listSx}>
                  {[
                    { text: "내가 쓴 후기", count: "0건" },
                    { text: "내가 쓴 댓글", count: "0건" },
                    { text: "포인트", count: "0P" },
                    { text: "뱃지", count: "0개" },
                    { text: "체험단", count: "0건?" },
                    {
                      text: "쪽지",
                      count:
                        unreadMessageCount > 0
                          ? `미확인 ${unreadMessageCount}건`
                          : "미확인 0건",
                    },
                  ].map((item, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        onClick={() => handleTabChange(null, index)}
                        selected={selectedTab === index}
                        sx={listItemButtonSx}
                      >
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            ...listItemTextSx,
                            color: selectedTab === index ? "#1976d2" : "#666",
                          }}
                        />
                        <CustomTypography sx={countTextSx}>
                          {item.count}
                        </CustomTypography>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                <CustomLayout.Divider sx={{ my: 2 }} />

                <List sx={listSx}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleSidebarItemClick(0)}
                      sx={settingsListItemSx}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CustomLayout sx={editIconBoxSx}>📝</CustomLayout>
                      </ListItemIcon>
                      <ListItemText
                        primary="정보 수정"
                        primaryTypographyProps={listItemTextSx}
                      />
                      <CustomTypography sx={arrowSx}>›</CustomTypography>
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleSidebarItemClick(1)}
                      sx={settingsListItemSx}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CustomLayout sx={deleteIconBoxSx}>🗑️</CustomLayout>
                      </ListItemIcon>
                      <ListItemText
                        primary="회원 탈퇴"
                        primaryTypographyProps={listItemTextSx}
                      />
                      <CustomTypography sx={arrowSx}>›</CustomTypography>
                    </ListItemButton>
                  </ListItem>
                </List>
              </CustomLayout>
            </CustomLayout>

            {/* 메인 콘텐츠 영역 */}
            <CustomLayout sx={mainContentSx}>
              {/* 상단 탭 메뉴 */}
              <CustomTabs.MyPage
                selectedTab={selectedTab}
                onTabChange={handleTabChange}
                unreadCount={unreadMessageCount}
                showContent={false}
              />

              {/* 콘텐츠 영역 */}
              <CustomLayout sx={contentAreaSx}>
                {renderTabContent()}
              </CustomLayout>
            </CustomLayout>
          </CustomLayout>
        </Card>
      </CustomLayout>

      {/* 다이얼로그들 */}
      <EditProfile
        open={editDialogOpen}
        onClose={handleEditClose}
        userInfo={userInfo}
        onUpdate={handleProfileUpdate}
      />

      <DeleteProfile
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onDelete={handleDeleteSuccess}
      />

      {/* 성공 메시지 토스트 */}
      <CustomAlert.SuccessToast
        open={showSuccessAlert}
        onClose={handleCloseSuccessAlert}
        message={successMessage}
      />
    </CustomLayout>
  );
};

export default Mypage;
