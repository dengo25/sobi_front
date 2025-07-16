"use client";

import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

import BasicEditor from "../../components/editor/BasicEditor";
import {
  getCategoryList,
  getReview,
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

const ModifyComponent = ({ tno }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const member = useSelector((state) => state.member);

  const [categories, setCategories] = useState([]);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    tno: "",
    title: "",
    content: "",
    categoryId: "",
    imageUrls: [],
  });

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoading(true);
        setError("");

        // 카테고리 목록과 기존 리뷰 데이터를 병렬로 가져오기
        const [categoriesData, reviewData] = await Promise.all([
          getCategoryList(),
          getReview(tno),
        ]);

        setCategories(categoriesData);
        setOriginalData(reviewData);

        // 폼 데이터 초기화
        setFormData({
          tno: reviewData.tno,
          title: reviewData.title || "",
          content: reviewData.content || "",
          categoryId: reviewData.categoryId || "",
          imageUrls: [],
        });

        // 기존 이미지 설정
        if (reviewData.images && reviewData.images.length > 0) {
          setImages(reviewData.images);
        }
      } catch (err) {
        console.error("초기 데이터 로드 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setInitialLoading(false);
      }
    };

    if (tno) {
      loadInitialData();
    }
  }, [tno]);

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

  const submitModify = async (e) => {
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

    console.log("수정 DTO:", dto);

    try {
      await updateReview(dto);
      navigate(`/review/detail/${tno}`);
    } catch (err) {
      console.error("리뷰 수정 실패", err);
      setError("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/review/detail/${tno}`);
  };

  // 초기 로딩 중
  if (initialLoading) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={48} color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  // 데이터 로드 실패
  if (error && !originalData) {
    return (
      <ThemeProvider theme={sobiTheme}>
        <MainContainer maxWidth="lg">
          <Alert
            severity="error"
            sx={{
              mt: 4,
              borderRadius: 2,
              "& .MuiAlert-message": {
                fontWeight: 500,
              },
            }}
          >
            {error}
          </Alert>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <ActionButton
              variant="outlined"
              onClick={() => navigate("/review/list")}
            >
              목록으로 돌아가기
            </ActionButton>
          </Box>
        </MainContainer>
      </ThemeProvider>
    );
  }

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
              상세보기로
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
            후기 수정
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            후기 내용을 수정하고 저장해주세요.
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
            <Box component="form" onSubmit={submitModify}>
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
                  <BasicEditor
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
                    ) : (
                      <SaveIcon />
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
                  {loading ? "수정 중..." : "수정 완료"}
                </ActionButton>
              </Box>
            </Box>
          </CardContent>
        </FormCard>
      </MainContainer>
    </ThemeProvider>
  );
};

export default ModifyComponent;
