import React, { useState } from "react";
import { Paper, Grid } from "@mui/material";
import { sendMessage } from "../../service/member/ApiService";
import CustomInput from "../../components/input/CustomInput";
import CustomButton from "../../components/input/CustomButton";
import CustomAlert from "../../components/input/CustomAlert";
import CustomTypography from "../../components/input/CustomTypography";
import CustomLayout from "../../components/input/CustomLayout";

const SendMessage = ({ onMessageSent }) => {
  const [formData, setFormData] = useState({
    receiverMemberId: "",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 메시지 초기화
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!formData.receiverMemberId.trim()) {
      setError("받는 사람의 아이디를 입력해주세요.");
      return false;
    }

    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.");
      return false;
    }

    if (!formData.content.trim()) {
      setError("내용을 입력해주세요.");
      return false;
    }

    if (formData.title.length > 100) {
      setError("제목은 100자 이내로 입력해주세요.");
      return false;
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
    setSuccess("");

    try {
      const messageDTO = {
        receiverMemberId: formData.receiverMemberId.trim(),
        title: formData.title.trim(),
        content: formData.content.trim(),
      };

      console.log("쪽지 전송 시도:", messageDTO);
      const response = await sendMessage(messageDTO);
      console.log("쪽지 전송 응답:", response);

      if (response) {
        setSuccess("쪽지가 성공적으로 전송되었습니다!");
        setFormData({
          receiverMemberId: "",
          title: "",
          content: "",
        });

        // 부모 컴포넌트에 전송 완료 알림
        if (onMessageSent) {
          onMessageSent(response);
        }
      }
    } catch (err) {
      console.error("쪽지 전송 오류:", err);

      // 에러 메시지 처리
      let errorMessage = "쪽지 전송 중 오류가 발생했습니다.";
      if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      receiverMemberId: "",
      title: "",
      content: "",
    });
    setError("");
    setSuccess("");
  };

  // 스타일 정의
  const paperContainerSx = {
    p: 2,
    backgroundColor: "#f5f5f5",
    borderRadius: 2,
    border: "1px solid #e0e0e0",
  };

  const titleSx = {
    mb: 2,
    color: "#333",
    fontSize: "16px",
    fontWeight: 600,
  };

  const buttonAreaSx = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 1.5,
    mt: 1,
    pt: 1.5,
    borderTop: "1px solid #e0e0e0",
  };

  const infoAlertSx = {
    mt: 2,
    backgroundColor: "#f0f8ff",
    border: "1px solid #b8daff",
  };

  const infoTitleSx = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#333",
    mb: 0.5,
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  };

  const infoContentSx = {
    fontSize: "12px",
    lineHeight: 1.5,
    color: "#666",
  };

  return (
    <Paper sx={paperContainerSx}>
      <CustomTypography sx={titleSx}>새 쪽지 보내기</CustomTypography>

      <CustomLayout component="form" onSubmit={handleSubmit}>
        <CustomLayout.Stack spacing={2}>
          {error && <CustomAlert.Error message={error} />}

          {success && <CustomAlert.Success message={success} />}

          {/* 받는 사람과 제목을 한 줄에 배치 */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <CustomInput
                label="받는 사람 *"
                name="receiverMemberId"
                value={formData.receiverMemberId}
                onChange={handleChange}
                required
                fullWidth
                disabled={loading}
                placeholder="받는 사람 아이디"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <CustomInput
                label={`제목 * (${formData.title.length}/100)`}
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
                disabled={loading}
                placeholder="쪽지 제목"
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
          </Grid>

          <CustomInput
            label="내용 *"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={4}
            disabled={loading}
            placeholder="쪽지 내용을 입력하세요"
            size="small"
            helperText="전달하고 싶은 메시지를 작성해주세요."
          />

          {/* 버튼 영역 */}
          <CustomLayout sx={buttonAreaSx}>
            <CustomButton
              text="초기화"
              type="button"
              onClick={handleReset}
              disabled={loading}
              variant="outlined"
              color="default"
              size="small"
            />
            <CustomButton
              text={loading ? "전송 중..." : "쪽지 보내기"}
              type="submit"
              variant="contained"
              color="success"
              disabled={
                loading ||
                !formData.receiverMemberId ||
                !formData.title ||
                !formData.content
              }
              size="small"
            />
          </CustomLayout>
        </CustomLayout.Stack>
      </CustomLayout>

      {/* 안내 메시지 */}
      <CustomAlert.Info
        title={
          <CustomTypography sx={infoTitleSx}>
            📌 쪽지 전송 안내
          </CustomTypography>
        }
        sx={infoAlertSx}
      >
        <CustomTypography sx={infoContentSx}>
          • 받는 사람의 아이디를 정확히 입력해주세요.
          <br />
          • 자기 자신에게도 쪽지를 보낼 수 있습니다. (메모 기능)
          <br />
          • 제목은 최대 100자까지 입력 가능합니다.
          <br />• 전송된 쪽지는 수정할 수 없으니 신중히 작성해주세요.
        </CustomTypography>
      </CustomAlert.Info>
    </Paper>
  );
};

export default SendMessage;
