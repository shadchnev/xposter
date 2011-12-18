$(document).ready(function() {
  state = {
    twitter: {enabled: true, insertButton: updateTweetButton, click: function(){}},
    facebook: {enabled: false, insertButton: insertFacebookButton, click: clickFacebookTab}
  }
  injectXPoster();
  $('textarea.twitter-anywhere-tweet-box-editor').on("keyup", textareaChange);
})

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "fb_post_successful") {
      $(".twitter-anywhere-tweet-box-editor").val("");    
    }
  }
);

function injectXPoster() {
  setTimeout(function() {
    if (twitterBoxPresent()) injectTwitterInterface();
  }, 1000)
}

function textareaChange(event) {
  if ($(event.target).val().length == 0) {
    $(".tweet-button-sub-container .btn").addClass("disabled");
  } else {
    $(".tweet-button-sub-container .btn").removeClass("disabled");
  }
}

function twitterBoxPresent() {
  return ($('textarea.twitter-anywhere-tweet-box-editor').length > 0);
}

function postToFacebook() {
  chrome.extension.sendRequest({action: "fb_post", message: $(".twitter-anywhere-tweet-box-editor").val()}, function(response) {
    console.log(response.status)
  });
}

function clickFacebookTab(currentState) {
  chrome.extension.sendRequest({action: "fb_login"}, function(response) {
    console.log(response.status);
  });
}

function insertFacebookButton() {
  $('<a />').attr('href', '#').addClass('xfacebook-button btn primary-btn').text('Share on Facebook').appendTo('.tweet-button-sub-container').click(postToFacebook);
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

function selectTab(element) {
	state[element].click(state[element].enabled);
  if (state[element].enabled) return;
  for (e in state) state[e].enabled = false;
  state[element].enabled = true;
  matchUI2State();  
}

function insert(element) {
  $('<div />').addClass('xnetwork').addClass('x' + element).appendTo('.xposter').click(function() { selectTab(element) });	
  enable(element);  
  state[element].insertButton();
}

function disable(element) {
	$('.x' + element).removeClass('x' + element + '-up').addClass('x' + element + '-down');
}

function enable(element) {
	$('.x' + element).removeClass('x' + element + '-down').addClass('x' + element + '-up');
}















