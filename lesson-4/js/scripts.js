
;(function(window, document, undefined) {
  'use strict';

  function getViewportH() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  };

  function ScrollPathFinder() {
    var self = this;

    // ссылки на элементы
    self.svg = document.getElementById('scrollPath');
    self.path = document.getElementById('scrollLine');
    self.light = document.getElementById('light');
    self.bg = document.getElementById('scrollBg');

    // список координат точек кривой, вдоль которой движется объект
    self.points = self.path.getAttribute('points');
    self.duration = 1;
    self.tween = null;

    // принудительная привязка контекста для методов
    self.render = self.render.bind(self);
    self.scrollHandler = self.scrollHandler.bind(self);
    self.calc = self.calc.bind(self);
    self.init();
  }


  ScrollPathFinder.prototype.calc = function() {
      var self = this;

      self.winCenter = getViewportH() / 2;
      self.rectH = self.svg.clientHeight;
      self.rect = self.bg.getBoundingClientRect();
  };


  ScrollPathFinder.prototype.init = function() {
    var self = this,
        values = [];

    self.calc();
    var points = self.points.split(/[ ,]+/);

    for (var i = 0; i < points.length - 2; i += 2) {
      var x = parseFloat(points[i]) + self.rect.left,
          y = parseFloat(points[i + 1]);

      values.push({
        x: x - (light.width / 2),
        y: y - (light.height / 2)
      });
    }

    TweenMax.set(self.light, {
      x: values[0].x,
      y: values[0].y
    });

    self.tween = new TweenMax(self.light, self.duration, {
        bezier: {
          type: "thru",
          curviness: 0,
          values: values
       },
       paused: true
    });

    self.bindEvents();
    self.render();
  };


  ScrollPathFinder.prototype.scrollHandler = function() {
    var self = this;
    self.rect = self.bg.getBoundingClientRect();
  };


  ScrollPathFinder.prototype.bindEvents = function() {
    var self = this;
    window.addEventListener('scroll', self.scrollHandler);
    window.addEventListener('resize', self.calc);
  };


  ScrollPathFinder.prototype.render = function() {
      var self = this;
      var elCenter = self.rect.top + (self.rectH / 2);  //center of layer from document top
      var scrollFromMiddle =  -(elCenter - self.winCenter);
      var time = (scrollFromMiddle) / 1000;     //window.innerHeight; //multiplier decides how fast it animates

      time -= self.duration / 2;
      self.tween.time(time);

      requestAnimationFrame(self.render);
  };


  window.ScrollPathFinder = ScrollPathFinder;
})(window, document);
