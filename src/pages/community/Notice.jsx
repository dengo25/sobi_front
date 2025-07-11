import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/material';

import CustomButton from '../../components/input/CustomButton';
import { getNoticeList } from '../../service/community/noticeApiService';

const Notice = () =>{
    const [list, setList] = useState([]);
    const navigate = useNavigate();
    const member = useSelector((state) => state.memberSlice);
    console.log("[slice] 현재 유저 정보 :", member);

    useEffect(()=>{
        getNoticeList().then((data) => {
            setList(data);
            console.log("api 통신 데이터 : ",data);
        })
    },[])

    const handleClick = (e) => {
        if (e === "insert"){
            navigate("/notice/insert");
        }
   }

    let dataList = list.map((notice,index) => {
        console.log(`Notice ${index}:`, notice);
        return (
            <tr key={notice.noticeNo}>
                <td>{notice.noticeNo}</td>
                <td><Link to={`/notice/${notice.noticeNo}`}>{notice.noticeTitle}</Link></td>
                <td>{notice.noticeCreateDate}</td>
            </tr>
        )
    });

    return (
        <>
            <h2>공지사항</h2>
            <table>
                <colgroup>
                    <col width={"100px"}></col>
                    <col width={"auto"}></col>
                    <col width={"200px"}></col>
                </colgroup>
                <thead>
                    <tr>
                        <th>글번호</th>
                        <th>제목</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {dataList}
                </tbody>
            </table>

            {member?.role === "ROLE_ADMIN" && (
            <Stack direction="row" spacing={1} sx={{justifyContent:"right"}}>
                <CustomButton
                    type="button"
                    onClick={()=>{handleClick("insert")}}
                    size='medium'
                    variant="contained"
                    color="success"
                    text='새글 등록'
                />
            </Stack>
            )}
        </>
    )
}

export default Notice;