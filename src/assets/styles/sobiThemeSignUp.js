import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
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

export const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: "#ffffff",
}));

export const SignUpCard = styled(Card)(({ theme }) => ({
  maxWidth: 1000,
  width: "100%",
  borderRadius: theme.spacing(2),
  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  overflow: "hidden",
  display: "flex",
  minHeight: 600,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    maxWidth: 400,
  },
}));

export const LeftSection = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: "white",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4),
  },
}));

export const RightSection = styled(Box)(({ theme }) => ({
  flex: 1,
  background: `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    right: "-50%",
    width: "200%",
    height: "200%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
    animation: "float 6s ease-in-out infinite",
  },
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-20px)" },
  },
  [theme.breakpoints.down("md")]: {
    minHeight: 200,
    padding: theme.spacing(4),
  },
}));

export const BrandLogo = styled(Typography)(({ theme }) => ({
  fontSize: "3rem",
  fontWeight: 800,
  letterSpacing: "3px",
  marginBottom: theme.spacing(2),
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
    backgroundColor: "#fafafa",
    height: 56,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    "&.Mui-focused": {
      backgroundColor: "white",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
      },
    },
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 500,
  textTransform: "none",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  height: 56,
  boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
  },
}));

export const SocialButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  margin: theme.spacing(0.5),
  height: 56,
  width: 56,
  minWidth: 56,
  border: "1px solid #e0e0e0",
  backgroundColor: "white",
  color: "#666",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
}));
