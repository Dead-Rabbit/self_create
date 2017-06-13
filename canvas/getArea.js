var doDraw = new drawCanvas("canvas");
function xiao_loadImg(url){
    doDraw.setBackground(url);
}
var selectedArea = -1;
function xiao_beginStatus(){
    doDraw.changeStatus(1);
}
function xiao_endStatus(){
    doDraw.changeStatus(0);
    doDraw.tempPoints = [];
}
function xiao_finishDraw(){
    var number_title = document.getElementById("create_number_title");
    if(number_title.value <= 0) {
        alert("您还没对划区进行编号");
        return ;
    };
    if(doDraw.tempPoints.length <= 2) {
        alert("划区失败：选点数小于三");
        return ;
    };
    if(doDraw.checkAreaIfExis(number_title.value)){
        alert("编号已存在");
        return ;
    }
    doDraw.finishDrawLine(number_title.value);
    // 清空
    number_title.value = 0;
}
function xiao_deleteArea(){
    var number_title = document.getElementById("delete_number_title");
    if(number_title.value <= 0) {
        alert("您还没输入所删除选区的编号");
        return ;
    };
    doDraw.deleteArea(number_title.value);
}
function xiao_getAllAreas(){
    console.log(doDraw.getAllArea());
}
function drawCanvas(canvasId){
	// canvas base
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.cricleRadius = 10;
	this.alph = '0.5';

	this.strokeStyle = 'black';
	// 填充颜色
	this.fillStyle = ['124,183,247','254,95,140','236,231,88','178,88,236'];

	// canvas background url
	this.backgroundUrl = "";

	//  store all exist points(id and points{x,y})
	this.areas = [];

	//temp points for people draw areas
	this.tempPoints = [];
	this.mousePoint = {x:0,y:0};

	//module 
	// 0 is show (cannot do draw donnot show lines)
	// 1 is drawing(draw and line to mouse point)
	// 2 is finish draw waiting for upload(cannot draw show lines)
	this.canvasStatus = 0;

	this.canvas.onmousedown = function(e){
		var point = {
			x:this.getMousePosition(e).x,
			y:this.getMousePosition(e).y
		}
		if(this.canvasStatus==1){
			if(this.compareFirstWithPoint(point)){//如果当前点在初始点圆圈之内则完成draw
				this.addFirstToTemp();
				this.canvasStatus=2;
			}else{
				this.addTempPoint(point);
			}
		}else if(this.canvasStatus==2){

		}else if(this.canvasStatus==0){

		}
	}.bind(this);
	this.canvas.onmousemove = function(e){
		if(this.canvasStatus==1){
			var point = {
				x:this.getMousePosition(e).x,
				y:this.getMousePosition(e).y
			}
			this.mousePoint = point;
		}
		this.run();
	}.bind(this);
}
drawCanvas.prototype.changeStatus = function(args) {
	this.canvasStatus = args;
	this.run();
};
// 运行时调用
drawCanvas.prototype.run = function() {
	this.context.clearRect(0,0,this.width,this.height);
	this.drawBackground();

	this.drawAllArea();
	if(this.canvasStatus == 1){
		this.drawLine();
	}else if(this.canvasStatus == 2){
		this.drawLine();
	}
};

