"use client";

import { Box, Typography, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RateReview as ReviewIcon } from "@mui/icons-material";

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const ReviewManagement = () => {
  return (
    <Box sx={{ height: "100%", backgroundColor: "grey.50", p: 3 }}>
      <SectionTitle variant="h6">
        <ReviewIcon />
        리뷰 관리
      </SectionTitle>

      <Card>
        <CardContent>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ py: 4 }}
          >
            리뷰 관리 기능이 여기에 구현됩니다.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReviewManagement;
