var animationFrames = 36;
var animationSpeed = 10; // ms
var rotation = 0;

function LoadingAnimation() {
	this.timerId_ = 0;
	this.maxCount_ = 8;  // Total number of states in animation
	this.current_ = 0;  // Current state
	this.maxDot_ = 4;  // Max number of dots in animation
}

LoadingAnimation.prototype.paintFrame = function() {
	var text = "";
	for (var i = 0; i < this.maxDot_; i++) {
		text += (i == this.current_) ? "." : " ";
	}
	if (this.current_ >= this.maxDot_)
		text += "";

	chrome.browserAction.setBadgeText({text:text});
	this.current_++;
	if (this.current_ == this.maxCount_)
		this.current_ = 0;
}

LoadingAnimation.prototype.start = function() {
	if (this.timerId_)
		return;

	var self = this;
	this.timerId_ = window.setInterval(function() {
		self.paintFrame();
		}, 100);
}

LoadingAnimation.prototype.stop = function() {
	if (!this.timerId_)
		return;

	window.clearInterval(this.timerId_);
	this.timerId_ = 0;
}


function ease(x) {
	return (1-Math.sin(Math.PI/2+x*Math.PI))/2;
}

function animateFlip() {
	rotation += 1/animationFrames;
	drawIconAtRotation();

	if (rotation <= 1) {
		setTimeout("animateFlip()", animationSpeed);
	} else {
		rotation = 0;
		drawIconAtRotation();
		chrome.browserAction.setBadgeText({
			text: unreadCount != "0" ? unreadCount : ""
			});
		chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
	}
}

function drawIconAtRotation() {
	canvasContext.save();
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	canvasContext.translate(
		Math.ceil(canvas.width/2),
		Math.ceil(canvas.height/2));
	canvasContext.rotate(2*Math.PI*ease(rotation));
	canvasContext.drawImage(loggedInImage,
		-Math.ceil(canvas.width/2),
		-Math.ceil(canvas.height/2));
	canvasContext.restore();

	chrome.browserAction.setIcon({imageData:canvasContext.getImageData(0, 0,
		canvas.width,canvas.height)});
}
