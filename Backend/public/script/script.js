var messeges = document.querySelector(".messeges")
var submit = document.querySelector(".submit")
var messegeInput = document.querySelector(".messege-input")

socket = io('http://localhost:5000/')

socket.emit("username","mahendra")


socket.on('send',(messege)=>{
    const li = document.createElement('li')
    li.textContent = messege
    messeges.appendChild(li)
})
submit.onclick = (e)=>{
    console.log("HI")
    e.preventDefault();
    const val = messegeInput.value
    socket.emit('send',val)
}