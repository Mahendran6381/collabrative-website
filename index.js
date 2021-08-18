const loginBtn = document.querySelector(".login-btn")
const signUpbtn = document.querySelector(".Signup-btn") 
const username = document.querySelector(".username")
const passwodr = document.querySelector(".password")

signUpbtn.onclick = (e) =>{
    e.preventDefault();
   axios.post("http://localhost:5000/signup",{
    username:username.value,
    password:passwodr.value,
    name:"Tummy"
   })
   .then((res)=>{
       console.log(res)
       console.log("SignUp successfull")
   })
   .catch((err)=>{
       if(err) {
           console.log(err)
       }
   })
}

loginBtn.onclick = (e) =>{
    e.preventDefault();
    axios.post("http://localhost:5000/login",{
        username:username.value,
        password:passwodr.value
    })
    .then((res)=>{
        console.log(res)
        console.log("Login Succesfull")
    })
    .catch((err)=>{
        if(err) console.log(err)
    })
}
