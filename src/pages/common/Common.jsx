import { useEffect, useState } from "react";
import CustomCheckbox from "../../components/input/CustomCheckbox";
import CustomButton from "../../components/input/CustomButton";
import BasicEditor from "../../components/editor/BasicEditor";
import CustomInput from "../../components/input/CustomInput";
import BasicPagination from "../../components/list/BasicPagination";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Common = () => {
  // 단일 체크박스 상태
  const [singleCheck, setSingleCheck] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  // 버튼 클릭 테스트
  const [count, setCount] = useState(0);

  // 에디터 기본 설정
  const [value, setValue] = useState("");

  // 폼 상태
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    message: "",
    phone: "",
    website: "",
  });

  // 에러 상태
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // 에러 초기화
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("폼 데이터:", formData);
    alert("폼이 제출되었습니다!");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setErrors({
        ...errors,
        email: "올바른 이메일 형식을 입력해주세요.",
      });
    }
  };

  // 페이지네이션 상태 + 핸들러
  const [page, setPage] = useState(1);
  const [page2, setPage2] = useState(1);

  const pageHandleChange = (event, value) => {
    setPage(value);
  };
  const pageHandleChange2 = (event, value) => {
    setPage2(value);
  };

  /* s: 페이지 네이션 예제 데이터 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 가상의 데이터
  const allItems = Array.from({ length: 47 }, (_, i) => `아이템 ${i + 1}`);
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  // 현재 페이지의 아이템들
  const currentItems = allItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  /* e : 페이지 네이션 예제 데이터 */

  return (
    <>
      <style>
        {`
                    h2{padding-left:10px;}
                    section{margin:30px 10px;padding:10px 20px 30px;border:2px dashed #555;border-radius:15px;}
                    section > h3:before{content:'';display:inline-block;position:relative;top:-2px;width:15px;height:15px;margin-right:5px;background:#444;}
                `}
      </style>
      <h2>SOBI : COMPONENTS</h2>
      <hr />
      <hr />
      <section>
        <h3>Button : 기본형</h3>
        <CustomButton
          type="button"
          size="small"
          variant="contained"
          color="success"
          text="기본형 (배경O)"
        />
        <CustomButton
          type="button"
          size="small"
          variant="outlined"
          color="success"
          text="기본형 (보더O)"
        />
        <CustomButton
          type="button"
          size="small"
          variant="contained"
          color="success"
          text="기본형 (비활성화)"
          disabled
        />

        <br />
        <br />
        <h4>▶ 컬러별</h4>
        <CustomButton
          type="button"
          size="medium"
          variant="contained"
          color="success"
          text="성공 버튼"
          onClick={() => setCount(count + 1)}
        />
        <CustomButton
          type="button"
          size="medium"
          variant="contained"
          color="warning"
          text="경고 버튼"
          onClick={() => setCount(count + 1)}
        />
        <CustomButton
          type="button"
          size="medium"
          variant="contained"
          color="danger"
          text="위험 버튼"
          onClick={() => setCount(count + 1)}
        />

        <br />
        <br />
        <h4>▶ 사이즈별</h4>
        <CustomButton
          type="button"
          size="small"
          variant="contained"
          color="success"
          text="성공 버튼"
          onClick={() => setCount(count + 1)}
        />
        <CustomButton
          type="button"
          size="medium"
          variant="contained"
          color="warning"
          text="경고 버튼"
          onClick={() => setCount(count + 1)}
        />
        <CustomButton
          type="button"
          size="large"
          variant="contained"
          color="danger"
          text="위험 버튼"
          onClick={() => setCount(count + 1)}
        />
        <p>
          <strong>클릭 횟수:</strong> {count}
        </p>
      </section>

      <hr />
      <section>
        <h3>Checkbox : 기본 체크박스</h3>
        <CustomCheckbox
          checked={singleCheck}
          onChange={(e) => setSingleCheck(e.target.checked)}
          label="기본 체크박스"
        />
        <CustomCheckbox
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          label="이용약관에 동의합니다"
          required
          color="success"
        />
        <CustomCheckbox
          checked
          onChange={(e) => setAgreeTerms(e.target.checked)}
          label="기본 체크형"
          required
          color="success"
        />
        <CustomCheckbox
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          label="뉴스레터 수신 동의"
          color="warning"
          size="small"
        />
        <CustomCheckbox label="비활성화된 체크박스" disabled checked />
        <br />
        <br />
        <h4>▶ 컬러별</h4>
        <CustomCheckbox label="Primary" color="primary" checked />
        <CustomCheckbox label="Success" color="success" checked />
        <CustomCheckbox label="Warning" color="warning" checked />
        <CustomCheckbox label="Error" color="error" checked />
        <br />
        <br />
        <h4>▶ 사이즈별</h4>
        <CustomCheckbox label="Small" size="small" checked />
        <CustomCheckbox label="Medium" size="medium" checked />
        <CustomCheckbox label="Large" size="large" checked />
      </section>
      <hr />

      <section>
        <h3>Input : text filed</h3>

        <h4>1. 기본 사용법</h4>
        <div>
          <h5>Outlined (기본)</h5>
          <CustomInput label="이름" placeholder="이름을 입력하세요" />
          <CustomInput
            label="이메일"
            type="email"
            placeholder="email@example.com"
          />
          <CustomInput label="비밀번호" type="password" />
        </div>
        <br />

        <div>
          <h5>Filled</h5>
          <CustomInput
            label="이름"
            variant="filled"
            placeholder="이름을 입력하세요"
          />
          <CustomInput
            label="이메일"
            type="email"
            variant="filled"
            placeholder="email@example.com"
          />
          <CustomInput label="비밀번호" type="password" variant="filled" />
        </div>
        <br />

        <div>
          <h5 className="font-semibold mb-2">Standard</h5>
          <CustomInput
            label="이름"
            variant="standard"
            placeholder="이름을 입력하세요"
          />
          <CustomInput
            label="이메일"
            type="email"
            variant="standard"
            placeholder="email@example.com"
          />
          <CustomInput label="비밀번호" type="password" variant="standard" />
        </div>
        <br />
        <br />

        <h4>2. 커스텀 색상</h4>
        <div>
          <h5>Success</h5>
          <CustomInput
            label="성공 입력"
            color="success"
            defaultValue="성공적으로 입력됨"
          />
        </div>
        <div>
          <h5>Warning</h5>
          <CustomInput
            label="경고 입력"
            color="warning"
            defaultValue="주의가 필요함"
          />
        </div>
        <div>
          <h5>Danger</h5>
          <CustomInput
            label="위험 입력"
            color="danger"
            defaultValue="오류가 발생함"
          />
        </div>
        <br />
        <br />

        <h4>3. 다양한 입력 타입</h4>
        <CustomInput
          label="검색"
          type="search"
          placeholder="검색어를 입력하세요"
        />
        <CustomInput label="전화번호" type="tel" placeholder="010-1234-5678" />
        <CustomInput
          label="웹사이트"
          type="url"
          placeholder="https://example.com"
        />
        <CustomInput label="숫자" type="number" placeholder="숫자만 입력" />
        <CustomInput
          label="읽기 전용"
          defaultValue="수정할 수 없습니다"
          readOnly
        />
        <CustomInput label="비활성화" defaultValue="비활성화됨" disabled />
        <br />
        <br />

        <h4>4. 멀티라인 (Textarea)</h4>
        <CustomInput
          label="메시지"
          multiline
          rows={4}
          placeholder="여러 줄의 메시지를 입력하세요..."
          fullWidth
        />
        <CustomInput
          label="자동 크기 조절"
          multiline
          maxRows={6}
          placeholder="내용에 따라 높이가 자동으로 조절됩니다..."
          fullWidth
        />
        <br />
        <br />

        <h4>5. 실제 폼 예시(구분은 Stack 으로 진행 예정)</h4>
        <form onSubmit={handleSubmit}>
          <CustomInput
            label="이름"
            required
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="홍길동"
            fullWidth
          />
          <CustomInput
            label="이메일"
            type="email"
            required
            value={formData.email}
            onChange={handleChange("email")}
            onBlur={handleEmailBlur}
            placeholder="hong@example.com"
            error={!!errors.email}
            helperText={errors.email || "로그인에 사용될 이메일입니다"}
            fullWidth
          />

          <CustomInput
            label="비밀번호"
            type="password"
            required
            value={formData.password}
            onChange={handleChange("password")}
            helperText="8자 이상 입력해주세요"
            fullWidth
          />
          <CustomInput
            label="전화번호"
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            placeholder="010-1234-5678"
            fullWidth
          />

          <CustomInput
            label="웹사이트"
            type="url"
            value={formData.website}
            onChange={handleChange("website")}
            placeholder="https://example.com"
            helperText="개인 웹사이트가 있다면 입력해주세요 (선택사항)"
            fullWidth
          />

          <CustomInput
            label="메시지"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange("message")}
            placeholder="추가로 전달하고 싶은 내용이 있다면 입력해주세요..."
            fullWidth
          />

          <CustomButton
            type="submit"
            variant="contained"
            color="success"
            text="제출하기"
          />
          <CustomButton
            type="button"
            variant="outlined"
            color="danger"
            text="초기화"
            onClick={() => {
              setFormData({
                name: "",
                email: "",
                password: "",
                message: "",
                phone: "",
                website: "",
              });
              setErrors({});
            }}
          />
        </form>
        <br />
        <br />

        <h4>6. 크기별</h4>
        <CustomInput label="Small" size="small" placeholder="작은 크기" />
        <CustomInput
          label="Medium (기본)"
          size="medium"
          placeholder="중간 크기"
        />
        <br />
        <br />
      </section>
      <hr />

      <section>
        <h3>Editor : ReactQuill</h3>
        <form>
          {" "}
          {/* onSubmit={submitEditor} */}
          <BasicEditor
            value={value}
            // onChange={setValue} // 게시판 데이터 이동시 활성처리
          />
          <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
            <CustomButton
              type="button"
              size="medium"
              variant="contained"
              color="success"
              text="저장"
            />
            <CustomButton
              type="button"
              size="medium"
              variant="contained"
              color="danger"
              text="삭제"
            />
            <CustomButton
              type="button"
              size="medium"
              variant="contained"
              color="default"
              text="취소"
            />
          </Stack>
        </form>
      </section>
      <hr />

      <section>
        <h3>Pagination</h3>

        <h4># 기본 기능적 페이지네이션</h4>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          현재 페이지: {page}
        </Typography>
        <BasicPagination
          count={10}
          page={page}
          onChange={pageHandleChange}
          color="primary"
        />
        <br />
        <h4># 고급 옵션 페이지네이션</h4>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          현재 페이지: {page2} (첫/마지막 버튼, 더 많은 형제 페이지)
        </Typography>
        <BasicPagination
          count={20}
          page={page2}
          onChange={pageHandleChange2}
          color="secondary"
          showFirstButton
          showLastButton
          siblingCount={2}
          boundaryCount={2}
        />
        <br />
        <h4># 고급 옵션 페이지네이션</h4>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          총 {allItems.length}개 아이템 중{" "}
          {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, allItems.length)}번째 표시
        </Typography>

        <Box sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
          {currentItems.map((item, index) => (
            <Typography key={index} variant="body1" sx={{ py: 0.5 }}>
              {item}
            </Typography>
          ))}
        </Box>

        <BasicPagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </section>
    </>
  );
};

export default Common;
