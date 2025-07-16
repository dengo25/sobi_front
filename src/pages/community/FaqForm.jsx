import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Stack } from '@mui/material';

import CustomButton from '../../components/input/CustomButton';
import BasicEditor from '../../components/editor/BasicEditor';
import { getFaqDetail, updateFaqList, insertFaqList } from '../../service/community/faqApiService';

const FaqForm = () => {
    const location = useLocation();
    const faqDataFromState = location.state?.faqData;
    const [faqQuestion, setFaqQuestion] = useState('');
    const [value, setValue] = useState('');
    const { faqNo } = useParams();
    const navigate = useNavigate();
    console.log("faqNo: ", faqNo);
    
    useEffect(() => {
        if(faqDataFromState){
            setFaqQuestion(faqDataFromState.faqQuestion);
                setValue(faqDataFromState.faqAnswer);
        } else if(faqNo){
            getFaqDetail(faqNo).then((data)=>{
                setFaqQuestion(data.faqQuestion);
                setValue(data.faqAnswer);
                console.log("상세내용 : "+data.faqAnswer);
            }).catch(err => {
                console.error("FAQ 데이터를 불러오는 중 오류 : ", err);
            });
        }
    },[faqNo, faqDataFromState]);

    const updateInput = (e) => {
        const{ name, value } = e.target;
        console.log(e);
        if (name === "faqQuestion") setFaqQuestion(value);
        // 카테고리 추가시 if (name === "faqCategory") setFaqCategory(value);
    }

    const submitEditor = async (e) => {
        e.preventDefault();
        const dto = {
            faqQuestion,
            faqAnswer: value
        };

        try{
            if(faqNo){ // 수정
                await updateFaqList(faqNo, dto);
                console.log("Faq 수정 완료");
            } else{ // 새 글 등록
                await insertFaqList(dto);
                console.log("Faq 등록 완료");
            }
            navigate("/faq");
        }catch(err){
            console.error("등록에 실패 하였습니다.")
        }
    }

    const handleClick = (e) => {
        if (e === "cancel"){
            if(confirm("해당 게시글 등록(수정)을 취소 하시겠습니가?") == false){
                return;
            }
            navigate("/faq");
        }
    }

    return(
        <>
            <h2>FAQ</h2>
            <form onSubmit={submitEditor}>
                <input 
                    type="text" 
                    name="faqQuestion" 
                    value={faqQuestion}
                    onChange={updateInput}
                    placeholder="제목을 입력해 주세요"
                    />
                <BasicEditor
                    value={value}
                    onChange={setValue}
                    />
                <Stack direction="row" spacing={1} sx={{justifyContent:"right"}}>
                    <CustomButton
                        type="submit"
                        size='medium'
                        variant="contained"
                        color="success"
                        text='등록'
                    />
                    <CustomButton
                        type="button"
                        onClick={()=>{handleClick("cancel")}}
                        size='medium'
                        variant="contained"
                        color="default"
                        text='취소'
                    />
                </Stack>
            </form>
        </>
    )
}

export default FaqForm;