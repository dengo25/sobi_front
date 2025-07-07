import React from "react";
import { Tabs, Tab, Box, Badge } from "@mui/material";

const CustomTabs = ({
  // 기본 props
  value = 0,
  onChange,
  tabs = [],

  // 스타일 관련
  variant = "standard",
  orientation = "horizontal",
  centered = false,

  // 탭 스타일
  indicatorColor = "primary",
  textColor = "primary",

  // 스크롤 관련 (variant="scrollable"일 때)
  scrollButtons = "auto",
  allowScrollButtonsMobile = false,

  // 컨텐츠 관련
  showContent = true,
  contentSx = {},

  // 컨테이너 스타일
  sx = {},
  tabsSx = {},

  // 기타 props
  ...otherProps
}) => {
  const defaultTabsSx = {
    borderBottom: orientation === "horizontal" ? "1px solid #e0e0e0" : "none",
    borderRight: orientation === "vertical" ? "1px solid #e0e0e0" : "none",
    ...tabsSx,
  };

  const defaultContentSx = {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
    ...contentSx,
  };

  const renderTab = (tab, index) => {
    let tabLabel = tab.label;

    // 뱃지가 있는 경우
    if (tab.badge !== undefined && tab.badge !== null) {
      tabLabel = (
        <Badge
          badgeContent={tab.badge}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "10px",
              minWidth: "16px",
              height: "16px",
            },
          }}
        >
          {tab.label}
        </Badge>
      );
    }

    // 아이콘이 있는 경우
    if (tab.icon) {
      tabLabel = (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {tab.icon}
          {tabLabel}
        </Box>
      );
    }

    return (
      <Tab
        key={index}
        label={tabLabel}
        disabled={tab.disabled || false}
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          minHeight: 48,
          transition: "all 0.2s",
          "&.Mui-selected": {
            color: indicatorColor === "primary" ? "#1976d2" : "#9c27b0",
          },
          ...(tab.sx || {}),
        }}
        {...(tab.props || {})}
      />
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: orientation === "horizontal" ? "column" : "row",
        height: "100%",
        ...sx,
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        variant={variant}
        orientation={orientation}
        centered={centered}
        indicatorColor={indicatorColor}
        textColor={textColor}
        scrollButtons={scrollButtons}
        allowScrollButtonsMobile={allowScrollButtonsMobile}
        sx={defaultTabsSx}
        {...otherProps}
      >
        {tabs.map((tab, index) => renderTab(tab, index))}
      </Tabs>

      {showContent && value < tabs.length && tabs[value]?.content && (
        <Box sx={defaultContentSx}>{tabs[value].content}</Box>
      )}
    </Box>
  );
};

// 미리 정의된 탭 variants
const CustomTabsVariants = {
  // 마이페이지 메인 탭
  MyPage: ({ selectedTab, onTabChange, unreadCount = 0, ...props }) => {
    const myPageTabs = [
      {
        label: "내가 쓴 후기",
        content: props.reviewContent,
      },
      {
        label: "내가 쓴 댓글",
        content: props.commentContent,
      },
      {
        label: "포인트",
        content: props.pointContent,
      },
      {
        label: "뱃지",
        content: props.badgeContent,
      },
      {
        label: "체험단",
        content: props.experienceContent,
      },
      {
        label: "쪽지",
        badge: unreadCount > 0 ? unreadCount : null,
        content: props.messageContent,
      },
    ];

    return (
      <CustomTabs
        value={selectedTab}
        onChange={onTabChange}
        tabs={myPageTabs}
        tabsSx={{ px: 3, pt: 2 }}
        contentSx={{ flex: 1, overflow: "hidden" }}
        {...props}
      />
    );
  },

  // 쪽지 서브 탭
  Message: ({ selectedTab, onTabChange, ...props }) => {
    const messageTabs = [
      {
        label: "받은쪽지",
        content: props.receivedContent,
      },
      {
        label: "보낸쪽지",
        content: props.sentContent,
      },
      {
        label: "쪽지보내기",
        content: props.sendContent,
      },
    ];

    return (
      <CustomTabs
        value={selectedTab}
        onChange={onTabChange}
        tabs={messageTabs}
        tabsSx={{ px: 2, pt: 1 }}
        contentSx={{
          flex: 1,
          overflow: "hidden",
          backgroundColor: "#f8f9fa",
        }}
        {...props}
      />
    );
  },

  // 세로 탭 (사이드바용)
  Vertical: ({ selectedTab, onTabChange, tabs, ...props }) => (
    <CustomTabs
      value={selectedTab}
      onChange={onTabChange}
      tabs={tabs}
      orientation="vertical"
      variant="scrollable"
      sx={{ height: "100%" }}
      tabsSx={{
        minWidth: 200,
        alignItems: "flex-start",
      }}
      {...props}
    />
  ),

  // 스크롤 가능한 탭
  Scrollable: ({ selectedTab, onTabChange, tabs, ...props }) => (
    <CustomTabs
      value={selectedTab}
      onChange={onTabChange}
      tabs={tabs}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      {...props}
    />
  ),

  // 전체 너비 탭
  FullWidth: ({ selectedTab, onTabChange, tabs, ...props }) => (
    <CustomTabs
      value={selectedTab}
      onChange={onTabChange}
      tabs={tabs}
      variant="fullWidth"
      {...props}
    />
  ),

  // 간단한 탭 (컨텐츠 없음)
  Simple: ({ selectedTab, onTabChange, tabs, ...props }) => (
    <CustomTabs
      value={selectedTab}
      onChange={onTabChange}
      tabs={tabs}
      showContent={false}
      {...props}
    />
  ),
};

// 탭 패널 컴포넌트 (개별 사용시)
CustomTabs.Panel = ({ children, value, index, ...props }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{ height: "100%", overflow: "hidden" }}
      {...props}
    >
      {value === index && children}
    </Box>
  );
};

// 유틸리티 함수들
CustomTabs.createTabs = (labels, contents = []) => {
  return labels.map((label, index) => ({
    label,
    content: contents[index] || null,
  }));
};

// 메인 컴포넌트에 variants 추가
CustomTabs.MyPage = CustomTabsVariants.MyPage;
CustomTabs.Message = CustomTabsVariants.Message;
CustomTabs.Vertical = CustomTabsVariants.Vertical;
CustomTabs.Scrollable = CustomTabsVariants.Scrollable;
CustomTabs.FullWidth = CustomTabsVariants.FullWidth;
CustomTabs.Simple = CustomTabsVariants.Simple;

export default CustomTabs;
