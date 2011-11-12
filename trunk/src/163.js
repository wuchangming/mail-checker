﻿
function get163Url(email) {
	var url = 'http://entry.mail.163.com/coremail/fcg/ntesdoor2' +
		'?lightweight=1&verifycookie=1&language=-1&style=-1&username=';
	url += email;
	return url;
}

function is163Url(url) {
	// This is the Gmail we're looking for if:
	// - starts with the correct gmail url
	// - doesn't contain any other path chars
	var email = "mail.163.com/js4/main.jsp";
	
	if (url.indexOf(email) == -1)
		return false;

	return true;
}

function get163InboxCount(onSuccess, onError) {
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
    
		var url = "https://reg.163.com/login.jsp?type=1";
		url += "&url=http://entry.mail.163.com/coremail/fcg/ntesdoor2?";
		url += "lightweight%3D1%26verifycookie%3D1%26language%3D-1%26style%3D-1";

		var data = "verifycookie=1&style=-1&product=mail163&savelogin=";
		data += "&url2=http%3A%2F%2Fmail.163.com%2Ferrorpage%2Ferr_163.htm";
		data += "&username=" + localStorage.email + "&password=" + localStorage.password + "&selType=-1";

		//console.debug("url: " + url);
		//console.debug("data: " + data);

		xhr_l.open("POST", url, false);
		xhr_l.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr_l.send(data);

		//console.debug("xhr_l.responseText: " + xhr_l.responseText);

		url = pickupString(xhr_l.responseText, "window.location.replace(\"", "\");");
		if (url == "")
			return;
    
		console.debug("url: " + url);
    
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			//console.debug("xhr.readyState : " + xhr.readyState );
	
			if (xhr.readyState != 4)
				return;
	   
			console.debug("xhr.status: " + xhr.status);

			if(xhr.status === 200) {
				var url = "http://*.mail.163.com/";
				chrome.cookies.getAll({ url: "http://*.mail.163.com/", name: "Coremail"}, function (cookies) {
					for (var i in cookies) {
						console.debug("cookie name: " + cookies[i].name );
						console.debug("cookie value: " + cookies[i].value );

						console.debug("cookie domain: " + cookies[i].domain );
						//console.debug("cookie hostOnly: " + cookies[i].hostOnly );
						//console.debug("cookie path: " + cookies[i].path );
						//console.debug("cookie secure: " + cookies[i].secure );
						//console.debug("cookie httpOnly: " + cookies[i].httpOnly );
						//console.debug("cookie session: " + cookies[i].session );
						//console.debug("cookie storeId: " + cookies[i].storeId );

					}
					//console.debug("cookies: " + cookie.value );
					//var Coremail = cookie.value;
					var Coremail = cookies[0].value;

					var idx_1 = Coremail.indexOf('%');
					var idx_2 = Coremail.indexOf('%', idx_1 + 1);
					var mailserver = Coremail.substr(idx_2+1);
					var sessionid =  Coremail.substring(idx_1+1, idx_2);

					console.debug("host: " + mailserver );
					console.debug("sid: " + sessionid);

					url = 'http://' + mailserver + '/js4/index.jsp?sid='+sessionid;

					console.debug("url: " + url);
					var xhr2 = new XMLHttpRequest();
					xhr2.open("GET", url, false);
					xhr2.send(null);

					//console.debug("xhr.responseText: " + xhr2.responseText);

					var inboxnew = 0;
				
						try {
							idx_1 = xhr2.responseText.indexOf('folders : [{');
						idx_2 = xhr2.responseText.indexOf(',folderStats : {', idx_1);
							var folders_json_text = xhr2.responseText.substring(idx_1+9, idx_2);
							//console.debug("folders_json: " + folders_json_text);
							var folders_json = eval('(' + folders_json_text + ')');

							for (var i in folders_json) {
								//console.debug("folders_json[i].name: " + folders_json[i].name);
								//console.debug("收件箱");
								
							if(localStorage.displayall == "true" || folders_json[i].name == "收件箱" || folders_json[i].name == "订阅邮件") {
									inboxnew += folders_json[i].stats.unreadMessageCount;
								}
							}
							console.debug("inboxnew: " + inboxnew);
							handleSuccess(inboxnew.toString());
						} catch(e) {
							console.error("Error: parse folders_json failed!");
							handleError();
						}
						return;
				});
				return;
			}

			handleError();
		}
   
		xhr.open("GET", url, true);
    
		xhr.send(null);
	} catch(e) {
		console.error("exception: " + e);
		handleError();
	}
}
