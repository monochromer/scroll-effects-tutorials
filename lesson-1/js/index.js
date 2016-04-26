;(function(window, document) {

  var layers,
    len,
    depths;

  layers = Array.prototype.slice.call(document.querySelectorAll("[data-type='parallax']"));
  depths = layers.map(function(layer) {
    return layer.getAttribute('data-depth');
  });


  function render() {
    var topDistance = window.pageYOffset,
      layer,
      depth,
      movement,
      translate3d;

    for (len = layers.length; len > 0; len -= 1) {
      layer = layers[len - 1];
      depth = depths[len - 1];
      movement = -(topDistance * depth);
      translate3d = 'translate3d(0, ' + movement + 'px, 0)';
      layer.style.transform = translate3d;
    };
  };


  function updateView() {
    render();
    requestAnimationFrame(updateView);
  };

  updateView();

})(window, document);