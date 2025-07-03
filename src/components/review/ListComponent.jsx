import {useEffect, useState} from "react";
import {getList} from "../../service/member/ApiService.js";
import useCustomMove from "../../UseCustomMove.jsx";


function ListComponent() {
    const { page, size,   } = useCustomMove();

    const [serverData, setServerData] = useState();

    useEffect(() => {
        getList({ page, size }).then((data) => {
            console.log(data);
            setServerData(data);
        });
    }, [page, size ]);

    return (
        <div>
            {serverData && (
                <>
                    <div>
                        {serverData.rnoList.map((review) => (
                            <div key={review.rno}>
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