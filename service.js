var app = require('express');
var server = require('http').createServer(app);
var io= require('socket.io').listen(server);
var socketIds=[];

server.listen(3000);

io.sockets.on("connection",function (socket) {
    socketIds.push(socket);
    console.log("user join, current user number is:===="+socketIds.length);
    socket.on("login",function (data) {
        socket.userName=data.name;
        if(socket.userRoom != data.room){
            //in some room already
            for(var room in socket.rooms){
                socket.leave(room);
            }
            socket.userRoom=data.room;
            socket.join(socket.userRoom);
            console.log(socket.id+"'s name: "+socket.userName+",It's Room: "+socket.userRoom);
        }
        socket.emit("message","你好，我是服务端");
    });

    //talk of room(channel)
    socket.on("broadcastRoom",function (data) {
        var backData={
            name:socket.userName,
            talk:data
        };
        //io.sockets.in(socket.userRoom).emit("talkRoom","["+socket.userName+"]:"+data);
        io.sockets.in(socket.userRoom).emit("talkRoom",backData);
    });

    //talk of everyone(world)
    socket.on("broadcast",function (data) {
        socket.broadcast.emit("broadcast","["+socket.userName+"]:"+data);
    });

    //leave room
    socket.on("leaveRoom",function () {
        for(var room in socket.rooms){
            socket.leave(room);
        }
    });

    //show people from room
    socket.on("peopleInRoom",function(){
        var users=io.sockets.adapter.rooms[socket.userRoom].sockets;
        for(var u in users){
            console.log(u);
        }
    });

    //show all rooms
    socket.on("roomList",function(){
        var rooms=io.sockets.adapter.rooms;
        console.log(rooms);
    });

    //disconnect 客户端退出
    socket.on("disconnect",function (data) {
        var index=socketIds.indexOf(socket);
        if(index>=0){
            socketIds.splice(index,1);
        }
        console.log("a user leave, current user number is:===="+socketIds.length);
    });

    //game control test
    socket.on("control",function (data) {
        console.log("接收参数:"+data);
        //socket.broadcast.emit("control",data);
        socket.broadcast.emit('ListenerMove', { move: data });
    });

    /**
    * 与unity3d通信测试
    * */
    //发送数据
    socket.emit('ClientListener', { hello: 'world' });
    //接收数据
    socket.on('ServerListener', function (data, callback) {
        console.log('ServerListener email:' + data['email']);
        callback({ abc: 123 });
    });
});

console.log('服务器运行于：localhost:3000');

/*
var Socket = require("socket.io");
const SocketServer = function (server) {
    var that=Socket(server);
    that.on("connection",function (socket) {
        //console.log("a user conection");
        socket.on("test",function(data){
            console.log(data);
            socket.emit("test","i'm server");
        });
    });
    return that;
};
module.exports= SocketServer;
*/
