import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
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

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(2),
    maxWidth: 800,
    width: "90%",
    maxHeight: "80vh",
  },
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: "white",
  padding: theme.spacing(3, 3, 4, 3),
  position: "relative",
  textAlign: "center",
}));

export const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  color: "white",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
}));

export const ContentSection = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
  "& h3": {
    color: theme.palette.primary.main,
    fontWeight: 700,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1.5),
    fontSize: "1.1rem",
  },
  "& h4": {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(1),
    fontSize: "1rem",
  },
  "& p": {
    lineHeight: 1.7,
    marginBottom: theme.spacing(1.5),
    color: theme.palette.text.primary,
  },
  "& ul": {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
  },
  "& li": {
    lineHeight: 1.6,
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.secondary,
  },
}));

export const SectionDivider = styled(Box)(({ theme }) => ({
  height: 1,
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(3, 0),
}));

export const HighlightBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light + "15",
  border: `1px solid ${theme.palette.primary.light}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  "& p": {
    margin: 0,
    fontWeight: 500,
  },
}));
