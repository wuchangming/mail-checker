
function getYeahUrl(email) {
	var url = 'http://entry.mail.yeah.net/cgi/ntesdoor' +
		'?lightweight=1&verifycookie=1&from=web&style=-1&username=';
	url += email;
	return url;
}

function isYeahUrl(url) {
	// This is the Gmail we're looking for if:
	// - starts with the correct gmail url
	// - doesn't contain any other path chars
	var email = "webmail.mail.yeah.net/js4/main.jsp";
	
	if (url.indexOf(email) == -1)
		return false;

	return true;
}

function getYeahInboxCount(onSuccess, onError) {
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
    
		var url = "https://reg.163.com/login.jsp?type=1";
		url += "&product=mailyeah&url=http://entry.mail.yeah.net/cgi/ntesdoor?";
		url += "lightweight%3D1%26verifycookie%3D1%26from%3Dweb%26style%3D-1";

		var data = "username=" + localStorage.email + "%40yeah.net";
		data += "&url2=http%3A%2F%2Fmail.yeah.net%2Ferrorpage%2Ferr_yeah.htm";
		data += "&user=" + localStorage.email + "&password=" + localStorage.password;

		console.debug("url: " + url);
		console.debug("data: " + data);

		var xhr_l = new XMLHttpRequest();
		xhr_l.open("POST", url, false);
		xhr_l.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr_l.send(data);

		//console.debug("xhr_l.responseText: " + xhr_l.responseText);

		url = pickupString(xhr_l.responseText, "window.location.replace(\"", "\");");
		if (url == "")
			return "";

		console.debug("url: " + url);

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4)
				return;

			//console.debug("xhr.status: " + xhr.status);

			if(xhr.status === 200) {
				//console.debug("xhr.responseText: " + xhr.responseText);
				var url = getYeahUrl(localStorage.email);
				console.debug("url: " + url);
				
				var xhr2 = new XMLHttpRequest();
				xhr2.onreadystatechange = function() {
					//console.debug("xhr2.readyState : " + xhr2.readyState );
			
					if (xhr2.readyState != 4)
						return;
				 
					//console.debug("xhr2.status: " + xhr2.status);

					if(xhr2.status === 200) {
						chrome.cookies.getAll({ url: "http://webmail.mail.yeah.net/", name: "Coremail"}, function (cookies) {
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

							mailserver = "webmail.mail.yeah.net";
							console.debug("host: " + mailserver );
							console.debug("sid: " + sessionid);

							url = 'http://' + mailserver + '/js4/index.jsp?sid='+sessionid;

							console.debug("url: " + url);
							var xhr3 = new XMLHttpRequest();
							xhr3.open("GET", url, false);
							xhr3.send(null);

							//console.debug("xhr3.responseText: " + xhr3.responseText);

							var inboxnew = 0;
						
								try {
									idx_1 = xhr3.responseText.indexOf('folders : [{');
								idx_2 = xhr3.responseText.indexOf(',folderStats : {', idx_1);
									var folders_json_text = xhr3.responseText.substring(idx_1+9, idx_2);
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
   
				xhr2.open("GET", url, true);
    
				xhr2.send(null);
			}
		}

		xhr.open("GET", url, true);
		xhr.send(null);
	} catch(e) {
		console.error("exception: " + e);
		handleError();
	}
}

