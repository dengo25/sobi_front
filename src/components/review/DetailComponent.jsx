import {useEffect, useState} from "react";
import useCustomMove from "../../hooks/review/UseCustomMove.jsx";
import {getReview} from "../../service/review/ReviewService.js";
import CustomButton from "../input/CustomButton.jsx";
import Stack from "@mui/material/Stack";


function DetailComponent({tno}) {
    const [review, setReview] = useState(null);
    const { page, size,moveToList, moveToModify } = useCustomMove();

    useEffect(() => {
        getReview(tno).then((data) => {
            console.log(data);
            setReview(data);
        });
    }, [tno]);


    return (
        <div>
            <h2>리뷰 상세 보기</h2>

            {review && (
                <div className="content-area">
                    <h3>{review.title}</h3>

                    <div className="content" dangerouslySetInnerHTML={{ __html: review.content }} />

                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 2 }}>
                        <CustomButton type="button" color="primary" text="목록" onClick={() => moveToList({ page, size })} />
                        <CustomButton type="button" color="default" text="수정" onClick={() => moveToModify(tno)} />
                    </Stack>
                </div>
            )}
        </div>
    );
}


export default DetailComponent;
