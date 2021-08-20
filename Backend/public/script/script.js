var messeges = document.querySelector(".messeges");
var submit = document.querySelector(".submit");
var messegeInput = document.querySelector(".messege-input");
var addTask = document.querySelector(".add-task");
var task = document.querySelector(".task");
var todoList = document.querySelector('.todo-list')
const files = document.querySelector('.files')

socket = io("http://localhost:5000/");
let tasklist = null

axios.get("/username").then(async (res) => {
  console.log(res);
  socket.emit("username", res.data.username);
});
socket.on("send", (messege) => {
  const li = document.createElement("li");
  li.textContent = messege;
  messeges.appendChild(li);
});
submit.onclick = (e) => {
  console.log("HI");
  e.preventDefault();
  const val = messegeInput.value;
  socket.emit("send", val);
};
const addTodo = (todos) => {
    todos = todos[0]
    tasklist = todos
    todoList.innerHTML = ''
  todos.forEach((item) => {
    let li = document.createElement("li");
    li.textContent = item.task + "  " + String(item.date);
    li.innerHTML = `${item.task + "  " + String(item.date)} <button class = "delete"><i class="fas fa-trash"></i></button>`
    todoList.appendChild(li);
  });
  deleteTask()

  
};
addTask.onclick = (e) => {
  e.preventDefault();
  axios
    .post("/addtask", {
      task: task.value,
      date: Date.now(),
    })
    .then((res) => {
      if (res) {
        console.log(res);
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
    getData()
};

const getData = () =>{
  axios
  .get("/todos")
  .then((res) => {
    addTodo(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
}
getData()


const getFiles = () =>{
   files.innerHTML = ""
    axios.get('/files')
    .then((res)=>{
      console.log(res.data)
      res.data.forEach((item)=>{
         let div =  document.createElement('div')
         div.classList.add(String(item.filename))
         div.textContent = item.originalname
         files.appendChild(div)

      })
      showFile()
    })
    .catch((err)=>{
      console.log
    })
}

getFiles()
const showFile = () =>{
  console.log("showfile funciion")
  const file = files.children
  console.log(file)
  Array.prototype.forEach.call(file,item=>{
      console.log("HI")
       item.onclick = (e) =>{
         e.preventDefault();
         let id = item.classList[0]
         console.log(id)
         axios.post("/getfiles",{
           id:id
         })
         .then((res)=>{
           if(res){
             console.log(res.data)
             let blob = new Blob([res.data],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"})
             saveAs(blob)
             getFiles()
           }
         })
         .catch((err)=>{
           if(err){
             console.log(err)
           }
         })
       }
  })
 

}



const deleteTask = () =>{
  const data = Array(todoList.children)
  console.log(data)
  Array.prototype.forEach.call(data[0],item=>{
    console.log(item.children[0])
    item.children[0].onclick = (e) =>{
          e.preventDefault();
          console.log(item.textContent)
          let strArr = String(item.textContent).split(" ")
          console.log(strArr[strArr.length-2],strArr)
          axios.post("/removetask",{
            date:strArr[strArr.length-2]
          })
          .then((res)=>{
            console.log(res)
            if(res.data.condition){
                getData()
                console.log("Removed")
            }else{
              console.log("Problem")
            }
          })
          .catch((err)=>{
            if(err){
              console.log(err)
            }
          })
    }
  })
 
 }
 
window.onload = (e) =>{
 deleteTask()

}
 