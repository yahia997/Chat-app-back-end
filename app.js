const express = require('express');
const app = express();
const http = require('http');
const path = require("path");
const compression = require('compression');
const mongoose = require('mongoose');
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use(compression());
app.use(express.json());

const { Messages } = require('./db');

app.get("/all", (req, res) => {
  Messages.find()
    .sort({ _id: -1 })
    .limit(30)
    .then(messages => res.json(messages.reverse()))
    .catch(err => res.status(400).json(`error: ${err}`));   
});

app.post("/add", (req, res) => {
  const { name, text, date, colour} = req.body;

  const newMessage = new Messages({
    name,
    text,
    date,
    colour
  });

  newMessage.save()
    .then(() => res.send("new message added !"))
    .catch(err => res.status(400).json(`error: ${err}`));
});

app.use(express.static(path.resolve(__dirname, './build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

const io = require('socket.io')(server, {
  cors: {origin: "*"}
});


io.on('connection', (socket) => {
  socket.on('send-nickname', (nickname) => {
    socket.nickname = nickname;
    
    io.emit('message', `${socket.nickname} has joined the server www@$WWW_gtav5532759`);
  });

  socket.on('message', (message) => {
    io.emit('message', `${socket.nickname} => ${message}`);
  });

  socket.on('disconnect', (reason) => {
    if (socket.nickname) {
      io.emit('message', `${socket.nickname} has leaved the server www@$WWW_gtav5532759`);
    }
  });
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('database connected successfully');
});

const uri = "mongodb+srv://js-war:wwwWWW@cluster0.c1uv8.mongodb.net/chat-app?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });


server.listen(PORT, () => {
  console.log(`app is listening on port ${PORT} ...`);
});