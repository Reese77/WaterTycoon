
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

console.log('Server has started')

var socket = require('socket.io');
var io = socket(server);

var scoreBoard = new Map();
var scores = [];


function newConnection(socket){
  //everyone joins the lobby to begin with
  socket.on('score', updateScoreboard);
  
  function updateScoreboard(input){
    let time = input.time[0]*180000 + input.time[1]*7500 + input.time[2]*125;
    while (scores.includes(time)){
      time++;
    }
    scores.push(time);
    scoreBoard.set(time, input.userName);
    scores.sort(function(a, b){return b-a});
    for(let i=10; i<scores.length; i++){
      scoreBoard.delete(scores[i]);
    }
    if(scores.length > 10){
      scores.splice(10, scores.length-10);
    }
    let arr = [];
    for(let i=0; i<scores.length; i++){
      arr.push([]);
      arr[i].push(scoreBoard.get(scores[i]));
      arr[i].push(scores[i]);
    }
    console.log(arr);
    io.emit('scoreBoard', arr);
  }

}

io.sockets.on('connection', newConnection);


