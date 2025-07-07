import React, { useState, useEffect } from "react";
import { deleteMypage, signout } from "../../service/member/ApiService";
import CustomDialog from "../../components/input/CustomDialog";
import CustomInput from "../../components/input/CustomInput";
import CustomButton from "../../components/input/CustomButton";
import CustomAlert from "../../components/input/CustomAlert";
import CustomTypography from "../../components/input/CustomTypography";
import CustomLayout from "../../components/input/CustomLayout";

const DeleteProfile = ({ open, onClose, onDelete }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 다이얼로그가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setPassword("");
      setError("");
    }
  }, [open]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("현재 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await deleteMypage(password);

      if (response && !response.error) {
        signout();
        onDelete();
      } else {
        setError(response.error || "회원 탈퇴 처리 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("회원 탈퇴 오류:", err);
      setError("비밀번호가 일치하지 않거나 탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 스타일 정의
  const dialogPaperSx = {
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  };

  const warningAlertSx = {
    backgroundColor: "#fffbeb",
    borderColor: "#fed7aa",
    color: "#d97706",
  };

  const warningTextSx = {
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#dc2626",
    my: 2,
  };

  const bodyTextSx = {
    fontSize: "13px",
    lineHeight: 1.5,
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="회원 탈퇴"
      maxWidth="sm"
      PaperProps={{ sx: dialogPaperSx }}
      actions={
        <CustomLayout.Row spacing={1.5}>
          <CustomButton
            text="취소"
            onClick={onClose}
            disabled={loading}
            variant="outlined"
            color="default"
            size="medium"
          />
          <CustomButton
            text={loading ? "탈퇴 처리 중..." : "탈퇴하기"}
            type="submit"
            form="delete-profile-form"
            variant="contained"
            color="danger"
            disabled={loading}
            size="medium"
          />
        </CustomLayout.Row>
      }
    >
      <CustomLayout
        component="form"
        id="delete-profile-form"
        onSubmit={handleSubmit}
      >
        <CustomLayout.Stack spacing={2}>
          {error && <CustomAlert.Error message={error} />}

          <CustomAlert.Warning title="주의사항" sx={warningAlertSx}>
            <CustomTypography sx={bodyTextSx}>
              • 회원 탈퇴 시 모든 개인정보가 삭제됩니다.
              <br />
              • 작성한 게시글과 댓글은 유지될 수 있습니다.
              <br />
              • 탈퇴 후에는 같은 아이디로 재가입이 불가능할 수 있습니다.
              <br />• 이 작업은 되돌릴 수 없습니다.
            </CustomTypography>
          </CustomAlert.Warning>

          <CustomTypography sx={warningTextSx}>
            탈퇴하려면 현재 비밀번호를 입력해주세요.
          </CustomTypography>

          <CustomInput
            label="현재 비밀번호"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            fullWidth
            disabled={loading}
            autoFocus
            size="small"
            placeholder="현재 비밀번호를 입력하세요"
          />
        </CustomLayout.Stack>
      </CustomLayout>
    </CustomDialog>
  );
};

export default DeleteProfile;
