;(function(window, document, undefined) {
  'use strict';

  function getViewportH() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  };

  function CanvasParallax(options) {
    var self = this;
    self.element = options.element;
    self.context = self.element.getContext('2d');
    self.canvasW = self.element.width;
    self.canvasH = self.element.height;
    self.canvasRect = {};
    self.winCenter = null;
    self.layers = options.layers;
    self.loadLayerCount = 0;
    this.scrollHandler = this.scrollHandler.bind(this);
    this.render = this.render.bind(this);
    this.calc = this.calc.bind(this);
    this.init();
  }

  CanvasParallax.prototype.init = function() {
    var self = this;
    self.calc();
    self.bindEvents();
    self.loadLayers();
  };

  CanvasParallax.prototype.calc = function() {
    var self = this;
    self.canvasRect = self.element.getBoundingClientRect();
    self.winCenter = getViewportH() / 2;
  };

  CanvasParallax.prototype.scrollHandler = function() {
    var self = this;
    self.canvasRect = self.element.getBoundingClientRect();
  };

  CanvasParallax.prototype.bindEvents = function() {
    var self = this;
    window.addEventListener('scroll', self.scrollHandler);
    window.addEventListener('resize', self.calc);
  };

  CanvasParallax.prototype.loadLayers = function() {
    var self = this;
    for (var i = 0; i < self.layers.length; i += 1) {
      var img = new Image();
      img.src = self.layers[i].url;
      img.onload = self.loadHandler.bind(self);
      self.layers[i].img = img;
    }
  };

  CanvasParallax.prototype.loadHandler = function() {
    var self = this;
    self.loadLayerCount += 1;
    (self.loadLayerCount == self.layers.length) && self.render();
  };

  CanvasParallax.prototype.render = function() {
    var self = this,
        ctx = self.context,
        elCenter,
        scrollFromMiddle,
        y,
        len = self.layers.length;

    ctx.clearRect(0, 0, self.canvasW, self.canvasH);
    ctx.fillStyle = '#1b323d';

    // новая фигура визуализируется поверх уже добавленных на холст
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, self.canvasW, self.canvasH);

    // center of layer from viewport top
    elCenter = self.canvasRect.top + (self.canvasH / 2);
    // distance between element center and viewport center
    scrollFromMiddle = elCenter - self.winCenter;

    for (var i = 0; i < len; i += 1) {
      // multiply by offset and add base y
      y = self.layers[i].y + (scrollFromMiddle * self.layers[i].offset);

      if (i == len - 1) {
        /* Сохраняются только те фрагменты существующих фигур,
         которые перекрываются новой фигурой.
        Все остальное, включая новую фигуру, становится прозрачным */
        ctx.globalCompositeOperation = "destination-in";
      }

      ctx.drawImage(self.layers[i].img, self.layers[i].x, y);
    }

    requestAnimationFrame(self.render);
  };

  window.CanvasParallax = CanvasParallax;
})(window, document);
