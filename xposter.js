$(document).ready(function() {
  console.log("xposter.loaded. jQuery.version = " + $.fn.jquery);
  injectXPoster();
  state = {
    twitter: true,
    gplus: false
  }
})

function injectXPoster() {
  if (oldTwitterVersion()) injectOldTwitter();
}

function oldTwitterVersion() {
  return ($('.tweet-box .text-area').length > 0);
}

function injectOldTwitter() {
  setInterval(function(){ // because Twitter redraws the interface after page load
    if ($('.xposter').length == 0) {
      $("<div />").addClass('xposter').insertBefore('.text-area');
      insertTwitter();
      insertGPlus();
      matchUI2State();
  	}
  }, 1000); 
}

function matchUI2State() {
  state.twitter ? enableTwitter() : disableTwitter();
  state.gplus ? enableGPlus() : disableGPlus();
}

function insertTwitter() {
  $('<div />').addClass('xnetwork').addClass('xtwitter').appendTo('.xposter');	
  enableTwitter();
}

function insertGPlus() {
  $('<div />').addClass('xnetwork').addClass('xgplus').appendTo('.xposter');	
  enableGPlus();
}

function disableTwitter() {
	$('.xtwitter').removeClass('xtwitter-up').addClass('xtwitter-down');
}

function disableGPlus() {
	$('.xgplus').removeClass('xgplus-up').addClass('xgplus-down');
}

function enableTwitter() {
	$('.xtwitter').removeClass('xtwitter-down').addClass('xtwitter-up');
}

function enableGPlus() {
	$('.xgplus').removeClass('xgplus-down').addClass('xgplus-up');
}
