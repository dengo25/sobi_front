import { configureStore } from "@reduxjs/toolkit";
import memberSlice from "./slice/memberSlice";


export default configureStore({
    reducer: {
        "memberSlice": memberSlice
    },
});

