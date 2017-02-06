webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {var Swiper = __webpack_require__(2);

	window.requestFrame = (function(){
			return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
		})();

	window.cancelFrame = (function(){
			return  window.cancelAnimationFrame       ||
				window.webkitCancelAnimationFrame ||
				window.mozCancelAnimationFrame    ||
				function( callback ){
				window.clearTimeout(callback, 1000 / 60);
			};
		})();

	var Outline = function( _obj ) {
	  this.currIndex = 0;
	  this.menu = _obj.menu || [];
	  this.menuPos = {
	    start: parseInt(_obj.start) || 0,
	    stop: parseInt(_obj.stop) || 0
	  }
	};

	Outline.prototype = {
	  init: function() {
	    this.initMenu();
	    this.bind();
	  },
	  initMenu: function() {
	    var self = this,
	        data = self.menu,
	        dataLen = data.length + 1,
	        menuPos = self.menuPos,
	        start = menuPos.start,
	        stop = menuPos.stop,
	        step = Math.ceil( stop - start ) / dataLen,
	        textStep = step / 2;

	    var lineStr = '<span class="process-line" style="height:' + step + '%;top:' + menuPos.start + '%"></span>',
	        menuStr = '';

	    for ( var i = 0; i < dataLen; i++ ) {
	      if ( i == 0 ) {
	        lineStr += '<span class="outline-ends" style="top:' + start + '%">+</span>'
	            +  '<p class="outline-menu-item" style="top:' + (start + textStep) + '%">'
	            +  '<em class="outline-menu-num">0' + i + '</em>'
	            +  '<span class="outline-menu-text">' + data[i] + '</span>'
	            +  '</p>';
	      }else if ( i == dataLen - 1 ) {
	        lineStr += '<span class="outline-ends" style="top:' + (start + step * i) + '%">+</span>';
	      }else {
	        lineStr += '<span class="outline-point" style="top:' + (start + step * i) + '%"></span>'
	            +  '<p class="outline-menu-item" style="top:' + (start + step * i + textStep) + '%">'
	            +   '<em class="outline-menu-num">0' + i + '</em>'
	            +   '<span class="outline-menu-text">' + data[i] + '</span>'
	            +  '</p>';
	      }

	      menuStr += '<li class="menu-item">' 
	              +   data[i] 
	              +   '<em class="menu-index">0' + i + '</em>'
	              + '</li>';
	    }

	    var button = '<div class="outline-button-container" style="top: ' + start + '%">'
	               +  '<div class="outline-button outline-button-open">'
	               +    '<span class="outline-button-line"></span>'
	               +    '<span class="outline-button-line"></span>'
	               +    '<span class="outline-button-line"></span>'
	               +  '</div>'
	               +  '<div class="outline-button outline-button-close"></div>'
	               + '</div>';

	    lineStr += button;
	    $('.outline-line').html( lineStr );
	    $('.menu-list').html( menuStr );

	    self.moveProcessLine( 0 );

	  },
	  bind: function() {
	    var self = this;

	    $('.outline-button-container').on('click', function() {
	      $('.outline-container').toggleClass('open');
	    });

	    $('.menu-list').on('click', '.menu-item', function() {
	      var index = $(this).index();

	      self.moveProcessLine( index );
	      $('.outline-container').toggleClass('open');
	    });
	  },
	  moveProcessLine: function( _index ) {
	    var step = _index * 100;
	    
	    $('.process-line').css('transform', 'translateY(' + step + '%)');
	    $('.outline-menu-item').each(function(i, el) {
	      var $el = $(el);
	      
	      if ( i <= _index ) {
	        $el.addClass('prev');
	      }else {
	        $el.removeClass('prev');
	      }

	      if ( i == _index ) {
	        $el.addClass('current');
	      }else {
	        $el.removeClass('current');
	      }
	    });
	  }
	};

	var Linework = function( _canvas ) {
	  this.canvas = document.getElementById(_canvas);
	  this.ctx = null;

	  if( this.canvas.getContext ) {
	    this.ctx = this.canvas.getContext('2d');
	  }

	  width = window.innerWidth;
	  height = window.innerHeight;
	  this.canvas.width = width;
	  this.canvas.height = height;
	  this.mousePosition = {
	    x: width / 2,
	    y: height / 2,
	    lastX: width / 2,
	    lastY: height / 2
	  };
	  
	  this.points = [];
	};

	Linework.prototype = {
	  init: function() {
	    // this.initPoints(0.03);
	    // this.bind();
	    this.startOpening();
	  },
	  startOpening: function () {
	    var self = this,
	        r = 300,
	        sideCount = 24,
	        ang = Math.PI * 2 / sideCount,
	        sideAng = (Math.PI - ang) / 2,
	        sideLength = r * Math.cos(sideAng) * 2,
	        openingCore = {
	          x: this.canvas.width / 2,
	          y: this.canvas.height / 2
	        },
	        pathLength = sideCount * sideLength,
	        remainCount = 5,
	        coverLength = (sideCount - remainCount) * sideLength,
	        openingTimer,
	        processNum = 100 - remainCount,
	        passNStart = Math.floor( coverLength / sideLength ),
	        passN;

	    var initOpeningPath = function() {
	      var ctx = self.ctx,
	          i;

	      self.clearCanvas();

	      self.drawBg();

	      ctx.save();
	      self.translateToCenter();
	      ctx.font="20px Georgia";
	      ctx.fillStyle='#8ac832';
	      ctx.fillText(processNum + passN - passNStart + "%",-20,0);
	      
	      ctx.fillStyle ='transparent';
	      ctx.strokeStyle ='rgba(255,255,255,.2)';
	      ctx.lineWidth = 1;
	      ctx.moveTo(0, -r);
	      ctx.beginPath();

	      for(var i = 0; i < sideCount; i++) {
	        ctx.rotate(ang)
	        ctx.lineTo(0, -r);
	      }

	      ctx.closePath();
	      ctx.stroke();
	      ctx.fill();
	      ctx.restore();
	      
	      (function traceOpeningPath() {
	        passN = Math.floor( coverLength / sideLength );

	        var remainLen = coverLength - passN * sideLength;

	        ctx.save();
	        ctx.fillStyle ='transparent';
	        ctx.strokeStyle ='#8ac832';
	        ctx.lineWidth = 1;
	        self.translateToCenter();
	        ctx.moveTo(0, -r);
	        ctx.beginPath();

	        for(var j = 0; j <= passN; j++) {
	          ctx.rotate(ang)
	          ctx.lineTo(0, -r);
	        }
	        ctx.rotate(ang)
	        
	        var d = sideLength - remainLen;
	        ctx.lineTo(-d * Math.sin(sideAng), -r + d * Math.cos(sideAng));
	        ctx.stroke();
	        ctx.fill();
	        ctx.restore();

	        coverLength += 5;
	        
	      })();

	      openingTimer = requestFrame(initOpeningPath);
	      if( coverLength > pathLength * 1.01 ) {
	        cancelFrame( openingTimer );
	        self.clearCanvas();
	        self.initPoints(0.03);
	      }
	    }

	    initOpeningPath();
	  },
	  rotate: function(cx, cy, x, y, angle) {
			var radians = angle,
			    cos = Math.cos(radians),
			    sin = Math.sin(radians),
			    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
			    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
			return [nx, ny];
	  },
	  initPoints: function(_density) {
	    var self = this,
	        canvas = this.canvas,
	        core = {x: canvas.width / 2, y: canvas.height / 2},
	        r1 = 350,
	        r2 = 200,
	        rDiff = r1 - r2;
	        
	    var isInArea = function(x, y) {
	      var rx = x,
	          ry = y,
	          edgeLength = Math.sqrt(Math.pow(rx,2) + Math.pow(ry,2));

	      return (edgeLength >= r2) && (edgeLength <= r1);
	    };


	    for(var rad = 0; rad <= Math.PI * 2; rad += _density) {
	      var pointR = Math.random() * rDiff + r2,
	          pointX = pointR * Math.cos( rad );
	          pointY = pointR * Math.sin( rad );
	          
	        if( isInArea(pointX, pointY) ) {
	          self.points.push({
	            x: pointX,
	            y: pointY,
	            r: Math.sqrt(Math.pow(pointX,2) + Math.pow(pointY,2)),
	            rad: rad
	          });
	        }
	    }

	    // assign a circle to each point
	    for(var i in self.points) {
	        var c = new Circle(self.points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
	        self.points[i].circle = c;
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

	    self.rotateLinework();
	  },
	  initClosestPoints: function( _count ) {
	    var self = this,
	        count = _count || 6;

	    // for each point find the 5 closest points
	    for(var i = 0; i < self.points.length; i++) {
	      var closest = [];
	      var p1 = self.points[i];
	      for(var j = 0; j < self.points.length; j++) {
	        var p2 = self.points[j]
	        if(!(p1 == p2)) {
	          var placed = false;
	          for(var k = 0; k < 6; k++) {
	            if(!placed) {
	              if(closest[k] == undefined) {
	                closest[k] = p2;
	                placed = true;
	              }
	            }
	          }

	          for(var k = 0; k < 6; k++) {
	            if(!placed) {
	              if(self.getDistance(p1, p2) < self.getDistance(p1, closest[k])) {
	                closest[k] = p2;
	                placed = true;
	              }
	            }
	          }
	        }
	      }
	      p1.closest = closest;
	    }

	    self.drawLinework();
	  },
	  getDistance: function(p1, p2) {
	    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
	  },
	  drawLinework: function() {
	    var self = this,
	        points = self.points;
	    
	    self.drawBg();
	    for(var i in points) {
	      self.drawCircle(points[i], 0.5, '');
	      self.drawLine(points[i]);
	    }
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
	  drawLine: function(p) {
	    var self = this,
	        ctx = self.ctx,
	        closestPoints = p.closest,
	        closestLength = closestPoints.length;
	    
	    ctx.save();
	    self.translateToCenter();
	    for( var i = 0; i < closestLength; i++ ) {
	      for ( var j = i + 1; j < closestLength; j++ ) {
	        ctx.beginPath();
	        ctx.moveTo(p.x, p.y);
	        ctx.lineTo(p.closest[i].x, p.closest[i].y);
	        ctx.lineTo(p.closest[j].x, p.closest[j].y);
	        ctx.closePath();
	        ctx.strokeStyle = 'rgba(255,255,255,1)';
	        ctx.lineWidth = .05;
	        ctx.fillStyle = 'rgba(158,158,158,.02)';
	      }
	    }

	    ctx.stroke();
	    ctx.fill();
	    ctx.restore();
	  },
	  rotateLinework: function() {
	    var self = this,
	        rChange = 5,
	        radChange = 0.04,
	        centerX = self.canvas.width / 2,
	        centerY = self.canvas.height / 2,
	        rotateTimer;

	    function rotate(_obj, angle) {
	      var pointX = _obj.x,
	          pointY = _obj.y,
	          pointRad = _obj.rad,
	          newRad = pointRad + radChange > Math.PI * 2 ? pointRad + radChange - Math.PI * 2 : pointRad + radChange,
	          pointR = _obj.r + rChange;
	          
	      newX = pointR * Math.cos( newRad );
	      newY = pointR * Math.sin( newRad );

	      return {x: newX, y: newY, r: pointR, rad: newRad};
	    }

	    var time=0;
	    function render() {
	      self.clearCanvas();

	      for( var i = 0; i < self.points.length; i++ ) {
	        var pos = rotate(self.points[i], radChange * time);
	       
	        self.points[i].x = pos.x;
	        self.points[i].y = pos.y;
	        self.points[i].rad = pos.rad;
	        self.points[i].r = pos.r;
	      }

	      self.initClosestPoints();

	      time += 1;

	      rotateTimer = requestFrame(render);
	      if(time > 20) {
	        cancelFrame( rotateTimer );
	      }
	    }

	    render();    
	  },
	  updateLinework: function() {
	    var self = this,
	        speedX = (self.mousePosition.x - self.mousePosition.lastX) / 10,
	        speedY = (self.mousePosition.y - self.mousePosition.lastY) / 10;
	      
	    for( var i = 0; i < self.points.length; i++ ) {
	      // if ( Math.abs(self.mousePosition.x - self.points[i].x) < 100 ) {
	      //   var step
	      // }
	      var stepX = Math.abs(self.mousePosition.x - self.points[i].x) < 50 ? 5 : 1,
	          stepY = Math.abs(self.mousePosition.y - self.points[i].y) < 50 ? 5 : 1;
	      self.points[i].x += speedX * Math.random() * stepX;
	      self.points[i].y += speedY * Math.random() * stepY;
	    }

	    self.clearCanvas();
	    self.initClosestPoints();
	    self.mousePosition.lastX = self.mousePosition.x;
	    self.mousePosition.lastY = self.mousePosition.y;
	  },
	  spreadLinework: function() {
	    var self = this,
	        rChange = 5,
	        radChange = 0.04,
	        centerX = self.canvas.width / 2,
	        centerY = self.canvas.height / 2,
	        rotateTimer,
	        speed = 10;

	    function rotate(_obj, angle) {
	      var pointX = _obj.x,
	          pointY = _obj.y,
	          pointRad = _obj.rad,
	          newRad = pointRad + radChange > Math.PI * 2 ? pointRad + radChange - Math.PI * 2 : pointRad + radChange,
	          pointR = _obj.r + rChange * _obj.direction;
	          
	      newX = pointR * Math.cos( newRad );
	      newY = pointR * Math.sin( newRad );

	      return {x: newX, y: newY, r: pointR, rad: newRad};
	    }

	    var time=0;
	    function render() {
	      self.clearCanvas();

	      for( var i = 0; i < self.points.length; i++ ) {
	        // var pos = rotate(self.points[i], radChange * time);
	        
	        self.points[i].x += pos.x;
	        self.points[i].y += pos.y;
	        self.points[i].rad = pos.rad;
	        self.points[i].r = pos.r;
	      }

	      self.initClosestPoints(3);

	      time += 1;

	      rotateTimer = requestFrame(render);
	      // if(time > 20) {
	      //   cancelFrame( rotateTimer );
	      // }
	    }

	    render();    
	  },
	  transformLinework: function() {
	    var self = this,
	        rChange = 5,
	        radChange = 0.03,
	        centerX = self.canvas.width / 2,
	        centerY = self.canvas.height / 2,
	        transformTimer;

	    function rotate(_obj, angle) {
	      var pointX = _obj.x,
	          pointY = _obj.y,
	          pointRad = _obj.rad,
	          newRad = pointRad + radChange > Math.PI * 2 ? pointRad + radChange - Math.PI * 2 : pointRad + radChange,
	          pointDir = _obj.direction || 1,
	          pointR = _obj.r - rChange * pointDir;
	      
	      newX = pointR * Math.cos( newRad );
	      newY = pointR * Math.sin( newRad );

	      if( pointR < 0 && Math.abs(pointR) > centerX ) {
	        pointDir = -1;
	      }

	      return {x: newX, y: newY, r: pointR, rad: newRad, dir: pointDir};
	    }

	    var time=0;
	    function render() {
	      self.clearCanvas();

	      for( var i = 0; i < self.points.length; i++ ) {
	        var pos = rotate(self.points[i], radChange * time);
	       
	        self.points[i].x = pos.x;
	        self.points[i].y = pos.y;
	        self.points[i].rad = pos.rad;
	        self.points[i].r = pos.r;
	      }

	      self.initClosestPoints();

	      time += 1;

	      transformTimer = requestFrame(render);
	      // if(time > 100) {
	        // cancelFrame( transformTimer );
	        // self.spreadLinework();
	      // }
	    }

	    render();   
	  },
	  bind: function() {
	    var self = this;

	    $('body').bind('mousemove mouseleave', function(e){
	      if(e.type == 'mousemove'){
	        self.mousePosition.x = e.pageX;
	        self.mousePosition.y = e.pageY;
	      }
	      if(e.type == 'mouseleave'){
	        self.mousePosition.x = self.canvas.width / 2;
	        self.mousePosition.y = self.canvas.height / 2;
	      }
	      
	      self.updateLinework();
	    });
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
	  var outlineMenu = new Outline({
	    menu: ['Intro','Blog','Skill','Contact','Ending'],
	    start: '16%',
	    stop: '96%'
	  });
	  outlineMenu.init();

	  var lineWork = new Linework('home-canvas');
	  lineWork.init();

	  setTimeout(function() {
	    var indexSwiper = new Swiper('.swiper-container', {
	      direction : 'vertical',
	      mousewheelControl: true,
	      onSlideChangeStart: function() {
	        var _index = indexSwiper.activeIndex;

	        outlineMenu.moveProcessLine( _index );
	        
	        if ( _index == 1 ) {

	          lineWork.transformLinework();

	        }else if ( _index == 2 ) {
	          // var skill = new Skill('skill-svg');
	          // skill.init();
	          $('.skill').addClass('active');
	        }else if ( _index == 4 ) {
	          // $('.skill').removeClass('active');
	        }
	        
	      }

	    });

	    $('.outline-container').fadeIn();
	    $('.intro-content').fadeIn();
	  }, 1600);

	})
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);