import {
  Box,
  Button,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  ThemeProvider,
  createTheme,
  Stack,
  TextField,
  MenuItem,
  InputAdornment,
  Fab,
  Fade,
  TableContainer,
  TableCell,
  TableRow,
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
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  maxWidth: "1200px !important",
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2, 0),
}));

export const FilterSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  border: "1px solid #f0f0f0",
}));

export const BlogCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease-in-out",
  cursor: "pointer",
  border: "1px solid #f0f0f0",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(68,195,170,0.15)",
    borderColor: theme.palette.primary.light,
  },
}));

export const AuthorSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export const AuthorAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.primary.main,
  marginRight: theme.spacing(1.5),
  fontSize: "1.2rem",
  fontWeight: "bold",
}));

export const AuthorInfo = styled(Box)({
  flex: 1,
});

export const PostTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  lineHeight: 1.4,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

export const PostContent = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  marginBottom: theme.spacing(2),
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

export const ThumbnailImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: 160,
  objectFit: "cover",
  borderRadius: theme.spacing(1.5),
  backgroundColor: "#f5f5f5",
}));

export const StatsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light + "20",
  color: theme.palette.primary.dark,
  fontWeight: 500,
  fontSize: "0.75rem",
  height: 24,
}));

export const WriteButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: "none",
  boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: `0 6px 16px ${theme.palette.primary.main}40`,
  },
}));

export const FloatingWriteButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.1)",
  },
  zIndex: 1000,
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(3),
    backgroundColor: "#fafafa",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    "&.Mui-focused": {
      backgroundColor: "white",
    },
  },
}));

export const DetailCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  border: "1px solid #f0f0f0",
  overflow: "hidden",
}));

export const InfoTable = styled(TableContainer)(({ theme }) => ({
  "& .MuiTableCell-root": {
    border: "none",
    padding: theme.spacing(2.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiTableRow-root:last-child .MuiTableCell-root": {
    borderBottom: "none",
  },
}));

export const LabelCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: `${theme.palette.primary.main}08`,
  fontWeight: 600,
  width: "140px",
  textAlign: "center",
  color: theme.palette.primary.dark,
  fontSize: "0.875rem",
  letterSpacing: "0.5px",
  borderRadius: `${theme.spacing(1)} 0 0 ${theme.spacing(1)}`,
}));

export const ContentCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "white",
  color: theme.palette.text.primary,
  fontSize: "0.95rem",
  lineHeight: 1.6,
}));

export const ContentArea = styled(Box)(({ theme }) => ({
  minHeight: "200px",
  padding: theme.spacing(3),
  fontSize: "1rem",
  lineHeight: 1.8,
  color: theme.palette.text.primary,
  backgroundColor: "#fafafa",
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  "& img": {
    maxWidth: "100%",
    height: "auto",
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1, 0),
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  "& p": {
    marginBottom: theme.spacing(1.5),
  },
}));

export const FilesArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#fafafa",
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1, 2),
  fontWeight: 500,
  textTransform: "none",
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "translateX(-2px)",
  },
  transition: "all 0.3s ease",
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: "none",
  minWidth: 120,
  boxShadow: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
}));

export const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 28,
  borderRadius: theme.spacing(1.5),
}));

export const ImageGallery = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const GalleryImage = styled("img")(({ theme }) => ({
  width: "100%",
  maxHeight: "200px",
  objectFit: "cover",
  borderRadius: theme.spacing(1.5),
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  },
}));
