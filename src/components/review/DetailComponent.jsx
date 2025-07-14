import {useEffect, useState} from "react";
import useCustomMove from "../../hooks/review/UseCustomMove.jsx";
import {getReview} from "../../service/review/ReviewService.js";
import CustomButton from "../input/CustomButton.jsx";
import Stack from "@mui/material/Stack";
import {deleteReview} from "../../service/member/ApiService.js";
import {useSelector} from "react-redux";


function DetailComponent({tno}) {
    const [review, setReview] = useState(null);
    const { page, size,moveToList, moveToModify } = useCustomMove();

    const memberId = useSelector((state) => state.member.memberId);


    useEffect(() => {
        getReview(tno).then((data) => {
            console.log(data);
            setReview(data);
        });
    }, [tno]);

    const handleDelete = async () => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            await deleteReview(tno);
            alert("삭제가 완료되었습니다.");
            moveToList({ page, size });
        } catch (err) {
            console.error("삭제 실패", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };


    return (
        <div>
            <h2>리뷰 상세 보기</h2>

            {review && (
                <div className="content-area">
                    <h3>{review.title}</h3>

                    <div className="content" dangerouslySetInnerHTML={{ __html: review.content }} />

                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 2 }}>
                        <CustomButton type="button" color="primary" text="목록" onClick={() => moveToList({ page, size })} />
                        {memberId === review.memberId && (
                            <>
                                <CustomButton type="button" color="default" text="수정" onClick={() => moveToModify(tno)} />
                                <CustomButton type="button" color="error" text="삭제" onClick={handleDelete} />
                            </>
                        )}
                    </Stack>
                </div>
            )}
        </div>
    );
}


export default DetailComponent;
