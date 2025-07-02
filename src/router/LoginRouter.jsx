import { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

import LoginPage from "../pages/login/LoginPage.jsx";


const LoginRouter = () => {
    return {
        path: "login",
        children: [
            {
                path: "",
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <LoginPage />
                    </Suspense>
                ),
            },

        ],
    };
};

export default LoginRouter;
