import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/material';

import CustomButton from '../../components/input/CustomButton.jsx';
import { getNoticeDetail, deleteNotice } from '../../service/community/noticeApiService';

const NoticeDetail = () => {
    const { noticeNo } = useParams();
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const member = useSelector((state) => state.member);
    console.log("[slice] 현재 유저 정보 :", member);
    
    useEffect(()=>{
        if(!noticeNo) return;
        getNoticeDetail(noticeNo)
            .then((res) => {
                setDetail(res);
                console.log("[상세호출] res : ",res);
            })
            .catch(err => {
                console.error("공지 사항 상세 조회 실패 : " , err)
            })
    },[noticeNo]);

    const handleClick = async (e) => {
        if (e === "update"){
            navigate(`/notice/update/${noticeNo}`,{
                state: {noticeData : detail}
            });
        }else if(e === "delete"){
            if(confirm("해당 게시글을 정말 삭제 하시겠습니까?") == false){
                return;
            }

            try {
                await deleteNotice(noticeNo)
                console.log("삭제완료 : ", noticeNo);
                navigate('/notice');
            } catch (err) {
                console.error("삭제 실패:", err);
                alert("삭제 중 오류가 발생했습니다.");
            } 
        } else if (e === "list") {
            navigate('/notice');
        }
   }
    
    if (!detail) return <div>로딩 중...</div>;
    return (
        <>
            <h2>공지사항 - 상세</h2>
            
            <div className="content-area">
                <span>글번호 : {noticeNo}</span>
                <p>{detail.memberId} <b>관리자</b></p>
                <h3>{detail.noticeTitle}</h3>
                <div className="content">
                    <p dangerouslySetInnerHTML={{ __html: detail.noticeContent }} />
                </div>
            </div>

            {member?.role === "ROLE_ADMIN" && (
            <Stack direction="row" spacing={1} sx={{justifyContent:"right"}}>
                <CustomButton
                    type="button"
                    onClick={()=>{handleClick("list")}}
                    size='medium'
                    variant="contained"
                    color="success"
                    text='목록'
                />
                <CustomButton
                    type="button"
                    onClick={()=>{handleClick("update")}}
                    size='medium'
                    variant="contained"
                    color="default"
                    text='수정'
                />
                <CustomButton
                    type="button"
                    onClick={()=>{handleClick("delete")}}
                    size='medium'
                    variant="contained"
                    color="danger"
                    text='삭제'
                />
            </Stack>
            )}
        </>
    )
}

export default NoticeDetail;