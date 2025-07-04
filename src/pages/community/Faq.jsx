import { useEffect, useState } from 'react';
import BasicEditor from '../../components/editor/BasicEditor';
import CNTAccordion from '../../components/list/ControlledAccordions';
import axios from "axios";
import React from 'react'
import { getFaqList, insertFaqList } from '../../service/community/FaqApiService';
import { data } from 'react-router-dom';

const Faq = () =>{
    const [faqQuestion, setFaqQuestion] = useState('');
    const [selectedFaqs, setSelectedFaqs] = useState([]);
    const [value, setValue] = useState('');
    const [list, setList] = useState([]);
    const [expanded, setExpanded] = useState(false);
    
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

    const axiosConfig = {
        headers:{
            "Content-Type" : "application/json"
        }
    }

    // useEffect(()=>{
    //     axios.get("http://localhost:8080/api/faq").then((res) => {
    //         setList(res.data);
    //         console.log("api 통신 데이터 : ",res.data)
    //     });
    // },[]);
    useEffect(()=>{
        getFaqList().then((data) => {
            setList(data);
            console.log("api 통신 데이터 : ",data);
        })
    },[])


    const updateInput = (e) => {
        const{ name, value } = e.target;
        console.log(e);
        if(name === "faqQuestion"){
            setFaqQuestion(value);
        }
    }

    const submitEditor = async (e) => {
        e.preventDefault();
        const dto = {
            faqQuestion : faqQuestion,
            faqAnswer: value
        }

        try{
            insertFaqList().then((data) => {
                console.log("api 신규 데이터 : ",data);
            });

            // 새로고침 나중에 추가
            
            // axios.post("http://localhost:8080/api/faq", dto, axiosConfig).then((res) => {
            //     console.log("api post : ",res.data)
            // });
        }catch(err){
            console.error("등록에 실패 하였습니다.")
        }

    }

    const editFaq = async () => {
            console.log("수정")

            const faqNo = selectedFaqs[0];
            const selectedItem = list.find(faq => faq.faqNo === faqNo);

            // 기존 내용을 입력창에 세팅
            setFaqQuestion(selectedItem.faqQuestion);
            setValue(selectedItem.faqAnswer);
    }
    //selectedFaqs
    const deleteFaq = async (faqNo) => {
        if(confirm("해당 게시글을 정말 삭제 하시겠습니까?") == false){
            return;
        }

        try {
            for (let faqNo of selectedFaqs) {
                    axios.delete(`http://localhost:8080/api/faq/${faqNo}`, axiosConfig).then((res) => {
                    console.log("api delete : ", res.data);
                });
            }
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제 중 오류가 발생했습니다.");
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
                ></CNTAccordion>
        )
    });

    return (
        <>
            <h2>FAQ</h2>
            {dataList}
            {/* <AdminFaq></AdminFaq> */}
            <form onSubmit={submitEditor}>
                <input 
                    type="text" 
                    name="faqQuestion" 
                    value={faqQuestion}
                    onChange={updateInput}
                    placeholder="제목을 입력해 주세요"/>
                <BasicEditor
                    value={value}
                    onChange={setValue}
                    />
                <button>등록</button>
                <button type="button" onClick={editFaq}>수정</button>
                <button type="button" onClick={deleteFaq}>삭제</button>
            </form>

        </>
    )
}

export default Faq;