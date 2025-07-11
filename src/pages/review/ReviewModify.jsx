import React from 'react'
import ModifyComponent from "../../components/review/ModifyComponent.jsx";
import {useParams} from "react-router-dom";

export default function ReviewModify() {

    const {tno}=useParams()
    console.log(tno)

    return (

        <div>
            <h1>ReviewModify</h1>
            <ModifyComponent  tno={Number(tno)} />

        </div>
    )
}
