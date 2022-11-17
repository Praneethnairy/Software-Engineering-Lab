import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Buttons from './Buttons';
import Navbar from './Navbar';
import TextField from '@mui/material/TextField';
import Cookies from 'universal-cookie';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
const cookie = new Cookies();

export default function Survey() {
  
  const [value,setValue] = useState([]);
  const [flag,setFlag] = useState(false);
  const [post,setPost] = useState(false);
  const [deleted,setDeleted] = useState(false);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_SERVER_URL}/getSurveys`).then((res)=>{
      setValue(res.data.details);
      console.log(res.data.details);
      setFlag(true);
    })
  },[flag,post,deleted])
  const addSurvey = () =>{
    setPost(true);
  };
  const backToSurvey = () =>{
    setPost(false);
  }

  const surveyPostingClicked = (e) =>{
    e.preventDefault();
    const required = {
      tok : cookie.get('userAuthToken'),
      survey : e.target.survey.value,
      opt1: e.target.o1.value,
      opt2:e.target.o2.value,
      opt3:e.target.o3.value,
      opt4:e.target.o4.value
    } 
    axios.post(`${process.env.REACT_APP_SERVER_URL}/postSurvey`,required).then((res)=>{
      setPost(false)
    })
  }


  return (
    <>
    <Navbar name = "Survey"/>
    {!post?<div style= {{width:"98vw",display:"flex",justifyContent:"center",flexWrap:"wrap",padding:"0 0 15vh 0"}}>
    {flag?
      value.map((survey,i)=>{
      return (
        <div key = {i}>
        
        <Card sx={{ maxWidth: 345 ,margin:"2vh 2vw"}} className='surveyCard'>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {survey.name.slice(0,1)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={()=>{
              axios.post(`${process.env.REACT_APP_SERVER_URL}/getUid`,{tok:cookie.get('userAuthToken')}).then(res1=>{
                if(res1.data.uid === survey.uid){
                  axios.post(`${process.env.REACT_APP_SERVER_URL}/deleteSurvey`,{sid:survey.sid}).then((res)=>{
                    if(deleted === true){
                      setDeleted(false);
                    }
                    else{
                      setDeleted(true);
                    }
                  })
                }
                else{
                  alert("Survey can be only deleted by user who has created it!!!");
                }
              })
            }}>
              <DeleteIcon />
            </IconButton>
          }
          
          title={survey.name}
          subheader={months[(survey.mon)-1] + ' '+survey.time.slice(8,10) + ', '+survey.time.slice(0,4)}
        />
        
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {survey.surveyDetails}
          </Typography>
        </CardContent>
        <div>
          <Buttons survey = {survey}/>
        </div>
           </Card>
        </div>
      )
    }):<p>No survey</p>}
      <div style={{position:"fixed",bottom:0,width:"99vw",textAlign:"right",padding:"4vh 2vw"}}>
        {/* <Button variant="contained" sx = {{padding:"2vh 4vw"}} onClick = {addSurvey}>Start a Survey</Button> */}
        <Fab color="primary" aria-label="edit" sx = {{width:"90px",height:"90px"}} onClick = {addSurvey}>
          <EditIcon sx = {{width:"50px",height:"50px"}}/>
        </Fab>
      </div>
    </div>
    :
    <div>
    <h3 style = {{margin:"1vh 2vw",fontFamily: "'Lato', sans-serif",textAlign:"center"}}>Start a Survey</h3>
          <div style={{margin:"3vh 23vw",display:"flex",justifyContent:"center",alignItems:"center", backgroundColor:"white"}} className="gatewayDiv">
            <form onSubmit = {surveyPostingClicked}>
              <h5>Enter the Survey:</h5>
              <textarea rows={5} cols = {63} id="textArea" name = "survey" style={{margin:"0 0 3vh 0"}} required/><br/>
              <TextField id="outlined-basic" label="Option 1" name = "o1" variant="outlined" sx={{width:"31vw" ,margin:"0 0 3vh 0"}} required/><br/>
              <TextField id="outlined-basic" label="Option 2" name = "o2" variant="outlined" sx={{width:"31vw" ,margin:"0 0 3vh 0"}} required/><br/>
              <TextField id="outlined-basic" label="Option 3" name = "o3" variant="outlined" sx={{width:"31vw" ,margin:"0 0 3vh 0"}} required/><br/>
              <TextField id="outlined-basic" label="Option 4" name = "o4" variant="outlined" sx={{width:"31vw" ,margin:"0 0 3vh 0"}} required/><br/>
              <Button variant="contained" sx = {{margin:"0 2vw 0 0",padding:"10px 20px"}} onClick = {backToSurvey}>Back</Button>
              <Button variant="contained" sx = {{margin:"0 2vw 0 0",padding:"10px 20px"}} type = "survey">Start the Survey</Button>
              
            </form>
          </div>
      </div>}
    </>
  );
}
