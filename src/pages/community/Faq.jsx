import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';

import CNTAccordion from '../../components/list/ControlledAccordions';
import CustomButton from '../../components/input/CustomButton';
import { getFaqList, deleteFaq } from '../../service/community/FaqApiService';
import { getUserRoleFromToken } from "../../service/util/auth";

const Faq = () =>{
    const [selectedFaqs, setSelectedFaqs] = useState([]);
    const [list, setList] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    // const user = JSON.parse(localStorage.getItem("loginUser"));
    // const userRole = user?.role;  // ex: "ROLE_ADMIN"
    const userRole = getUserRoleFromToken();
    console.log("현재 유저 권한:", userRole);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const toggleSelect = (faqNo) => {
    setSelectedFaqs((prev) =>
            prev.includes(faqNo)
                ? prev.filter(no => no !== faqNo)
                : [...prev, faqNo]
        );
    };

    useEffect(()=>{
        getFaqList().then((data) => {
            setList(data);
            console.log("api 통신 데이터 : ",data);
        })
    },[])

    const handleClick = (e) => {
        if (e === "insert"){
            navigate("/faq/insert");
        }else if(e === "update"){
            // console.log(e);
            if (selectedFaqs.length === 0) {
                alert("수정할 항목을 선택해 주세요.");
                return;
            }
            if (selectedFaqs.length > 1) {
                alert("하나의 항목만 선택해 주세요.");
                return;
            }
            const faqNo = selectedFaqs[0];
            const selectedItem = list.find(faq => faq.faqNo === faqNo);

            navigate(`/faq/update/${faqNo}`,{
                state: {faqData : selectedItem}
            });
        }else if(e === "delete"){
            if(confirm("해당 게시글을 정말 삭제 하시겠습니까?") == false){
                return;
            }

            try {
                for (let faqNo of selectedFaqs) {
                        deleteFaq(faqNo).then(() => {
                        console.log("삭제완료 : ", faqNo);
                        getFaqList().then(data => {
                            setList(data);
                            setSelectedFaqs([]); // 선택 초기화도 함께
                        });
                    });
                }
            } catch (err) {
                console.error("삭제 실패:", err);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    }

    let dataList = list.map((faq,index) => {
        console.log(`FAQ ${index}:`, faq);
        return (
             <CNTAccordion 
                key={`${faq.faqNo}-${index}`}
                name={`panel`+faq.faqNo}
                title={faq.faqQuestion}
                content={
                    faq.faqAnswer
                }
                expanded={expanded}
                handleChange={handleChange}
                faqNo={faq.faqNo}
                isChecked={selectedFaqs.includes(faq.faqNo)}
                onCheckToggle={toggleSelect}
                isAdmin={userRole === "ROLE_ADMIN"}
                ></CNTAccordion>
        )
    });

    return (
        <>
            <h2>FAQ</h2>
            {dataList}
            {userRole === "ROLE_ADMIN" && (
            <Stack direction="row" spacing={1} sx={{justifyContent:"right"}}>
                <CustomButton
                    type="button"
                    onClick={()=>{handleClick("insert")}}
                    size='medium'
                    variant="contained"
                    color="success"
                    text='새글 등록'
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

export default Faq;