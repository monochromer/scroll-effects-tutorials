'use strict';

var ctrl = new ScrollMagic.Controller();

var sections = document.querySelectorAll('.section');

Array.prototype.forEach.call(sections, function (section) {
  new ScrollMagic.Scene({
    triggerElement: section,
    triggerHook: 0
  })
  .setClassToggle(section, 'section_fix')
  .addTo(ctrl);
});

// Array.prototype.forEach.call(sections, (section) => {
//   new ScrollMagic.Scene({
//     triggerElement: section,
//     triggerHook: 0.5,
//     duration: '50%'
//   })
//   .addTo(ctrl)
//   .on('progress', function(e) {
//     var scene = e.target;
//     var el = scene.triggerElement();
//     var content = el.querySelector('.section__content');
//     content.style.transform = `translateY(${50*(e.progress - 1)}vh)`
//   });
// });

var lastScene = new ScrollMagic.Scene({
    triggerElement: "#id4",
    triggerHook: 0
  })
  .setClassToggle('#id4', 'section_end')
  .addTo(ctrl);
