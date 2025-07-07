import React from "react";
import {
  Box,
  Container,
  Paper,
  Card,
  CardContent,
  Divider,
  Grid,
} from "@mui/material";

const CustomLayout = ({
  // 컨테이너 관련
  children,
  component = "div",

  // 레이아웃 타입
  variant = "default",

  // 스페이싱 관련
  spacing = 2,
  padding = 0,
  margin = 0,

  // 정렬 관련
  direction = "column",
  justifyContent = "flex-start",
  alignItems = "stretch",
  textAlign = "inherit",

  // 크기 관련
  fullWidth = false,
  fullHeight = false,
  maxWidth = "lg",
  minHeight,

  // 배경 관련
  backgroundColor = "transparent",
  backgroundVariant,

  // 테두리 관련
  border = false,
  borderRadius = 0,
  elevation = 0,

  // 기타 스타일
  sx = {},

  // 기타 props
  ...otherProps
}) => {
  // 배경 색상 맵
  const backgroundMap = {
    white: "#ffffff",
    gray: "#f5f5f5",
    light: "#fafafa",
  };

  // 기본 스타일 계산
  const getComputedSx = () => {
    let computedSx = {
      padding: padding,
      margin: margin,
      textAlign: textAlign,
      ...(fullWidth && { width: "100%" }),
      ...(fullHeight && { height: "100%" }),
      ...(minHeight && { minHeight }),
      ...(backgroundColor !== "transparent" && {
        backgroundColor: backgroundMap[backgroundVariant] || backgroundColor,
      }),
      ...(border && {
        border: typeof border === "string" ? border : "1px solid #e0e0e0",
      }),
      ...(borderRadius && { borderRadius }),
    };

    // Flex 레이아웃인 경우
    if (
      variant === "flex" ||
      direction !== "column" ||
      justifyContent !== "flex-start" ||
      alignItems !== "stretch"
    ) {
      computedSx.display = "flex";
      computedSx.flexDirection = direction;
      computedSx.justifyContent = justifyContent;
      computedSx.alignItems = alignItems;
      if (spacing && direction === "row") {
        computedSx.gap = spacing;
      } else if (spacing && direction === "column") {
        computedSx.gap = spacing;
      }
    }

    return { ...computedSx, ...sx };
  };

  // 레이아웃 변형에 따른 렌더링
  switch (variant) {
    case "container":
      return (
        <Container
          maxWidth={maxWidth}
          sx={getComputedSx()}
          component={component}
          {...otherProps}
        >
          {children}
        </Container>
      );

    case "paper":
      return (
        <Paper
          elevation={elevation}
          sx={getComputedSx()}
          component={component}
          {...otherProps}
        >
          {children}
        </Paper>
      );

    case "card":
      return (
        <Card
          elevation={elevation}
          sx={getComputedSx()}
          component={component}
          {...otherProps}
        >
          <CardContent>{children}</CardContent>
        </Card>
      );

    case "grid":
      return (
        <Grid
          container
          spacing={spacing}
          sx={getComputedSx()}
          component={component}
          {...otherProps}
        >
          {children}
        </Grid>
      );

    default:
      return (
        <Box sx={getComputedSx()} component={component} {...otherProps}>
          {children}
        </Box>
      );
  }
};

