import React from "react";
import DetailComponent from "../../components/review/DetailComponent.jsx";
import { useParams } from "react-router-dom";

export default function ReviewDetail() {
  const { tno } = useParams();
  console.log(tno);

  return (
    <div>
      <h1>ReviewList</h1>
      <DetailComponent tno={Number(tno)} />
    </div>
  );
}
