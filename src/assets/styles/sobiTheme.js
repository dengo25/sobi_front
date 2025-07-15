import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Paper,
  Divider,
  Badge,
  Alert,
  Snackbar,
  CircularProgress,
  Button,
  Container,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const sobiTheme = createTheme({
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

export const MainContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

export const MainCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  minHeight: 700,
  display: "flex",
}));

export const Sidebar = styled(Box)(({ theme }) => ({
  width: 280,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
}));

export const ProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.primary.main}08)`,
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: "0 auto 12px",
  backgroundColor: theme.palette.primary.main,
  fontSize: 32,
  fontWeight: "bold",
}));

export const MenuSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
}));

export const MenuLabel = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(1),
}));

export const MainContent = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

export const TabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
}));

export const ContentArea = styled(Box)({
  flex: 1,
  minHeight: 0,
});

export const MessageTabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const DefaultContent = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(4),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));