import React from "react"
import axios from "axios";
import { useState } from "react";
import loginImage from "../image/3545760.jpg" 
import "../styles/style-main.css";
const Auth = (props) =>{
    const {setAuthStatus,authStatus,username,setUsername} = props;
    const [password, setPassword] = useState("");
    const [code,setCode] = useState("")
    const setPass = (event) => setPassword(event.target.value);
    const setUser = (event) => setUsername(event.target.value);
    const setGRPCode = (event) => setCode(event.target.value);
    //functions
    const SignUp = (e) => {
      e.preventDefault();
      axios
        .post("http://localhost:5000/signup", {
          username: username,
          password: password,
          name: "Tummy",
          code:code
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    };
    const Login = (e) =>{
      e.preventDefault()
      axios.post("http://localhost:5000/login",{
          username:username,
          password:password,
          code:code
      })
      .then(async (res)=>{
          console.log(res)
          if(res.data.auth){
            setAuthStatus(!authStatus)
          }
      })
      .catch((err)=>{
          if(err) console.log(err) 
      })
      e.preventDefault()
    }
    return (
      <div>
        <div className="container">
          <div className="image">
            <img src={loginImage}  alt="man.jpg" />
          </div>
          <div className="login">
            <div className="panel">
              <form>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  className="username"
                  value={username}
                  onChange={(e) => setUser(e)}
                />
                 <label htmlFor="username">Code</label>
                <input
                  type="text"
                  name="grpcode"
                  className="username"
                  value={code}
                  onChange={(e) => setGRPCode(e)}
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="password"
                  value={password}
                  onChange={(e) => setPass(e)}
                />
                <div className="bottons">
                  <button type="submit" className="login-btn" onClick = {(e)=>Login(e)}>
                    Login
                  </button>
                  <button type="submit" className="Signup-btn" onClick = {(e)=>SignUp(e)}>
                    SignUp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}
export default Auth