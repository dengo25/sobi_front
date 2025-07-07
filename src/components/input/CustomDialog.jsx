import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from "@mui/material";

const CustomDialog = ({
  // 기본 props
  open = false,
  onClose,

  // 크기 관련
  maxWidth = "sm",
  fullWidth = true,
  fullScreen = false,

  // 제목 관련
  title = "",
  showCloseButton = false,

  // 내용
  children,

  // 액션 버튼들
  actions = null,

  // 스타일 관련
  PaperProps = {},
  titleSx = {},
  contentSx = {},
  actionsSx = {},

  // 기타 props
  ...otherProps
}) => {
  const defaultPaperProps = {
    sx: {
      borderRadius: 2,
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      ...PaperProps.sx,
    },
    ...PaperProps,
  };

  const defaultTitleSx = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#333",
    borderBottom: "1px solid #e0e0e0",
    pb: 2,
    position: "relative",
    ...titleSx,
  };

  const defaultContentSx = {
    pt: 3,
    ...contentSx,
  };

  const defaultActionsSx = {
    p: 3,
    pt: 2,
    borderTop: "1px solid #e0e0e0",
    gap: 1.5,
    ...actionsSx,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      PaperProps={defaultPaperProps}
      {...otherProps}
    >
      {title && (
        <DialogTitle sx={defaultTitleSx}>
          {typeof title === "string" ? (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          ) : (
            title
          )}

          {showCloseButton && (
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: "#666",
                width: 32,
                height: 32,
                fontSize: "18px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              ✕
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent sx={defaultContentSx}>{children}</DialogContent>

      {actions && (
        <DialogActions sx={defaultActionsSx}>{actions}</DialogActions>
      )}
    </Dialog>
  );
};

export default CustomDialog;
