var Outline = function() {

};

Outline.prototype = {
  init: function() {
    this.bind();
  },
  bind: function() {
    $('.outline-button-container').on('click', function() {
      $('.outline-container').toggleClass('open');
    });
  }
}

var Linework = function( _canvas ) {
  this.canvas = document.getElementById(_canvas);
  this.ctx = this.canvas.getContext('2d');

  width = window.innerWidth;
  height = window.innerHeight;
  this.canvas.width = width;
  this.canvas.height = height;
  
  this.points = [];
}

Linework.prototype = {
  init: function() {
    this.initPoints();
  },
  initPoints: function() {
    var self = this,
        canvas = this.canvas,
        core = {x: canvas.width / 2, y: canvas.height / 2},
        r1 = core.y / 2,
        r2 = core.y / 4;

    var isOutArea = function(x, y) {
      return (x > core.x - r2 && x < core.x + r2 && y > core.y - r2 && y < core.y + r2) || x < core.x - r1 || x > core.x + r1 || y < core.y - r1 || y > core.y + r1;
    };

    for(var x = core.x - r1; x < core.x + r1; x = x + 0.5) {
      var ang = (Math.random() - 0.5) * 4 * Math.PI,
          pointY = Math.tan(ang) * (x - core.x) + core.y;
          
        if( !isOutArea(x, pointY) ) {
          self.points.push({x: x, y: pointY});
        }
    }

    // console.log(canvas.width + ',' + canvas.height);
    // console.log(core);
    // for(var x = 0; x < canvas.width; x = x + canvas.width/20) {
    //   for(var y = 0; y < canvas.height; y = y + canvas.height/20) {
    //     var px = x + Math.random()*canvas.width/20;
    //     var py = y + Math.random()*canvas.height/20;
    //     var p = {x: px, originX: px, y: py, originY: py };
    //     self.points.push(p);
    //   }
    // }

    // for each point find the 5 closest points
    for(var i = 0; i < self.points.length; i++) {
      var closest = [];
      var p1 = self.points[i];
      for(var j = 0; j < self.points.length; j++) {
        var p2 = self.points[j]
        if(!(p1 == p2)) {
          var placed = false;
          for(var k = 0; k < 5; k++) {
            if(!placed) {
              if(closest[k] == undefined) {
                closest[k] = p2;
                placed = true;
              }
            }
          }

          for(var k = 0; k < 5; k++) {
            if(!placed) {
              if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                closest[k] = p2;
                placed = true;
              }
            }
          }
        }
      }
      p1.closest = closest;
    }

    // assign a circle to each point
    for(var i in self.points) {
        var c = new Circle(self.points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
        self.points[i].circle = c;
        console.log(self.points[i]);
    }

      function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(247,202,24,'+ _this.active+')';
            ctx.fill();
        };
    }

    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    self.drawLinework();
  },
  drawLinework: function() {
    var self = this,
        points = self.points;
    // console.log(points);
    for(var i in points) {
      self.drawCircle(points[i], 1, '');
      self.drawLine(points[i]);
    }
  },
  drawCircle: function(pos, rad, color) {
    // console.log(pos);
    var self = this,
        ctx = self.ctx;

    ctx.beginPath();
    // console.log(pos.x + ',' + pos.y + ',' + rad);
    ctx.arc(pos.x, pos.y, rad, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(158, 158, 158, 1)';
    ctx.fill();
  },
  drawLine: function(p) {
    var self = this,
        ctx = self.ctx;
    // if(!p.active) return;
    for(var i in p.closest) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.closest[i].x, p.closest[i].y);
      ctx.strokeStyle = 'rgba(158,158,158,.5)';
      ctx.lineWidth = .3;
      ctx.stroke();
    }
  }
}

$(function() {
  var outlineMenu = new Outline();
  outlineMenu.init();

  var lineWork = new Linework('home-canvas');
  lineWork.init();
})