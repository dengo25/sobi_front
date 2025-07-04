import { useState, useEffect } from "react";
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
  const [unreadMessageCount, setUnreadMessageCount] = useState(0); // 읽지 않은 쪽지 수
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "24px",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    mainCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
      border: "1px solid #e0e0e0",
    },
    layout: {
      display: "flex",
      minHeight: "700px",
    },
    sidebar: {
      width: "280px",
      backgroundColor: "white",
      borderRight: "1px solid #e0e0e0",
    },
    profileSection: {
      padding: "24px",
      textAlign: "center",
      borderBottom: "1px solid #f0f0f0",
    },
    avatar: {
      width: "80px",
      height: "80px",
      margin: "0 auto 12px",
      backgroundColor: "#4ecdc4",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "32px",
      fontWeight: "bold",
    },
    userRole: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "4px",
    },
    userName: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#333",
    },
    menuSection: {
      padding: "16px",
    },
    menuLabel: {
      fontSize: "12px",
      color: "#666",
      fontWeight: "500",
      marginBottom: "12px",
    },
    menuList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    menuItem: {
      marginBottom: "4px",
    },
    menuButton: {
      width: "100%",
      textAlign: "left",
      padding: "12px",
      border: "none",
      backgroundColor: "transparent",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.2s",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    menuButtonActive: {
      backgroundColor: "#f0f8ff",
      color: "#1976d2",
    },
    menuButtonHover: {
      backgroundColor: "#f8f9fa",
    },
    menuText: {
      fontSize: "14px",
      color: "#666",
    },
    menuCount: {
      fontSize: "12px",
      color: "#999",
    },

    divider: {
      height: "1px",
      backgroundColor: "#e0e0e0",
      margin: "16px 0",
    },
    settingButton: {
      width: "100%",
      textAlign: "left",
      padding: "8px 12px",
      border: "none",
      backgroundColor: "transparent",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#666",
    },
    iconBox: {
      width: "20px",
      height: "20px",
      borderRadius: "3px",
      marginRight: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
    },
    blueIcon: {
      backgroundColor: "#e3f2fd",
    },
    redIcon: {
      backgroundColor: "#ffebee",
    },
    arrow: {
      marginLeft: "auto",
      color: "#ccc",
      fontSize: "18px",
    },
    mainContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    tabsContainer: {
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "white",
    },
    tabs: {
      display: "flex",
    },
    tab: {
      padding: "16px 24px",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      borderBottomWidth: "2px",
      borderBottomStyle: "solid",
      borderBottomColor: "transparent",
      transition: "all 0.2s",
      color: "#666",
    },
    tabActive: {
      borderBottomColor: "#1976d2",
      color: "#1976d2",
    },
    contentArea: {
      flex: 1,
      minHeight: 0,
    },
    messageTabsContainer: {
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "white",
    },
    messageTabs: {
      display: "flex",
    },
    messageTab: {
      padding: "12px 24px",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      borderBottomWidth: "2px",
      borderBottomStyle: "solid",
      borderBottomColor: "transparent",
      transition: "all 0.2s",
      color: "#666",
    },
    messageTabActive: {
      borderBottomColor: "#1976d2",
      color: "#1976d2",
    },
    messageContent: {
      flex: 1,
      backgroundColor: "#f8f9fa",
      overflow: "hidden",
    },
    defaultContent: {
      height: "100%",
      backgroundColor: "#f8f9fa",
      padding: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    defaultContentInner: {
      maxWidth: "500px",
      textAlign: "center",
    },
    defaultTitle: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "16px",
      color: "#333",
    },
    defaultCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: "1px solid #e0e0e0",
    },
    defaultCardTitle: {
      fontSize: "16px",
      fontWeight: "500",
      marginBottom: "16px",
      color: "#555",
    },
    defaultList: {
      textAlign: "left",
      fontSize: "14px",
      color: "#666",
      lineHeight: "1.6",
    },
    defaultNote: {
      marginTop: "24px",
      fontSize: "14px",
      color: "#999",
    },
    successAlert: {
      position: "fixed",
      top: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
      backgroundColor: "#d4edda",
      border: "1px solid #c3e6cb",
      color: "#155724",
      padding: "12px 16px",
      borderRadius: "4px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
    },
    closeButton: {
      marginLeft: "16px",
      background: "none",
      border: "none",
      color: "#155724",
      cursor: "pointer",
      fontSize: "16px",
    },
  };

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
      // 에러가 발생해도 0으로 설정
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
        // 사용자 정보를 가져온 후 읽지 않은 쪽지 수도 가져옴
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

  const handleTabChange = (tabIndex) => {
    setSelectedTab(tabIndex);
    if (tabIndex !== 5) {
      setSelectedMessageTab(0);
    }

    // 쪽지 탭을 선택했을 때 읽지 않은 쪽지 수를 다시 가져옴
    if (tabIndex === 5) {
      fetchUnreadMessageCount();
    }
  };

  const handleMessageTabChange = (tabIndex) => {
    setSelectedMessageTab(tabIndex);

    // 받은쪽지 탭을 선택했을 때 읽지 않은 쪽지 수를 다시 가져옴
    if (tabIndex === 0) {
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

  const renderTabContent = () => {
    // 내가 쓴 후기 탭
    if (selectedTab === 0) {
      return (
        <div style={{ height: "100%", backgroundColor: "#f8f9fa" }}>
          <MyReviews />
        </div>
      );
    }

    // 쪽지 탭
    if (selectedTab === 5) {
      return (
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div style={styles.messageTabsContainer}>
            <div style={styles.messageTabs}>
              {["받은쪽지", "보낸쪽지", "쪽지보내기"].map((tab, index) => (
                <button
                  key={index}
                  onClick={() => handleMessageTabChange(index)}
                  style={{
                    ...styles.messageTab,
                    ...(selectedMessageTab === index
                      ? styles.messageTabActive
                      : {}),
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.messageContent}>
            {selectedMessageTab === 0 && (
              <div style={{ height: "100%" }}>
                <ReceivedMessages onMessageAction={handleMessageAction} />
              </div>
            )}

            {selectedMessageTab === 1 && (
              <div style={{ height: "100%" }}>
                <SentMessages />
              </div>
            )}

            {selectedMessageTab === 2 && (
              <div style={{ height: "100%", padding: "16px" }}>
                <SendMessage onMessageSent={handleMessageSent} />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={styles.defaultContent}>
        <div style={styles.defaultContentInner}>
          <h2 style={styles.defaultTitle}>콘텐츠 영역</h2>
          <div style={styles.defaultCard}>
            <h3 style={styles.defaultCardTitle}>
              선택된 탭별 리스트/테이블 출력
            </h3>
            <div style={styles.defaultList}>
              <p>- 내가 쓴 댓글: 내가 작성한 댓글 목록</p>
              <p>- 포인트: 히스토리 테이블</p>
              <p>- 뱃지: 획득 조건 안내 카드</p>
              <p>- 체험단: ?</p>
            </div>
            <div style={styles.defaultNote}>
              <p>이 영역에 실제 탭별 콘텐츠가 표시됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #1976d2",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: "16px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              color: "#721c24",
              padding: "12px 16px",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
          <button
            onClick={fetchUserInfo}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.mainCard}>
          <div style={styles.layout}>
            {/* 왼쪽 사이드바 */}
            <div style={styles.sidebar}>
              {/* 프로필 섹션 */}
              <div style={styles.profileSection}>
                <div style={styles.avatar}>
                  {userInfo?.memberName?.charAt(0).toUpperCase() || "H"}
                </div>
                <div style={styles.userRole}>일반 회원</div>
                <h2 style={styles.userName}>
                  {userInfo?.memberName || "hh"}#{userInfo?.id || "9"}
                </h2>
              </div>

              {/* 활동 메뉴 섹션 */}
              <div style={styles.menuSection}>
                <div style={styles.menuLabel}>• 활동</div>

                <ul style={styles.menuList}>
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
                    <li key={index} style={styles.menuItem}>
                      <button
                        onClick={() => handleTabChange(index)}
                        style={{
                          ...styles.menuButton,
                          ...(selectedTab === index
                            ? styles.menuButtonActive
                            : {}),
                        }}
                        onMouseEnter={(e) => {
                          if (selectedTab !== index) {
                            e.target.style.backgroundColor = "#f8f9fa";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedTab !== index) {
                            e.target.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        <span style={styles.menuText}>{item.text}</span>
                        <span style={styles.menuCount}>{item.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div style={styles.divider}></div>

                {/* 설정 메뉴 */}
                <div>
                  <button
                    onClick={() => handleSidebarItemClick(0)}
                    style={styles.settingButton}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f8f9fa";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    <div style={{ ...styles.iconBox, ...styles.blueIcon }}>
                      📝
                    </div>
                    <span>정보 수정</span>
                    <span style={styles.arrow}>›</span>
                  </button>

                  <button
                    onClick={() => handleSidebarItemClick(1)}
                    style={styles.settingButton}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f8f9fa";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    <div style={{ ...styles.iconBox, ...styles.redIcon }}>
                      🗑️
                    </div>
                    <span>회원 탈퇴</span>
                    <span style={styles.arrow}>›</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div style={styles.mainContent}>
              {/* 상단 탭 메뉴 */}
              <div style={styles.tabsContainer}>
                <div style={styles.tabs}>
                  {[
                    "내가 쓴 후기",
                    "내가 쓴 댓글",
                    "포인트",
                    "뱃지",
                    "체험단",
                    "쪽지",
                  ].map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => handleTabChange(index)}
                      style={{
                        ...styles.tab,
                        ...(selectedTab === index ? styles.tabActive : {}),
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTab !== index) {
                          e.target.style.color = "#333";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTab !== index) {
                          e.target.style.color = "#666";
                        }
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* 콘텐츠 영역 */}
              <div style={styles.contentArea}>{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>

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

      {/* 성공 메시지 스낵바 */}
      {showSuccessAlert && (
        <div style={styles.successAlert}>
          <span style={{ fontSize: "14px" }}>{successMessage}</span>
          <button onClick={handleCloseSuccessAlert} style={styles.closeButton}>
            ✕
          </button>
        </div>
      )}

      {/* 스피너 애니메이션을 위한 CSS */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Mypage;
