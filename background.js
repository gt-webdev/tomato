var timerStates = [
	{"state": "off", "html": "popup.html"},
	new PomodoroState(),
	new BreakState()];
var stateInd = 0;
var currentState = timerStates[stateInd];

function startTimer() {
	var start = moment();
	var runningTimer = setInterval(function() {
	    var difference = moment().diff(start, 'seconds');
	    if (difference > currentState.length) {
	    	stopTimer(runningTimer);
	    	return;
	    }
	    sendUpdatedTime(difference);
	}, 1000);
}

function stopTimer(timer) {
	clearInterval(timer);
	notifyUser();
	changeState(false);
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
	var idBase = currentState.notificationBaseId;
	var id = idBase + (new Date()).getTime();
	chrome.notifications.create(id, currentState.opt, function() {
		console.log(idBase + " notification created.");
	}); // Callback function as 3rd parameter is required.
}

function changeState(isInitial) {
	stateInd = (stateInd + 1) % timerStates.length;
	currentState = timerStates[stateInd]
	console.log(stateInd);
	chrome.browserAction.setPopup({
		"popup": currentState.html
	});
	console.log(currentState.hasOwnProperty("length"));
	// We know it's a time period of some sort.
	if (currentState.hasOwnProperty("length")) {
		// Delay?
		if (!isInitial) {
			setTimeout(startTimer, currentState.delay*1000);
		}
		else startTimer();
	}
}

chrome.browserAction.setPopup({
	"popup": currentState.html
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.command == "startTimer" && stateInd == 0) {
			changeState(true);
			sendResponse({message: "Timer started."});
		}

	});