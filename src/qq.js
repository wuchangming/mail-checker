
function getQQUrl(email) {
	var url = 'https://mail.qq.com/cgi-bin/login?vt=passport&vm=wpt&ft=ptlogin&validcnt=0&clientaddr=';
	url += email + "qq.com";

	return url;
}

function isQQUrl(url) {
	// This is the Gmail we're looking for if:
	// - starts with the correct gmail url
	// - doesn't contain any other path chars
	var email = "mail.qq.com/cgi-bin/frame_html";
	
	if (url.indexOf(email) == -1)
		return false;

	return true;
}

function getQQInboxCount(onSuccess, onError) {
	var xhr_l = new XMLHttpRequest();
	var abortTimerId = window.setTimeout(function() {
		xhr_l.abort();  // synchronously calls onreadystatechange
		}, requestTimeout);

	function handleSuccess(count) {
		requestFailureCount = 0;
		window.clearTimeout(abortTimerId);
		if (onSuccess)
			onSuccess(count);
	}

	function handleError() {
		++requestFailureCount;
		window.clearTimeout(abortTimerId);
		if (onError)
			onError();
	}
  
	try {
		xhr_l.onerror = function(error) {
			handleError();
		}
    
		//removeCookiesForDomain('mail.163.com');
		var url = "https://ssl.ptlogin2.qq.com/check?uin=" + localStorage.email + "@qq.com";
		url += "&appid=522005705&ptlang=2052&r=" + Math.random();
		
		xhr_l.open("GET", url, false);
		xhr_l.send(null);
		//console.debug("responseText: " + xhr_l.responseText);
		
		//var content = xhr_l.responseText;
		//var pattern_qq_verfycode = '.*,\'(.*)\'\);';
		//var verifycode = content.match(pattern_qq_verfycode);
		var verifycode = pickupString(xhr_l.responseText, "ptui_checkVC('0','", "'");
		console.debug("verifycode: " + verifycode);
		
                var passkey = md5(md5_3(localStorage.password) + verifycode.toUpperCase());
		console.debug("passkey: " + passkey);
		
		url = "https://ssl.ptlogin2.qq.com/login?ptlang=2052&uin=" + localStorage.email;
		url += "&u_domain=@qq.com&u="  + localStorage.email + "@qq.com&p=" + passkey;
		url += "&verifycode=" + verifycode + "&aid=522005705";
		url += "&u1=https%3A%2F%2Fmail.qq.com%2Fcgi-bin%2Flogin%3Fvt%3Dpassport%26vm%3Dwpt%26ft%3Dptlogin%26validcnt%3D0%26clientaddr%3D" + localStorage.email +  "%40qq.com&remember=&ss=1&from_ui=1&ptredirect=1&h=1&wording=%E5%BF%AB%E9%80%9F%E7%99%BB%E5%BD%95&mibao_css=m_ptmail&fp=loginerroralert&action=3-8-11844&dummy=";
		
		xhr_l.open("GET", url, false);
		xhr_l.send(null);
		//console.debug("responseText: " + xhr_l.responseText);
		
		url = pickupString(xhr_l.responseText, "ptuiCB('0','0','", "','");
		console.debug("url: " + url);
		if (url == "") return;
		xhr_l.open("GET", url, false);
		xhr_l.send(null);
		//console.debug("responseText: " + xhr_l.responseText);
		
		url = pickupString(xhr_l.responseText, "var urlHead=\"", "\";");
		if (url == "") return;
		url += "frame_html?sid=";
		url += pickupString(xhr_l.responseText, "frame_html?sid=", "\";");
		url += pickupString(xhr_l.responseText, "targetUrl+=\"", "\";");
		console.debug("url: " + url);
		
		xhr_l.open("GET", url, false);
		xhr_l.send(null);
		//console.debug("responseText: " + xhr_l.responseText);
		
		var inboxnew = pickupString(xhr_l.responseText, "收件箱</b><b>(", ")</b>");
		if( inboxnew == "" ) inboxnew = "0";
		console.debug("inboxnew: " + inboxnew);
		handleSuccess(inboxnew.toString());
	} catch(e) {
		console.error("exception: " + e);
		handleError();
	}
}

