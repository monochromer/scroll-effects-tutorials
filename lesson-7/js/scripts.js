(function(){
  // helpers
  var $ = document.querySelector.bind(document);
  Node.prototype.on = window.on = function(event, fn) {
      this.addEventListener(event, fn, false);
  };

  var $sceneIntro = $('.js-scene--intro'),
      $sceneOutro = $('.js-scene--outro'),
      $sceneAlice = $('.js-scene--alice'),
      $elContent  = $('.js-content'),
      $elTitle    = $('.js-title'),
      $elTrack    = $('.js-timeline-track');

  var introBox   = $sceneIntro.getBoundingClientRect(),
      outroBox   = $sceneOutro.getBoundingClientRect(),
      aliceBox   = $sceneAlice.getBoundingClientRect(),
      contentBox = $elContent.getBoundingClientRect(),
      titleBox   = $elTitle.getBoundingClientRect();

  var timeline = [];

  // Add intro scene animation to timeline
  timeline.push({
    min: introBox.top,
    max: introBox.height / 4,
    freeze: false,
    fn: function(progress) {
      if (this.freeze) {
          return;
      }

      var opacity = 100 - progress;

      window.requestAnimationFrame(function() {
        $sceneIntro.style['-webkit-filter'] = 'opacity(' + opacity + '%)';
        $sceneIntro.style['visibility'] = (opacity === 0) ? 'hidden' : 'visible';

        // remove this scene after the fade-out
        if (progress === 100) {
          timeline.splice(0,1);
        }
      });
    }
  });

  // Add Alice scene offset animation to timeline
  timeline.push({
    // chain after prev animation
    min: timeline[timeline.length - 1].max + aliceBox.top,
    max: timeline[timeline.length - 1].max + aliceBox.top + aliceBox.height,
    freeze: false,
    fn: function(progress) {
      if (this.freeze) {
        return;
      }

      var maxOffset = aliceBox.height - window.innerHeight;
      var offset = -1 * Math.ceil((maxOffset * progress) / 100);

      window.requestAnimationFrame(function() {
        var str = 'translate3d(0, ' + offset + 'px, 0)';
        $sceneAlice.style['-webkit-transform'] = str;
        $sceneAlice.style['transform'] = str;
      })
    }
  });

  // Add text offset animation to timeline
  timeline.push({
    min: timeline[timeline.length - 1].min * 1.4  + contentBox.top,
    max: timeline[timeline.length - 1].min * 1.4 + contentBox.top + contentBox.height,
    freeze: false,
    fn: function(progress) {
      if (this.freeze) {
        return;
      }

      var maxOffset = aliceBox.height - contentBox.top;
      var offset = Math.ceil((maxOffset * progress) / 100);

      window.requestAnimationFrame(function() {
        $elContent.style['margin-top'] = offset + 'px';
      })
    }
  });

  // Add fade-to-black animation to timeline
  timeline.push({
    min: timeline[timeline.length - 1].max * 0.85, // early start
    max: timeline[timeline.length - 1].max, // quick transition
    freeze: false,
    fn: function(progress) {
      if (this.freeze) {
          return;
      }

      var opacity = progress;

      window.requestAnimationFrame(function() {
        $sceneOutro.style['-webkit-filter'] = 'opacity(' + opacity + '%)';
        $sceneOutro.style['visibility'] = (opacity === 0) ? 'hidden' : 'visible';

        if (progress === 100) {
          $sceneOutro.classList.add('complete')
        } else {
          $sceneOutro.classList.remove('complete')
        }
      })
    }
  });

  function setup() {
    /*
      All scenes are `position: fixed`. The .timeline-track el is a placeholder
      to create artificial height so the page can be scrolled.

      Set .timeline-track height to the maximum extent that needs to be reched
      by the scroll.
    */
    var max = 0;

    timeline.forEach(function(t) {
      max = (max < t.max) ? t.max : max;
    });

    $elTrack.style.height = window.innerHeight + Math.round(max) + "px";

    // listen to scroll change and trigger animations
    window.on('scroll', function(e) {
        var scrollY = window.scrollY;

        // run animations that fit scroll range
        timeline.forEach(function(t) {
          if (t.min < scrollY && scrollY < t.max) {
            var progress = (scrollY - t.min) / (t.max - t.min);
            t.freeze = false;
            t.fn.call(t, Math.ceil(progress * 100));
          }

          /*
            'scroll' event granularity is not consistent when scrooling.
            Clamp the progress at 0 or 100 and complete any leftover animation,
            then freeze until the scroll gets within min/max range again.
          */
          if (scrollY > t.max) {
            t.fn.call(t, 100);
            t.freeze = true;
          }

          if (scrollY < t.min) {
            t.fn.call(t, 0);
            t.freeze = true;
          }
        })
    });
  }

  // feature detection
  ['shape-outside'].forEach(function(property) {
    // check if any variant exists, prefixed or not
    var isCapable = ['', '-webkit-', '-moz-', '-ms-'].some(function(prefix){
      return (prefix + property) in document.body.style;
    })

    if (isCapable) {
      document.documentElement.classList.add('shapes');
      setup();
    }
  });

})();
