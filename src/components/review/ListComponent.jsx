"use client";

import { useEffect, useState } from "react";
import { getListWithoutToken } from "../../service/member/ApiService.js";
import useCustomMove from "../../hooks/review/UseCustomMove.jsx";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  ThemeProvider,
  createTheme,
  Stack,
  TextField,
  MenuItem,
  InputAdornment,
  Fab,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import PageComponent from "./PageComponent.jsx";
import { useSelector } from "react-redux";

const sobiTheme = createTheme({
  palette: {
    primary: {
      main: "#44C3AA",
      light: "#6FD4BB",
      dark: "#045242",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#045242",
      light: "#44C3AA",
      dark: "#033A30",
      contrastText: "#ffffff",
    },
  },
});

// 스타일드 컴포넌트들
const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  maxWidth: "1200px !important",
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2, 0),
}));

const FilterSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  border: "1px solid #f0f0f0",
}));

const BlogCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease-in-out",
  cursor: "pointer",
  border: "1px solid #f0f0f0",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(68,195,170,0.15)",
    borderColor: theme.palette.primary.light,
  },
}));

const AuthorSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const AuthorAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.primary.main,
  marginRight: theme.spacing(1.5),
  fontSize: "1.2rem",
  fontWeight: "bold",
}));

const AuthorInfo = styled(Box)({
  flex: 1,
});

const PostTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  lineHeight: 1.4,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

const PostContent = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  marginBottom: theme.spacing(2),
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

const ThumbnailImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: 160,
  objectFit: "cover",
  borderRadius: theme.spacing(1.5),
  backgroundColor: "#f5f5f5",
}));

const StatsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light + "20",
  color: theme.palette.primary.dark,
  fontWeight: 500,
  fontSize: "0.75rem",
  height: 24,
}));

const WriteButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: "none",
  boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: `0 6px 16px ${theme.palette.primary.main}40`,
  },
}));

const FloatingWriteButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.1)",
  },
  zIndex: 1000,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(3),
    backgroundColor: "#fafafa",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    "&.Mui-focused": {
      backgroundColor: "white",
    },
  },
}));

