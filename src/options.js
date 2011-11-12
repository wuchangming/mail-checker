function setText(elementId, text) {
	document.getElementById(elementId).innerText = text;
}

function locale() {
	setText("header1", chrome.i18n.getMessage('option_title'));
	setText("setting", chrome.i18n.getMessage('setting'));
	setText("email", chrome.i18n.getMessage('email'));
	setText("password", chrome.i18n.getMessage('password'));
	setText("checkcycle", chrome.i18n.getMessage('checkcycle'));
	setText("minute", chrome.i18n.getMessage('minute'));
	setText("displayall", chrome.i18n.getMessage('displayall'));
	setText("warn_msg", chrome.i18n.getMessage('warn_msg'));
	setText("save-button", chrome.i18n.getMessage('save'));
	setText("cancel-button", chrome.i18n.getMessage('cancel'));
}
