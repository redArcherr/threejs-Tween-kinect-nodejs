var camera,scene,renderer,controls,mouseX,mouseY,styFps;
var table;//数据
var objects = [];//用于遍历数据后创建对象存放列表
var targets = { table: [], leave: [], fly: [], grid: [] };//动画记录位置的列表（飞入，离开，环，网格）
init();
animate();

//初始化
function init() {
    //相机
    camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,1,10000);
    camera.position.z=3000;

    //场景
    scene = new THREE.Scene();

    //渲染器
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.backgroundColor='#000';
    document.getElementById('container').appendChild( renderer.domElement );

    //控制器（场景缩放旋转等）
    // controls = new THREE.TrackballControls( camera, renderer.domElement );
    // controls.rotateSpeed = 0.5;
    // controls.minDistance = 500;
    // controls.maxDistance = 6000;
    // controls.addEventListener( 'change', render );

    //灯光
    scene.add(new THREE.AmbientLight(0x0c0c0c));
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-100, -100, -100);
    var spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(100, 100, 100);
    scene.add(spotLight);
    scene.add(spotLight2);

    itemInitData();//初始化内容

    styFps = initStats(); //初始化fps

    window.addEventListener( 'resize', onWindowResize, false );
}

//整体动画
function transform( targets, duration ) {
    TWEEN.removeAll();
    for(var i=0;i<objects.length;i++){
        var object = objects[i];
        var target = targets[i];
        new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();
        new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Circular.Out )
            .start();
    }

    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( render )
        .start();
}
//局部动画
function anim( target, duration ,pos,type) {
    //TWEEN.removeAll();
    var object = target;
    //console.log(object.state);
    switch (type){
        case 'leave':
                new TWEEN.Tween( object.position )
                    .to( pos,  duration )
                    .easing( TWEEN.Easing.Cubic.Out )
                    .start().onComplete(function (obj) {
                        object.state = "on";
                });

            break;
        case 'back':
                new TWEEN.Tween( object.position )
                    .to( pos,  duration )
                    .easing( TWEEN.Easing.Quadratic.Out )
                    .start().onComplete(function (obj) {
                        object.state = "off";
                });
            break;
        default:
            break;
    }

    new TWEEN.Tween( this )
        .to( {}, duration )
        .onUpdate( render )
        .start();
}

/* 调试插件 */
function initStats() {
    var stats = new Stats();
    //设置统计模式
    stats.setMode(0); // 0: fps, 1: ms
    //统计信息显示在左上角
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    //将统计对象添加到对应的<div>元素中
    document.getElementById("Stats-output").appendChild(stats.domElement);
    return stats;
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}
function animate() {
    styFps.update();
    requestAnimationFrame( animate );
    TWEEN.update();
}
function render() {
    renderer.render( scene, camera );
}

