import React, { useState } from "react";
import { signup } from "../../service/member/ApiService";
import CustomInput from "../../components/input/CustomInput";
import DaumPostcode from "react-daum-postcode";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../../components/input/CustomButton.jsx";

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
        console.error("회원가입 오류:", error);

        // 블랙리스트 에러 처리 추가
        if (
          error.message &&
          error.message.includes("이용이 제한되어 있습니다")
        ) {
          alert(
            "해당 계정은 이용이 제한되어 있습니다.\n고객센터(1588-0000)로 문의해주세요."
          );
        } else {
          alert(error.message || "회원가입 중 오류가 발생했습니다.");
        }
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border border-gray-300 rounded-xl">
      <h2 className="text-center text-2xl font-bold mb-6">회원가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInput
          label="아이디"
          name="memberId"
          value={formData.memberId} //여기서 input 안에 있는 값을 보여주고 아래 메서드로 set을 호출해서 값을 정의
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
          customColor="success"
        />

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
        />
      </form>
    </div>
  );
}

export default SignUp;
