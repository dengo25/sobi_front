import { configureStore, combineReducers } from "@reduxjs/toolkit";
import memberReducer from "./slice/memberSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 기본: localStorage 사용

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["member"], // persist할 slice 이름
};


const rootReducer = combineReducers({
    member: memberReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 필수 설정
        }),
});

export const persistor = persistStore(store);

export default store;
