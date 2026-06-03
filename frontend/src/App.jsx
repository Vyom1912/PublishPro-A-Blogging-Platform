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
  MyBlog,
} from "./Page";
import { Navbar } from "./components";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/blog/:id' element={<BlogDetails />} />
          <Route path='/add-blog' element={<AddBlog />} />
          <Route path='/profile' element={<Profile />} />

          <Route path='/profile/blog' element={<MyBlog />} />
          <Route path='/profile/blog/:id' element={<BlogDetails />} />
          <Route path='/edit-profile' element={<EditProfile />} />
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
