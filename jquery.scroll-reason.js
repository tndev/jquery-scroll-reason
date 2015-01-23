(function(jQuery, undefined) {
  var $ = jQuery,
    scrollTopOld = jQuery.fn.scrollTop;

  function mappedElement(elm) {

    if (elm === document || elm === window || elm.tagName === 'HTML' || elm.tagName === 'BODY') {
      elm = document;
    }

    return $(elm);
  }

  function scrollFilter(event, originalEvent) {
    var $elm = mappedElement(event.target);


    var expectedScroll = $elm.data('event-scroll-expected');
    var scrollTop = $elm.scrollTop();
    var diff = Math.floor(expectedScroll - scrollTop);
    var scrollTopSet = $elm.data('event-scroll-set');

    if (scrollTopSet && diff == 0) {
      event.scrollType = 'programm';
    } else {
      event.scrollType = 'user';
    }

    $elm.data('event-scroll-set', false);

    return event;
  };

  jQuery.event.fixHooks.scroll = jQuery.event.fixHooks.scroll || {};
  jQuery.event.fixHooks.scroll.filter = scrollFilter;

  jQuery.Tween.propHooks.scrollTop = jQuery.Tween.propHooks.scrollLeft = {
    set: function(tween) {
      if (tween.elem.nodeType && tween.elem.parentNode) {
        var $elm = mappedElement(tween.elem);
        $elm.data('event-scroll-set', true);
        if (tween.start !== tween.end) {
          //we only need to do something of the values differ
          //this is a hack for the $('body, html').animate({scrollTop:x},1000);
          $elm.data('event-scroll-expected', tween.now);
        }
        tween.elem[tween.prop] = tween.now;
      }
    }
  };

  jQuery.fn.scrollTop = function() {

    if (arguments.length === 0) {
      this.each(function(elm) {
        var $elm = mappedElement(elm);
        $elm.data('event-scroll-set', true);
      });
    }

    return scrollTopOld.apply(this, arguments);
  };
}(jQuery));
