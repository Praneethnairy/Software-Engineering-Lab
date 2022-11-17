import React from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
    const navigate = useNavigate();
    const registerFormSubmitted = (e) =>{
        e.preventDefault();
        if(e.target.uPass.value !== e.target.uCnfPass.value){
            console.log("Error");
        }
        else{
            const required = {
                name : e.target.Name.value,
                uName: e.target.uName.value,
                uPass: e.target.uPass.value,
                email: e.target.email.value,
                Phno : e.target.contact.value
            };
            axios.post(`${process.env.REACT_APP_SERVER_URL}/registerUser`, required).then((res)=>{
                if(res.data.flag === true){
                    navigate('/signin')
                }
                else{
                    console.log(res.data.msg);
                }
                
            }).catch((err)=>{
                // if(err) throw err;
                console.log("User already registered");
            });
        }
    };

    const gotToSignIn = () =>{
        navigate('/signin')
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
                height: 690,
                },
            }}
            >
        
                <Paper elevation={5} className = "PaperLogin">
                    <h2 style={{"margin":"0 0 3vh 0","fontFamily": "'Open Sans', sans-serif"}}>Sign Up</h2>
                    <form onSubmit={registerFormSubmitted}>
                        <TextField  label="Name" id="Name" name="Name"  sx={{"margin":"1vh 1vw 2vh 1vw","width":"80%"}} required/>

                        <TextField  label="Email" type = "email" id="email" name="email"  sx={{"margin":"1vh 1vw 2vh 1vw","width":"80%"}} required/>

                        <TextField  label="Contact number" id="contact" name="contact"  sx={{"margin":"1vh 1vw 2vh 1vw","width":"80%"}} required/>
                        
                        <TextField  label="Username" id="uName" name="uName"  sx={{"margin":"1vh 1vw 2vh 1vw","width":"80%"}} required/>

                        <TextField label="Password" type = "password" id="uPassword" name="uPass" sx={{"margin":"1vh 1vw 3vh 1vw","width":"80%"}} required/>

                        <TextField label="Confirm Password" id="uCnfPassword" name="uCnfPass" sx={{"margin":"1vh 1vw 3vh 1vw","width":"80%"}} required/>
                        
                        <Button variant="outlined" type = "submit">Register</Button>
                    </form>
                    <div className='paragraph'>
                        <p style={{"margin":"0 5px 0 0",display:"inline-block"}}>Already have an account?</p>
                        <p style={{"color" : "rgb(2, 118, 227)",display:"inline-block"}} onClick = {gotToSignIn}>Log In</p>
                    </div>
                </Paper>
            </Box>
        </div>
    </div>
  )
}
