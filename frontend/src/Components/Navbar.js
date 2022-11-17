import React from 'react'
import image from '../Images/IMAGE.jpg'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';

const cookie = new Cookies();
const token = cookie.get('userAuthToken');

export default function Navbar(props) {
  const [name,setName] = useState('');

  useEffect(()=>{
    axios.post(`${process.env.REACT_APP_SERVER_URL}/userName`,{tok:cookie.get('userAuthToken')}).then(res=>{
      setName(res.data.name);
    })
  },[name]);
  const navigate = useNavigate();
  const logOutClicked = () => {
    axios.post(`${process.env.REACT_APP_SERVER_URL}/logOut`, { tok: token }).then((res) => {
      if (res.data.flag === true) {
        cookie.remove('userAuthToken', { path: '/', domain: 'localhost' });
        navigate('/signin');
      }
    });
  };
  return (<div style= {{position:"sticky",top:0,width:"100%",zIndex:2}}>
    {window.location.pathname === '/' ? <div className='mainNavbar' style={{ margin: "0 0 5vh 0", background: 'linear-gradient(90deg, rgba(208,151,32,1) 35%, rgba(0,79,131,1) 100%)' }}>
      <h2>{props.name}</h2>
      <div className='innerDiv'>
        <h6>Welcome, {name}</h6>
        <Avatar alt="User" src={image} sx={{ "margin": "0 1vw 0 1vw" }} />
        <Button variant="outlined " onClick={logOutClicked} sx = {{margin:"0 0 0.7vh 0"}}>Log Out</Button>
      </div>
    </div> :
      window.location.pathname === '/survey' ?
        <div className='mainNavbar' style={{ margin: "0 0 5vh 0",backgroundColor:"rgb(210, 151, 20)" }}>
          <h2>{props.name}</h2>
          <div className='innerDiv'>
            <h6>Welcome, {name}</h6>
            <Avatar alt="User" src={image} sx={{ "margin": "0 1vw 0 1vw" }} />
            <Button variant="outlined " onClick={logOutClicked} sx = {{margin:"0 0 0.7vh 0"}}>Log Out</Button>
          </div>
        </div>
        :
        <div className='mainNavbar' style={{ margin: "0 0 5vh 0", backgroundColor:"rgb(0, 79, 145)" }}>
          <h2>{props.name}</h2>
          <div className='innerDiv'>
            <h6>Welcome, {name}</h6>
            <Avatar alt="User" src={image} sx={{ "margin": "0 1vw 0 1vw" }} />
            <Button variant="outlined " onClick={logOutClicked} sx = {{margin:"0 0 0.7vh 0"}}>Log Out</Button>
          </div>
        </div>}
  </div>

  )
}
