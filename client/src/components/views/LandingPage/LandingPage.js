
import axios from 'axios'
import React from 'react'
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const onClickHandler = () => {
    axios.get(`/api/users/logout`)
    .then(response =>{
      if(response.data.success){
        navigate("../login",  { replace: true});
      }else{
        alert('err')
      }
    })
  }


  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems:'center', width: '100%',height: '100vh'}}>
      LandingPage

      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  )
}

export default LandingPage
