import TextField from "@mui/material/TextField"
import { styled } from "@mui/material/styles"

// 커스텀 스타일 TextField
const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => !["customColor"].includes(prop),
})(({ theme, customColor, variant }) => ({
  // outlined 스타일
  ...(variant === "outlined" && {
    "& .MuiOutlinedInput-root": {
      ...(customColor === "success" && {
        "& fieldset": {
          borderColor: "#27AE60",
        },
        "&:hover fieldset": {
          borderColor: "#37AA7C",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#27AE60",
        },
      }),
      ...(customColor === "danger" && {
        "& fieldset": {
          borderColor: "#ef4444",
        },
        "&:hover fieldset": {
          borderColor: "#dc2626",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#ef4444",
        },
      }),
      ...(customColor === "warning" && {
        "& fieldset": {
          borderColor: "#f59e0b",
        },
        "&:hover fieldset": {
          borderColor: "#d97706",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#f59e0b",
        },
      }),
    },
    "& .MuiInputLabel-root": {
      ...(customColor === "success" && {
        "&.Mui-focused": {
          color: "#27AE60",
        },
      }),
      ...(customColor === "danger" && {
        "&.Mui-focused": {
          color: "#ef4444",
        },
      }),
      ...(customColor === "warning" && {
        "&.Mui-focused": {
          color: "#f59e0b",
        },
      }),
    },
  }),

  // filled 스타일
  ...(variant === "filled" && {
    "& .MuiFilledInput-root": {
      ...(customColor === "success" && {
        "&:after": {
          borderBottomColor: "#27AE60",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottomColor: "#37AA7C",
        },
      }),
      ...(customColor === "danger" && {
        "&:after": {
          borderBottomColor: "#ef4444",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottomColor: "#dc2626",
        },
      }),
      ...(customColor === "warning" && {
        "&:after": {
          borderBottomColor: "#f59e0b",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottomColor: "#d97706",
        },
      }),
    },
    "& .MuiInputLabel-root": {
      ...(customColor === "success" && {
        "&.Mui-focused": {
          color: "#27AE60",
        },
      }),
      ...(customColor === "danger" && {
        "&.Mui-focused": {
          color: "#ef4444",
        },
      }),
      ...(customColor === "warning" && {
        "&.Mui-focused": {
          color: "#f59e0b",
        },
      }),
    },
  }),

  // standard 스타일
  ...(variant === "standard" && {
    "& .MuiInput-root": {
      ...(customColor === "success" && {
        "&:after": {
          borderBottomColor: "#27AE60",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottomColor: "#37AA7C",
        },
      }),
      ...(customColor === "danger" && {
        "&:after": {
          borderBottomColor: "#ef4444",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottomColor: "#dc2626",
        },
      }),
      ...(customColor === "warning" && {
        "&:after": {
          borderBottomColor: "#f59e0b",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottomColor: "#d97706",
        },
      }),
    },
    "& .MuiInputLabel-root": {
      ...(customColor === "success" && {
        "&.Mui-focused": {
          color: "#27AE60",
        },
      }),
      ...(customColor === "danger" && {
        "&.Mui-focused": {
          color: "#ef4444",
        },
      }),
      ...(customColor === "warning" && {
        "&.Mui-focused": {
          color: "#f59e0b",
        },
      }),
    },
  }),
}))

const CustomInput = ({
  // 기본 props
  label = "",
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = "",
  disabled = false,
  required = false,
  readOnly = false,

  // 타입 관련
  type = "text", // text, password, email, number, search, tel, url
  multiline = false,
  rows = 4,
  maxRows,

  // 스타일 관련
  variant = "outlined", // outlined, filled, standard
  size = "medium", // small, medium
  fullWidth = false,
  color = "primary", // primary, secondary, success, error, info, warning

  // 커스텀 색상
  customColor, // success, danger, warning
  useCustomStyle = false,

  // 유효성 검사
  error = false,
  helperText = "",

  // 접근성
  id,
  name,
  ariaLabel,
  ariaDescribedBy,

  // 자동완성
  autoComplete = "off",
  autoFocus = false,

  // 입력 제한
  maxLength,
  minLength,
  pattern,

  // 스타일 클래스
  className = "",
  sx = {},

  // 기타 props
  ...otherProps
}) => {
  // 커스텀 색상 사용 여부 결정
  const customColors = ["success", "danger", "warning"]
  const needsCustomStyle = useCustomStyle || customColors.includes(color)
  const InputComponent = needsCustomStyle ? StyledTextField : TextField

  // 불필요한 props 제거
  const { customColor: _, useCustomStyle: __, ...cleanOtherProps } = otherProps

  const inputProps = {
    id,
    name,
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    disabled,
    required,
    type,
    multiline,
    ...(multiline && { rows }),
    ...(multiline && maxRows && { maxRows }),
    variant,
    size,
    fullWidth,
    color: needsCustomStyle ? undefined : color,
    error,
    helperText,
    autoComplete,
    autoFocus,
    className,
    sx,
    // 커스텀 스타일 사용시 추가 props
    ...(needsCustomStyle && {
      customColor: customColor || color,
    }),
    // readOnly 처리
    ...(readOnly && {
      slotProps: {
        input: {
          readOnly: true,
        },
      },
    }),
    // 입력 제한
    inputProps: {
      ...(maxLength && { maxLength }),
      ...(minLength && { minLength }),
      ...(pattern && { pattern }),
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
    },
    ...cleanOtherProps,
  }

  return <InputComponent {...inputProps} />
}

export default CustomInput
