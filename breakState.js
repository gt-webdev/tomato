function BreakState() {
	this.length = function() {
		return localStorage["break-selection"] || 10;
	};
	this.delay = 10;
	this.html = "timer.html";
	this.opt = {
		type: "basic",
		title: "Break's over!",
		message: "Your pomodoro period will start in 10 seconds.",
		iconUrl: "icon.png"
	};
	this.notificationBaseId = "breakOver";
	this.nextState = "pomodoro";
}
