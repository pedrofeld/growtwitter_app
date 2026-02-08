import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../../pages/Login";
import { DefaultLayout } from "../layout/DefaultLayout";
import { FeedPage } from "../../pages/Feed";
import { ExplorePage } from "../../pages/Explore";
import { ProfilePage } from "../../pages/Profile";

export const routes = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "",
                element: <FeedPage />,
            },
            {
                path: "explore",
                element: <ExplorePage />,
            },
            {
                path: "profile",
                element: <ProfilePage />,
            }
        ]
    }
]);