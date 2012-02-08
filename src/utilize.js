function pickupString(target, start, end)
{
	var idx_s = target.indexOf(start);
	if(idx_s == -1)
		return "";
		
	if(end=="")
		return target.substring(idx_s + 1);
		
	var idx_e = target.indexOf(end, idx_s + start.length);
	
	if(idx_e == -1)
		return "";
	
	return target.substring(idx_s + start.length, idx_e);
}

function removeCookiesForDomain(domain) {
	chrome.cookies.getAll({url: 'http://' + domain}, function(cookies) {
		for (var i in cookies) {
			var url = "http" + (cookies[i].secure ? "s" : "") + "://" + cookies[i].domain +
			cookies[i].path;
			console.debug("url: " + url);
			console.debug("name: " + cookies[i].name);
			chrome.cookies.remove({"url": url, "name": cookies[i].name});
		}
	})
}

function notify(icon_url, message, timeout) {
	if( window.webkitNotifications && window.webkitNotifications.checkPermission() == 0 ) {
		var notification = webkitNotifications.createNotification(
			icon_url,  // icon url - can be relative
			'Mail Checker',  // notification title
			message
		);
		notification.show();
		if ( timeout ) {
			setTimeout(function() {
				notification.cancel();
			}, timeout);
		}
		return true;
	}
	return false;
}
