(function(jQuery, undefined) {
  
  var $ = jQuery,
      scrollTopOld = jQuery.fn.scrollTop,
      dataKey = 'scroll-event';
      
  function getScrollInfo($elm) {
    var info = $elm.data(dataKey) || {};
    $elm.data(dataKey, info);
    return info;
  }

  
  function mappedElement(elm) {
    if (elm === document || elm === window || elm.tagName === 'HTML' || elm.tagName === 'BODY') {
      elm = document;
    }
    
    return $(elm);
  }

  function scrollFilter(event, originalEvent) {
    var $elm = mappedElement(event.target),
        info = getScrollInfo($elm),
        scrollTop = $elm.scrollTop(),
        diff = Math.floor(info.expectedScrollPos - scrollTop);

    if (info.scrollSet && diff === 0) {
      event.scrollType = 'programm';
    } else {
      event.scrollType = 'user';
    }

    info.scrollSet = false;

    return event;
  };


  jQuery.event.fixHooks.scroll = jQuery.event.fixHooks.scroll || {};
  jQuery.event.fixHooks.scroll.filter = scrollFilter;

  //TODO we need scrollLeft support
  jQuery.Tween.propHooks.scrollTop = /*jQuery.Tween.propHooks.scrollLeft =*/ {
    set: function(tween) {
      var $elm, info;
      
      if (tween.elem.nodeType && tween.elem.parentNode) {
        $elm = mappedElement(tween.elem);
        info = getScrollInfo($elm);
        
        info.scrollSet = true;

        /*
          Only set the expected value if start and end value are different.
        
          This is used to support scroll animations on html/body as they both map do document.
          $('body, html').animate({scrollTop:x},1000);
        */
        if (tween.start !== tween.end) {
          info.expectedScrollPos = tween.now;
        }
        
        tween.elem[tween.prop] = tween.now;
      }
    }
  };


  jQuery.fn.scrollTop = function() {

    if (arguments.length === 0) {
      this.each(function(elm) {
        var $elm = mappedElement(elm),
            info = getScrollInfo($elm);
        
        info.scrollSet = true;
      });
    }

    return scrollTopOld.apply(this, arguments);
  };
  
}(jQuery));
