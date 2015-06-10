var WebSocketServer = require('ws').Server;

module.exports = function(app, options) {
  var sockets = new WebSocketServer({
    server: options.httpServer,
    path: '/api'
  });

  sockets.on('connection', function(ws) {
    var id = setInterval(function() {
    ws.send(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
    }, 100);
    console.log('started client interval');
    ws.on('close', function() {
      console.log('stopping client interval');
      clearInterval(id);
    });
  });

  // sockets.on('connection', function(socket) {
  //   socket.on('open', function() {});
  //   socket.on('close', function() {});
  //   socket.on('error', function() {});
  //   socket.on('message', function() {});
  // });

  // var sockets = new WebSocketServer({
  //   autoAcceptConnections: false,
  //   httpServer: options.httpServer,
  //   path: '/api'
  // });

  // sockets.on('request', onRequest);
};

// shared stuff

// var CHANNELS = { };

// function onRequest(socket) {
//     var origin = socket.origin + socket.resource;

//     var websocket = socket.accept(null, origin);

//     websocket.on('message', function(message) {
//         if (message.type === 'utf8') {
//             onMessage(JSON.parse(message.utf8Data), websocket);
//         }
//     });

//     websocket.on('close', function() {
//         truncateChannels(websocket);
//     });
// }

// function onMessage(message, websocket) {
//     if (message.checkPresence)
//         checkPresence(message, websocket);
//     else if (message.open)
//         onOpen(message, websocket);
//     else
//         sendMessage(message, websocket);
// }

// function onOpen(message, websocket) {
//     var channel = CHANNELS[message.channel];

//     if (channel)
//         CHANNELS[message.channel][channel.length] = websocket;
//     else
//         CHANNELS[message.channel] = [websocket];
// }

// function sendMessage(message, websocket) {
//     message.data = JSON.stringify(message.data);
//     var channel = CHANNELS[message.channel];
//     if (!channel) {
//         console.error('no such channel exists');
//         return;
//     }

//     for (var i = 0; i < channel.length; i++) {
//         if (channel[i] && channel[i] != websocket) {
//             try {
//                 channel[i].sendUTF(message.data);
//             } catch(e) {
//             }
//         }
//     }
// }

// function checkPresence(message, websocket) {
//     websocket.sendUTF(JSON.stringify({
//         isChannelPresent: !!CHANNELS[message.channel]
//     }));
// }

// function swapArray(arr) {
//     var swapped = [],
//         length = arr.length;
//     for (var i = 0; i < length; i++) {
//         if (arr[i])
//             swapped[swapped.length] = arr[i];
//     }
//     return swapped;
// }

// function truncateChannels(websocket) {
//     for (var channel in CHANNELS) {
//         var _channel = CHANNELS[channel];
//         for (var i = 0; i < _channel.length; i++) {
//             if (_channel[i] == websocket)
//                 delete _channel[i];
//         }
//         CHANNELS[channel] = swapArray(_channel);
//         if (CHANNELS && CHANNELS[channel] && !CHANNELS[channel].length)
//             delete CHANNELS[channel];
//     }
// }
