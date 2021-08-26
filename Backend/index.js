const bcrypt = require("bcryptjs");
const fs = require('fs')
const path = require('path')
const {
  GridFsStorage
} = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodoverride = require('method-override')
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv").config();
const multer = require('multer');
const bodyParser = require("body-parser");
const storeFileSchema = require('./models/fileSchema')
const UserSchema = require("./models/mongoose");
const TodoSchema = require("./models/todoSchema");
const {
  json
} = require("body-parser");
const crypto = require('crypto')
const ejs = require("ejs");
const app = express();
const ChatSchema = require("./models/messegeSchema");
//server connection
app.use(methodoverride('__method'))
var http = require("http").Server(app);
var {
  https
} = require("follow-redirects");
const cors = require('cors')
const io = require("socket.io")(http);
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
const conn = mongoose.createConnection(URI)
mongoose.connect(
  URI, {
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
const UserDetails = {
  username: ""
};
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
  UserSchema.findOne({
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
app.get("/getMessege",(req,res)=>{
  console.log("Hi")
  let messeges = []
  ChatSchema.find({},(err,docs)=>{
    if(!err){
      docs.forEach((item)=>{
        let messege = {
          username:item.username,
          messege:item.messege
        }
        messeges.push(messege)
      })
      res.send(messeges)
    }else{
      console.log(err)
      res.status(400).json({
        error:err
      })
    }
  })
})


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
app.get("/todos", (req, res) => {
  TodoSchema.find({}, (err, docs) => {
    if (!err) {
      console.log(docs);
      console.log("Success");
      res.json([docs]);
    } else {
      throw err;
    }
  });
});
app.post("/removetask", (req, res) => {
  let taskDate = req.body.date;
  console.log(taskDate)
  TodoSchema.deleteOne({date:taskDate},(err)=>{
    if(err){
      console.log(err)
      res.json({
        condition:false
      })
    }else{
    res.json({ 
        condition:true
    })
  }
})
});
const storefile = (originalname, filename) => {
  console.log("Storeing")
  const StoreFile = new storeFileSchema({
    originalname: originalname,
    filename: filename
  })
  StoreFile.save()
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      if (err) {
        console.log(err)
      }
    })

}


let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads')
})
var storage = new GridFsStorage({
  url: URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        storefile(file.originalname, filename)
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

app.get("/files", (req, res) => {
  let files = []
  storeFileSchema.find({}, (err, docs) => {
    if (!err) {
      console.log("Retrived Data")
      docs.forEach((item) => {
        let doc = {
          originalname: item.originalname,
          filename: item.filename
        }
        console.log(doc)
        files.push(doc)
        console.log(files)
      })
      console.log(files, "files")
      res.json(files)
    } else {
      console.log(err)
      res.status(400).send("File Nt found")
    }
  })


})



const upload = multer({
  storage
});
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    file: req.file
  })
})
app.post('/getfiles', (req, res) => {
  console.log(req.body)
  gfs.files.findOne({
    filename: req.body.id
  }, (err, file) => {
    if (err) {
      res.status(400).send("Proplem in retriveing in data")
    }
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  })
})
app.get("/", (req, res) => {
  res.render("index.html");
});

http.listen(5000);