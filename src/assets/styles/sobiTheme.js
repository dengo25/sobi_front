import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Container,
  Card,
  createTheme,
  Dialog,
  IconButton,
  DialogContent,
  DialogActions,
  TableContainer,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Theme
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

// Dialogs & Sections
export const HeaderSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #ff4757, #ff3742)",
  color: "white",
  padding: theme.spacing(3, 3, 4, 3),
  position: "relative",
  textAlign: "center",
}));

export const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const DangerZone = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffebee, #fce4ec)",
  border: "2px solid #f48fb1",
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #ff4757, #ff6b7a)",
    borderRadius: `${theme.spacing(1.5)} ${theme.spacing(1.5)} 0 0`,
  },
}));

export const InputContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#f8f9fa",
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2.5),
  border: "1px solid #e9ecef",
}));

export const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: "1px solid #f0f0f0",
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(1),
    maxWidth: 600,
    width: "100%",
  },
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3, 3, 2, 3),
  textAlign: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main}10)`,
}));

export const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  color: theme.palette.grey[500],
}));

export const ContentBox = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
}));

export const ActionsBox = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  borderTop: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1.5),
}));

// Table & Pagination
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  "& .MuiTable-root": {
    tableLayout: "fixed",
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const EmptyStateBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

export const LoadingBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 200,
}));

export const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  position: "sticky",
  bottom: 0,
  zIndex: 1,
  boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
}));

export const UnreadTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  backgroundColor: theme.palette.primary.light + "20",
  "&:hover": {
    backgroundColor: theme.palette.primary.light + "40",
  },
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginTop: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  borderRadius: theme.spacing(1.5),
}));

export const InfoCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  marginTop: theme.spacing(3),
  boxShadow: "0 4px 12px rgba(68,195,170,0.3)",
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: 120,
}));

export const ReadTableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  backgroundColor: theme.palette.action.selected,
  "&:hover": {
    backgroundColor: theme.palette.action.focus,
  },
}));
