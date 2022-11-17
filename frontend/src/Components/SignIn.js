import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

export default function SignIn(props) {
    const [varAlert, setVarAlert] = useState(false);
  const cookie = new Cookies();
  const navigate = useNavigate();
  const signInFormSubmitted = (e) =>{
    e.preventDefault();
    const requested = {
      uName : e.target.uName.value,
      passwd : e.target.uPass.value
    };
    // console.log(requested);
    axios.post(`${process.env.REACT_APP_SERVER_URL}/signIn`,requested).then((res)=>{
      cookie.set('userAuthToken',res.data.authTok);
      navigate('/');
    }).catch((err)=>{
      setVarAlert(true);
      setTimeout(()=>{
        setVarAlert(false);
      },3000);
    })
  }

  const gotToRegister = () => {
    // window.localStorage.setItem('register', true);
    navigate('/signup')
  };


  return (
    <div>
        <div className='signInMain'>
            <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                m: 1,
                width: 500,
                height: 400,
                },
            }}
            >
        
                <Paper elevation={5} className = "PaperLogin">
                {varAlert === true?<Alert severity="error" >Invalid Username or Password!!!</Alert>:<></>}
                    <h2 style={{"margin":"0 0 3vh 0","fontFamily": "'Open Sans', sans-serif"}}>Log In</h2>
                    <form onSubmit={signInFormSubmitted}>
                        
                        <TextField  label="Username" id="uName" name="uName"  sx={{"margin":"1vh 1vw 2vh 1vw","width":"80%"}} required/>

                        <TextField type = "password" label="Password" id="uPassword" name="uPass" sx={{"margin":"1vh 1vw 3vh 1vw","width":"80%"}} required/>
                        
                        <Button variant="outlined" type = "submit">Log In</Button>
                    </form>
                    <div className='paragraph'>
                        <p style={{"margin":"0 5px 0 0" ,display:"inline-block"}}>Create an account</p>
                        <p style={{"color" : "rgb(2, 118, 227)",display:"inline-block"}} onClick = {gotToRegister}>Sign Up</p>
                    </div>
                </Paper>
            </Box>
        </div>
        
    </div>
  )
}
