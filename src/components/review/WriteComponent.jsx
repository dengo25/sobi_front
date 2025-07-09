import React, { useEffect, useState } from 'react'
import BasicEditor from "../editor/BasicEditor.jsx"
import { getCategoryList } from "../../service/member/ApiService.js"
import CustomInput from "../input/CustomInput.jsx"
import MenuItem from "@mui/material/MenuItem" // 반드시 import 필요!

export default function WriteComponent() {
    const [value, setValue] = useState("")
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("")

    useEffect(() => {
        getCategoryList()
            .then((data) => setCategories(data))
            .catch((err) => console.error("카테고리 가져오기 실패", err))
    }, [])

    return (
        <div className="space-y-4">
            <CustomInput
                select
                label="카테고리 선택"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                variant="outlined"
                fullWidth
                useCustomStyle
                customColor="success"
                required
            >
                <MenuItem value="">-- 카테고리 선택 --</MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                ))}
            </CustomInput>

            <BasicEditor value={value} onChange={setValue} />
        </div>
    )
}
