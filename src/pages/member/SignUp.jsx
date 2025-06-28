import React, { useState } from "react";

function SignUp() {
  const [formData, setFormData] = useState({
    member_id: "",
    member_password: "",
    member_name: "",
    member_gender: "",
    member_email: "",
    member_birth: "",
    member_zip: "",
    roadAddress: "",
    detailAddress: "",
    member_addr_final: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [idCheckMsg, setIdCheckMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkId = () => {
    // 외부 ID 중복 체크 로직 분리 예정
    console.log("checkId 호출");
  };

  const execPostcode = () => {
    // 외부 주소 검색 API 연동 예정
    console.log("주소 찾기 호출");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isChecked) return alert("아이디 중복확인을 해주세요.");

    const finalAddress = `${formData.roadAddress} ${formData.detailAddress}`;
    setFormData((prev) => ({ ...prev, member_addr_final: finalAddress }));

    console.log("제출 데이터:", { ...formData, member_addr_final: finalAddress });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border border-gray-300 rounded-xl">
      <h2 className="text-center text-2xl font-bold mb-6">회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            name="member_id"
            placeholder="아이디"
            value={formData.member_id}
            onChange={handleChange}
            className="flex-1 p-2 border rounded"
            required
          />
          <button type="button" onClick={checkId} className="w-32 bg-blue-500 text-white rounded px-3">
            중복확인
          </button>
        </div>
        <span className="text-sm" style={{ color: isChecked ? "green" : "red" }}>{idCheckMsg}</span>

        <input
          type="password"
          name="member_password"
          placeholder="비밀번호"
          value={formData.member_password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <div className="flex gap-2 mb-3 items-center">
          <input
            type="text"
            name="member_name"
            placeholder="이름"
            value={formData.member_name}
            onChange={handleChange}
            required
            className="flex-1 p-2 border rounded"
          />
          <label><input type="radio" name="member_gender" value="M" onChange={handleChange} /> 남</label>
          <label><input type="radio" name="member_gender" value="F" onChange={handleChange} /> 여</label>
        </div>

        <input
          type="email"
          name="member_email"
          placeholder="이메일"
          value={formData.member_email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="text"
          name="member_birth"
          placeholder="생년월일 (예: 990101)"
          value={formData.member_birth}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            id="sample4_postcode"
            placeholder="우편번호"
            readOnly
            value={formData.member_zip}
            className="flex-1 p-2 border rounded"
          />
          <button type="button" onClick={execPostcode} className="w-32 bg-gray-500 text-white rounded px-3">
            우편번호 찾기
          </button>
        </div>

        <input
          type="text"
          id="sample4_roadAddress"
          placeholder="도로명주소"
          readOnly
          value={formData.roadAddress}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="text"
          id="sample4_detailAddress"
          name="detailAddress"
          placeholder="상세주소"
          value={formData.detailAddress}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <input type="hidden" name="member_addr" value={formData.member_addr_final} />

        <button type="submit" className="w-full bg-yellow-500 text-white p-3 rounded mt-4 font-semibold">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignUp;
