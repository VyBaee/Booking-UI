import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Booking from "./Container/Booking";
// import UserList from "./Container/UserList";
// import Login from "./Login/Login";
import './App.css';

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/" element={<Booking />} />
        {/* <Route path="/userlist" element={<UserList />} /> */}
        {/* <Route path="/login" element={<Login/>}/> */}
      </Routes>
    </Router>
  );
};

export default App;
