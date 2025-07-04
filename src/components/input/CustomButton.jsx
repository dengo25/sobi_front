import Button from '@mui/material/Button';
import { styled } from "@mui/material/styles"

// 커스텀 스타일 버튼
const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => !["customColor"].includes(prop),
})(({ theme, customColor, variant }) => ({
  // contained 스타일 (배경색 채움)
  ...(variant === "contained" && {
    ...(customColor === "success" && {
      backgroundColor: "#27AE60",
      color: "white",
      "&:hover": {
        backgroundColor: "#37AA7C",
      },
    }),
    ...(customColor === "danger" && {
      backgroundColor: "#ef4444",
      color: "white",
      "&:hover": {
        backgroundColor: "#dc2626",
      },
    }),
    ...(customColor === "default" && {
      backgroundColor: "#787878",
      color: "white",
      "&:hover": {
        backgroundColor: "#4d4d4d",
      },
    }),
  }),

  // outlined 스타일 (테두리만)
  ...(variant === "outlined" && {
    ...(customColor === "success" && {
      color: "#27AE60",
      borderColor: "#27AE60",
      "&:hover": {
        backgroundColor: "rgba(39, 174, 96, 0.04)",
        borderColor: "#37AA7C",
      },
    }),
    ...(customColor === "danger" && {
      color: "#ef4444",
      borderColor: "#ef4444",
      "&:hover": {
        backgroundColor: "rgba(239, 68, 68, 0.04)",
        borderColor: "#dc2626",
      },
    }),
    ...(customColor === "default" && {
      color: "#787878",
      borderColor: "#787878",
      "&:hover": {
        backgroundColor: "rgba(120, 120, 120, 0.04)",
        borderColor: "#4d4d4d",
      },
    }),
  }),

  // text 스타일 (텍스트만)
  ...(variant === "text" && {
    ...(customColor === "success" && {
      color: "#27AE60",
      "&:hover": {
        backgroundColor: "rgba(39, 174, 96, 0.04)",
      },
    }),
    ...(customColor === "danger" && {
      color: "#ef4444",
      "&:hover": {
        backgroundColor: "rgba(239, 68, 68, 0.04)",
      },
    }),
    ...(customColor === "default" && {
      color: "#787878",
      "&:hover": {
        backgroundColor: "rgba(120, 120, 120, 0.04)",
      },
    }),
  }),
}));

const CustomButton = ({
  text,

  // 기본 props
  type = "button", // button, submit, reset 
  onClick,
  disabled = false,
  
  // 스타일 관련
  size = "small", // 'small', 'medium', 'large'
  variant = "contained", // outlined, contained, text
  color = "primary", // "primary", "secondary", "success", "error", "info", "warning"

  // 커스텀 색상 (StyledButton 사용시)
  customColor, // "success", "danger", "default"
  useCustomStyle = false,

  // 접근성
  ariaLabel,
  id,
  name,

  // 스타일 클래스
  className = "",
  sx = {}, // Material-UI sx prop

  // 기타 props
  ...otherProps
}) =>{
  const customColors = ["success", "danger", "default"]
  const needsCustomStyle = customColors.includes(color)
  const ButtonComponent = needsCustomStyle ? StyledButton : Button
  const { customColor: _, ...cleanOtherProps } = otherProps
  const BtnProps = {
    type,
    onClick,
    disabled,
    size,
    variant,
    color: needsCustomStyle ? undefined : color,
    ...(needsCustomStyle && {
      customColor: customColor || color,variant,
    }),
    "aria-label": ariaLabel,
    id,
    name,
    className,
    sx,
    ...cleanOtherProps, // customColor가 제거된 props만 전달
  }
  
  return (
    <ButtonComponent {...BtnProps}>{text}</ButtonComponent>
  );
}

export default CustomButton;