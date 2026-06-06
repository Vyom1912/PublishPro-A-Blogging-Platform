// import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  Home,
  AddBlog,
  Login,
  SignUp,
  Logout,
  Profile,
  EditProfile,
  BlogDetails,
  EditBlog,
  EditPassword,
  ForgotPassword,
  ResetPassword,
} from "./Page";
import { Navbar } from "./components";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add-blog' element={<AddBlog />} />
          <Route path='/blog/:id' element={<BlogDetails />} />

          <Route path='/profile' element={<Profile />} />
          <Route path='/edit-profile' element={<EditProfile />} />

          <Route path='/edit-password' element={<EditPassword />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />

          <Route path='/profile/blog/:id' element={<BlogDetails />} />
          <Route path='/edit-blog/:id' element={<EditBlog />} />

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='*' element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
