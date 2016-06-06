;(function() {
    'use strict';

    // набор картинок для загрузки и данных, нужных для позиционирования и параллакса
    var assets = [
            {url: 'img/4-layer4.svg', x: -100, y: -100, offset: -0.4},
            {url: 'img/4-layer3.svg', x: -100, y: 150, offset: -0.3},
            {url: 'img/4-layer2.svg', x: -90, y: 180, offset: -0.2},
            {url: 'img/4-layer1.svg', x: -190, y: 230, offset: -0.1},
            {url: 'img/4-logo.svg', x: 155, y: 70, offset: 0.1},
            {url: 'img/4-border.svg', x: 20, y: 20, offset: 0},
            {url: 'img/4-mask.svg', x: 0, y: 0, offset: 0}
        ],
        layers = [],
        // размеры области
        w = 505,
        h = 460,
        // счетчик загрузки изображений
        loaded = 0,
        container = document.getElementById('container'),
        s = new Snap(w, h),
        grad,
        gradEl;


    container.appendChild(s.node);

    var g = s.g();
    var c = s.g();
    c.attr({transform: 'scale(1)'});
    g.append(c);

    for (var i = 0; i < assets.length; i++) {
      var img = new Image();
      img.src = assets[i].url;
      img.onload = loadHandler;

      var _img = s.image(assets[i].url, assets[i].x, assets[i].y);
      c.append(_img);
      layers.push(_img);
    }


    // обработчик загрузки одной картинки
    function loadHandler(e) {
      loaded += 1;

      if (loaded == assets.length) {
        loadCompleteHanlder();
      }
    }

    // обработчик загрузки всех картинок
    function loadCompleteHanlder() {
      var _mask = layers[layers.length - 1];
      g.attr({mask: _mask});

      createGradient();

      container.addEventListener('mousemove', moveHandler);
      container.addEventListener('mouseout', outHandler);
      container.addEventListener('mouseover', overHandler);
    }

    // обработчик перемещения указателя
    function moveHandler(e) {
      var dx = e.offsetX - (w / 2);
      var dy = e.offsetY - (h / 2);

      for (var i = 0; i < layers.length; i += 1) {
        var l = layers[i];
        var _x = dx * assets[i].offset;
        var _y = dy * assets[i].offset;
        TweenMax.to(l.node, 0.1, {x: _x, y: _y});
      }

      updateGradient(e);
      TweenMax.to(s.node, 0.2, {rotationY: dx / 10, rotationX: -dy / 10});
    }

    // обработчик отведения указателя
    function outHandler(e) {
      for (var i = 0; i < layers.length; i += 1) {
        var l = layers[i];
        TweenMax.to(l.node, 0.2, {x: 0, y: 0, ease: Quad.easeOut});
      }

      TweenMax.to(s.node, 0.2, {scale: 0.9, rotationY: 0, rotationX: 0, ease: Quad.easeOut});
      TweenMax.to(c.node, 1, {rotationY: 0, rotationX: 0});
    }

    // обработчик наведения указателя
    function overHandler(e) {
      TweenMax.to(s.node, 0.2, {scale: 1, ease: Back.easeOut});
    }

    // функции для работы с градиентом
    function createGradient() {
      grad = s.gradient("l(0, 0, 1, 1)rgba(0,0,0,0.5)-rgba(0,0,0,0):75");

      gradEl = s.rect(0, 0, w, h);
      gradEl.attr({fill: grad, opacity: 0});

      g.append(gradEl);
    }

    function updateGradient(e) {
      var dx = e.offsetX - (w / 2);
      var dy = e.offsetY - (h / 2);
      var angle = Math.atan2(dy, dx);
      var points = angleToPoints(angle);

      var _opacity = Math.sqrt((dx * dx) + (dy * dy));

      grad.attr(points);
      TweenMax.to(gradEl.node, 0.1, {opacity: _opacity / (w / 2)});
    }

    function angleToPoints(angle) {
      var segment = Math.floor(angle / Math.PI * 2) + 2;
      var diagonal =  (1/2 * segment + 1/4) * Math.PI;
      var op = Math.cos(Math.abs(diagonal - angle)) * Math.sqrt(2);
      var x = op * Math.cos(angle);
      var y = op * Math.sin(angle);

      return {
        x1: x < 0 ? 1 : 0,
        y1: y < 0 ? 1 : 0,
        x2: x >= 0 ? x : x + 1,
        y2: y >= 0 ? y : y + 1
      };
    }

})();
