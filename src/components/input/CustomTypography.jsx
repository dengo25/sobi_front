import React from "react";
import { Typography } from "@mui/material";

const CustomTypography = ({
  // 기본 props
  children,
  variant = "body1",
  component,

  // 텍스트 관련
  align = "inherit",
  color = "inherit",

  // 스타일 관련
  gutterBottom = false,
  noWrap = false,
  paragraph = false,

  // 커스텀 스타일
  fontSize,
  fontWeight,
  lineHeight,
  textColor,

  // 자주 사용되는 스타일 프리셋
  preset = "",

  // 기타 스타일
  sx = {},

  // 기타 props
  ...otherProps
}) => {
  // 프리셋 스타일 맵
  const presetStyles = {
    // 제목들
    pageTitle: {
      fontSize: "24px",
      fontWeight: 700,
      color: "#333",
      mb: 3,
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#333",
      mb: 2,
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#333",
      mb: 1,
    },

    // 서브타이틀
    subtitle: {
      fontSize: "14px",
      fontWeight: 500,
      color: "#666",
      mb: 1,
    },

    // 본문
    body: {
      fontSize: "14px",
      lineHeight: 1.6,
      color: "#333",
    },
    bodySecondary: {
      fontSize: "14px",
      lineHeight: 1.6,
      color: "#666",
    },

    // 캡션
    caption: {
      fontSize: "12px",
      color: "#999",
    },

    // 라벨
    label: {
      fontSize: "14px",
      fontWeight: 500,
      color: "#374151",
      mb: 1,
    },
    labelRequired: {
      fontSize: "14px",
      fontWeight: 500,
      color: "#374151",
      mb: 1,
      "&::after": {
        content: '" *"',
        color: "#dc2626",
      },
    },

    // 헬퍼 텍스트
    helper: {
      fontSize: "12px",
      color: "#6b7280",
      mt: 0.5,
    },

    // 상태별 색상
    error: {
      color: "#dc2626",
      fontWeight: 500,
    },
    success: {
      color: "#16a34a",
      fontWeight: 500,
    },
    warning: {
      color: "#d97706",
      fontWeight: 500,
    },
    info: {
      color: "#2563eb",
      fontWeight: 500,
    },

    // 특수 용도
    count: {
      fontSize: "12px",
      color: "#999",
      fontWeight: 400,
    },
    date: {
      fontSize: "12px",
      color: "#666",
    },
    status: {
      fontSize: "11px",
      fontWeight: 500,
    },

    // 링크 스타일
    link: {
      color: "#2563eb",
      textDecoration: "none",
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },

    // 강조 텍스트
    emphasis: {
      fontWeight: 600,
      color: "#111827",
    },

    // 비활성화
    disabled: {
      color: "#9ca3af",
    },
  };

  // 기본 스타일 계산
  const getComputedSx = () => {
    let computedSx = {};

    // 프리셋 스타일 적용
    if (preset && presetStyles[preset]) {
      computedSx = { ...computedSx, ...presetStyles[preset] };
    }

    // 개별 스타일 적용
    if (fontSize) computedSx.fontSize = fontSize;
    if (fontWeight) computedSx.fontWeight = fontWeight;
    if (lineHeight) computedSx.lineHeight = lineHeight;
    if (textColor) computedSx.color = textColor;

    // 사용자 정의 sx 적용
    return { ...computedSx, ...sx };
  };

  return (
    <Typography
      variant={variant}
      component={component}
      align={align}
      color={color}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      paragraph={paragraph}
      sx={getComputedSx()}
      {...otherProps}
    >
      {children}
    </Typography>
  );
};

// 미리 정의된 타이포그래피 variants
const CustomTypographyVariants = {
  // 페이지 제목
  PageTitle: ({ children, ...props }) => (
    <CustomTypography preset="pageTitle" variant="h4" {...props}>
      {children}
    </CustomTypography>
  ),

  // 섹션 제목
  SectionTitle: ({ children, ...props }) => (
    <CustomTypography preset="sectionTitle" variant="h6" {...props}>
      {children}
    </CustomTypography>
  ),

  // 카드 제목
  CardTitle: ({ children, ...props }) => (
    <CustomTypography preset="cardTitle" variant="h6" {...props}>
      {children}
    </CustomTypography>
  ),

  // 라벨 (필수 표시 포함)
  Label: ({ children, required = false, ...props }) => (
    <CustomTypography
      preset={required ? "labelRequired" : "label"}
      variant="body2"
      {...props}
    >
      {children}
    </CustomTypography>
  ),

  // 헬퍼 텍스트
  Helper: ({ children, ...props }) => (
    <CustomTypography preset="helper" variant="caption" {...props}>
      {children}
    </CustomTypography>
  ),

  // 에러 메시지
  Error: ({ children, ...props }) => (
    <CustomTypography preset="error" variant="body2" {...props}>
      {children}
    </CustomTypography>
  ),

  // 성공 메시지
  Success: ({ children, ...props }) => (
    <CustomTypography preset="success" variant="body2" {...props}>
      {children}
    </CustomTypography>
  ),

  // 카운트 표시
  Count: ({ children, ...props }) => (
    <CustomTypography preset="count" variant="caption" {...props}>
      {children}
    </CustomTypography>
  ),

  // 날짜 표시
  Date: ({ children, ...props }) => (
    <CustomTypography preset="date" variant="caption" {...props}>
      {children}
    </CustomTypography>
  ),

  // 링크 텍스트
  Link: ({ children, onClick, ...props }) => (
    <CustomTypography
      preset="link"
      variant="body2"
      component="span"
      onClick={onClick}
      {...props}
    >
      {children}
    </CustomTypography>
  ),

  // 강조 텍스트
  Emphasis: ({ children, ...props }) => (
    <CustomTypography preset="emphasis" variant="body1" {...props}>
      {children}
    </CustomTypography>
  ),
};

// 메인 컴포넌트에 variants 추가
CustomTypography.PageTitle = CustomTypographyVariants.PageTitle;
CustomTypography.SectionTitle = CustomTypographyVariants.SectionTitle;
CustomTypography.CardTitle = CustomTypographyVariants.CardTitle;
CustomTypography.Label = CustomTypographyVariants.Label;
CustomTypography.Helper = CustomTypographyVariants.Helper;
CustomTypography.Error = CustomTypographyVariants.Error;
CustomTypography.Success = CustomTypographyVariants.Success;
CustomTypography.Count = CustomTypographyVariants.Count;
CustomTypography.Date = CustomTypographyVariants.Date;
CustomTypography.Link = CustomTypographyVariants.Link;
CustomTypography.Emphasis = CustomTypographyVariants.Emphasis;

export default CustomTypography;
