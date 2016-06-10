/**
 * Анимация обводки при скролле
 */
;(function(window, document, undefined) {

  'use strict';
  var maxS; // для хранения макс. возможной прокрутки

  // высота области просмотра баузера
  var getViewportH = function() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  };

  // величина прокрутки
  var getScrollY = function(container) {
    return (container && container.scrollTop) || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  };

  // высота всего документа
  var getDocumentHeight = function() {
    return Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
  };

  // величиниа максимально возможной прокрутки
  var getMaxScroll = function() {
    return getDocumentHeight() - getViewportH();
  };


  // величина текущей прокрутки в долях
  var getScrollPercentage = function() {
    return getScrollY() / maxS;
  };

  var setMaxScroll = function() {
    return maxS = getMaxScroll();
  };

  var extend = function(a, b) {
    var key;
    for (key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  };


  /**
   * Функция-конструктор
   */
  function DrawSVGOnScroll(options) {
    this.options = extend({}, options);
    this.init();
  };
  DrawSVGOnScroll.prototype.init = function() {
    setMaxScroll();

    var self = this,
      elems = self.options.elems,
      elemCount = elems.length,
      lens = new Array(elemCount);

    elems.forEach(function(item, index, arr) {
      var pathLength = item.getTotalLength();
      lens[index] = pathLength;
      item.style.strokeDasharray = pathLength + ' ' + pathLength;
      item.style.strokeDashoffset = pathLength;
    });

    window.addEventListener('scroll', function(e) {
      var scrollPercentage = getScrollPercentage(),
        index;

      for (index = 0; index < elemCount; index += 1) {
        var pathLength = lens[index],
          drawLength = lens[index] * scrollPercentage,
          elem = elems[index];

        elem.style.strokeDashoffset = pathLength - drawLength;

        if (scrollPercentage < 0.1) {
            elem.style.strokeDasharray = 0;
        }

        if (scrollPercentage >= 0.99) {
          elem.style.strokeDasharray = "none";
          elem.style.fillOpacity = '1';
          elem.style.strokeOpacity = '0';
        } else {
          elem.style.strokeDasharray = pathLength + ' ' + pathLength;
          elem.style.fillOpacity = '';
          elem.style.strokeOpacity = '';
        }
      };
    });

    window.addEventListener('resize', function() {
      setMaxScroll();
    });
  };

  window.DrawSVGOnScroll = DrawSVGOnScroll;

})(window, document);


/**
 * Вспомогательные  функции для поиска элементов в DOM
 */
var $ = function(selector, context) {
  return (context || document).querySelector(selector) || null;
};
var $$ = function(selector, context) {
  return Array.prototype.slice.call((context || document).querySelectorAll(selector)) || null;
};


document.addEventListener('DOMContentLoaded', function() {

  var drawer = new DrawSVGOnScroll({
    elems: $$('.logo path')
  });

});
