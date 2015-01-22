var scrollTopOld = jQuery.fn.scrollTop;


jQuery.event.fixHooks.scroll = jQuery.event.fixHooks.scroll || {};
jQuery.event.fixHooks.scroll.filter = function(event, originalEvent) {
  var $elm = $(event.target);
  if ($elm[0] === document || $elm[0] === window) {
    $elm = $('body');
  }

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

jQuery.Tween.propHooks.scrollTop = jQuery.Tween.propHooks.scrollLeft = {
  set: function(tween) {
    if (tween.elem.nodeType && tween.elem.parentNode) {
      var $elm = $(tween.elem);
      
      $elm.data('event-scroll-set', true);
      $elm.data('event-scroll-expected', tween.now);
      tween.elem[tween.prop] = tween.now;
    }
  }
};

jQuery.fn.scrollTop = function() {
  if (arguments.length > 0) {
    var $elm = $(this);
    if ($elm[0] === document || $elm[0] === window) {
      $elm = $('body');
    }
    $elm.data('event-scroll-set', true);
  }

  return scrollTopOld.apply(this, arguments);
};

