var Kinect2 = require('kinect2'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    path = require('path');
var bodyParser=require('body-parser');

var kinect = new Kinect2();
// 打开kinect
if(kinect.open()) {
    // 监听8000端口
    server.listen(8000);
    // 指定请求指向根目录
    // app.get('/', function(req, res) {
    //     res.sendFile(__dirname + '/public/index.html');
    // });
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/three-tween.html');
    });

    //将骨骼数据发送给浏览器端————只读取身体数据
    kinect.on('bodyFrame', function(bodyFrame){
        io.sockets.emit('bodyFrame', bodyFrame);
        console.log(bodyFrame);
    });

    //开始读取骨骼数据
    kinect.openBodyReader();

    /*读取所有数据
    kinect.on('multiSourceFrame',function (Frame) {
        console.log(Frame);
    });
    //开始读取所有。这里参数里设置了读取body和color的数据，需要别的可以添加
    kinect.openMultiSourceReader({
        frameTypes: Kinect2.FrameType.body | Kinect2.FrameType.color
    });*/
}


//测试数据接口
app.use(bodyParser.urlencoded({extended:true}));
app.all('*',function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
var data={
    status:200,
    data:[{id:1,imgPath:'public/img',videoPath:'public/video',desc:'测试数据1',datetime:'20190307'},
        {id:2,imgPath:'public/img',videoPath:'public/video',desc:'测试数据2',datetime:'20190307'},
        {id:3,imgPath:'public/img',videoPath:'public/video',desc:'测试数据1',datetime:'20190307'},
        {id:4,imgPath:'public/img',videoPath:'public/video',desc:'测试数据2',datetime:'20190307'},
        {id:5,imgPath:'public/img',videoPath:'public/video',desc:'测试数据1',datetime:'20190307'},
        {id:6,imgPath:'public/img',videoPath:'public/video',desc:'测试数据2',datetime:'20190307'},
        {id:7,imgPath:'public/img',videoPath:'public/video',desc:'测试数据1',datetime:'20190307'},
        {id:8,imgPath:'public/img',videoPath:'public/video',desc:'测试数据2',datetime:'20190307'},
        {id:9,imgPath:'public/img',videoPath:'public/video',desc:'测试数据1',datetime:'20190307'},
        {id:10,imgPath:'public/img',videoPath:'public/video',desc:'测试数据2',datetime:'20190307'},
        {id:12,imgPath:'public/img',videoPath:'public/video',desc:'测试数据1',datetime:'20190307'},
        {id:13,imgPath:'public/img',videoPath:'public/video',desc:'测试数据2',datetime:'20190307'},
        {id:14,imgPath:'public/img',videoPath:'public/video',desc:'测试数据1',datetime:'20190307'},
        {id:15,imgPath:'public/img',videoPath:'public/video',desc:'测试数据2',datetime:'20190307'},
        {id:16,imgPath:'public/img',videoPath:'public/video',desc:'测试数据1',datetime:'20190307'},
        {id:17,imgPath:'public/img',videoPath:'public/video',desc:'测试数据2',datetime:'20190307'},
        {id:18,imgPath:'public/img',videoPath:'public/video',desc:'测试数据1',datetime:'20190307'},
        {id:19,imgPath:'public/img',videoPath:'public/video',desc:'测试数据2',datetime:'20190307'},
        {id:20,imgPath:'public/img',videoPath:'public/video',desc:'测试数据1',datetime:'20190307'},
        {id:21,imgPath:'public/img',videoPath:'public/video',desc:'测试数据2',datetime:'20190307'}]
};

app.get('/dd',function(req,res){
    res.status(200),
    res.json(data);
});
