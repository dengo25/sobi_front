import {useEffect, useState} from "react";
import {getList} from "../../service/member/ApiService.js";
import useCustomMove from "../../hooks/review/UseCustomMove.jsx";
import CustomButton from "../input/CustomButton.jsx";
import {useNavigate} from "react-router-dom";


function ListComponent() {
    const { page, size,   } = useCustomMove();

    const [serverData, setServerData] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        getList({ page, size }).then((data) => {
            console.log(data);
            setServerData(data);
        });
    }, [page, size ]);


    const handleWriteClick = () => {
        navigate("/review/write"); // 라우터에 등록된 경로로 이동
    };

    return (
        <div>
            {serverData && (
                <>
                    <div className="text-right mb-4">
                        <CustomButton
                            text="글쓰기"
                            onClick={handleWriteClick}
                            variant="contained"
                            customColor="success"
                            size="medium"
                        />
                    </div>
                    <div>
                        {serverData.rnoList.map((review) => (
                            <div key={review.tno}>
                                <div>
                                    <div>{review.rno}</div>
                                    <div>{review.title}</div>
                                    <div>{review.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ListComponent;