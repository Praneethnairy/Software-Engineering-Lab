import React from 'react'
import { useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';
import Cookies from 'universal-cookie'

const cookie = new Cookies();

export default function Buttons(props) {
    const [clicked,setClicked] = useState(false);
    const [b1,setB1] = useState(false);
    const [b2,setB2] = useState(false);
    const [b3,setB3] = useState(false);
    const [b4,setB4] = useState(false);
    const [p1,setP1] = useState(0);
    const [p2,setP2] = useState(0);
    const [p3,setP3] = useState(0);
    const [p4,setP4] = useState(0);
    useEffect(()=>{
      axios.post(`${process.env.REACT_APP_SERVER_URL}/checkSurveyed`,{sid:props.survey.sid,tok:cookie.get('userAuthToken')}).then((res)=>{
        if(res.data.flag === false){
          setClicked(false);
        }
        else{
          axios.post(`${process.env.REACT_APP_SERVER_URL}/getPercentage`,{sid:props.survey.sid}).then((res1)=>{
            setP1(res1.data.opt1);
            setP2(res1.data.opt2);
            setP3(res1.data.opt3);
            setP4(res1.data.opt4);
          })
          setClicked(true);
          if(res.data.details.selectOpt === '1'){
            setB1(true)
          }
          else if(res.data.details.selectOpt === '2'){
            setB2(true)
          }
          else if(res.data.details.selectOpt === '3'){
            setB3(true)
          }
          else if(res.data.details.selectOpt === '4'){
            setB4(true)
          }
        }
      })
    },[clicked,props.survey.sid])
    const clickedOpt1 = () =>{
      const required = {
        sid:props.survey.sid,
        tok:cookie.get('userAuthToken'),
        opt:'1'
      }
      axios.post(`${process.env.REACT_APP_SERVER_URL}/optSelected`,required).then((res)=>{
        setClicked(true); 
        setB1(true);
      })
    }
    const clickedOpt2 = () =>{
      const required = {
        sid:props.survey.sid,
        tok:cookie.get('userAuthToken'),
        opt:'2'
      }
      axios.post(`${process.env.REACT_APP_SERVER_URL}/optSelected`,required).then((res)=>{
        setClicked(true); 
        setB2(true);
      })
    }

    const clickedOpt3 = () =>{
      const required = {
        sid:props.survey.sid,
        tok:cookie.get('userAuthToken'),
        opt:'3'
      }
      axios.post(`${process.env.REACT_APP_SERVER_URL}/optSelected`,required).then((res)=>{
        setClicked(true); 
        setB3(true);
      })
    }
    const clickedOpt4 = () =>{
      const required = {
        sid:props.survey.sid,
        tok:cookie.get('userAuthToken'),
        opt:'4'
      }
      axios.post(`${process.env.REACT_APP_SERVER_URL}/optSelected`,required).then((res)=>{
        setClicked(true); 
        setB4(true);
      })
    }
  return (
    <div>
        {clicked === true ? 
        <div>
  
          <div className="progress" style={{height:"5vh",width : "19vw",margin:"4.2vh 1vw"}}>
            {b1?
            <div className="progress-bar bg-success" role="progressbar" style={{width : `${p1}%`}} aria-valuenow={p1} aria-valuemin="0" aria-valuemax="100">{p1 + '%'}</div>
            :
            <div className="progress-bar bg-warning" role="progressbar" style={{width : `${p1}%`}} aria-valuenow={p1} aria-valuemin="0" aria-valuemax="100">{p1 + '%'}</div>
            }
          </div>
          <div className="progress" style={{height:"5vh",width : "19vw",margin:"4.2vh 1vw"}}>
            {b2?
            <div className="progress-bar bg-success" role="progressbar" style={{width : `${p2}%`}} aria-valuenow={p2} aria-valuemin="0" aria-valuemax="100">{p2 + '%'}</div>
            :
            <div className="progress-bar bg-warning" role="progressbar" style={{width : `${p2}%`}} aria-valuenow={p2} aria-valuemin="0" aria-valuemax="100">{p2 + '%'}</div>
            }
          </div>
          <div className="progress" style={{height:"5vh",width : "19vw",margin:"4.2vh 1vw"}}>
            {b3?
            <div className="progress-bar bg-success" role="progressbar" style={{width : `${p3}%`}} aria-valuenow={p3} aria-valuemin="0" aria-valuemax="100">{p3 + '%'}</div>
            :
            <div className="progress-bar bg-warning" role="progressbar" style={{width : `${p3}%`}} aria-valuenow={p3} aria-valuemin="0" aria-valuemax="100">{p3 + '%'}</div>
            }
          </div>
          <div className="progress" style={{height:"5vh",width : "19vw",margin:"4.2vh 1vw"}}>
            {b4?
            <div className="progress-bar bg-success" role="progressbar" style={{width : `${p4}%`}} aria-valuenow={p4} aria-valuemin="0" aria-valuemax="100">{p4 + '%'}</div>
            :
            <div className="progress-bar bg-warning" role="progressbar" style={{width : `${p4}%`}} aria-valuenow={p4} aria-valuemin="0" aria-valuemax="100">{p4 + '%'}</div>
            }
          </div>
        </div>
        :
        <CardContent>
        <Button variant="outlined" onClick={clickedOpt1} sx = {{width : "19vw",height:"5vh",margin:"2vh 0",padding :"2vh 0"}}>{props.survey.optA}</Button><br/>
        <Button variant="outlined" onClick={clickedOpt2} sx = {{width : "19vw",height:"5vh",margin:"2vh 0",padding :"2vh 0"}}>{props.survey.optB}</Button><br/>
        <Button variant="outlined" onClick={clickedOpt3} sx = {{width : "19vw",height:"5vh",margin:"2vh 0",padding :"2vh 0"}}>{props.survey.optC}</Button><br/>
        <Button variant="outlined" onClick={clickedOpt4} sx = {{width : "19vw",height:"5vh",margin:"2vh 0",padding :"2vh 0"}}>{props.survey.optD}</Button><br/>
        </CardContent>}
    </div>
  )
}
