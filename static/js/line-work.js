function Linework( _canvas ) {
  this.canvas = document.getElementById(_canvas);
  this.ctx = this.canvas.getContext('2d');

  width = window.innerWidth;
  height = window.innerHeight;
  this.canvas.width = width;
  this.canvas.height = height;
  
  this.points = [];

  this.init();
}

Linework.prototype = {
  init: function() {
    this.initPoints();
  },
  initPoints: function() {
    var self = this,
        canvas = this.canvas,
        core = {x: canvas.width / 2, y: canvas.height / 2},
        r1 = 600,
        r2 = 400,
        points = [];

    var isInArea = function(x, y) {
      return (x < core.x - r2 || x > core.x + r2) && (y < core.y - r2 || y > core.y + r2);
    };

    for(var x = core.x - r1; x < core.x + r1; x = x + 20) {
      for(var y = core.y - r1; y < core.y + r1; y = y + 20) {
        if( isInArea(x, y) ) {
          self.points.push({x: x, y: y});
        }
      }
    }

    self.drawLinework();
  },
  drawLinework: function() {
    var self = this,
        points = self.points;
    
    for(var i in points) {
      self.drawCircle(points[i], 5, '');
    }
  },
  drawCircle: function(pos, rad, color) {
    var self = this,
        ctx = self.ctx;

    ctx.beginPath();
    console.log(pos);
    ctx.arc(pos.x, pos.y, rad, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(247, 202, 24, 1)';
    ctx.fill();
  }
}