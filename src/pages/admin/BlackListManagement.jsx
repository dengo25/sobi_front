"use client";

import { Box, Typography, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Block as BlockIcon } from "@mui/icons-material";

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const BlacklistManagement = () => {
  return (
    <Box sx={{ height: "100%", backgroundColor: "grey.50", p: 3 }}>
      <SectionTitle variant="h6">
        <BlockIcon />
        블랙리스트 관리
      </SectionTitle>

      <Card>
        <CardContent>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ py: 4 }}
          >
            블랙리스트 관리 기능이 여기에 구현됩니다.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BlacklistManagement;
//사용안함
