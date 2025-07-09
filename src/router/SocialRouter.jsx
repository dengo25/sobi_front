import Social from "../pages/login/Social.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import {Suspense} from "react";


const SocialRouter = () => {
    return {
        path: "sociallogin",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <Social />
            </Suspense>
        ),
    };
};

export default SocialRouter;