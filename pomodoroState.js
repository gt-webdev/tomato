function PomodoroState() {
	this.length = 10;
	this.delay = 10;
	this.html = "timer.html";
	this.opt = {
		type: "basic",
		title: "Time for a break!",
		message: "Your break period will start in 10 seconds. Click this notification to keep working instead.",
		iconUrl: "icon.png"
	};
	this.notificationBaseId = "pomodoroOver";

}