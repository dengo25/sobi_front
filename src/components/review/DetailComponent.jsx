import {useEffect, useState} from "react";
import useCustomMove from "../../hooks/review/UseCustomMove.jsx";
import {getReview} from "../../service/review/ReviewService.js";
import BasicEditor from "../editor/BasicEditor.jsx";


function DetailComponent({tno}) {
    const [review, setReview] = useState(null);
    const { moveToList, moveToModify } = useCustomMove();

    useEffect(() => {
        getReview(tno).then((data) => {
            console.log(data);
            setReview(data);
        });
    }, [tno]);


    return (
        <div>
            <h1>DetailComponent</h1>
            {review && (
                <div>
                    <h2>{review.title}</h2>


                    <BasicEditor
                        value={review.content}
                        onChange={() => {}} // 빈 함수 전달
                        readOnly={true}
                        theme={null} // readOnly면 테마 없어도 됨
                    />

                    <button onClick={() => moveToList()}>목록</button>
                    <button onClick={() => moveToModify(tno)}>수정</button>
                </div>
            )}
        </div>
    );
}


export default DetailComponent;
