

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
	case "126.com":
		this.getEmailUrl = get126Url;
		this.isEmailUrl = is126Url;
		this.getInboxCount = get126InboxCount;
		this.email_logged_in_ico = "icons/163/email_logged_in.png";
		this.email_not_logged_in_ico = "icons/163/email_not_logged_in.png";
		break;
	default:
		this.getEmailUrl = get163Url;
		this.isEmailUrl = is163Url;
		this.getInboxCount = get163InboxCount;
		this.email_logged_in_ico = "icons/163/email_logged_in.png";
		this.email_not_logged_in_ico = "icons/163/email_not_logged_in.png";
		break;
	}
}

	
	