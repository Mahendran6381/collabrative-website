var messeges = document.querySelector(".messeges");
var submit = document.querySelector(".submit");
var messegeInput = document.querySelector(".messege-input");
var addTask = document.querySelector(".add-task");
var task = document.querySelector(".task");
var todoList = document.querySelector(".todo-list");

socket = io("http://localhost:5000/");

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
  if (todos.length === 0) {
   console.log("NOthi Happed")
  }else{
  todos.forEach((item) => {
    let li = document.createElement("li");
    li.textContent = item.task + "  " + String(item.date);
    todoList.appendChild(li);
  });
  

}
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
};

axios
  .get("/todos")
  .then((res) => {
    addTodo(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
