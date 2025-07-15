"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  CircularProgress,
  Chip,
  Alert,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Wc as GenderIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  RateReview as ReviewIcon,
} from "@mui/icons-material";

const ProfileSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.light}08)`,
}));

const BasicInfoSection = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: 48,
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  margin: "0 auto",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 0),
  minHeight: 60,
}));

const InfoLabel = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  minWidth: 120,
  marginRight: theme.spacing(2),
}));

const InfoValue = styled(Box)({
  flex: 1,
});

const MemberDetail = ({ data, onBack }) => {
  const [member, setMember] = useState({});
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(data ? null : "데이터가 없습니다.");

  useEffect(() => {
    if (data) {
      setMember(data);
      setLoading(false);
    } else {
      setError("회원 데이터가 없습니다.");
      setLoading(false);
    }
  }, [data]);

  const formatGender = (gender) => {
    if (gender === "M") return "남성";
    if (gender === "F") return "여성";
    return "설정 안함";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
        {onBack && (
          <Button onClick={onBack} sx={{ mt: 2 }}>
            목록으로 돌아가기
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "md", margin: "0 auto" }}>
      {/* 프로필 섹션 */}
      <ProfileSection>
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          <StyledAvatar sx={{ mb: 3 }}>
            {member?.memberName?.charAt(0).toUpperCase() || "U"}
          </StyledAvatar>

          <Typography variant="h5" fontWeight={700} gutterBottom>
            {member?.memberName || "사용자"}
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            @{member?.memberId || "unknown"}
          </Typography>

          <Chip
            label={`게시글 ${member?.memberReviewCount || 0}개`}
            color="primary"
            sx={{ mt: 1 }}
          />
        </CardContent>
      </ProfileSection>

      {/* 기본 정보 섹션 */}
      <BasicInfoSection>
        <CardContent sx={{ p: 4 }}>
          <SectionTitle variant="h6">
            <PersonIcon />
            회원 정보
          </SectionTitle>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <InfoRow>
                <InfoLabel>
                  <PersonIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    이름
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Typography variant="body2" fontWeight={500}>
                    {member?.memberName || "설정 안함"}
                  </Typography>
                </InfoValue>
              </InfoRow>
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoRow>
                <InfoLabel>
                  <PersonIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    아이디
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Typography variant="body2" fontWeight={500}>
                    {member?.memberId || "설정 안함"}
                  </Typography>
                </InfoValue>
              </InfoRow>
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoRow>
                <InfoLabel>
                  <GenderIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    성별
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Typography variant="body2" fontWeight={500}>
                    {formatGender(member?.memberGender)}
                  </Typography>
                </InfoValue>
              </InfoRow>
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoRow>
                <InfoLabel>
                  <EmailIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    이메일
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Typography variant="body2" fontWeight={500}>
                    {member?.memberEmail || "설정 안함"}
                  </Typography>
                </InfoValue>
              </InfoRow>
            </Grid>

            <Grid item xs={12}>
              <InfoRow>
                <InfoLabel>
                  <HomeIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    주소
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Typography variant="body2" fontWeight={500}>
                    {member?.memberAddr || "설정 안함"}
                  </Typography>
                </InfoValue>
              </InfoRow>
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoRow>
                <InfoLabel>
                  <CalendarIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    가입일
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Typography variant="body2" fontWeight={500}>
                    {member?.memberReg
                      ? new Date(member.memberReg).toLocaleDateString("ko-KR")
                      : "정보 없음"}
                  </Typography>
                </InfoValue>
              </InfoRow>
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoRow>
                <InfoLabel>
                  <ReviewIcon color="primary" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    게시글수
                  </Typography>
                </InfoLabel>
                <InfoValue>
                  <Chip
                    label={`${member?.memberReviewCount || 0}개`}
                    color="primary"
                    size="small"
                  />
                </InfoValue>
              </InfoRow>
            </Grid>
          </Grid>
        </CardContent>
      </BasicInfoSection>
    </Box>
  );
};

export default MemberDetail;
