var Swiper = require('swiper');

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
    this.initPoints(0.03);
    this.bind();
  },
  initPoints: function(_density) {
    var self = this,
        canvas = this.canvas,
        core = {x: canvas.width / 2, y: canvas.height / 2},
        r1 = core.y / 1.5,
        r2 = core.y / 3,
        rDiff = r1 - r2;
        
    var isInArea = function(x, y) {
      var rx = x - core.x,
          ry = y - core.y,
          edgeLength = Math.sqrt(Math.pow(rx,2) + Math.pow(ry,2));

      return (edgeLength >= r2) && (edgeLength <= r1);
    };


    for(var rad = 0; rad <= Math.PI * 2; rad += _density) {
      var pointR = Math.random() * rDiff + r2,
          pointX = pointR * Math.cos( rad ) + core.x;
          pointY = pointR * Math.sin( rad ) + core.y;
          
        if( isInArea(pointX, pointY) ) {
          self.points.push({
            x: pointX,
            y: pointY,
            maxX: core.x + pointX + Math.cos( rad ) * r1,
            minX: core.x + pointX - Math.cos( rad ) * r1,
            maxY: (Math.cos( rad ) + 1) * core.y * 3
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

    self.initClosestPoints();
  },
  initClosestPoints: function() {
    var self = this;

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

    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    self.drawLinework();
  },
  drawLinework: function() {
    var self = this,
        points = self.points;
    for(var i in points) {
      self.drawCircle(points[i], 0.5, '');
      self.drawLine(points[i]);
    }
  },
  drawCircle: function(pos, rad, color) {
    var self = this,
        ctx = self.ctx;

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rad, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fill();
  },
  drawLine: function(p) {
    var self = this,
        ctx = self.ctx,
        closestPoints = p.closest,
        closestLength = closestPoints.length;
    // if(!p.active) return;
    
    for( var i = 0; i < closestLength; i++ ) {
      for ( var j = i + 1; j < closestLength; j++ ) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.closest[i].x, p.closest[i].y);
        ctx.lineTo(p.closest[j].x, p.closest[j].y);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.lineWidth = .05;
        // ctx.stroke();
        ctx.fillStyle = 'rgba(158,158,158,.02)';
        // ctx.fill();
      }
    }

    ctx.stroke();
    ctx.fill();
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

    self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
    self.initClosestPoints();
    self.mousePosition.lastX = self.mousePosition.x;
    self.mousePosition.lastY = self.mousePosition.y;
  },
  spreadLinework: function() {
    var self = this,
        pointCount = self.points.length,
        halfCount = Math.ceil(pointCount / 2),
        speedX = 30,
        speedY = 50,
        spreadAnim;
        
    var render1 = function() {
      self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

      for( var i = 0; i < halfCount; i ++ ) {
        var currPoint = self.points[i],
            distanceY = (i - halfCount) / halfCount * speedY;

        self.points[i].y += distanceY;

        if ( pointCount - i >= 0 && i > 0 ) {
          self.points[pointCount - i].y -= distanceY;
        }
      }
      
      self.initClosestPoints();
      spreadAnim = window.requestAnimationFrame( render1 );
     
      if ( self.points[halfCount * 2 / 3].y < 0 ) {
        window.cancelAnimationFrame( spreadAnim );

        // var newPoints = [];

        // for( var i = 0; i < halfCount; i ++ ) {
        //   var p = self.points[i];
        //   if ( p.y > 0 ) {
        //     newPoints.push( p );
        //   }
        // }

        // self.points = newPoints;
        // self.transformLinework();
        render2();
        return false;
      }
    };

    var render2 = function() {
      self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

      for( var i = 0; i < halfCount; i ++ ) {
        var currPoint = self.points[i],
            distanceY = (i - halfCount) / halfCount * speedY,
            distanceX = speedX * Math.random();

        // console.log(distanceY);
        self.points[i].x += distanceX;
        self.points[i].y += distanceY;

        if ( pointCount - i >= 0 && i > 0 ) {
          self.points[pointCount - i].y -= distanceY;
          self.points[pointCount - i].x += speedX * Math.random() * 2 / 3;
        }

      }
      
      self.initClosestPoints();
      transformAnim = window.requestAnimationFrame( render2 );
     
      var endPoint = Math.ceil(halfCount * 9 / 11);
      if ( self.points[endPoint].y < 0 ) {
        window.cancelAnimationFrame( transformAnim );
        return false;
      }
    };

    render1();
  },
  transformLinework: function() {
    var self = this,
        pointCount = self.points.length,
        halfCount = Math.ceil(pointCount / 2),
        speedX = 10,
        speedY = 1,
        transformAnim;
    
    var render = function() {
      self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      
      for( var i = 0; i < halfCount; i ++ ) {
        var currPoint = self.points[i],
            distanceY = (i - halfCount) / halfCount * speedY,
            distanceX = speedX * Math.random();

        // console.log(distanceY);
        self.points[i].x += distanceX;
        // self.points[i].y += distanceY;

        if ( pointCount - i >= 0 && i > 0 ) {
          // self.points[pointCount - i].y -= distanceY;
          self.points[pointCount - i].x += speedX * Math.random();
        }

      }

      self.initClosestPoints();
      transformAnim = window.requestAnimationFrame( render );

      if ( self.points[halfCount * 1 / 3].y < 0 ) {
        window.cancelAnimationFrame( transformAnim );
        return false;
      }
    };

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

  var indexSwiper = new Swiper('.swiper-container', {
    direction : 'vertical',
    mousewheelControl: true,
    onSlideChangeStart: function() {
      var _index = indexSwiper.activeIndex;

      outlineMenu.moveProcessLine( _index );
      console.log(_index);
      
      if ( _index == 1 ) {
        // $('.skill').removeClass('active');

        setTimeout(function(){
          $('body').unbind();
          lineWork.spreadLinework();
        },100);

        // indexSwiper.lockSwipes();
      }else if ( _index == 2 ) {
        // var skill = new Skill('skill-svg');
        // skill.init();
        $('.skill').addClass('active');
      }else if ( _index == 4 ) {
        // $('.skill').removeClass('active');
      }
      
    }
  });

  // blackhole('.intro');

  // function blackhole(element) {
  //   var h = $(element).height(),
  //       w = $(element).width(),
  //       cw = w,
  //       ch = h,
  //       maxorbit = 255, // distance from center
  //       centery = ch/2,
  //       centerx = cw/2;

  //   var startTime = new Date().getTime();
  //   var currentTime = 0;

  //   var stars = [],
  //       collapse = false, // if hovered
  //       expanse = false; // if clicked

  //   var canvas = $('<canvas/>').attr({width: cw, height: ch}).appendTo(element),
  //       context = canvas.get(0).getContext("2d");

  //   context.globalCompositeOperation = "multiply";

  //   function setDPI(canvas, dpi) {
  //     // Set up CSS size if it's not set up already
  //     if (!canvas.get(0).style.width)
  //       canvas.get(0).style.width = canvas.get(0).width + 'px';
  //     if (!canvas.get(0).style.height)
  //       canvas.get(0).style.height = canvas.get(0).height + 'px';

  //     var scaleFactor = dpi / 96;
  //     canvas.get(0).width = Math.ceil(canvas.get(0).width * scaleFactor);
  //     canvas.get(0).height = Math.ceil(canvas.get(0).height * scaleFactor);
  //     var ctx = canvas.get(0).getContext('2d');
  //     ctx.scale(scaleFactor, scaleFactor);
  //   }

  //   function rotate(cx, cy, x, y, angle) {
  //     var radians = angle,
  //         cos = Math.cos(radians),
  //         sin = Math.sin(radians),
  //         nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
  //         ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  //     return [nx, ny];
  //   }

  //   setDPI(canvas, 192);

  //   var star = function(){

  //     // Get a weighted random number, so that the majority of stars will form in the center of the orbit
  //     var rands = [];
  //     rands.push(Math.random() * (maxorbit/2) + 1);
  //     rands.push(Math.random() * (maxorbit/2) + maxorbit);

  //     this.orbital = (rands.reduce(function(p, c) {
  //       return p + c;
  //     }, 0) / rands.length);
  //     // Done getting that random number, it's stored in this.orbital

  //     this.x = centerx; // All of these stars are at the center x position at all times
  //     this.y = centery + this.orbital; // Set Y position starting at the center y + the position in the orbit

  //     this.yOrigin = centery + this.orbital;  // this is used to track the particles origin

  //     this.speed = (Math.floor(Math.random() * 2.5) + 1.5)*Math.PI/180; // The rate at which this star will orbit
  //     this.rotation = 0; // Starting rotation.  If not random, all stars will be generated in a single line.  
  //     this.startRotation = (Math.floor(Math.random() * 360) + 1)*Math.PI/180; // Starting rotation.  If not random, all stars will be generated in a single line.  

  //     this.id = stars.length;  // This will be used when expansion takes place.

  //     this.collapseBonus = this.orbital - (maxorbit * 0.7); // This "bonus" is used to randomly place some stars outside of the blackhole on hover
  //     if(this.collapseBonus < 0){ // if the collapse "bonus" is negative
  //       this.collapseBonus = 0; // set it to 0, this way no stars will go inside the blackhole
  //     }

  //     stars.push(this);
  //     this.color = 'rgba(255,255,255,'+ (1 - ((this.orbital) / 255)) +')'; // Color the star white, but make it more transparent the further out it is generated

  //     this.hoverPos = centery + (maxorbit/2) + this.collapseBonus;  // Where the star will go on hover of the blackhole
  //     this.expansePos = centery + (this.id%100)*-10 + (Math.floor(Math.random() * 20) + 1); // Where the star will go when expansion takes place


  //     this.prevR = this.startRotation;
  //     this.prevX = this.x;
  //     this.prevY = this.y;

  //     // The reason why I have yOrigin, hoverPos and expansePos is so that I don't have to do math on each animation frame.  Trying to reduce lag.
  //   }
  //   star.prototype.draw = function(){
  //     // the stars are not actually moving on the X axis in my code.  I'm simply rotating the canvas context for each star individually so that they all get rotated with the use of less complex math in each frame.



  //     if(!expanse){
  //       this.rotation = this.startRotation + (currentTime * this.speed);
  //       if(!collapse){ // not hovered
  //         if(this.y > this.yOrigin){
  //           this.y-= 2.5;
  //         }
  //         if(this.y < this.yOrigin-4){
  //           this.y+= (this.yOrigin - this.y) / 10;
  //         }
  //       } else { // on hover
  //         this.trail = 1;
  //         if(this.y > this.hoverPos){
  //           this.y-= (this.hoverPos - this.y) / -5;
  //         }
  //         if(this.y < this.hoverPos-4){
  //           this.y+= 2.5;
  //         }
  //       }
  //     } else {
  //       this.rotation = this.startRotation + (currentTime * (this.speed / 2));
  //       if(this.y > this.expansePos){
  //         this.y-= Math.floor(this.expansePos - this.y) / -140;
  //       }
  //     }

  //     context.save();
  //     context.fillStyle = this.color;
  //     context.strokeStyle = this.color;
  //     context.beginPath();
  //     var oldPos = rotate(centerx,centery,this.prevX,this.prevY,-this.prevR);
  //     context.moveTo(oldPos[0],oldPos[1]);
  //     context.translate(centerx, centery);
  //     context.rotate(this.rotation);
  //     context.translate(-centerx, -centery);
  //     context.lineTo(this.x,this.y);
  //     context.stroke();
  //     context.restore();


  //     this.prevR = this.rotation;
  //     this.prevX = this.x;
  //     this.prevY = this.y;
  //   }


  //   $('.center-hover').on('click',function(){
  //     collapse = false;
  //     expanse = true;

  //     $(this).addClass('open');
  //     $('.fullpage').addClass('open');
  //     setTimeout(function(){
  //       $('.header .welcome').removeClass('gone');
  //     }, 500);
  //   });
  //   $('.center-hover').on('mouseover',function(){
  //     if(expanse == false){
  //       collapse = true;
  //     }
  //   });
  //   $('.center-hover').on('mouseout',function(){
  //     if(expanse == false){
  //       collapse = false;
  //     }
  //   });

  //   window.requestFrame = (function(){
  //     return  window.requestAnimationFrame       ||
  //       window.webkitRequestAnimationFrame ||
  //       window.mozRequestAnimationFrame    ||
  //       function( callback ){
  //       window.setTimeout(callback, 1000 / 60);
  //     };
  //   })();

  //   function loop(){
  //     var now = new Date().getTime();
  //     currentTime = (now - startTime) / 50;

  //     context.fillStyle = 'rgba(25,25,25,0.2)'; // somewhat clear the context, this way there will be trails behind the stars 
  //     context.fillRect(0, 0, cw, ch);

  //     for(var i = 0; i < stars.length; i++){  // For each star
  //       if(stars[i] != stars){
  //         stars[i].draw(); // Draw it
  //       }
  //     }

  //     requestFrame(loop);
  //   }

  //   function init(time){
  //     context.fillStyle = 'rgba(25,25,25,1)';  // Initial clear of the canvas, to avoid an issue where it all gets too dark
  //     context.fillRect(0, 0, cw, ch);
  //     for(var i = 0; i < 2500; i++){  // create 2500 stars
  //       new star();
  //     }
  //     loop();
  //   }
  //   init();
  // }

})