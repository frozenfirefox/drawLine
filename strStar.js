export default class LoginCanvas{
  constructor(width, height, point = 35, colorLine, colorFill) {
    this.width = width||window.innerWidth
    this.height = width||window.innerHeight
    this.point = point||35
    this.canvas = document.createElement('canvas')
    this.canvas.style = 'position: absolute;z-index: 0;'
    let firstChild = document.body.firstChild
    document.body.insertBefore(this.canvas, firstChild)
    this.canvas.width = width||window.innerWidth
    this.canvas.height = height||window.innerHeight
    this.context = this.canvas.getContext('2d')
    this.context.strokeStyle = colorLine||'rgba(0,255,0,0.05)'
    this.context.strokeWidth = 1
    this.context.fillStyle = colorFill||'rgba(0,255,0,0.05)'
    this.circleArr = []
    //接口调用
    this.init()
  }
  //线条：开始xy坐标，结束xy坐标，线条透明度
  Line (x, y, _x, _y, o) {
    return {
      beginX : x,
      beginY : y,
      closeX : _x,
      closeY : _y,
      o : o,
    }
  }
  //点：圆心xy坐标，半径，每帧移动xy的距离
  Circle (x, y, r, moveX, moveY) {
    return {
      x : x,
      y : y,
      r : r,
      moveX : moveX,
      moveY : moveY,
    }
  }
  //生成max和min之间的随机数
  num (max, min) {
    min = arguments[1] || 0;
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  // 绘制原点
  drawCricle (cxt, x, y, r, moveX, moveY) {
    let circle = this.Circle(x, y, r, moveX, moveY)
    cxt.beginPath()
    
    for( var i = 0 ; i < 5 ; i ++){
        cxt.lineTo(Math.cos((18+72*i - circle.r)/180*Math.PI) * circle.r + circle.x ,- Math.sin((18+72*i - circle.r )/180*Math.PI) * circle.r + circle.y);
        cxt.lineTo(Math.cos((54+72*i - circle.r)/180*Math.PI) * (circle.r-5) + circle.x ,- Math.sin((54+72*i - circle.r )/180*Math.PI) * (circle.r-5) + circle.y);
    }

    cxt.closePath();
    cxt.fill();
    return circle;
  }
  //绘制线条
  drawLine (cxt, x, y, _x, _y, o) {
    let line = this.Line(x, y, _x, _y, o)
    cxt.beginPath()
    cxt.strokeStyle = 'rgba(0,0,0,'+ o +')'
    cxt.moveTo(line.beginX, line.beginY)
    cxt.lineTo(line.closeX, line.closeY)
    cxt.closePath()
    cxt.stroke();

  }
  //每帧绘制
  draw () {
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.point; i++) {
      this.drawCricle(this.context, this.circleArr[i].x, this.circleArr[i].y, this.circleArr[i].r);
    }
    for (let i = 0; i < this.point; i++) {
      for (let j = 0; j < this.point; j++) {
        if (i + j < this.point) {
          let A = Math.abs(this.circleArr[i+j].x - this.circleArr[i].x),
            B = Math.abs(this.circleArr[i+j].y - this.circleArr[i].y);
          let lineLength = Math.sqrt(A*A + B*B);
          let C = 1/lineLength*7-0.009;
          let lineOpacity = C > 0.03 ? 0.03 : C;
          if (lineOpacity > 0) {
            this.drawLine(this.context, this.circleArr[i].x, this.circleArr[i].y, this.circleArr[i+j].x, this.circleArr[i+j].y, this.lineOpacity);
          }
        }
      }
    }
  }
  //初始化生成原点
  init () {
    this.circleArr = [];

    for (let i = 0; i < this.point; i++) {
      this.circleArr.push(this.drawCricle(this.context, this.num(this.width), this.num(this.height),this.num(15, 2), this.num(10, -10)/40, this.num(10, -10)/40));
    }
    let _this = this
    setInterval(function () {
      for (let i = 0; i < _this.point; i++) {
        let cir = _this.circleArr[i];
        cir.x += cir.moveX;
        cir.y += cir.moveY;
        if (cir.x > _this.width) cir.x = 0;
        else if (cir.x < 0) cir.x = _this.width;
        if (cir.y > _this.height) cir.y = 0;
        else if (cir.y < 0) cir.y = _this.height;

      }
      _this.draw();
    }, 1);
  }
}