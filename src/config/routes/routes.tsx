import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../../pages/Login";
import { DefaultLayout } from "../layout/DefaultLayout";
import { FeedPage } from "../../pages/Feed";
import { ExplorePage } from "../../pages/Explore";
import { ProfilePage } from "../../pages/Profile";
import { TweetDetailPage } from "../../pages/TweetDetail";
import { ProtectedRoute } from "./ProtectedRoute";

export const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <FeedPage />,
      },
      {
        path: "explore",
        element: <ExplorePage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "tweet/:tweetId",
        element: <TweetDetailPage />,
      },
    ],
  },
]);
