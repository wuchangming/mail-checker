function pickupString(target, start, end)
{
	var idx_s = target.indexOf(start);
	if(idx_s == -1)
		return "";
		
	if(end=="")
		return target.substring(idx_s + 1);
		
	var idx_e = target.indexOf(end, idx_s + 1);
	
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
