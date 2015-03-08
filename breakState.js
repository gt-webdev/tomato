function BreakState() {
	this.length = 10;
	this.delay = 10;
	this.html = "timer.html";
	this.opt = {
		type: "basic",
		title: "Break's over!",
		message: "Your pomodoro period will start in 10 seconds. Click this notification to stay on break.",
		iconUrl: "icon.png"
	};
	this.notificationBaseId = "breakOver";
}