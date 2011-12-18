/*
 * Simple Facebook API wrapper, can handle graph or rest api calls via FB.api
 * Written by Zach Allia in 2011, modified by E. Shadchnev
 *
 */
(function($) {
	var	appId = "211613895587953",
		// perms = "offline_access,read_stream,publish_stream,read_mailbox,user_status,user_birthday,friends_birthday,user_checkins,friends_checkins,user_photos,friends_photos,publish_checkins,manage_notifications",
		perms = "publish_stream",
		URL = {
			graph: "https://graph.facebook.com/",
			api: "https://api.facebook.com/restserver.php"
		};
		
		
	var FB = window.FB = {
    	login: function() {
    		var url = URL.graph + "oauth/authorize?client_id=" + appId + "&redirect_uri=https://www.facebook.com/connect/login_success.html&type=user_agent&display=popup&scope=" + perms;	
        fbwindow = window.open(url,"fbconnect");
    	},
    	logout: function(callback) {
    		FB.api("auth.revokeAuthorization", callback);
    		window.open("https://www.facebook.com/logout.php?next=http://www.facebook.com&access_token=" + FB.token());
    		localStorage.clear();
    	},
    	token: function() {
    		if(localStorage._fbtoken && localStorage._fbtoken != "false") {
    			return localStorage._fbtoken;
    		} else {
    			return false;
    		}
    	},
    	requireLogin: function() {
    		if(!localStorage._fbtoken) {
    			FB.login();
    		}
    	},
    	rest: function(method,options,callback) {
    		callback = (typeof options == "function") ? options : (callback || function() {});
    		options = (typeof options == "function") ? {} : (options || {});
    		var params = {"access_token": FB.token(),
    					  "format": "json-strings",
    					  "method": method
    					 };
    		$.extend(params, options);
    		
    		$.getJSON(URL.api + "?callback=?", params, function(res) {
    			$("#loader").hide();
    			callback(res);
    		});
    	},
    	permissions: function(callback) {
    	   var t = decodeURIComponent(FB.token());
    	   $.getJSON(URL.graph + 'me/permissions' + "?access_token=" + t + "&callback=?", function(res) {
    			callback(res);
    		});
    	},
    	graph: function(method,options,callback) {
    	   method = method.replace(/\/$/, "");
    		callback = (typeof options == "function") ? options : (callback || function() {});
    		options = (typeof options == "function") ? {} : (options || {});
    		var t = decodeURIComponent(FB.token());
    		$.getJSON(URL.graph + method + "?access_token=" + t + "&callback=?", options, function(res) {
          // $("#loader").hide();
    			callback(res);
    		});
    	},
    	api: function(method, options, callback) {
    		if((method.indexOf(".") != -1 || method.indexOf("_") != -1) && method.indexOf("/") == -1) {
    			method = method.replace(".","_");
    			FB.rest(method,options,callback);
    		} else {
    			FB.graph(method,options,callback);
    		}
        // $("#loader").show();
    	}
    }
})(jQuery);