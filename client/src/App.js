
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth';

function App() {
  const NewLandingPage = Auth(LandingPage, null);
  const NewLoginPage = Auth(LoginPage, false);
  const NewRegisterPage = Auth(RegisterPage, false);
  return (
    <Router>
    <div>
      

    
         <Routes>

          <Route exact path="/login" element ={<NewLoginPage />}/>
          <Route exact path="/register" element ={<NewRegisterPage />}/>
          <Route exact path="/" element ={<NewLandingPage/>}/>
          
            
        </Routes>
    </div>
  </Router>
  );
}

export default App;
