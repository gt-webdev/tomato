var timerStates = [
	{"state": "off", "html": "popup.html"},
	{"state": "pomodoro", "html": "timer.html"},
	{"state": "short", "html": "timer.html"}];
var currentState = 0;

function startTimer(start) {
	changeState();
	var runningTimer = setInterval(function() {
	    var difference = moment().diff(start, 'seconds');
	    if (difference > 10) {
	    	stopTimer(runningTimer);
	    	return;
	    }
	    sendUpdatedTime(difference);
	}, 1000);
}

function stopTimer(timer) {
	clearInterval(timer);
	notifyUser();
	changeState();
	chrome.runtime.sendMessage({
		command: "timerEnded"
	});
}

function sendUpdatedTime(difference) {
	var time = moment().startOf("day").seconds(difference).format("m:ss");
	chrome.runtime.sendMessage({
		"command": "updateTime",
		"time": time
	});
}

function notifyUser() {
	var opt = {
		type: "basic",
		title: "Time's up!",
		message: "Time to take a break! Your break period will start in 10 seconds. Click this notification to keep working instead.",
		iconUrl: "icon.png"
	};
	var timestamp = new Date().getTime();
	var notification = chrome.notifications.create("periodOver" + timestamp, opt, function() {
		console.log("Notification created. This callback function is required.");
	});
}

function changeState() {
	currentState = (currentState + 1) % 3;
	console.log(currentState);
	chrome.browserAction.setPopup({
		"popup": timerStates[currentState].html
	});
}

chrome.browserAction.setPopup({
	"popup": timerStates[currentState].html
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.command == "startTimer" && currentState == 0) {
			var start = moment();
			startTimer(start);
			sendResponse({message: "Timer started."});
		}

	});