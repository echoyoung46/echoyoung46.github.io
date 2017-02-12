var Linework = function( _canvas ) {
  this.canvas = document.getElementById(_canvas);
  this.ctx = null;

  if( this.canvas.getContext ) {
    this.ctx = this.canvas.getContext('2d');
  }

  width = $('body').width();
  height = $('body').height();
  this.canvas.width = width;
  this.canvas.height = height;
};

Linework.prototype = {
  init: function() {
    this.drawBg();
  },
  drawBg: function() {
    var self = this,
        ctx = self.ctx,
        canvas = self.canvas,
        canvasW = canvas.width,
        canvasH = canvas.height,
        density = 100;

    for(var i = -canvasW / 2 + density / 2; i <= canvasW/ 2; i += density) {
      for(var j = -canvasH / 2 + density / 2; j <= canvasH/ 2; j += density) {
        self.drawCircle({x: i, y: j}, 1, 'rgba(255, 255, 255, .5)');
      }
    }
  },
  drawCircle: function(pos, rad, color) {
    var self = this,
        ctx = self.ctx,
        fillColor = color != '' ? color : 'rgba(255, 255, 255, 1)';
    
    ctx.save();
    self.translateToCenter();
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rad, 0, 2 * Math.PI, false);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.restore();
  },
  translateToCenter: function() {
    var self = this,
        canvas = self.canvas,
        ctx = self.ctx,
        centerX = canvas.width / 2,
        centerY = canvas.height / 2;
    
    ctx.translate(centerX, centerY);
  },
  clearCanvas: function() {
    var self = this;
    self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
  }
};

$(function() {
  var lineWork = new Linework('post-canvas');
  lineWork.init();
})