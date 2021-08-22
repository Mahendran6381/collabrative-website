import React from "react"
import axios from "axios";
import { useState } from "react";
const Auth = (props) =>{
    const {setAuthStatus,authStatus,username,setUsername} = props;
    const [password, setPassword] = useState("");
    const setPass = (event) => setPassword(event.target.value);
    const setUser = (event) => setUsername(event.target.value);
    //functions
    const SignUp = (e) => {
      e.preventDefault();
      axios
        .post("http://localhost:5000/signup", {
          username: username,
          password: password,
          name: "Tummy",
        })
        .then((res) => {
          console.log(res);
          console.log("SignUp successfull");
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
          password:password
      })
      .then(async (res)=>{
          console.log(res)
          if(res.data.auth){
            console.log("Authetication Success")
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
            <img src="" alt="man.jpg" />
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