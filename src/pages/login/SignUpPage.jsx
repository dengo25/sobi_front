import React, { useState } from "react";
import { signup, checkEmailDuplicate } from "../../service/member/ApiService";
import CustomInput from "../../components/input/CustomInput";
import CustomButton from "../../components/input/CustomButton.jsx";
import DaumPostcode from "react-daum-postcode";
import { Modal, Box, IconButton, Alert, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function SignUp() {
  const [formData, setFormData] = useState({
    memberId: "",
    password: "",
    memberName: "",
    memberEmail: "",
    memberAddr: "",
    memberZip: "",
  });

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [detailAddress, setDetailAddress] = useState("");

  // 이메일 중복 확인 관련 상태
  const [emailCheck, setEmailCheck] = useState({
    checked: false, // 중복 확인을 했는지 여부
    available: false, // 사용 가능한지 여부
    message: "", // 결과 메시지
    loading: false, // 로딩 상태
  });

  const handleAddressSelect = (data) => {
    const fullAddress = data.address;
    const zonecode = data.zonecode;

    setFormData((prev) => ({
      ...prev,
      memberAddr: fullAddress,
      memberZip: zonecode,
    }));
    setIsPostcodeOpen(false); // 팝업 닫기
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 이메일이 변경되면 중복 확인 상태 초기화
    if (name === "memberEmail") {
      setEmailCheck({
        checked: false,
        available: false,
        message: "",
        loading: false,
      });
    }
  };

  // 이메일 중복 확인 함수
  const handleEmailCheck = async () => {
    const email = formData.memberEmail.trim();

    // 이메일 입력 검증
    if (!email) {
      setEmailCheck({
        checked: true,
        available: false,
        message: "이메일을 입력해주세요.",
        loading: false,
      });
      return;
    }

    // 기본 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailCheck({
        checked: true,
        available: false,
        message: "올바른 이메일 형식이 아닙니다.",
        loading: false,
      });
      return;
    }

    // 로딩 시작
    setEmailCheck((prev) => ({ ...prev, loading: true }));

    try {
      const result = await checkEmailDuplicate(email);

      setEmailCheck({
        checked: true,
        available: result.available,
        message: result.message,
        loading: false,
      });
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      setEmailCheck({
        checked: true,
        available: false,
        message: "이메일 확인 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 이메일 중복 확인이 완료되지 않았거나 사용 불가능한 경우
    if (!emailCheck.checked) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }

    if (!emailCheck.available) {
      alert("사용 가능한 이메일을 입력해주세요.");
      return;
    }

    const finalAddress = `${formData.memberAddr} ${detailAddress}`.trim();

    const sendData = {
      ...formData,
      memberAddr: finalAddress,
    };

    console.log("제출 데이터:", sendData);

    signup(sendData)
      .then((res) => {
        alert("회원가입 완료");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("회원가입 실패:", error);
        alert("회원가입 중 오류가 발생했습니다.");
      });
  };

  // 이메일 확인 결과에 따른 알림 색상 결정
  const getEmailAlertSeverity = () => {
    if (!emailCheck.checked) return "info";
    return emailCheck.available ? "success" : "error";
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border border-gray-300 rounded-xl">
      <h2 className="text-center text-2xl font-bold mb-6">회원가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInput
          label="아이디"
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          placeholder="아이디를 입력하세요"
          required
          fullWidth
          variant="outlined"
          useCustomStyle
          customColor="success"
        />

        <CustomInput
          label="비밀번호"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
          required
          fullWidth
          variant="outlined"
          useCustomStyle
          customColor="success"
        />

        <CustomInput
          label="이름"
          name="memberName"
          value={formData.memberName}
          onChange={handleChange}
          placeholder="이름을 입력하세요"
          required
          fullWidth
          variant="outlined"
          useCustomStyle
          customColor="success"
        />

        {/* 이메일 입력 및 중복 확인 */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <CustomInput
            label="이메일"
            type="email"
            name="memberEmail"
            value={formData.memberEmail}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            required
            fullWidth
            variant="outlined"
            useCustomStyle
            customColor={
              emailCheck.checked
                ? emailCheck.available
                  ? "success"
                  : "danger"
                : "success"
            }
            error={emailCheck.checked && !emailCheck.available}
          />
          <CustomButton
            text={emailCheck.loading ? "" : "중복확인"}
            onClick={handleEmailCheck}
            variant="outlined"
            customColor="success"
            useCustomStyle
            disabled={emailCheck.loading || !formData.memberEmail.trim()}
            sx={{ minWidth: "100px", height: "56px" }}
            startIcon={
              emailCheck.loading ? <CircularProgress size={20} /> : null
            }
          />
        </div>

        {/* 이메일 중복 확인 결과 메시지 */}
        {emailCheck.checked && emailCheck.message && (
          <Alert severity={getEmailAlertSeverity()} sx={{ mt: 1 }}>
            {emailCheck.message}
          </Alert>
        )}

        {/*우편번호나 검색을 누르면 모달창이 true로 되면서 검색창이 열림*/}
        <div style={{ display: "flex", gap: "8px" }}>
          <CustomInput
            label="우편번호"
            name="memberZip"
            value={formData.memberZip}
            onClick={() => setIsPostcodeOpen(true)}
            placeholder="우편번호 검색"
            required
            fullWidth
            variant="outlined"
            useCustomStyle
            customColor="success"
            readOnly
          />
          <CustomButton
            text="검색"
            onClick={() => setIsPostcodeOpen(true)}
            variant="outlined"
            customColor="success"
            useCustomStyle
          />
        </div>

        <CustomInput
          label="주소"
          name="memberAddr"
          value={formData.memberAddr}
          placeholder="주소를 검색으로 입력하세요"
          required
          fullWidth
          variant="outlined"
          useCustomStyle
          customColor="success"
          readOnly
        />
        <CustomInput
          label="상세주소"
          name="detailAddress"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          placeholder="상세 주소를 입력하세요"
          required
          fullWidth
          variant="outlined"
          useCustomStyle
          customColor="success"
        />

        <Modal open={isPostcodeOpen} onClose={() => setIsPostcodeOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: "90%",
              maxWidth: 500,
            }}
          >
            <IconButton
              onClick={() => setIsPostcodeOpen(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <DaumPostcode onComplete={handleAddressSelect} />
          </Box>
        </Modal>

        <CustomButton
          text="회원가입"
          type="submit"
          variant="contained"
          customColor="success"
          useCustomStyle
          fullWidth
          disabled={!emailCheck.checked || !emailCheck.available}
        />
      </form>
    </div>
  );
}

export default SignUp;
