const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const UserSchema = require("./models/mongoose");
const TodoSchema = require("./models/todoSchema");
const { json } = require("body-parser");
const cors = require("cors");
const ejs = require("ejs");
const app = express();
const ChatSchema = require("./models/messegeSchema");
//server connection
var http = require("http").Server(app);
var { https } = require("follow-redirects");
const io = require("socket.io")(http);
dotenv.config();
const URI = process.env.URI;
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
//connecting to the database
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Database Connected");
    }
  }
);
//save the user info in the mongodb database
const UserDetails = { username: "" };
const SaveInDatabase = (username, name, password) => {
  const NewUser = new UserSchema({
    username: username,
    name: name,
    password: password,
  });

  NewUser.save()
    .then((doc) => {
      console.log(doc);
      return true;
    })
    .catch((err) => {
      console.log(err);
    });
};
app.post("/main", (req, res) => {
  console.log(req.body);
  UserDetails.username = req.body.username;
  res.render("index.ejs");
});
//get  for /login
app.post("/login", (req, res) => {
  console.log("Login");
  username = req.body.username;
  password = req.body.password;
  UserSchema.findOne(
    {
      username: username,
    },
    (err, Users) => {
      if (err) console.log(err);
      else {
        //if username is not null we have to compare the hashed password and the user password
        bcrypt.compare(password, Users.password, (err, result) => {
          console.log(result);
          console.log(password);
          console.log(Users.password);
          console.log(Users);
          if (err) console.log(err);
          else {
            if (result == true) {
              UserDetails.username = username;
              console.log("User Authenticated");
              res.json({
                auth: true,
                details: Users,
              });
            } else {
              console.log("Authetication Fail");
              res.send("user Not found");
            }
          }
        });
      }
    }
  );
});
app.get("/username", (req, res) => {
  res.json(UserDetails);
  console.log("UserDetails Sended");
});

//post for /signup
app.post("/signup", (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const passwod = req.body.password;
  console.log(username, name, passwod);
  if (username != null && passwod != null) {
    bcrypt.genSalt(10, (salterr, salt) => {
      if (salterr) console.log(salterr);
      else {
        bcrypt.hash(passwod, salt, (err, hash) => {
          if (err) console.log(err);
          else {
            SaveInDatabase(username, name, hash);
            res.send("Done");
          }
        });
      }
    });
  } else {
    res.send("Proplem With User Input");
  }
});

io.on("connection", (socket) => {
  socket.on("username", (user) => {
    socket.username = user;
  });
  socket.on("send", (messege) => {
    let userChat = new ChatSchema({
      username: socket.username,
      messege: messege,
    });
    userChat
      .save()
      .then((doc) => {
        if (doc) {
          console.log(doc);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
    io.emit("send", socket.username + " : " + messege);
  });
});
app.post("/addtask", (req, res) => {
  task = req.body.task;
  date = req.body.date;
  const newTask = new TodoSchema({
    task: task,
    date: date,
  });
  newTask
    .save()
    .then((doc) => {
      if (doc) {
        console.log(doc);
        res.send(doc);
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
});
app.get('/todos',(req,res)=>{
  TodoSchema.find({},(err,docs)=>{
    if(!err){
      console.log(docs)
      console.log("Success")
      res.json([docs])
    }
    else{
      throw err
    }
  })


})
app.get("/", (req, res) => {
  res.render("index.html");
});

http.listen(5000);