function ListComponent() {
  const { page, size, moveToList, moveToDetail } = useCustomMove();
  const [serverData, setServerData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const memberId = useSelector((state) => state.member.memberId);

  useEffect(() => {
    getListWithoutToken({ page, size }).then((data) => {
      console.log(data);
      setServerData(data);
      setFilteredData(data);

      // 카테고리 목록 추출
      if (data?.rnoList) {
        const uniqueCategories = [
          ...new Set(
            data.rnoList
              .filter((review) => review.category)
              .map((review) => review.category.name)
          ),
        ];
        setCategories(uniqueCategories);
      }
    });
  }, [page, size]);

  // 필터링 및 정렬 로직
  useEffect(() => {
    if (!serverData?.rnoList) return;

    let filtered = [...serverData.rnoList];

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter(
        (review) => review.category?.name === selectedCategory
      );
    }

    // 정렬
    switch (sortBy) {
      case "latest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        break;
    }

    setFilteredData({
      ...serverData,
      rnoList: filtered,
    });
  }, [serverData, searchTerm, selectedCategory, sortBy]);

  const handleWriteClick = () => {
    navigate("/review/insert");
  };

  const handleItemClick = (tno) => {
    moveToDetail(tno, { page, size });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("latest");
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "오늘";
    } else if (diffDays === 2) {
      return "어제";
    } else if (diffDays <= 7) {
      return `${diffDays - 1}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
    }
  };

  // 썸네일 이미지 찾기 함수
  const getThumbnailImage = (images) => {
    if (!images || images.length === 0) return null;
    return images.find((img) => img.isThumbnail === "Y");
  };

  // HTML 태그 제거 및 텍스트 추출 함수
  const extractTextFromHTML = (html, maxLength = 150) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const totalResults = filteredData?.rnoList?.length || 0;
  const isFiltered = searchTerm || selectedCategory || sortBy !== "latest";

  return (
    <ThemeProvider theme={sobiTheme}>
      <MainContainer maxWidth="lg">
        {/* 헤더 섹션 */}
        <HeaderSection>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                color="text.primary"
                gutterBottom
              >
                후기 게시판
              </Typography>
              <Typography variant="body1" color="text.secondary">
                다양한 경험과 후기를 공유해보세요
              </Typography>
            </Box>
            <WriteButton
              variant="contained"
              color="primary"
              onClick={handleWriteClick}
              disabled={!memberId}
              startIcon={<EditIcon />}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              후기 작성
            </WriteButton>
          </Box>

          {/* 필터 섹션 */}
          <FilterSection>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FilterIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="h6" fontWeight={600}>
                  필터 및 정렬
                </Typography>
                {isFiltered && (
                  <Button
                    size="small"
                    onClick={clearFilters}
                    sx={{ ml: "auto", textTransform: "none" }}
                  >
                    필터 초기화
                  </Button>
                )}
              </Box>

              <Grid container spacing={2}>
                {/* 검색 */}
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    placeholder="제목, 내용 검색..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* 카테고리 필터 */}
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    select
                    fullWidth
                    size="small"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    placeholder="카테고리"
                  >
                    <MenuItem value="">전체 카테고리</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Grid>

                {/* 정렬 */}
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    select
                    fullWidth
                    size="small"
                    value={sortBy}
                    onChange={handleSortChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SortIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="latest">최신순</MenuItem>
                    <MenuItem value="oldest">오래된순</MenuItem>
                  </StyledTextField>
                </Grid>
              </Grid>

              {/* 결과 요약 */}
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                <Typography variant="body2" color="text.secondary">
                  {isFiltered ? (
                    <>
                      <strong>{totalResults}개</strong>의 후기가 검색되었습니다
                      {searchTerm && ` (검색어: "${searchTerm}")`}
                      {selectedCategory && ` (카테고리: ${selectedCategory})`}
                      {sortBy !== "latest" &&
                        ` (정렬: ${sortBy === "oldest" ? "오래된순" : sortBy})`}
                    </>
                  ) : (
                    <>
                      총 <strong>{totalResults}개</strong>의 후기
                    </>
                  )}
                </Typography>
              </Box>
            </CardContent>
          </FilterSection>
        </HeaderSection>

        {/* 후기 목록 */}
        {filteredData?.rnoList && filteredData.rnoList.length > 0 ? (
          filteredData.rnoList.map((review) => {
            const thumbnailImage = getThumbnailImage(review.images);
            const hasImage = !!thumbnailImage;

            return (
              <BlogCard
                key={review.tno}
                onClick={() => handleItemClick(review.tno)}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* 작성자 정보 */}
                  <AuthorSection>
                    <AuthorAvatar>
                      {review.memberId?.charAt(0).toUpperCase() || "U"}
                    </AuthorAvatar>
                    <AuthorInfo>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {review.memberId || "익명"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </AuthorInfo>
                    {review.category && (
                      <CategoryChip label={review.category.name} size="small" />
                    )}
                  </AuthorSection>

                  {/* 메인 콘텐츠 */}
                  <Grid container spacing={3}>
                    <Grid item xs={hasImage ? 8 : 12}>
                      <PostTitle variant="h6">
                        {review.confirmed === "Y" && (
                          <span
                            style={{
                              marginRight: "8px",
                              color: "green",
                              fontWeight: "bold",
                            }}
                          >
                            ✅
                          </span>
                        )}
                        {review.title}
                      </PostTitle>
                      <PostContent variant="body2">
                        {extractTextFromHTML(review.content)}
                      </PostContent>
                    </Grid>

                    {/* 썸네일 이미지 */}
                    {hasImage && (
                      <Grid item xs={4}>
                        <ThumbnailImage
                          src={thumbnailImage.fileUrl}
                          alt={review.title}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>

                  {/* 통계 정보 */}
                  <StatsSection>
                    <Typography variant="caption" color="text.secondary">
                      #{review.tno}
                    </Typography>
                  </StatsSection>
                </CardContent>
              </BlogCard>
            );
          })
        ) : (
          <Card sx={{ textAlign: "center", py: 8 }}>
            <CardContent>
              <Typography variant="h1" sx={{ fontSize: 48, mb: 2 }}>
                {isFiltered ? "🔍" : "📝"}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {isFiltered
                  ? "검색 결과가 없습니다"
                  : "아직 작성된 후기가 없습니다"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {isFiltered
                  ? "다른 검색어나 필터를 시도해보세요"
                  : "첫 번째 후기를 작성해보세요!"}
              </Typography>
              {!isFiltered && memberId && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleWriteClick}
                  startIcon={<EditIcon />}
                >
                  후기 작성하기
                </Button>
              )}
              {isFiltered && (
                <Button variant="outlined" onClick={clearFilters}>
                  필터 초기화
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* 페이지네이션 */}
        {filteredData &&
          filteredData.rnoList &&
          filteredData.rnoList.length > 0 &&
          !isFiltered && (
            <Box sx={{ mt: 4 }}>
              <PageComponent serverData={serverData} movePage={moveToList} />
            </Box>
          )}

        {/* 필터링된 상태에서도 페이지네이션 대신 결과 요약 표시 */}
        {isFiltered &&
          filteredData &&
          filteredData.rnoList &&
          filteredData.rnoList.length > 0 && (
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                필터링된 결과입니다. 모든 결과를 보려면 필터를 초기화하세요.
              </Typography>
            </Box>
          )}

        {/* 플로팅 작성 버튼 (모바일) */}
        {memberId && (
          <Fade in={true}>
            <FloatingWriteButton
              onClick={handleWriteClick}
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              <AddIcon />
            </FloatingWriteButton>
          </Fade>
        )}
      </MainContainer>
    </ThemeProvider>
  );
}

export default ListComponent;
