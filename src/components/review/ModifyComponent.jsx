import {useState, useCallback, useEffect} from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {MenuItem, Stack} from '@mui/material';

import CustomButton from '../../components/input/CustomButton';

import {getCategoryList, getReview, insertReview, updateReview} from "../../service/review/ReviewService.js";
import TextField from "@mui/material/TextField";
import {useSelector} from "react-redux";
import ReviewEditor from "../editor/ReviewEditor.jsx";


const InsertComponent = () => {
    const { state } = useLocation();
    const { tno } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const member = useSelector(state => state.member);



    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // 수정 모드일 때 기존 글 데이터 불러오기
        if (tno) {
            getReview(tno).then((data) => {
                setFormData({
                    tno: Number(tno),
                    title: data.title,
                    content: data.content,
                    categoryId: data.categoryId,
                    imageUrls: [], // 필요하면 여기서 image preview도 할 수 있음
                });
                setImages(data.images || []); // 이미지도 미리 설정
            }).catch((err) => {
                console.error("리뷰 불러오기 실패", err);
            });
        }
    }, [tno]);


    useEffect(() => {
        getCategoryList()
            .then((data) => setCategories(data))
            .catch((err) => console.error("카테고리 가져오기 실패", err));
    }, []);

    const reviewData = state?.reviewData;
    const isEdit = !!reviewData || !!tno;

    const [formData, setFormData] = useState({
        tno: reviewData?.tno || '',
        title: reviewData?.title || '',
        content: reviewData?.content || '',
        categoryId: reviewData?.categoryId || '',
        imageUrls: [], // imageUrls는 content에서 추출해 채움
    });

    const updateInput = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleEditorChange = useCallback((content) => {
        setFormData(prev => ({
            ...prev,
            content: content
        }));
    }, []);

    useEffect(() => {
        console.log("실시간 content 확인:", formData.content);
    }, [formData.content]);

    const extractImageUrlsFromHTML = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        const imgTags = div.getElementsByTagName("img");
        return Array.from(imgTags).map(img => img.getAttribute("src"));
    };


    const submitEditor = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert("제목을 입력하세요.");
            return;
        }

        if (!formData.content.trim()) {
            alert("내용을 입력하세요.");
            return;
        }

        const validImageUrls = extractImageUrlsFromHTML(formData.content);
        const filteredImages = images.filter(img => validImageUrls.includes(img.fileUrl));

        const dto = {
            ...formData,
            images: filteredImages, // ❗️삭제된 이미지 제외된 리스트
            memberId: member.memberId,
            tno: Number(tno)
        };
        console.log("전송 DTO:", dto);

        try {
            if (isEdit) {
                await updateReview(dto); // 수정
            } else {
                await insertReview(dto); // 등록
            }

            navigate("/review/list");
        } catch (err) {
            console.error("리뷰 등록/수정 실패", err);
            alert("작업 중 오류가 발생했습니다.");
        }
    };
    return (
        <>
            <h2>{isEdit ? '리뷰 수정' : '리뷰 작성'}</h2>
            <form onSubmit={submitEditor}>
                <div>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={updateInput}
                        placeholder="제목을 입력해 주세요"
                        style={{
                            width: '100%',
                            padding: '10px',
                            fontSize: '16px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>
                <TextField
                    select
                    label="카테고리 선택"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={updateInput}
                    fullWidth
                    margin="normal"
                    size="small"
                >
                    <MenuItem value="">카테고리를 선택하세요</MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </TextField>
                <ReviewEditor
                    value={formData.content}
                    onChange={handleEditorChange}
                    s3Folder="review"
                    onImageUpload={(imageInfo) => {
                        setImages((prev) => {
                            const newImage = { ...imageInfo };
                            if (prev.length === 0) {
                                newImage.isThumbnail = "Y";
                            }
                            return [...prev, newImage];
                        });
                    }}
                    onImageDelete={(fileUrl) => {
                        setImages((prev) => prev.filter((img) => img.fileUrl !== fileUrl));

                        // content에서 <img src="fileUrl"> 태그 제거
                        setFormData(prev => ({
                            ...prev,
                            content: prev.content.replace(
                                new RegExp(`<img[^>]*src=["']${fileUrl}["'][^>]*>`, 'g'),
                                ''
                            )
                        }));
                    }}
                />

                <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 2 }}>
                    <CustomButton type="submit" color="primary" text={isEdit ? '수정' : '등록'} />
                    <CustomButton type="button" color="default" text="취소"
                                  onClick={() => navigate(`/review/detail/${tno}`)} />
                </Stack>
            </form>
        </>
    );
};

export default InsertComponent;