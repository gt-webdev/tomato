function startTimer(start) {
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

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.command == "startTimer") {
			var start = moment();
			startTimer(start);
			sendResponse({message: "Timer started."});
		}

	});