drawCanvas.prototype.addTempPoint = function(point) {
	this.tempPoints.push(point);
};
drawCanvas.prototype.backTempPoint = function() {
	this.tempPoints.pop();
};
drawCanvas.prototype.clearTempPoint = function() {
	this.tempPoints = [];
};
drawCanvas.prototype.addFirstToTemp = function() {
	if(this.tempPoints.length <= 0) return ;
	this.tempPoints.push(this.tempPoints[0]);
};
drawCanvas.prototype.drawLine = function() {
	var points = this.tempPoints;
    this.context.beginPath();

    this.context.lineWidth = 1;
    this.context.strokeStyle = this.strokeStyle;      //填充样式
    if(points[0]==null) return;
    this.context.moveTo(points[0].x, points[0].y);// 此点为多边形的起点
    // 在起点画圆圈
    this.context.arc(points[0].x, points[0].y, this.cricleRadius,0, 180);
    this.context.moveTo(points[0].x, points[0].y);// 回到多边形的起点

    for(var index = 1;index < points.length;index++){
    	this.context.lineTo(points[index].x, points[index].y);
    }
    // this.context.strokeStyle = "black";      //填充样式
    this.context.lineTo(this.mousePoint.x, this.mousePoint.y);
    this.context.stroke();
};
drawCanvas.prototype.compareFirstWithPoint = function(point1,point2) {
	if(this.tempPoints.length <= 0) return false;
	var point2 = this.tempPoints[0];
	var xdiff = point1.x - point2.x;
	var ydiff = point1.y - point2.y;
	var dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
	return (this.cricleRadius>dis);
};
drawCanvas.prototype.finishDrawLine = function(id) {
	this.addTempPoint(this.tempPoints[0]);
	var index_color = RandomNum(0,this.fillStyle.length);
	var tempArea = {
		'id':id,
		'color':'rgba('+this.fillStyle[index_color]+','+this.alph+')',
		'font_color':'black',
		'points':this.tempPoints
	};
	if(tempArea.points == null) return;
	this.areas.push(tempArea);

	this.clearTempPoint();
	this.canvasStatus = 0;
	//执行一次，取消显示的线条
	this.run();
};
drawCanvas.prototype.addArea = function(oneArea) {
	this.areas.push(oneArea);
};
drawCanvas.prototype.drawAllArea = function() {
	var areas = this.areas;
	for(var index = 0;index < areas.length;index++){
		this.drawArea(areas[index]);
	}
};
drawCanvas.prototype.drawArea = function(oneArea) {
	var points = oneArea.points;
	var color = oneArea.color;
	var font_color = oneArea.font_color;

	//绘制ID号码
	this.context.beginPath();
    this.context.fillStyle = font_color;     //填充样式
	this.context.font = "22px Courier New";
	this.context.fillText(oneArea.id, oneArea.points[0].x, oneArea.points[0].y);
	this.context.closePath();

    this.context.beginPath();
    this.context.lineWidth = 1;

    var index = 0;
    this.context.fillStyle = color;      //填充样式
    this.context.moveTo(points[0].x, points[0].y);// 此点为多边形的起点  
    for(var index = 1;index < points.length;index++){
    	this.context.lineTo(points[index].x, points[index].y);
    }
    this.context.closePath(); // 使这些点构成封闭的多边形 
    // this.context. 
    this.context.fill();
};
drawCanvas.prototype.getAllArea = function() {
	return this.areas;
};

drawCanvas.prototype.deleteArea = function(number_title) {
	var ifSucc = false;
	for(var i = 0;i < this.areas.length;i++ ){
		if(this.areas[i].id == number_title){
			var j = i;
			for(;j<this.areas.length-1;j++){
				this.areas[j] = this.areas[j+1];
			}
			this.areas.length-=1;
			ifSucc = true;
		}
	}
	if(!ifSucc) alert("您输入的选区编号不正确");
	this.run();
};
drawCanvas.prototype.checkAreaIfExis = function(number_title) {
	var ifSucc = false;
	for(var i = 0;i < this.areas.length;i++ ){
		if(this.areas[i].id == number_title){
			ifSucc = true;
		}
	}
	return ifSucc;
};
// 更改背景图片
drawCanvas.prototype.setBackground = function(url) {
	this.backgroundUrl = url;
	this.run();
};
// 绘制背景图片
drawCanvas.prototype.drawBackground = function() {
	var img=new Image();
	img.src=this.backgroundUrl;
	this.context.drawImage(img,0,0,this.width,this.height);
};
// 获取鼠标位置
drawCanvas.prototype.getMousePosition = function(e) {
	var rect = this.canvas.getBoundingClientRect();
    return {   
     x: e.clientX - rect.left * (this.canvas.width / rect.width),  
     y: e.clientY - rect.top * (this.canvas.height / rect.height)  
   };
};
//min ≤ r < max
function RandomNum(Min, Max) {
      var Range = Max - Min;
      var Rand = Math.random();
      var num = Min + Math.floor(Rand * Range); //舍去
      return num;
}