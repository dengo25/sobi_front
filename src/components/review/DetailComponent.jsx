import { useEffect, useState } from "react";
import useCustomMove from "../../hooks/review/UseCustomMove.jsx";
import { getReview } from "../../service/review/ReviewService.js";
import BasicEditor from "../editor/BasicEditor.jsx";
import CustomButton from "../input/CustomButton.jsx";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ReportIcon from "@mui/icons-material/Report";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function DetailComponent({ tno }) {
  const [review, setReview] = useState(null);
  const { moveToList, moveToModify } = useCustomMove();
  const navigate = useNavigate();
  useEffect(() => {
    getReview(tno).then((data) => {
      console.log(data);
      setReview(data);
    });
  }, [tno]);

  //완빈 추가 신고 폼으로 이동
  const member = useSelector((state) => state.member);
  const memberId = member?.memberId;
  const moveToReport = () => {
    navigate(`/report`, {
      state: {
        reviewId: tno,
        writerId: review.memberId,
        reporterId: memberId, // 현재 로그인 사용자 ID
      },
    });
  };

  return (
    <div>
      <h2>리뷰 상세 보기</h2>

      {review && (
        <div className="content-area">
          <h3>{review.title}</h3>
          <div onClick={moveToReport}>신고하기</div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: review.content }}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "flex-end", mt: 2 }}
          >
            <CustomButton
              type="button"
              color="primary"
              text="목록"
              onClick={moveToList}
            />
            <CustomButton
              type="button"
              color="default"
              text="수정"
              onClick={() => moveToModify(tno)}
            />
          </Stack>
        </div>
      )}
    </div>
  );
}

export default DetailComponent;
