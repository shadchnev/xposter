$(document).ready(function() {
  state = { // state of tabs: on or off, and associated actions
    twitter: {enabled: true, insertButton: updateTweetButton, click: function(){}},
    facebook: {enabled: false, insertButton: insertFacebookButton, click: clickFacebookTab}
  }
  injectXPoster();  
})

chrome.extension.onRequest.addListener( // fb posting is async, so we need this to learn that it was successful
  function(request, sender, sendResponse) {
    if (request.action == "fb_post_successful") {
      // since we live in an isolated world and can't access the page's JS directly, we have to inject the code to execute it
      var script = document.createElement('script');
      script.setAttribute("type", "application/javascript");
      script.textContent = "twttr.showMessage('Your Facebook update has been sent')";
      document.body.appendChild(script); // run the script
      document.body.removeChild(script); // clean up
      $(".twitter-anywhere-tweet-box-editor").val("");    
    }
  }
);

function injectXPoster() {  
  setInterval(function(){ // because Twitter redraws the interface after page load and sometimes after page load, so I never disable this timer    
    if ((twitterBoxPresent()) && ($('.xposter').length == 0)) {      
      console.log('injected');
      $("<div />").addClass('xposter').insertBefore('.text-area');
      insert('twitter');
      insert('facebook');
      $('textarea.twitter-anywhere-tweet-box-editor').on("keyup", textareaChange);
      matchUI2State();
  	}
  }, 500); 
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
  $('<a />').attr('href', '#').addClass('xfacebook-button btn primary-btn disabled').text('Share on Facebook').appendTo('.tweet-button-sub-container').click(postToFacebook);
}

function updateTweetButton() {
  $('.tweet-button').addClass('xtwitter-button'); // to have a universal naming scheme for all buttons
}


// this function relies on the states we defined at the beginning of the file
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
	state[element].click(state[element].enabled); // this calls the handler defined on the state in $(document).ready()
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















