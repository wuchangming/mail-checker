
var canvas;
var canvasContext;
var loggedInImage;
var requestFailureCount = 0;  // used for exponential backoff
var requestTimeout = 1000 * 2;  // 5 seconds

var unreadCount = "";
var loadingAnimation = new LoadingAnimation();
var checker = new CheckMailClass();
var icon_url = '';

if (!chrome.cookies) {
	chrome.cookies = chrome.experimental.cookies;
}
    
// A "loading" animation displayed while we wait for the first response from
// Gmail. This animates the badge text with a dot that cycles from left to
// right.

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	if (changeInfo.url && checker.isEmailUrl(changeInfo.url)) {
		checker.getInboxCount(function(count) {
			updateUnreadCount(count);
			});
	}
});

function isInit() {
	if(typeof(localStorage.email)=="undefined" || localStorage.email.length<6) 
		return false;
		
	if(typeof(localStorage.password)=="undefined" || localStorage.password.length<6) 
		return false;
		
	return true;
}

function init() {
	canvas = document.getElementById('canvas');
	loggedInImage = document.getElementById('logged_in');
	canvasContext = canvas.getContext('2d');
  
	unreadCount = "";
	
	if(!isInit()) 
	{
		chrome.browserAction.setIcon({path: checker.email_not_logged_in_ico});
		return;
	}
  
	checker.init(localStorage.mailserver);
	loggedInImage.src = checker.email_logged_in_ico;
	icon_url = 'http://www.'+localStorage.mailserver +'/favicon.ico';

	chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
	chrome.browserAction.setIcon({path: checker.email_logged_in_ico});
	loadingAnimation.start();

	startRequest();
}

function scheduleRequest() {
	window.setTimeout(startRequest, localStorage.checkcycle * 1000 * 60);
}

function startRequest() {
	//console.debug('mail:' + localStorage.email )
	//console.debug('password:' + localStorage.password )
	//console.debug('checkcycle:' + localStorage.checkcycle )
	//console.debug('displayall:' + localStorage.displayall )
	//console.debug('mailserver:' + localStorage.mailserver )
  
	if(typeof(localStorage.password)=="undefined" || localStorage.password.length<6) 
	{
		//window.setTimeout(startRequest, 1000 * 10);
		return;
	}

	checker.getInboxCount(
		function(count) {
			loadingAnimation.stop();
			updateUnreadCount(count);
			scheduleRequest();
		},
		function() {
			loadingAnimation.stop();
			showLoggedOut();
			scheduleRequest();
		}
	);
}

function updateUnreadCount(count) {
	if (unreadCount != count) {
		unreadCount = count;
		animateFlip();
		if (localStorage.notification == "true" && unreadCount != 0)
			notify(icon_url, chrome.i18n.getMessage('notify_msg') + unreadCount, 5000);
	}
}

function showLoggedOut() {
	unreadCount = "";
	chrome.browserAction.setIcon({path:checker.email_not_logged_in_ico});
	chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
	chrome.browserAction.setBadgeText({text:"?"});
}

function goToInbox() {
	if (!isInit())
	{
		chrome.tabs.getAllInWindow(undefined, function(tabs) {
			for (var i = 0, tab; tab = tabs[i]; i++) {
				if (tab.url && tab.url == chrome.extension.getURL("options.html")) {
					chrome.tabs.update(tab.id, {selected: true});
					return;
				}
			}
			
			chrome.tabs.create({url: "options.html"});
		});
		return;
	}
		
	chrome.tabs.getAllInWindow(undefined, function(tabs) {
		for (var i = 0, tab; tab = tabs[i]; i++) {
			if (tab.url && checker.isEmailUrl(tab.url)) {
				chrome.tabs.update(tab.id, {selected: true});
				return;
			}
		}
			
		chrome.tabs.create({url: checker.getEmailUrl(localStorage.email)});
	});
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	goToInbox();
});

document.addEventListener('DOMContentLoaded', function() {
  init();
});
