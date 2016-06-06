;(function() {

    function updateInview() {
      var elems = document.querySelectorAll('[data-inview]'),
          i;

      for (i = 0; i < elems.length; i++) {
        var rect = elems[i].getBoundingClientRect(),
            prevValue = elems[i].dataset.inview,
            newValue,
            inviewEvent;

        if (rect.top > window.innerHeight || rect.bottom < 0) {
          // Element outside of viewport
          newValue = "0";
        } else if (rect.top < (window.innerHeight / 2) - (rect.height / 2) && rect.top > 0) {
          // Element inside viewport above center
          newValue = "3";
        } else if (rect.bottom < window.innerHeight && rect.top > 0) {
          // Element inside viewport but below center
          newValue = "2";
        } else {
          // Element partially in viewport
          newValue = "1";
        }

        if (newValue !== prevValue) {
          elems[i].dataset.inview = newValue;
          inviewEvent = new CustomEvent('inview', {'detail': newValue});
          elems[i].dispatchEvent(inviewEvent);
        }
      }
    }


    function addInviewListener() {
      var elems = document.querySelectorAll('[data-inview]'),
          i;

      for (i = 0; i < elems.length; i++) {
        elems[i].addEventListener('inview', function (e) {
          switch (e.detail) {
            case "0":
              triggerStatus.innerHTML = "0: Element outside of viewport";
            break;
            case "1":
              triggerStatus.innerHTML = "1: Element partially in viewport";
            break;
            case "2":
              triggerStatus.innerHTML = "2: Element inside viewport but below center";
            break;
            case "3":
              triggerStatus.innerHTML = "3: Element inside viewport above center";
            break;
          }
          console.log('inview:' + e.detail);
          console.log(e.target);
        });
      }
    }

    addInviewListener();
    requestAnimationFrame(loop);

    var scrolled = false;

    window.addEventListener('scroll', function () {
      scrolled = true;
    })

    function loop() {
      if (scrolled) {
        updateInview();
      }
      scrolled = false;
      requestAnimationFrame(loop);
    }

})();
