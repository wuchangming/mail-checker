

function CheckMailClass() {
		this.email_logged_in_ico = "icons/163/email_logged_in.png";
		this.email_not_logged_in_ico = "icons/163/email_not_logged_in.png";
}

CheckMailClass.prototype.getEmailUrl = function(email) {
	return "";
}

CheckMailClass.prototype.isEmailUrl = function() {
	return "";
}

CheckMailClass.prototype.getInboxCount = function() {
}

CheckMailClass.prototype.init = function(mailserver) {
	switch(mailserver) {
	case "qq.com":
		this.getEmailUrl = getQQUrl;
		this.isEmailUrl = isQQUrl;
		this.getInboxCount = getQQInboxCount;
		this.email_logged_in_ico = "icons/qq/email_logged_in.png";
		this.email_not_logged_in_ico = "icons/qq/email_not_logged_in.png";
		break;
	case "126.com":
	case "yeah.net":		
	default:
		this.getEmailUrl = getNeteaseUrl;
		this.isEmailUrl = isNeteaseUrl;
		this.getInboxCount = getNeteaseInboxCount;
		this.email_logged_in_ico = "icons/163/email_logged_in.png";
		this.email_not_logged_in_ico = "icons/163/email_not_logged_in.png";
		break;
	}
}

	
	