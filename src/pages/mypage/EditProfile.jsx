import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import { updateMypage } from "../../service/member/ApiService";
import CustomDialog from "../../components/input/CustomDialog";
import CustomInput from "../../components/input/CustomInput";
import CustomButton from "../../components/input/CustomButton";
import CustomAlert from "../../components/input/CustomAlert";
import CustomTypography from "../../components/input/CustomTypography";
import CustomLayout from "../../components/input/CustomLayout";
import CustomAvatar from "../../components/input/CustomAvatar";

const EditProfile = ({ open, onClose, userInfo, onUpdate }) => {
  const [formData, setFormData] = useState({
    memberName: "",
    memberEmail: "",
    memberGender: "",
    memberBirth: "",
    memberAddr: "",
    memberZip: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // userInfo가 변경될 때마다 폼 데이터 초기화
  useEffect(() => {
    if (userInfo) {
      setFormData({
        memberName: userInfo.memberName || "",
        memberEmail: userInfo.memberEmail || "",
        memberGender: userInfo.memberGender || "",
        memberBirth: userInfo.memberBirth || "",
        memberAddr: userInfo.memberAddr || "",
        memberZip: userInfo.memberZip || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [userInfo]);

  // 다이얼로그가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setError("");
      if (userInfo) {
        setFormData({
          memberName: userInfo.memberName || "",
          memberEmail: userInfo.memberEmail || "",
          memberGender: userInfo.memberGender || "",
          memberBirth: userInfo.memberBirth || "",
          memberAddr: userInfo.memberAddr || "",
          memberZip: userInfo.memberZip || "",
          password: "",
          confirmPassword: "",
        });
      }
    }
  }, [open, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.memberName.trim()) {
      setError("이름을 입력해주세요.");
      return false;
    }

    if (!formData.memberEmail.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.memberEmail)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return false;
    }

    if (formData.memberBirth && !/^\d{6}$/.test(formData.memberBirth)) {
      setError("생년월일은 6자리 숫자(YYMMDD)로 입력해주세요.");
      return false;
    }

    if (formData.memberZip && !/^\d{5}$/.test(formData.memberZip)) {
      setError("우편번호는 5자리 숫자로 입력해주세요.");
      return false;
    }

    if (formData.password) {
      if (formData.password.length < 4) {
        setError("비밀번호는 4자 이상이어야 합니다.");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updateData = {
        memberName: formData.memberName,
        memberEmail: formData.memberEmail,
        memberGender: formData.memberGender,
        memberBirth: formData.memberBirth,
        memberAddr: formData.memberAddr,
        memberZip: formData.memberZip,
      };

      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      const response = await updateMypage(updateData);

      if (response) {
        onUpdate(response, "회원정보가 성공적으로 수정되었습니다!");
        onClose();
      }
    } catch (err) {
      console.error("회원정보 수정 오류:", err);
      setError("회원정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 스타일 정의
  const dialogPaperSx = {
    maxHeight: "90vh",
  };

  const closeButtonSx = {
    position: "absolute",
    right: 16,
    top: 16,
    minWidth: 32,
    width: 32,
    height: 32,
    fontSize: "18px",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  };

  const profileSectionSx = {
    p: 4,
    pb: 2,
    textAlign: "center",
    borderBottom: "1px solid #f0f0f0",
    position: "relative",
  };

  const avatarSx = {
    width: 64,
    height: 64,
    mx: "auto",
    mb: 2,
    bgcolor: "#4ecdc4",
    fontSize: "24px",
    color: "white",
  };

  const titleSx = {
    fontWeight: 600,
    mb: 0.5,
    fontSize: "18px",
  };

  const subtitleSx = {
    fontSize: "14px",
    color: "#666",
  };

  const disabledInputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontSize: "14px",
      backgroundColor: "#f9fafb",
      color: "#6b7280",
    },
  };

  const selectSx = {
    borderRadius: 2,
    fontSize: "14px",
  };

  const dividerSx = {
    my: 1,
  };

  const actionsSx = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 2,
    mt: 4,
    pt: 3,
    borderTop: "1px solid #f0f0f0",
  };

  const dialogTitle = (
    <CustomLayout sx={profileSectionSx}>
      <CustomButton
        text="✕"
        onClick={onClose}
        variant="text"
        color="default"
        size="small"
        sx={closeButtonSx}
      />

      <CustomAvatar name={userInfo?.memberName} sx={avatarSx} />

      <CustomTypography sx={titleSx}>회원정보 수정</CustomTypography>

      <CustomTypography sx={subtitleSx}>
        {userInfo?.memberName || "사용자"}#{userInfo?.id || "N/A"}
      </CustomTypography>
    </CustomLayout>
  );

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title={dialogTitle}
      maxWidth="sm"
      PaperProps={{ sx: dialogPaperSx }}
      actions={
        <CustomLayout sx={actionsSx}>
          <CustomButton
            text="취소"
            onClick={onClose}
            disabled={loading}
            variant="outlined"
            color="default"
            size="medium"
          />
          <CustomButton
            text={loading ? "수정 중..." : "수정"}
            type="submit"
            form="edit-profile-form"
            variant="contained"
            color="success"
            disabled={loading}
            size="medium"
          />
        </CustomLayout>
      }
    >
      <CustomLayout
        component="form"
        id="edit-profile-form"
        onSubmit={handleSubmit}
      >
        <CustomLayout.Stack spacing={3}>
          {error && <CustomAlert.Error message={error} />}

          {/* 사용자 ID (읽기 전용) */}
          <CustomInput
            label="사용자 ID"
            value={userInfo?.memberId || ""}
            disabled
            fullWidth
            size="small"
            helperText="사용자 ID는 변경할 수 없습니다."
            sx={disabledInputSx}
          />

          {/* 이름과 이메일 */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomInput
                label="이름 *"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                required
                fullWidth
                disabled={loading}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomInput
                label="이메일 *"
                name="memberEmail"
                type="email"
                value={formData.memberEmail}
                onChange={handleChange}
                required
                fullWidth
                disabled={loading}
                size="small"
              />
            </Grid>
          </Grid>

          {/* 성별과 생년월일 */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>성별</InputLabel>
                <Select
                  name="memberGender"
                  value={formData.memberGender}
                  onChange={handleChange}
                  disabled={loading}
                  label="성별"
                  sx={selectSx}
                >
                  <MenuItem value="">선택</MenuItem>
                  <MenuItem value="M">남성</MenuItem>
                  <MenuItem value="F">여성</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomInput
                label="생년월일"
                name="memberBirth"
                value={formData.memberBirth}
                onChange={handleChange}
                fullWidth
                disabled={loading}
                size="small"
                placeholder="YYMMDD (예: 901225)"
                helperText="6자리 숫자로 입력해주세요 (예: 901225)"
              />
            </Grid>
          </Grid>

          {/* 우편번호와 주소 */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomInput
                label="우편번호"
                name="memberZip"
                value={formData.memberZip}
                onChange={handleChange}
                fullWidth
                disabled={loading}
                size="small"
                placeholder="12345"
                helperText="5자리 숫자로 입력해주세요"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomInput
                label="주소"
                name="memberAddr"
                value={formData.memberAddr}
                onChange={handleChange}
                fullWidth
                disabled={loading}
                size="small"
              />
            </Grid>
          </Grid>

          <CustomLayout.Divider sx={dividerSx} />

          {/* 새 비밀번호 */}
          <CustomInput
            label="새 비밀번호 (선택사항)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            size="small"
            helperText="비밀번호를 변경하지 않으려면 비워두세요."
          />

          {/* 비밀번호 확인 */}
          {formData.password && (
            <CustomInput
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              disabled={loading}
              size="small"
              error={
                formData.password !== formData.confirmPassword &&
                formData.confirmPassword !== ""
              }
              helperText={
                formData.password !== formData.confirmPassword &&
                formData.confirmPassword !== ""
                  ? "비밀번호가 일치하지 않습니다."
                  : ""
              }
            />
          )}
        </CustomLayout.Stack>
      </CustomLayout>
    </CustomDialog>
  );
};

export default EditProfile;
