import React from "react";
import { Avatar, Badge, Box, Typography } from "@mui/material";

const CustomAvatar = ({
  // 기본 props
  src,
  alt = "",
  children,

  // 사이즈 관련
  size = "medium",
  customSize,

  // 스타일 관련
  variant = "circular",
  color = "primary",
  backgroundColor,
  textColor = "white",

  // 텍스트 관련 (이미지가 없을 때)
  name = "",
  showInitials = true,
  fontSize,

  // 뱃지 관련
  badge = null,
  badgeColor = "error",
  badgeContent,
  badgeVariant = "standard",
  badgeAnchor = { vertical: "bottom", horizontal: "right" },

  // 추가 기능
  onClick,
  clickable = false,

  // 스타일
  sx = {},

  // 기타 props
  ...otherProps
}) => {
  // 사이즈 설정
  const sizeMap = {
    small: { width: 32, height: 32, fontSize: "14px" },
    medium: { width: 48, height: 48, fontSize: "20px" },
    large: { width: 64, height: 64, fontSize: "24px" },
    xl: { width: 80, height: 80, fontSize: "32px" },
    custom: customSize || { width: 48, height: 48, fontSize: "20px" },
  };

  const sizeStyle = sizeMap[size] || sizeMap.medium;

  // 색상 설정
  const colorMap = {
    primary: "#1976d2",
    secondary: "#9c27b0",
    success: "#4ecdc4",
    warning: "#ff9800",
    error: "#f44336",
    info: "#2196f3",
  };

  const bgColor = backgroundColor || colorMap[color] || colorMap.primary;

  // 이니셜 생성
  const getInitials = () => {
    if (children) return children;
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return "U";
  };

  // 기본 스타일
  const defaultSx = {
    width: sizeStyle.width,
    height: sizeStyle.height,
    bgcolor: bgColor,
    color: textColor,
    fontSize: fontSize || sizeStyle.fontSize,
    cursor: clickable || onClick ? "pointer" : "default",
    ...sx,
  };

  const avatarComponent = (
    <Avatar
      src={src}
      alt={alt}
      variant={variant}
      sx={defaultSx}
      onClick={onClick}
      {...otherProps}
    >
      {!src && showInitials && getInitials()}
    </Avatar>
  );

  // 뱃지가 있는 경우
  if (badge || badgeContent !== undefined) {
    return (
      <Badge
        badgeContent={badgeContent}
        color={badgeColor}
        variant={badgeVariant}
        anchorOrigin={badgeAnchor}
        {...(badge && { ...badge })}
      >
        {avatarComponent}
      </Badge>
    );
  }

  return avatarComponent;
};

// 미리 정의된 아바타 variants
const CustomAvatarVariants = {
  // 프로필 아바타 (마이페이지용)
  profile: ({ userInfo, ...props }) => (
    <CustomAvatar
      size="large"
      color="success"
      name={userInfo?.memberName || userInfo?.name}
      {...props}
    />
  ),

  // 헤더 아바타 (편집 다이얼로그용)
  header: ({ userInfo, ...props }) => (
    <CustomAvatar
      size="large"
      color="success"
      name={userInfo?.memberName || userInfo?.name}
      {...props}
    />
  ),

  // 작은 아바타 (리스트용)
  small: ({ name, ...props }) => (
    <CustomAvatar size="small" name={name} color="primary" {...props} />
  ),

  // 온라인 상태 아바타
  online: ({ name, isOnline, ...props }) => (
    <CustomAvatar
      name={name}
      badgeVariant="dot"
      badgeColor={isOnline ? "success" : "default"}
      badgeAnchor={{ vertical: "bottom", horizontal: "right" }}
      {...props}
    />
  ),

  // 알림 아바타 (읽지 않은 메시지 수)
  notification: ({ name, count, ...props }) => (
    <CustomAvatar
      name={name}
      badgeContent={count > 99 ? "99+" : count}
      badgeColor="error"
      {...props}
    />
  ),
};

// 추가 유틸리티 함수들
CustomAvatar.Group = ({ avatars = [], max = 3, ...props }) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <Box sx={{ display: "flex", alignItems: "center", ...props.sx }}>
      {visibleAvatars.map((avatar, index) => (
        <CustomAvatar
          key={index}
          size="small"
          sx={{
            ml: index > 0 ? -1 : 0,
            border: "2px solid white",
            zIndex: visibleAvatars.length - index,
          }}
          {...avatar}
        />
      ))}
      {remainingCount > 0 && (
        <CustomAvatar
          size="small"
          sx={{
            ml: -1,
            border: "2px solid white",
            bgcolor: "#666",
            fontSize: "12px",
          }}
        >
          +{remainingCount}
        </CustomAvatar>
      )}
    </Box>
  );
};

// 메인 컴포넌트에 variants 추가
CustomAvatar.Profile = CustomAvatarVariants.profile;
CustomAvatar.Header = CustomAvatarVariants.header;
CustomAvatar.Small = CustomAvatarVariants.small;
CustomAvatar.Online = CustomAvatarVariants.online;
CustomAvatar.Notification = CustomAvatarVariants.notification;

export default CustomAvatar;