//物体创建及初始化
function itemInitData() {
    for (var i=0;i<112;i++){
        var element = document.createElement( 'div' );
        element.className = 'player';
        element.style.backgroundColor = 'rgba(139,'+Math.random() * 200+','+Math.random() * 100+'1)';
        element.style.transformOrigin = 'center center';
        //新建对象的-------起始点
        var object = new THREE.CSS3DObject( element );
        var count;//计算每行从左飞入还是从右飞入
        (parseInt(i/16)%2)==0?count=1:count=-1;
        object.position.x = ((i+1)*4500 - 2000)*count;
        object.position.y = 950;
        object.position.z = 0;
        object.rotation.y = 20;
        scene.add( object );
        objects.push( object );

        //遍历对象位置存进位置列表-------目标点
        var object = new THREE.Object3D();
        object.position.x = ( i%16 * 240 )-1700;
        object.position.y = 950-( parseInt(i/16)*280 );
        targets.table.push( object );
    }

    //离开效果---leave
    for(var i=0;i<objects.length;i++){
        var object = new THREE.Object3D();
        var count;
        (parseInt(i/16)%2)==0?count=1:count=-1;
        object.position.x = ((i+1)*4500 - 2000)*count;
        object.position.y = 950;
        object.position.z = 0;
        object.rotation.y = 20;
        targets.leave.push(object);
    }

    //离开效果---fly
    for(var i=0;i<objects.length;i++){
        var object = new THREE.Object3D();
        object.position.x = 3000;
        object.position.y = 3000;
        object.position.z = ( Math.floor( i / 30 ) ) * 1000 - 2000;
        object.rotation.y = 20;
        targets.fly.push(object);
    }

    transform( targets.table, 2000 );

    var button = document.getElementById( 'table' );
    button.addEventListener( 'click', function () {
        transform( targets.table, 2000 );
    }, false );

    var button = document.getElementById( 'leave' );
    button.addEventListener( 'click', function () {
        transform( targets.leave, 5000 );
    }, false );

    var button = document.getElementById( 'fly' );
    button.addEventListener( 'click', function () {
        transform( targets.fly, 4000 );
    }, false );

    //document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

//鼠标测试
function onDocumentMouseMove( event ) {
     var div = document.getElementById('ui_button');
     mouseX = ( event.clientX);
     mouseY = ( event.clientY);
    // div.style.left = mouseX-75+'px';
    // div.style.top = mouseY-75+'px';
    //div.style.top = window.innerHeight/2+'px';

    var playerDom = document.getElementsByClassName('player');

    //debug
    var spanlist = document.getElementsByTagName('span');
    spanlist[0].innerHTML=mouseX;
    spanlist[1].innerHTML=mouseY;
    spanlist[2].innerHTML=parseInt(playerDom[0].getBoundingClientRect().left);
    spanlist[3].innerHTML=parseInt(playerDom[0].getBoundingClientRect().top);
    spanlist[4].innerHTML=mouseX-parseInt(playerDom[0].getBoundingClientRect().left);
    spanlist[5].innerHTML=mouseY-parseInt(playerDom[0].getBoundingClientRect().top);

    //jqery的遍历数组
    $(".player").each(function (i,val) {
        var dom = playerDom[i];
        var domleft = dom.getBoundingClientRect().left;
        var domtop = dom.getBoundingClientRect().top;
        if(mouseX-domleft<140 && mouseX-domleft>-50 && mouseY-domtop<140 && mouseY-domtop>-60){
            var pos = {x:0,y:0,z:0};
            mouseX-domleft < 0 ? pos.x = objects[i].position.x + 150 : pos.x = objects[i].position.x - 150;
            mouseY-domtop < 0 ? pos.y = objects[i].position.y - 160 : pos.y = objects[i].position.y + 160;
            anim(objects[i],200,pos,'leave');
        }else if(objects[i].state=='on'){
            if(mouseX-domleft>180 || mouseX-domleft<-80){
                if(objects[i].position != targets.table[i].position){
                    anim(objects[i],150,targets.table[i].position,'back');
                }
            }
        }
    });

}

//数据请求及执行初始化
function getmyData() {
    $.ajax({
        url: "/dd",//请求php文件的路径
        dataType: "json",//请求数据类型JSON
        type: "get",//请求发方式get
        async:false,
        success: function(json) {
            result = json.data;//j将请求到的数据返回给result
            table=result;
            console.log(table);
            if (table.length>0){
                init();
                animate();
            }
        }
    });
}

//getmyData();

//kinect部分
var socket = io.connect('/');
var uiButton = document.getElementById('ui_button');
socket.on('bodyFrame', function(bodyFrame){
    var index = 0;
    // 遍历所有骨骼数据

    bodyFrame.bodies.forEach(function(body){
        if(body.tracked) {
            for(var jointType in body.joints) {
                var joint = body.joints[jointType];
                // 如果骨骼节点为脊椎中点
                if(jointType == 1) {
                    uiButton.style.left=joint.depthX * window.innerWidth+'px';
                    mouseX=joint.depthX * window.innerWidth;
                    mouseY=window.innerHeight/2;
                    console.log("X:"+mouseX+"Y:"+mouseY);
                    var playerDom = document.getElementsByClassName('player');
                    $(".player").each(function (i,val) {
                        var dom = playerDom[i];
                        var domleft = dom.getBoundingClientRect().left;
                        var domtop = dom.getBoundingClientRect().top;
                        if(mouseX-domleft<140 && mouseX-domleft>-50 && mouseY-domtop<140 && mouseY-domtop>-60){
                            var pos = {x:0,y:0,z:0};
                            mouseX-domleft < 0 ? pos.x = objects[i].position.x + 150 : pos.x = objects[i].position.x - 150;
                            mouseY-domtop < 0 ? pos.y = objects[i].position.y - 160 : pos.y = objects[i].position.y + 160;
                            anim(objects[i],200,pos,'leave');
                        }else if(objects[i].state=='on'){
                            if(mouseX-domleft>180 || mouseX-domleft<-80){
                                if(objects[i].position != targets.table[i].position){
                                    anim(objects[i],150,targets.table[i].position,'back');
                                }
                            }
                        }
                    });
                }
            }
            // 识别左右手手势
            index++;
        }
    });
});
