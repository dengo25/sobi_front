import React from "react";
import { Alert, AlertTitle, Snackbar } from "@mui/material";

const CustomAlert = ({
  // 기본 props
  severity = "info", // error, warning, info, success
  variant = "filled", // filled, outlined, standard

  // 내용 관련
  title = "",
  children,
  message = "",

  // 스타일 관련
  sx = {},
  icon,

  // 액션 관련
  action = null,
  onClose,

  // Snackbar 관련 (토스트 알림용)
  isSnackbar = false,
  open = true,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: "top", horizontal: "center" },

  // 기타 props
  ...otherProps
}) => {
  const alertContent = (
    <Alert
      severity={severity}
      variant={variant}
      sx={sx}
      icon={icon}
      action={action}
      onClose={onClose}
      {...otherProps}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children || message}
    </Alert>
  );

  // Snackbar로 사용하는 경우
  if (isSnackbar) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={anchorOrigin}
      >
        {alertContent}
      </Snackbar>
    );
  }

  // 일반 Alert로 사용하는 경우
  return alertContent;
};

// 미리 정의된 스타일 variants
const CustomAlertVariants = {
  // 에러 알림
  error: (props) => <CustomAlert severity="error" {...props} />,

  // 성공 알림
  success: (props) => <CustomAlert severity="success" {...props} />,

  // 경고 알림
  warning: (props) => <CustomAlert severity="warning" {...props} />,

  // 정보 알림
  info: (props) => <CustomAlert severity="info" {...props} />,

  // 토스트 알림 (성공)
  successToast: (props) => (
    <CustomAlert
      severity="success"
      isSnackbar={true}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={3000}
      {...props}
    />
  ),

  // 토스트 알림 (에러)
  errorToast: (props) => (
    <CustomAlert
      severity="error"
      isSnackbar={true}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={4000}
      {...props}
    />
  ),
};

CustomAlert.Error = CustomAlertVariants.error;
CustomAlert.Success = CustomAlertVariants.success;
CustomAlert.Warning = CustomAlertVariants.warning;
CustomAlert.Info = CustomAlertVariants.info;
CustomAlert.SuccessToast = CustomAlertVariants.successToast;
CustomAlert.ErrorToast = CustomAlertVariants.errorToast;

export default CustomAlert;
