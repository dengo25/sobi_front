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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
    FavoriteOutlined as HeartIcon,
    ChatBubbleOutline as CommentIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2, 0),
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

function ListComponent() {
    const { page, size, moveToList, moveToDetail } = useCustomMove();
    const [serverData, setServerData] = useState();
    const navigate = useNavigate();
    const memberId = useSelector((state) => state.member.memberId);

    useEffect(() => {
        getListWithoutToken({ page, size }).then((data) => {
            console.log(data);
            setServerData(data);
        });
    }, [page, size]);

    const handleWriteClick = () => {
        navigate("/review/insert");
    };

    const handleItemClick = (tno) => {
        moveToDetail(tno, { page, size });
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

    return (
        <ThemeProvider theme={sobiTheme}>
            <MainContainer maxWidth="lg">
                {/* 헤더 섹션 */}
                <HeaderSection>
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
                    >
                        후기 작성
                    </WriteButton>
                </HeaderSection>

                {/* 후기 목록 */}
                {serverData?.rnoList && serverData.rnoList.length > 0 ? (
                    serverData.rnoList.map((review) => {
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
                                            <PostTitle variant="h6">{review.title}</PostTitle>
                                            <PostContent variant="body2">
                                                {extractTextFromHTML(review.content)}
                                            </PostContent>
                                        </Grid>

                                        {/* 썸네일 이미지 (조건부 렌더링) */}
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
                                        <Stack direction="row" spacing={3}>
                                            <StatItem>
                                                <HeartIcon fontSize="small" />
                                                <Typography variant="caption">
                                                    {review.likeCount || 0}
                                                </Typography>
                                            </StatItem>
                                            <StatItem>
                                                <CommentIcon fontSize="small" />
                                                <Typography variant="caption">
                                                    {review.commentCount || 0}
                                                </Typography>
                                            </StatItem>
                                            <StatItem>
                                                <ViewIcon fontSize="small" />
                                                <Typography variant="caption">
                                                    {review.viewCount || 0}
                                                </Typography>
                                            </StatItem>
                                        </Stack>

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
                                📝
                            </Typography>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                아직 작성된 후기가 없습니다
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                첫 번째 후기를 작성해보세요!
                            </Typography>
                            {memberId && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleWriteClick}
                                    startIcon={<EditIcon />}
                                >
                                    후기 작성하기
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* 페이지네이션 */}
                {serverData && serverData.rnoList && serverData.rnoList.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <PageComponent serverData={serverData} movePage={moveToList} />
                    </Box>
                )}
            </MainContainer>
        </ThemeProvider>
    );
}

export default ListComponent;
