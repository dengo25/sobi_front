import {useEffect, useState} from "react";


function ListComponent(){


    const{page,size,moveToRead,moveToList}=useCustomMove()
    const[serverData, setServerData] = useState();

    useEffect(() => {

        getList({page,size}).then(data => {
            console.log(data)
            setServerData(data)
        })

    },[page,size])

    return (
        <div>
            {serverData && (
                <>
                    {/*<div>*/}
                    {/*    {serverData.rtoList.map((todo) => (*/}
                    {/*        <div key={todo.tno} onClick={() => moveToRead(todo.tno)}>*/}
                    {/*            <div>*/}
                    {/*                <div>{todo.tno}</div>*/}
                    {/*                <div>{todo.title}</div>*/}
                    {/*                <div>{todo.dueDate}</div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    ))}*/}
                    {/*</div>*/}

                    <PageComponent
                        serverData={serverData}
                        movePage={moveToList}
                    />
                </>
            )}
        </div>
    );
}

export default ListComponent;