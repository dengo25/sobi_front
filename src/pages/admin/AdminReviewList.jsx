import { useEffect, useState } from "react";
import { getReviewList } from "../../service/admin/ApiService.js";
import useCustomMove from "../../hooks/review/UseCustomMove.jsx";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import PageComponent from "../../components/review/PageComponent.jsx";
import { useSelector } from "react-redux";

const AdminReviewList = () => {
  const { page, size, moveToList, moveToDetail } = useCustomMove();
  const [serverData, setServerData] = useState();
  const navigate = useNavigate();

  const memberId = useSelector((state) => state.member.memberId);

  useEffect(() => {
    getReviewList({ page, size }).then((data) => {
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

  return (
    <>
      <Container sx={{ mt: 4 }}>
        {/* 상단 글쓰기 버튼 */}
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button
            variant="contained"
            color="success"
            onClick={handleWriteClick}
            disabled={!memberId}
          >
            글쓰기
          </Button>
        </Box>

        {/* 게시판 리스트 */}
        {serverData?.rnoList.map((review) => (
          <Paper
            key={review.tno}
            elevation={1}
            sx={{
              mb: 2,
              p: 2,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
            onClick={() => handleItemClick(review.tno)}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">{review.title}</Typography>
              <Typography variant="caption">글 번호: {review.tno}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {/*정규식으로 태그 제거*/}
              {review.content.replace(/<[^>]+>/g, "")}
            </Typography>
          </Paper>
        ))}
      </Container>
      {serverData && (
        <PageComponent serverData={serverData} movePage={moveToList} />
      )}
    </>
  );
};

export default AdminReviewList;
