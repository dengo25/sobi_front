import {useState, useCallback, useEffect} from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {MenuItem, Stack} from '@mui/material';

import CustomButton from '../../components/input/CustomButton';
import BasicEditor from '../../components/editor/BasicEditor';
import {getCategoryList, insertReview, updateReview} from "../../service/review/ReviewService.js";
import TextField from "@mui/material/TextField";
import {useSelector} from "react-redux";


const InsertComponent = () => {
    const { state } = useLocation();
    const { tno } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const member = useSelector(state => state.member);



    const [categories, setCategories] = useState([]);

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

        // const imageUrls = extractImageUrls(formData.content);
        // const dto = {
        //     ...formData,
        //     images: imageUrls
        // };
        const dto = {
            ...formData,
            images: images,
            memberId: member.memberId,
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
                <BasicEditor
                    value={formData.content}
                    onChange={handleEditorChange}
                    s3Folder="review"
                    onImageUpload={(imageInfo) => {
                        setImages((prev) => {
                            const newImage = {...imageInfo};
                            // 만약 첫 번째 이미지라면 썸네일로 지정
                            if (prev.length === 0) {
                                newImage.isThumbnail = "Y";
                            }
                            return [...prev, newImage];
                        });
                    }}
                />

                <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 2 }}>
                    <CustomButton type="submit" color="primary" text={isEdit ? '수정' : '등록'} />
                    <CustomButton type="button" color="default" text="취소" onClick={() => navigate("/review/list")} />
                </Stack>
            </form>
        </>
    );
};

export default InsertComponent;