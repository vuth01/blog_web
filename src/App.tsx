import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { store } from "./stores";
import { Provider } from "react-redux";
import { Profile } from "./pages/Profile";
import { SettingUser } from "./pages/SettingUser";
import { NewPost } from "./pages/NewPost";
import { ProfileUser } from "./pages/ProfileUser";
import { Article } from "./pages/Article";
import { ArticleEdit } from "./pages/ArticleEdit";
import { PrivateRoute } from "./components/PrivateRoute";
const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Home />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },

  {
    path: "settings",
    element: (
      <PrivateRoute>
        <SettingUser />
      </PrivateRoute>
    ),
  },
  {
    path: "editor",
    element: (
      <PrivateRoute>
        <NewPost />
      </PrivateRoute>
    ),
  },
  {
    path: "editor/:slug",
    element: (
      <PrivateRoute>
        <NewPost />
      </PrivateRoute>
    ),
  },
  {
    path: "profile/:username",
    element: <ProfileUser />,
  },
  {
    path: "articles/:slug",
    element: <Article />,
  },
  {
    path: "articles/edit/:slug",
    element: <ArticleEdit />,
  },
  {
    path: ":username",
    element: <Profile />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <RouterProvider router={router} fallbackElement={"Loading..."} />
      </div>
    </Provider>
  );
}

export default App;
