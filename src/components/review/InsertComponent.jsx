"use client";

import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Box,
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
  getCategoryList,
  insertReview,
  updateReview,
} from "../../service/review/ReviewService.js";
import { useSelector } from "react-redux";
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
import ReviewEditor from "../editor/ReviewEditor.jsx";

const InsertComponent = () => {
  const { state } = useLocation();
  const { tno } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const member = useSelector((state) => state.member);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategoryList()
        .then((data) => setCategories(data))
        .catch((err) => {
          console.error("카테고리 가져오기 실패", err);
          setError("카테고리를 불러오는 중 오류가 발생했습니다.");
        });
  }, []);

  const reviewData = state?.reviewData;
  const isEdit = !!reviewData || !!tno;

  const [formData, setFormData] = useState({
    tno: reviewData?.tno || "",
    title: reviewData?.title || "",
    content: reviewData?.content || "",
    categoryId: reviewData?.categoryId || "",
    imageUrls: [],
  });

  const updateInput = useCallback(
      (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        // 에러 메시지 초기화
        if (error) setError("");
      },
      [error]
  );

  const handleEditorChange = useCallback((content) => {
    setFormData((prev) => ({
      ...prev,
      content: content,
    }));
  }, []);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.");
      return false;
    }

    if (formData.title.length > 100) {
      setError("제목은 100자 이내로 입력해주세요.");
      return false;
    }

    if (!formData.content.trim()) {
      setError("내용을 입력해주세요.");
      return false;
    }

    if (!formData.categoryId) {
      setError("카테고리를 선택해주세요.");
      return false;
    }

    return true;
  };

  const submitEditor = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    const dto = {
      ...formData,
      images: images,
      memberId: member.memberId,
    };

    console.log("전송 DTO:", dto);

    try {
      if (isEdit) {
        await updateReview(dto);
      } else {
        await insertReview(dto);
      }

      navigate("/review/list");
    } catch (err) {
      console.error("리뷰 등록/수정 실패", err);
      setError("작업 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/review/list");
  };

  return (
      <ThemeProvider theme={sobiTheme}>
        <MainContainer maxWidth="lg">
          {/* 헤더 섹션 */}
          <HeaderSection>
            <Box>
              <BackButton
                  startIcon={<ArrowBackIcon />}
                  onClick={handleCancel}
                  disabled={loading}
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
              {isEdit ? "후기 수정" : "후기 작성"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {isEdit
                  ? "후기 내용을 수정하고 저장해주세요."
                  : "경험하신 내용을 자세히 공유해주세요."}
            </Typography>
          </Box>

          {/* 에러 알림 */}
          {error && (
              <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    "& .MuiAlert-message": {
                      fontWeight: 500,
                    },
                  }}
              >
                {error}
              </Alert>
          )}

          {/* 메인 폼 */}
          <FormCard>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={submitEditor}>
                {/* 제목 입력 */}
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
                      name="title"
                      value={formData.title}
                      onChange={updateInput}
                      placeholder="후기 제목을 입력해주세요"
                      disabled={loading}
                      helperText={`${formData.title.length}/100자`}
                      inputProps={{ maxLength: 100 }}
                  />
                </Box>

                {/* 카테고리 선택 */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="text.primary"
                      sx={{ mb: 1.5 }}
                  >
                    카테고리 *
                  </Typography>
                  <StyledTextField
                      select
                      fullWidth
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={updateInput}
                      placeholder="카테고리를 선택하세요"
                      disabled={loading}
                      helperText="후기에 적합한 카테고리를 선택해주세요"
                  >
                    <MenuItem value="">
                      <Typography color="text.secondary">
                        카테고리를 선택하세요
                      </Typography>
                    </MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                    ))}
                  </StyledTextField>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* 내용 에디터 */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="text.primary"
                      sx={{ mb: 1.5 }}
                  >
                    내용 *
                  </Typography>
                  <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                  >
                    이미지와 함께 자세한 후기를 작성해주세요. 다른 사용자들에게
                    도움이 되는 정보를 포함해주시면 좋습니다.
                  </Typography>
                  <EditorContainer elevation={0}>
                    <ReviewEditor
                        value={formData.content}
                        onChange={handleEditorChange}
                        s3Folder="review"
                        onImageUpload={(imageInfo) => {

                          setImages((prev) => {
                            const newImage = { ...imageInfo };
                            if (prev.length === 0) {
                              newImage.isThumbnail = "Y";
                            }
                            return [...prev, newImage];
                          });
                        }}
                    />
                  </EditorContainer>
                </Box>

                {/* 액션 버튼 */}
                <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                      pt: 3,
                      borderTop: 1,
                      borderColor: "divider",
                    }}
                >
                  <ActionButton
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={loading}
                      startIcon={<CancelIcon />}
                      sx={{
                        borderColor: "grey.300",
                        color: "text.secondary",
                        "&:hover": {
                          borderColor: "grey.400",
                          backgroundColor: "grey.50",
                        },
                      }}
                  >
                    취소
                  </ActionButton>
                  <ActionButton
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={
                        loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : isEdit ? (
                            <SaveIcon />
                        ) : (
                            <EditIcon />
                        )
                      }
                      sx={{
                        background: loading
                            ? "grey.400"
                            : `linear-gradient(135deg, ${sobiTheme.palette.primary.main}, ${sobiTheme.palette.primary.dark})`,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${sobiTheme.palette.primary.dark}, ${sobiTheme.palette.secondary.dark})`,
                        },
                      }}
                  >
                    {loading ? "처리 중..." : isEdit ? "수정 완료" : "후기 등록"}
                  </ActionButton>
                </Box>
              </Box>
            </CardContent>
          </FormCard>
        </MainContainer>
      </ThemeProvider>
  );
};

export default InsertComponent;
