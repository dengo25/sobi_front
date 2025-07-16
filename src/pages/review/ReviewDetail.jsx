import React from "react";
import DetailComponent from "../../components/review/DetailComponent.jsx";
import { useParams } from "react-router-dom";
import useCustomMove from "../../hooks/review/UseCustomMove.jsx";

export default function ReviewDetail() {
  const { tno } = useParams();
  const { moveToList } = useCustomMove();

  console.log(tno);

  return (
    <div>
      <DetailComponent tno={Number(tno)} moveToList={moveToList} />
    </div>
  );
}
