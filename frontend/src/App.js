
import './App.css';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Survey from './Components/Survey';
import {useEffect,useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import {Navigate} from 'react-router-dom';
import Campaign from './Components/Campaign';

const cookie = new Cookies();
function App() {
  const [user,setUser] = useState();
  useEffect(()=>{
    let token = cookie.get('userAuthToken');
    if(token !== undefined)
      axios.post(`${process.env.REACT_APP_SERVER_URL}/validToken`,{"token":token}).then((res)=>{
        setUser(res.data.user);
      }).catch((err)=>{
        cookie.remove('userAuthToken');
      })
      
  },[])

  function PrivateOutlet(props){
    return cookie.get('userAuthToken')?<props.Page user = {user} setUser = {setUser}/>:<Navigate to = {{'pathname':'/signin'}}/>;
  }

  function PublicOutlet(props){
    return cookie.get('userAuthToken')?<Navigate to = {{'pathname':'/'}}/>:<props.Page />;
  }
  return (
    <div >
      <Router>
        <Routes>
          <Route exact path = "/signin" element = {<PublicOutlet Page = {SignIn}/>}/>
          <Route exact path = "/signup" element = {<PublicOutlet Page = {SignUp}/>}/>
          <Route exact path = "/" element = {<PrivateOutlet Page = {Dashboard}/>}/>
          <Route exact path = "/survey" element = {<PrivateOutlet Page = {Survey}/>}/>
          <Route exact path = "/campaign" element = {<PrivateOutlet Page = {Campaign}/>}/>
        </Routes>
      </Router>
      {/* <SignIn/> */}
      {/* <SignUp/> */}
      
    </div>
  );
}

export default App;
