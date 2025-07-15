import { useState, useCallback } from "react";
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
  insertNoticeList,
  updateNoticeList,
  deleteNotice,
} from "../../service/community/noticeApiService";
import { extractImageUrls } from "../../utils/extractImages";

const NoticeForm = () => {
  const { state } = useLocation();
  const { noticeNo } = useParams(); // noticeNo 추가
  const navigate = useNavigate();

  const noticeData = state?.noticeData; // Detail에서 전달한 데이터
  const isEdit = !!noticeData || !!noticeNo; // 수정 모드인지 확인

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    noticeNo: noticeData?.noticeNo || "",
    noticeTitle: noticeData?.noticeTitle || "",
    noticeContent: noticeData?.noticeContent || "",
    imageUrls: noticeData?.imageUrls || [],
  });

  console.log("현재 모드:", isEdit ? "수정" : "신규");
  console.log("받은 데이터:", noticeData);
  console.log("URL noticeNo:", noticeNo);
  console.log("폼 데이터:", formData);

  const updateInput = useCallback((e) => {
    const { name, value } = e.target;
    console.log(e);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleEditorChange = useCallback((content) => {
    setFormData((prev) => ({
      ...prev,
      noticeContent: content,
    }));
  }, []);

  const submitEditor = async (e) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.noticeTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.noticeContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // 수정 모드에서 noticeNo 검증
    if (isEdit && !formData.noticeNo) {
      alert("수정할 게시글 번호가 없습니다.");
      return;
    }

    // 에디터 내용에서 이미지 URL들을 추출
    const imageUrls = extractImageUrls(formData.noticeContent);
    console.log("추출된 이미지 URLs:", imageUrls);

    const dto = {
      ...formData,
      imageUrls: imageUrls, // 서버에서 기대하는 이미지 URL 배열 추가
    };

    console.log("전송할 DTO:", dto);
    console.log("수정 모드:", isEdit);
    console.log("noticeNo:", dto.noticeNo);

    try {
      if (isEdit) {
        // 수정
        // noticeNo가 제대로 전달되는지 확인
        if (!dto.noticeNo) {
          throw new Error("noticeNo가 없습니다.");
        }
        await updateNoticeList(dto);
        console.log("Notice 수정 완료");
      } else {
        // 새 글 등록
        await insertNoticeList(dto);
        console.log("Notice 등록 완료");
      }
      navigate("/notice");
    } catch (err) {
      console.error(
        isEdit ? "수정에 실패 하였습니다." : "등록에 실패 하였습니다.",
        err
      );
      alert(
        (isEdit ? "수정에" : "등록에") + " 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleClick = (e) => {
    if (e === "cancel") {
      if (
        confirm(
          `해당 게시글 ${isEdit ? "수정" : "등록"}을 취소 하시겠습니까?`
        ) == false
      ) {
        return;
      }
      navigate("/notice");
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
              공지사항 {isEdit ? "수정" : "등록"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              공지사항 내용을 작성해 주세요
            </Typography>
          </Box>

          <FormCard>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={submitEditor}>
                {/* <input
                            type="text"
                            name="noticeTitle"
                            value={formData.noticeTitle}
                            onChange={updateInput}
                            placeholder="제목을 입력해 주세요"/> */}

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
                    name="noticeTitle"
                    value={formData.noticeTitle}
                    onChange={updateInput}
                    placeholder="제목을 입력해 주세요"
                  />
                </Box>

                <BasicEditor
                  value={formData.noticeContent}
                  onChange={handleEditorChange}
                  s3Folder="notice"
                />

                <Divider sx={{ mb: 4 }} />

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ justifyContent: "right" }}
                >
                  <CustomButton
                    type="submit"
                    size="medium"
                    variant="contained"
                    color="success"
                    text={isEdit ? "수정" : "등록"}
                  />
                  <CustomButton
                    type="button"
                    onClick={() => {
                      handleClick("cancel");
                    }}
                    size="medium"
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

export default NoticeForm;
