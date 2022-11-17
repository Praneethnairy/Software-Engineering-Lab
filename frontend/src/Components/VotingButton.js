import React from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import IconButton from '@mui/material/IconButton';
import { useState,useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookie = new Cookies();

export default function VotingButton(props) {
    const [Voting,setVoting] = useState('0');
    useEffect(()=>{
        axios.post(`${process.env.REACT_APP_SERVER_URL}/checkVoted`,{cid:props.campaign.cid,tok:cookie.get('userAuthToken')}).then(res=>{
            if(res.data.row.length === 0){
                setVoting('0');
            }
            else{
                setVoting(res.data.row[0].voteType);
            }
        })
    },[Voting,props.flag,props.campaign.cid])
    const UpVote = () =>{
        if(Voting === "1"){
            axios.post(`${process.env.REACT_APP_SERVER_URL}/deleteVoted`,{cid:props.campaign.cid,tok:cookie.get('userAuthToken')}).then(res=>{
                setVoting("0");
                if(props.flag === true){
                    props.setFlag(false);
                }
                else{
                    props.setFlag(true);
                }
            })
        }
        else if(Voting === "2"){
            axios.post(`${process.env.REACT_APP_SERVER_URL}/changeVote`,{cid:props.campaign.cid,tok:cookie.get('userAuthToken'),type:'1'}).then(res=>{
                setVoting("1");
                if(props.flag === true){
                    props.setFlag(false);
                }
                else{
                    props.setFlag(true);
                }
            })
        }
        else{
            axios.post(`${process.env.REACT_APP_SERVER_URL}/votedCampaign`,{cid:props.campaign.cid,tok:cookie.get('userAuthToken'),type:'1'}).then(res=>{
                setVoting("1");
                if(props.flag === true){
                    props.setFlag(false);
                }
                else{
                    props.setFlag(true);
                }
            })
        }

    }

    const DownVote = () =>{
        if(Voting === "2"){
            axios.post(`${process.env.REACT_APP_SERVER_URL}/deleteVoted`,{cid:props.campaign.cid,tok:cookie.get('userAuthToken')}).then(res=>{
                setVoting("0");
                if(props.flag === true){
                    props.setFlag(false);
                }
                else{
                    props.setFlag(true);
                }
            })
        }
        else if(Voting === "1"){
            axios.post(`${process.env.REACT_APP_SERVER_URL}/changeVote`,{cid:props.campaign.cid,tok:cookie.get('userAuthToken'),type:'2'}).then(res=>{
                setVoting("2");
                if(props.flag === true){
                    props.setFlag(false);
                }
                else{
                    props.setFlag(true);
                }
            })
        }
        else{
            axios.post(`${process.env.REACT_APP_SERVER_URL}/votedCampaign`,{cid:props.campaign.cid,tok:cookie.get('userAuthToken'),type:'2'}).then(res=>{
                setVoting("2");
                if(props.flag === true){
                    props.setFlag(false);
                }
                else{
                    props.setFlag(true);
                }
            })
        }
    }

  return (
    <div>
        {Voting === '0'?
        <div>
            <IconButton aria-label="add to favorites" onClick={UpVote}>
                <ArrowUpwardIcon sx = {{display:"inline-block"}}/>
                <p style = {{fontSize:"small",display:"inline-block"}}>{props.campaign.upVoteCount}</p>
            </IconButton>
            <IconButton aria-label="share" onClick = {DownVote}>
                <ArrowDownwardIcon />
                <p style = {{fontSize:"small",display:"inline-block"}}>{props.campaign.downVoteCount}</p>
            </IconButton>
        </div>
        :
        Voting === '1'?
        <div>
            <IconButton aria-label="add to favorites" sx = {{color:"blue"}} onClick={UpVote}>
                <ArrowUpwardIcon sx = {{display:"inline-block"}}/>
                <p style = {{fontSize:"small",display:"inline-block"}}>{props.campaign.upVoteCount}</p>
            </IconButton>
            <IconButton aria-label="share" onClick = {DownVote}>
                <ArrowDownwardIcon />
                <p style = {{fontSize:"small",display:"inline-block"}}>{props.campaign.downVoteCount}</p>
            </IconButton>
        </div>
        :
        <div>
            <IconButton aria-label="add to favorites" onClick={UpVote}>
                <ArrowUpwardIcon sx = {{display:"inline-block"}}/>
                <p style = {{fontSize:"small",display:"inline-block"}}>{props.campaign.upVoteCount}</p>
            </IconButton>
            <IconButton aria-label="share" sx = {{color:"red"}} onClick = {DownVote}>
                <ArrowDownwardIcon />
                <p style = {{fontSize:"small",display:"inline-block"}}>{props.campaign.downVoteCount}</p>
            </IconButton>
        </div>
            
        }
    </div>
  )
}
