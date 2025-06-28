import React, { useState } from "react";
import { signup } from "../../service/member/ApiService";


function SignUp() {
  const [formData, setFormData] = useState({
    memberId: "",
    password: "",
    memberName: "",
    memberEmail: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


const handleSubmit = (e) => {
  e.preventDefault();

  // finalAddress 없이 바로 전송할 수 있음
  console.log("제출 데이터:", formData);

  // 예시) 실제 회원가입 요청
  signup(formData).then((res) => {
    alert("회원가입 완료");
    window.location.href = "/login";
  });
};

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border border-gray-300 rounded-xl">
      <h2 className="text-center text-2xl font-bold mb-6">회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            name="memberId"
            placeholder="아이디"
            value={formData.member_id}
            onChange={handleChange}
            className="flex-1 p-2 border rounded"
            required
          />
        </div>

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.member_password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <div className="flex gap-2 mb-3 items-center">
          <input
            type="text"
            name="memberName"
            placeholder="이름"
            value={formData.member_name}
            onChange={handleChange}
            required
            className="flex-1 p-2 border rounded"
          />
        </div>

        <input
          type="text"
          name="memberEmail"
          placeholder="이메일"
          value={formData.member_email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <button type="submit" className="w-full bg-yellow-500 text-white p-3 rounded mt-4 font-semibold">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignUp;
