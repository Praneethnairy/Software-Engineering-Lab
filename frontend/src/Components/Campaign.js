import React from 'react'
import Navbar from './Navbar'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import image from '../Images/pic.jpg';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState,useEffect } from 'react'
import axios from 'axios';
import VotingButton from './VotingButton';
import Cookies from 'universal-cookie';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';

const cookie = new Cookies();

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Campaign() {
  const [expanded, setExpanded] = React.useState(false);
  const [campaigns,setCampaigns] = useState([]);
  const [campaignFlag,setCampaignFlag] = useState(false);
  const [flag,setFlag] = useState(false);
  const [deleted,setDeleted] = useState(false);
  const [post,setPost] = useState(false);
  

  useEffect(() =>{
    axios.get(`${process.env.REACT_APP_SERVER_URL}/campaigns`).then((res)=>{
      if(res.data.details.length === 0){
        setCampaignFlag(false);
      }
      else{
        setCampaigns(res.data.details);
        setCampaignFlag(true);
      }
    })
  },[campaignFlag,flag,deleted,post]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const addSurvey = () =>{
    setPost(true);
  }

  const backToCampaign = () =>{
    setPost(false);
  }

  const campaignPostClicked = (e) =>{
    e.preventDefault();
    const required = {
      tok:cookie.get('userAuthToken'),
      short:e.target.short.value,
      long:e.target.long.value
    }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/startCampaign`,required).then((res)=>{
      setPost(false);
    })
  }

  return (
    <div>
      <Navbar name = "Campaign" />
  
      {!post?<div style= {{width:"98vw",display:"flex",justifyContent:"center",padding:"0 0 15vh 0",flexWrap:"wrap",zIndex:2}}>
        {campaignFlag?<div>

          {campaigns.map((campaign,i)=>{
            return(
              <div key={i}>
                <Card sx={{ width:545, maxWidth: 545 ,margin:"2vh 2vw"}} className='surveyCard'>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {campaign.name.slice(0,1)}
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings" onClick={()=>{
                        axios.post(`${process.env.REACT_APP_SERVER_URL}/getUid`,{tok:cookie.get('userAuthToken')}).then(res1=>{
                          if(res1.data.uid === campaign.uid){
                            axios.post(`${process.env.REACT_APP_SERVER_URL}/deleteVotes`,{cid:campaign.cid}).then(res2=>{

                              axios.post(`${process.env.REACT_APP_SERVER_URL}/deleteCampaign`,{cid:campaign.cid}).then((res)=>{
                                if(deleted === true){
                                  setDeleted(false);
                                  if(flag === true){
                                    setFlag(false);
                                  }
                                  else{
                                    setFlag(true);
                                  }
                                }
                                else{
                                  setDeleted(true);
                                  if(flag === true){
                                    setFlag(false);
                                  }
                                  else{
                                    setFlag(true);
                                  }
                                }
                              })
                            })
                          }
                          else{
                            alert("Survey can be only deleted by user who has created it!!!");
                          }
                        })
                      }}>
                        {/* <MoreVertIcon /> */}
                        <DeleteIcon/>
                      </IconButton>
                    }
                    title={campaign.name}
                    subheader={campaign.email}
                  />
                  <CardMedia
                    component="img"
                    height="194"
                    image={image}
                    alt="Paella dish"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {campaign.shortDesc}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <VotingButton campaign = {campaign} flag = {flag} setFlag = {setFlag}/>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph><b>More about Campaign:</b></Typography>
                      <Typography paragraph>
                        {campaign.longDesc}
                      </Typography>
                      
                    </CardContent>
                  </Collapse>
                </Card>
              </div>
            )
          })}
        </div>
        :<p>No Campaigns to display</p>}
        <div style={{position:"fixed",bottom:0,width:"99vw",textAlign:"right",padding:"4vh 2vw",zIndex:1}}>
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
            <form onSubmit = {campaignPostClicked}>
              <h5>Write in short about campaign:</h5>
              <textarea rows={3} cols = {63} id="textArea" name = "short" style={{margin:"0 0 3vh 0",padding:"2vh 1vw"}} required/><br/>
              <h5>Write detailed description about campaign:</h5>
              <textarea rows={5} cols = {63} id="textArea" name = "long" style={{margin:"0 0 3vh 0",padding:"2vh 1vw"}} required/><br/>
              <Button variant="contained" sx = {{margin:"0 2vw 0 0",padding:"10px 20px"}} onClick = {backToCampaign}>Back</Button>
              <Button variant="contained" sx = {{margin:"0 2vw 0 0",padding:"10px 20px"}} type = "survey">Start the Survey</Button>
              
            </form>
          </div>
      </div>
      }
    </div>
  )
}
