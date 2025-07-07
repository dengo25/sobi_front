import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import { styled } from "@mui/material/styles"

// 커스텀 스타일 체크박스
const StyledCheckbox = styled(Checkbox, { 
    shouldForwardProp: (prop) => !["customColor"].includes(prop),})
    (({ theme, customColor = "success" }) => ({
  "&.Mui-checked": {
    color:
      customColor === "primary"
        ? theme.palette.primary.main
        : customColor === "success"
          ? "#27AE60"
          : customColor === "warning"
            ? "#f59e0b"
            : customColor === "error"
              ? "#ef4444"
              : customColor === "info"
                ? "#0288d1"
                : theme.palette.primary.main,
  },
}))

const CustomCheckbox = ({
  // 기본 props
  checked = false,
  onChange,
  disabled = false,

  // 라벨 관련
  label = "",
  labelPlacement = "end", // 'start', 'end', 'top', 'bottom'

  // 스타일 관련
  size = "medium", // 'small', 'medium', 'large'
  color = "primary", // 'primary', 'success', 'warning', 'error'
  variant = "default", // 'default', 'custom'

  useCustomStyle = false,
  customColor, 

  // 접근성
  ariaLabel,
  id,
  name,
  value,

  // 추가 기능
  indeterminate = false, // 부분 선택 상태
  required = false,

  // 스타일 클래스
  className = "",
  labelClassName = "",

  // 이벤트
  onFocus,
  onBlur,

  // 기타 props
  ...otherProps
}) => {
  const unsupportedColors = ["success"]
  const autoNeedsCustomStyle = unsupportedColors.includes(color)
  const shouldUseCustomStyle = useCustomStyle || autoNeedsCustomStyle
  const CheckboxComponent = shouldUseCustomStyle ? StyledCheckbox : Checkbox
  const { customColor: _, useCustomStyle: __, ...cleanOtherProps } = otherProps

  const checkboxProps = {
    checked,
    onChange,
    disabled,
    size,
    color: shouldUseCustomStyle ? undefined : color,
    indeterminate,
    ...(shouldUseCustomStyle && {
      customColor: customColor || color,
    }),
    inputProps: {
      "aria-label": ariaLabel || label || "Checkbox",
      ...(id && { id }),
      ...(name && { name }),
      ...(value && { value }),
      ...(required && { required }),
    },
    onFocus,
    onBlur,
    className,
    ...(variant === "custom" && { color }),
  }

  // 라벨이 있는 경우
  if (label) {
    return (
      <FormControlLabel
        control={<CheckboxComponent {...checkboxProps} />}
        label={label}
        labelPlacement={labelPlacement}
        disabled={disabled}
        className={labelClassName}
      />
    )
  }

  // 라벨이 없는 경우
  return <CheckboxComponent {...checkboxProps} />
}

export default CustomCheckbox
