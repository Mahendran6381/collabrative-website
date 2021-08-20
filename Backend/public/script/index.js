const loginBtn = document.querySelector(".login-btn")
const signUpbtn = document.querySelector(".Signup-btn") 
const username = document.querySelector(".username")
const passwodr = document.querySelector(".password")
const name = document.querySelector('#var1')
const userName = document.querySelector('#var2')
const form = document.querySelector('#form')

signUpbtn.onclick = (e) =>{
    e.preventDefault()
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
    e.preventDefault()
    axios.post("http://localhost:5000/login",{
        username:username.value,
        password:passwodr.value
    })
    .then(async (res)=>{
        console.log(res)
        if(res.data.auth){
            console.log("Authetication Success")
            name.value = res.data.details.name
            userName.value = res.data.details.username
            form.submit()

        }
    })
    .catch((err)=>{
        if(err) console.log(err)
    })
    e.preventDefault()
}