// 미리 정의된 레이아웃 variants
const CustomLayoutVariants = {
  // 페이지 전체 레이아웃
  Page: ({ children, ...props }) => (
    <CustomLayout
      variant="default"
      fullHeight
      backgroundVariant="gray"
      padding={3}
      sx={{ minHeight: "100vh" }}
      {...props}
    >
      {children}
    </CustomLayout>
  ),

  // 컨테이너 레이아웃 (중앙 정렬)
  Container: ({ children, ...props }) => (
    <CustomLayout variant="container" maxWidth="lg" {...props}>
      {children}
    </CustomLayout>
  ),

  // 카드 레이아웃
  Card: ({ children, ...props }) => (
    <CustomLayout
      variant="card"
      elevation={1}
      borderRadius={2}
      sx={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
      }}
      {...props}
    >
      {children}
    </CustomLayout>
  ),

  // 사이드바 레이아웃
  Sidebar: ({ children, width = "280px", ...props }) => (
    <CustomLayout
      variant="flex"
      direction="column"
      backgroundColor="white"
      border="1px solid #e0e0e0"
      sx={{
        width: width,
        minHeight: "700px",
        borderRight: "1px solid #e0e0e0",
      }}
      {...props}
    >
      {children}
    </CustomLayout>
  ),

  // 메인 콘텐츠 레이아웃
  MainContent: ({ children, ...props }) => (
    <CustomLayout
      variant="flex"
      direction="column"
      sx={{
        flex: 1,
        overflow: "hidden",
      }}
      {...props}
    >
      {children}
    </CustomLayout>
  ),

  // 센터 레이아웃 (수직/수평 중앙 정렬)
  Center: ({ children, ...props }) => (
    <CustomLayout
      variant="flex"
      direction="column"
      justifyContent="center"
      alignItems="center"
      fullHeight
      {...props}
    >
      {children}
    </CustomLayout>
  ),

  // 헤더 레이아웃
  Header: ({ children, ...props }) => (
    <CustomLayout
      variant="flex"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      padding={3}
      border="1px solid #f0f0f0"
      sx={{ borderBottom: "1px solid #f0f0f0" }}
      {...props}
    >
      {children}
    </CustomLayout>
  ),

  // 푸터 레이아웃
  Footer: ({ children, ...props }) => (
    <CustomLayout
      variant="flex"
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      padding={3}
      spacing={1.5}
      border="1px solid #f0f0f0"
      sx={{ borderTop: "1px solid #f0f0f0" }}
      {...props}
    >
      {children}
    </CustomLayout>
  ),

  // 프로필 섹션 레이아웃
  ProfileSection: ({ children, ...props }) => (
    <CustomLayout
      padding={3}
      textAlign="center"
      border="1px solid #f0f0f0"
      sx={{ borderBottom: "1px solid #f0f0f0" }}
      {...props}
    >
      {children}
    </CustomLayout>
  ),

  // 양쪽 분할 레이아웃
  Split: ({ left, right, leftWidth = "280px", ...props }) => (
    <CustomLayout variant="flex" direction="row" fullHeight {...props}>
      <CustomLayout sx={{ width: leftWidth }}>{left}</CustomLayout>
      <CustomLayout sx={{ flex: 1 }}>{right}</CustomLayout>
    </CustomLayout>
  ),

  // 스택 레이아웃 (수직 정렬)
  Stack: ({ children, spacing = 2, ...props }) => (
    <CustomLayout
      variant="flex"
      direction="column"
      spacing={spacing}
      {...props}
    >
      {children}
    </CustomLayout>
  ),

  // 행 레이아웃 (수평 정렬)
  Row: ({ children, spacing = 2, ...props }) => (
    <CustomLayout
      variant="flex"
      direction="row"
      alignItems="center"
      spacing={spacing}
      {...props}
    >
      {children}
    </CustomLayout>
  ),
};

// 구분선 컴포넌트
CustomLayout.Divider = ({ orientation = "horizontal", ...props }) => (
  <Divider
    orientation={orientation}
    sx={{
      my: orientation === "horizontal" ? 2 : 0,
      mx: orientation === "vertical" ? 2 : 0,
    }}
    {...props}
  />
);

// 메인 컴포넌트에 variants 추가
CustomLayout.Page = CustomLayoutVariants.Page;
CustomLayout.Container = CustomLayoutVariants.Container;
CustomLayout.Card = CustomLayoutVariants.Card;
CustomLayout.Sidebar = CustomLayoutVariants.Sidebar;
CustomLayout.MainContent = CustomLayoutVariants.MainContent;
CustomLayout.Center = CustomLayoutVariants.Center;
CustomLayout.Header = CustomLayoutVariants.Header;
CustomLayout.Footer = CustomLayoutVariants.Footer;
CustomLayout.ProfileSection = CustomLayoutVariants.ProfileSection;
CustomLayout.Split = CustomLayoutVariants.Split;
CustomLayout.Stack = CustomLayoutVariants.Stack;
CustomLayout.Row = CustomLayoutVariants.Row;

export default CustomLayout;
