const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const users = {};

wss.on('connection', function connection(ws) {  

  ws.on('message', function incoming(message) {
    // Broadcast incoming messages to all clients
    console.log('hey');
    const data = JSON.parse(message);
    if (data.type === 'userJoin') {
      // Handle the 'join' message from the client
      console.log(data.username + data.message);
      // Notify other clients about the new user
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'userJoin', username: data.username, message: data.message }));
        }
      });
    }
    else if(data.type === 'userMessage'){
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {  
          client.send(JSON.stringify({ type: 'userMessage', username: data.username, message: data.message.toString('ascii') })); //  message.toString('ascii') 
        }
      });
    }
    else{  
      console.log(data.username + data.message);
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'userLeave', username: data.username, message: data.message }));
        }
      });
    }
   
  });

 // ws.on('close', function close(message) {
    // Notify all connected clients about the user who left

 //   wss.clients.forEach(function each(client) {
 //     if (client !== ws && client.readyState === WebSocket.OPEN) {
 //       client.send(JSON.stringify({ type: 'userLeave', username: 'User123', message: ' left the chat' }));
 //     }
 //   });
 // });



});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
server.listen(3000, function() {
  console.log('Server is listening on port 3000');
});