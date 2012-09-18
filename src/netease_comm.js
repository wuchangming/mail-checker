//var sessionid = '';

function getNeteaseUrl(email) {
	//var url = "http://twebmail.mail." + localStorage.mailserver + "/js4/main.jsp?sid=" + sessionid;
	return mailurl;
}

function isNeteaseUrl(url) {
	//var email = "twebmail.mail." + localStorage.mailserver + "/js5/main.jsp";
	
	if (url.indexOf(mailurl) == -1)
		return false;

	return true;
}

function getNeteaseInboxCount(onSuccess, onError) {
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
		
		var url = "";
		var data = "";
		
		switch(localStorage.mailserver) {
		case "126.com":
			url = "https://ssl.mail.126.com/entry/cgi/ntesdoor";
			url += "?hid=10010102&funcid=loginone&df=webmail126&language=-1&passtype=1";
			url += "&verifycookie=-1&iframe=1&from=web&net=t&product=mail126&style=-1";
			url += "&race=-1_-1_-1&uid="+localStorage.email+"@126.com";
		
			data="savelogin=0&username=" + localStorage.email + "%40126.com";
			data += "&url2=http%3A%2F%2Fmail.126.com%2Ferrorpage%2Ferr_126.htm";
			data += "&user=" + localStorage.email + "&password=" + localStorage.password;
			data += "&style=-1&secure=on";
			break;
		case "163.com":
			url = "https://ssl.mail.163.com/entry/coremail/fcg/ntesdoor2";
			url += "?df=webmail163&from=web&funcid=loginone&iframe=1&language=-1";
			url += "&net=t&passtype=1&product=mail163&race=-2_-2_-2_db&style=-1";
			url += "&uid="+localStorage.email+"@163.com";
		
			data="savelogin=0&url2=http%3A%2F%2Fmail.163.com%2Ferrorpage%2Ferr_163.htm";
			data += "&username=" + localStorage.email + "&password=" + localStorage.password;
			break;
		case 'yeah.net':
			url = "https://ssl.mail.yeah.net/entry/cgi/ntesdoor";
			url += "?funcid=loginone&language=-1&passtype=1&iframe=1&product=mailyeah";
			url += "&from=web&df=emailyeah&module=";
			url += "&uid="+localStorage.email+"yeah.net&style=-1";
		
			data="savelogin=0&url2=http%3A%2F%2Femail.163.com%2Ferrorpage%2Ferr_yeah.htm";
			data += "&username=" + localStorage.email + "&password=" + localStorage.password;
			break;
		}

		//console.debug("url: " + url);
		//console.debug("data: " + data);

		xhr_l.open("POST", url, false);
		xhr_l.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr_l.send(data);

		//console.debug("xhr_l.responseText: " + xhr_l.responseText);

		url = pickupString(xhr_l.responseText, "top.location.href = \"", "\";");
		if (url == "")
			return;
			
		mailurl = url;
		url = url.replace('main.jsp', 'index.jsp');
		console.debug("url: " + url);
    
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			//console.debug("xhr.readyState : " + xhr.readyState );
	
			if (xhr.readyState != 4)
				return;
	   
			console.debug("xhr.status: " + xhr.status);

			if(xhr.status === 200) {
				//console.debug("xhr.responseText: " + xhr.responseText);

				var inboxnew = 0;
			
				try {
					idx_1 = xhr.responseText.indexOf('folders : [{');
					idx_2 = xhr.responseText.indexOf(',folderStats : {', idx_1);
					var folders_json_text = xhr.responseText.substring(idx_1+9, idx_2);
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

