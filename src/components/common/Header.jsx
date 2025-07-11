"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { signout } from "../../service/member/ApiService.js";
import { useSelector } from "react-redux";

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

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  borderBottom: "1px solid #f0f0f0",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  minHeight: "70px",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(0, 4),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    textDecoration: "none",
  },
}));

const LogoImage = styled("img")(({ theme }) => ({
  height: "70px",
  width: "auto",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const NavMenu = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: "0.95rem",
  textTransform: "none",
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.light + "20",
    color: theme.palette.primary.main,
    transform: "translateY(-1px)",
  },
}));

const UtilMenu = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  textTransform: "none",
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.primary.main}`,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    transform: "translateY(-1px)",
    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
  },
}));

const SignUpButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
  fontWeight: 600,
  textTransform: "none",
  padding: theme.spacing(1, 2.5),
  borderRadius: theme.spacing(1),
  boxShadow: `0 2px 8px ${theme.palette.primary.main}40`,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-1px)",
    boxShadow: `0 4px 12px ${theme.palette.primary.main}60`,
  },
}));

const UserMenu = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: theme.palette.primary.main,
  fontSize: "0.9rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.05)",
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  display: "flex",
  color: theme.palette.text.primary,
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const isMobile = useMediaQuery(sobiTheme.breakpoints.down("md"));
  const userInfo = useSelector((state) => state.member);
  const isLoggedIn = userInfo && userInfo.token;

  const member = useSelector((state) => state.member);
  const role = member?.role;

  const handleLogout = () => {
    signout();
    setUserMenuAnchor(null);
    navigate("/");
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const menuItems = [
    { label: "공통", path: "/common" },
    { label: "후기", path: "/review" },
    ...(role === "ROLE_ADMIN" ? [{ label: "관리자", path: "/admin" }] : []),
    { label: "공지사항", path: "/notice" },
    { label: "FAQ", path: "/faq" },
  ];

  return (
    <ThemeProvider theme={sobiTheme}>
      <StyledAppBar position="sticky" elevation={0}>
        <Container maxWidth="xl">
          <StyledToolbar>
            {/* 로고 섹션 */}
            <LogoContainer
              component={Link}
              to="/"
              sx={{ flexGrow: { xs: 1, md: 0 } }}
            >
              <LogoImage src="/images/logo-color.png" alt="SOBI" />
            </LogoContainer>

            {/* 데스크톱 네비게이션 메뉴 */}
            <NavMenu sx={{ flexGrow: 1, ml: 6 }}>
              {menuItems.map((item) => (
                <NavButton key={item.path} component={Link} to={item.path}>
                  {item.label}
                </NavButton>
              ))}
            </NavMenu>

            {/* 데스크톱 유틸리티 메뉴 */}
            {!isLoggedIn ? (
              <UtilMenu>
                <LoginButton component={Link} to="/login">
                  로그인
                </LoginButton>
                <SignUpButton component={Link} to="/join">
                  회원가입
                </SignUpButton>
              </UtilMenu>
            ) : (
              <UtilMenu>
                <LoginButton component={Link} to="/mypage">
                  마이페이지
                </LoginButton>
                <SignUpButton onClick={handleLogout}>로그아웃</SignUpButton>
              </UtilMenu>
            )}

            {/* 모바일 메뉴 버튼 */}
            <MobileMenuButton onClick={handleMobileMenuOpen}>
              <MenuIcon />
            </MobileMenuButton>
          </StyledToolbar>
        </Container>

        {/* 모바일 메뉴 */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            },
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMobileMenuClose}
              sx={{ py: 1.5 }}
            >
              {item.label}
            </MenuItem>
          ))}
          {!isLoggedIn
            ? [
                <MenuItem
                  key="login"
                  component={Link}
                  to="/login"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 1.5, color: "primary.main" }}
                >
                  로그인
                </MenuItem>,
                <MenuItem
                  key="signup"
                  component={Link}
                  to="/join"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 1.5, color: "primary.main", fontWeight: 600 }}
                >
                  회원가입
                </MenuItem>,
              ]
            : [
                <MenuItem
                  key="mypage"
                  component={Link}
                  to="/mypage"
                  onClick={handleMobileMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <PersonIcon sx={{ mr: 1 }} />
                  마이페이지
                </MenuItem>,
                <MenuItem
                  key="logout"
                  onClick={() => {
                    handleLogout();
                    handleMobileMenuClose();
                  }}
                  sx={{ py: 1.5, color: "error.main" }}
                >
                  <LogoutIcon sx={{ mr: 1 }} />
                  로그아웃
                </MenuItem>,
              ]}
        </Menu>

        {/* 사용자 메뉴 */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 180,
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            },
          }}
        >
          <MenuItem
            component={Link}
            to="/mypage"
            onClick={handleUserMenuClose}
            sx={{ py: 1.5 }}
          >
            <PersonIcon sx={{ mr: 1 }} />
            마이페이지
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{ py: 1.5, color: "error.main" }}
          >
            <LogoutIcon sx={{ mr: 1 }} />
            로그아웃
          </MenuItem>
        </Menu>
      </StyledAppBar>
    </ThemeProvider>
  );
};

export default Header;
