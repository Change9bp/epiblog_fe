import "./App.css";
import React from "react";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/login/Login";
import ProtectedRoutes from "./middlewares/ProtectedRoutes";
import PostContext from "./contexts/reactContext";
import SettingAuthorImg from "./views/settings/SettingAuthorImg";
import Success from "./views/success/Success";
import NotFound from "./views/notFound/NotFound";

function App() {
  return (
    <Router>
      <PostContext>
        <Routes>
          <Route exact path="/" element={<Login />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/home" exact element={<Home />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/new" element={<NewBlogPost />} />
            <Route path="/settings" exact element={<SettingAuthorImg />} />
            <Route path="/success/:tokengit" element={<Success />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </PostContext>
      <Footer />
    </Router>
  );
}

export default App;
