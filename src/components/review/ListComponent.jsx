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
}

export default ListComponent;