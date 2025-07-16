import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  CardContent,
  Alert,
  CircularProgress,
  ThemeProvider,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import {
  sobiTheme,
  MainContainer,
  HeaderSection,
  FormCard,
  StyledTextField,
  TitleTextField,
  ActionButton,
  BackButton,
  EditorContainer,
} from "../../assets/styles/sobiThemeReviewWrite";

import CustomButton from "../../components/input/CustomButton";
import BasicEditor from "../../components/editor/BasicEditor";
import {
  getFaqDetail,
  insertFaqList,
  updateFaqList,
} from "../../service/community/faqApiService.js";
import { isEmptyAndAlert, isEditorEmptyAndAlert } from "../../utils/common.js";

const FaqForm = () => {
  const location = useLocation();
  const faqDataFromState = location.state?.faqData;
  const [faqQuestion, setFaqQuestion] = useState("");
  const [value, setValue] = useState("");
  // const [faqAnswer, setFaqAnswer] = useState("");
  const { faqNo } = useParams();
  const navigate = useNavigate();
  console.log("faqNo: ", faqNo);

  useEffect(() => {
    if (faqDataFromState) {
      setFaqQuestion(faqDataFromState.faqQuestion);
      setValue(faqDataFromState.faqAnswer);
    } else if (faqNo) {
      getFaqDetail(faqNo)
        .then((data) => {
          setFaqQuestion(data.faqQuestion);
          setValue(data.faqAnswer);
          console.log("상세내용 : " + data.faqAnswer);
        })
        .catch((err) => {
          console.error("FAQ 데이터를 불러오는 중 오류 : ", err);
        });
    }
  }, [faqNo, faqDataFromState]);

  const updateInput = (e) => {
    const { name, value } = e.target;
    console.log(e);
    if (name === "faqQuestion") setFaqQuestion(value);
    // 카테고리 추가시 if (name === "faqCategory") setFaqCategory(value);
  };

  const submitEditor = async (e) => {
    e.preventDefault();

    // 필수 필드 검증
    if(isEmptyAndAlert(faqQuestion,"제목을 입력하세요!")) return;
    if(isEditorEmptyAndAlert(value,"내용을 입력하세요!")) return;

    const dto = {
      faqQuestion,
      faqAnswer: value,
    };

    try {
      if (faqNo) {
        // 수정
        await updateFaqList(faqNo, dto);
        console.log("Faq 수정 완료");
      } else {
        // 새 글 등록
        await insertFaqList(dto);
        console.log("Faq 등록 완료");
      }
      navigate("/faq");
    } catch (err) {
      console.error("등록에 실패 하였습니다.");
    }
  };

  const handleClick = (e) => {
    if (e === "cancel") {
      if (confirm("해당 게시글 등록(수정)을 취소 하시겠습니가?") == false) {
        return;
      }
      navigate("/faq");
    }
  };

  return (
    <>
      <ThemeProvider theme={sobiTheme}>
        <MainContainer maxWidth="lg">
          <HeaderSection>
            <Box>
              <BackButton
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                  handleClick("cancel");
                }}
              >
                목록으로
              </BackButton>
            </Box>
          </HeaderSection>
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              color="text.primary"
              gutterBottom
              sx={{ mb: 1 }}
            >
              FAQ
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              FAQ 내용을 작성해 주세요
            </Typography>
          </Box>

          <FormCard>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={submitEditor}>
                {/* <input
                type="text"
                name="faqQuestion"
                value={faqQuestion}
                onChange={updateInput}
                placeholder="제목을 입력해 주세요"
                /> */}

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="text.primary"
                    sx={{ mb: 1.5 }}
                  >
                    제목 *
                  </Typography>
                  <TitleTextField
                    fullWidth
                    name="faqQuestion"
                    value={faqQuestion}
                    onChange={updateInput}
                    placeholder="제목을 입력해 주세요"
                  />
                </Box>

                <BasicEditor value={value} onChange={setValue} />

                <Divider sx={{ mb: 4 }} />

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ justifyContent: "right" }}
                >
                  <CustomButton
                    type="submit"
                    size="large"
                    variant="contained"
                    color="success"
                    text="등록"
                  />
                  <CustomButton
                    type="button"
                    onClick={() => {
                      handleClick("cancel");
                    }}
                    size="large"
                    variant="contained"
                    color="default"
                    text="취소"
                  />
                </Stack>
              </Box>
            </CardContent>
          </FormCard>
        </MainContainer>
      </ThemeProvider>
    </>
  );
};

export default FaqForm;
