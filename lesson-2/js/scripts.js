;(function(window, document, undefined) {
  'use strict';

  function LayerParallax(options) {
    this.layers = [];
    this.layerElements = Array.prototype.slice.call(options.elements);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.render = this.render.bind(this);
    this.calc = this.calc.bind(this);
    this.init();
  }

  LayerParallax.prototype.init = function() {
    var self = this;
    self.calc();
    self.bindEvents();
    requestAnimationFrame(self.render);
  };

  LayerParallax.prototype.calc = function() {
    var i,
        el,
        self = this,
        factor,
        len = self.layerElements.length;

    for (i = 0; i < len; i += 1) {
      el = self.layerElements[i];
      factor = parseFloat(el.dataset.parallax);
      self.layers.push({
        el: el,
        offset: 0,
        factor: factor
      });
    };
  };

  LayerParallax.prototype.bindEvents = function() {
    var self = this;
    window.addEventListener('scroll', self.scrollHandler);
    window.addEventListener('resize', self.calc);
  };

  LayerParallax.prototype.scrollHandler = function() {
    this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
  };

  LayerParallax.prototype.render = function() {
    var self = this,
        i,
        oldOffset,
        layer,
        len = self.layers.length;

    for (i = 0; i < len; i += 1) {
      layer = self.layers[i];
      oldOffset = layer.offset;
      layer.offset = this.scrollY * layer.factor;

      if (oldOffset !== layer.offset) {
        layer.el.style.transform = 'translateY(' + layer.offset + 'px)';
      }
    }

    requestAnimationFrame(self.render);
  };

  LayerParallax.prototype.destroy = function() {
    var self = this;
    window.removeEventListener('scroll', self.scrollHandler);
    window.removeEventListener('resize', self.calc);
    delete self.layers;
    delete self.layersElements;
    delete self.scrollHandler;
  };


  window.LayerParallax = LayerParallax;
})(window, document);
