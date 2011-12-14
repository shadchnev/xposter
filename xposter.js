$(document).ready(function() {
  console.log("xposter.loaded. jQuery.version = " + $.fn.jquery);
  injectXPoster();
  state = {
    twitter: {enabled: true, insertButton: updateTweetButton},
    facebook: {enabled: false, insertButton: insertGPlusButton}
  }
})

function injectXPoster() {
  setTimeout(function() {
    if (twitterBoxPresent()) injectTwitterInterface();
  }, 1000)
}

function twitterBoxPresent() {
  return ($('textarea.twitter-anywhere-tweet-box-editor').length > 0);
}

function postToGPlus() {
  
}

function insertGPlusButton() {
  $('<a />').attr('href', '#').addClass('xfacebook-button btn disabled').text('Share on Facebook').appendTo('.tweet-button-sub-container').click(postToGPlus);
}

function updateTweetButton() {
  $('.tweet-button').addClass('xtwitter-button'); // to have a universal naming scheme for all buttons
}

function injectTwitterInterface() {
  var interval = setInterval(function(){ // because Twitter redraws the interface after page load
    if ($('.xposter').length == 0) {      
      console.log('injected');
      // clearInterval(interval);
      $("<div />").addClass('xposter').insertBefore('.text-area');
      insert('twitter');
      insert('facebook');
      matchUI2State();
  	}
  }, 100); 
}

function matchUI2State() {
  $('.tweet-button-sub-container .btn').hide();
  for (e in state) {
    state[e].enabled ? enable(e) : disable(e);
    if (state[e].enabled) {
      console.log("showing button for " + e);
      $('.tweet-button-sub-container .x' + e + '-button').show();
    }
  }
}

function toggle(element) {
  if (state[element].enabled) return;
  for (e in state) state[e].enabled = false;
  state[element].enabled = true;
  matchUI2State();  
}

function insert(element) {
  $('<div />').addClass('xnetwork').addClass('x' + element).appendTo('.xposter').click(function() { toggle(element) });	
  enable(element);  
  state[element].insertButton();
}

function disable(element) {
	$('.x' + element).removeClass('x' + element + '-up').addClass('x' + element + '-down');
}

function enable(element) {
	$('.x' + element).removeClass('x' + element + '-down').addClass('x' + element + '-up');
}















