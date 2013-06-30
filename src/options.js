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
	setText("notification", chrome.i18n.getMessage('notification'));
	setText("warn_msg", chrome.i18n.getMessage('warn_msg'));
	setText("save-button", chrome.i18n.getMessage('save'));
	setText("cancel-button", chrome.i18n.getMessage('cancel'));
}

var customDomainsTextbox;
var emailTextBox;
var passwordTextBox;
var checkcycleTextBox;
var displayallCheckBox;
var notificationCheckBox;
var saveButton;
var mailserverDropList;

function init() {
  //customDomainsTextbox = document.getElementById("custom-domain");
  emailTextBox = document.getElementById("custom-email");
  passwordTextBox = document.getElementById("custom-password");
  checkcycleTextBox = document.getElementById("custom-checkcycle");
  displayallCheckBox = document.getElementById("custom-displayall");
  notificationCheckBox = document.getElementById("custom-notify");
  mailserverDropList = document.getElementById("custom-mailserver");
 
  saveButton = document.getElementById("save-button");

  //customDomainsTextbox.value = localStorage.customDomain || "";
  emailTextBox.value = localStorage.email || "";
  passwordTextBox.value = localStorage.password || "";
  checkcycleTextBox.value = localStorage.checkcycle || "15";
  displayallCheckBox.checked = localStorage.displayall == "true" || false;
  notificationCheckBox.checked = localStorage.notification == "true" || false;
  mailserverDropList.value = localStorage.mailserver || "163.com";
  //if ( !localStorage.checkcycle || localStorage.checkcycle == 0 )
	//checkcycleTextBox.value = "15";
  //else
	//checkcycleTextBox.value = localStorage.checkcycle.toString();
  markClean();
}

function save() {
  //localStorage.customDomain = customDomainsTextbox.value;
  localStorage.email = emailTextBox.value;
  localStorage.password = passwordTextBox.value;
  localStorage.checkcycle = checkcycleTextBox.value;
  localStorage.displayall = displayallCheckBox.checked;
  localStorage.notification = notificationCheckBox.checked;
  localStorage.mailserver = mailserverDropList.value;
  
  var idx_1 = emailTextBox.value.indexOf("@");
  localStorage.mailtype = emailTextBox.value.substr(idx_1+1);
 
  markClean();

  chrome.extension.getBackgroundPage().init();
}

function markDirty() {
  saveButton.disabled = false;
}

function markClean() {
  saveButton.disabled = true;
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('custom-email').addEventListener('input', markDirty);
	document.getElementById('custom-mailserver').addEventListener('change', markDirty);
	document.getElementById('custom-password').addEventListener('input', markDirty);
	document.getElementById('custom-checkcycle').addEventListener('input', markDirty);
	document.getElementById('custom-displayall').addEventListener('click', markDirty);
	document.getElementById('custom-notify').addEventListener('click', markDirty);
	
	document.getElementById('save-button').addEventListener('click', save);
	document.getElementById('cancel-button').addEventListener('click', init);
	
	locale();
	init();
});

