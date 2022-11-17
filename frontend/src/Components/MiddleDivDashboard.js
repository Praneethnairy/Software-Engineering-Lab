import React from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';

export default function MiddleDivDashboard() {
  const navigate = useNavigate();
  return (
    <div className='MiddleDiv'>
        <Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            '& > :not(style)': {
            m: 1,
            width: 500,
            height: 500,
            },
        }}
        >

        <Paper elevation={3} sx = {{background: "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(253,187,45,1) 100%)",display:"flex",justifyContent:"center",alignItems:"center"}} className = "paper" onClick = {()=>{navigate('/survey')}}>
            <h1 style={{color:"white",fontSize:"50px"}}>Survey</h1>
        </Paper>
        <Paper elevation={3} sx = {{background: "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(0,212,255,1) 100%)",display:"flex",justifyContent:"center",alignItems:"center"}} className = "paper" onClick = {()=>{navigate('/campaign')}}>
            <h1 style={{color:"white",fontSize:"50px"}}>Campaign</h1>
        </Paper>
        </Box>
    </div>
  )
}
