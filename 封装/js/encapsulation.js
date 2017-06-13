/*******************************************************/
var  = {
	//
	canvasLabelId : "";
	backgroundUrl : "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496942423953&di=e772d86a0c6807c0f35b7ed3916c772b&imgtype=0&src=http%3A%2F%2Fimg10.3lian.com%2Fc1%2Fnewpic%2F10%2F23%2F26.jpg",
	pointsDensity : 20
}
/*******************************************************/
function imgAction(createInfo){
	// 背景图片
	this.backgroundUrl = "";
	// 点的密度
	this.pointsDensity = 20;

	this._init_(createInfo);
}
imgAction.prototype = {
	_init_ : function(info){
		this.backgroundUrl = info.backgroundUrl;
		this.pointsDensity = info.pointsDensity;
	},

	load : function(info){
		console.log("in test the result is " + info);
	},
};
var one = new imgAction(testInfo);
console.log(one);