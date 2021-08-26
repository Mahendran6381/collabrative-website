import React from "react";
import axios from "axios";
import { useState, useRef } from "react";
import { saveAs } from "file-saver";
import io from "socket.io-client";
import "../styles/style.css";

const Main = (props) => {
  var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  const classList = useRef(null);
  const { username, start, setStart } = props;
  const socket = io("http://localhost:5000/", connectionOptions);
  const [messeges, setMesseges] = useState("");
  const [messege, setMessege] = useState("");
  const [tasks, setTasks] = useState("");
  const [task, setTask] = useState("");
  const [files, setFiles] = useState("");
  const setMes = (event) => setMessege(event.target.value);
  const showFile = (id) => {
    console.log(id);
    axios
      .post("/getfiles", {
        id: id,
      })
      .then((res) => {
        if (res) {
          console.log(res.data);
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          saveAs(blob);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };
  const deleteTask = (date) => {
    console.log(date);
    axios
      .post("/removetask", {
        date: date,
      })
      .then((res) => {
        console.log(res);
        if (res.data.condition) {
          setStart(!start);
          console.log("Removed");
        } else {
          console.log("Problem");
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };
  const addTask = (e) => {
    e.preventDefault();
    axios
      .post("/addtask", {
        task: task,
        date: Date.now(),
      })
      .then((res) => {
        if (res) {
          console.log(res);
          setStart(!start);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  if (start === false) {
    axios
      .get("/getMessege")
      .then(async (res) => {
        console.log(res);
        let messege = res.data.map((item) => {
          return (
            <li className ="messege received">
              <p>{item.username} : {item.messege}{" "}</p>
            </li>
          );
        });
        await setMesseges(messege);
      })
      .catch((err) => {
        console.log(err);
      });
    //   setStart(!start);
    axios
      .get("/todos")
      .then((res) => {
        res = res.data[0];
        let taskJsx = res.map((item) => {
          return (
            <>
              <div className="Task">
              <li>
                {item.task}
              </li>
              <button className="delete" onClick={(e) => deleteTask(item.date)}>
                <i className="fas fa-trash"></i>
              </button>
              </div>
            </>
          );
        });
        setTasks(taskJsx);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get("/files")
      .then((res) => {
        console.log(res.data);
        let filesJsx = res.data.map((item) => {
          return (
            <div
              className={item.filename}
              ref={classList}
              onClick={(e) => showFile(item.filename)}
            >
              {item.originalname}
            </div>
          );
        });
        setFiles(filesJsx);
      })
      .catch((err) => {
        console.log(err);
      });
    setStart(!start);
    console.log("Loading FInished");
  }
  //socket io operation
  //getting messege and update messege show
  socket.on("send", (messege) => {
    setStart(!start);
  });
  //emit the username
  socket.emit("username", username);
  const sendMessege = (e) => {
    e.preventDefault();
    socket.emit("send", messege);
  };
  return (
    <div className="container">
      <div className="members">
        <form action="/upload" method="post" encType="multipart/form-data">
          <input type="file" name="file" />
          <button type="submit">submit</button>
        </form>
        <div className="files">{files}</div>
      </div>
      <div className="messege-pannel">
          <h2>Messeges</h2>
        <ul className ="main">
          {messeges}
           
        </ul>
        <div className="send-messege">
          <input
            type="text"
            className="messege-input"
            value={messege}
            onChange={(e) => setMes(e)}
            name="messege"
          />
          <button
            className="submit"
            type="submit"
            onClick={(e) => sendMessege(e)}
          >
            send
          </button>
        </div>
      </div>
      <div className="todo">
        <div className="add-tas">
          <input
            className="task"
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button className="add-task" onClick={(e) => addTask(e)}>
            <i className="fas fa-plus" />
          </button>
        </div>
        <ul className="todo-list">
          {tasks}
          {/* <button type="submit" class="delete" style="display: none;"></button> */}
        </ul>
      </div>
    </div>
    
  );
};

export default Main;
