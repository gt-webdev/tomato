var timerStates = [
	{"state": "off", "html": "popup.html"},
	new PomodoroState(),
	new BreakState()];
var stateInd = 0;
var currentState = timerStates[stateInd];
var timer;
var timeout;

function startTimer() {
	var start = moment();
	timer = setInterval(function() {
	    var difference = moment().diff(start, 'seconds');
	    if (difference > currentState.length()) {
	    	stopTimer(timer);
	    	return;
	    }
	    sendUpdatedTime(difference);
	}, 1000);
}

function stopTimer() {
	clearInterval(timer);
	timer = null;
	notifyUser();
	changeToNextState(true);
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

function changeToNextState(isDelayed) {
	nextStateInd = currentState.nextState || (stateInd + 1) % timerStates.length;
	changeState(nextStateInd, isDelayed);
}

function changeState(nextStateInd, isDelayed) {
	stateInd = nextStateInd;
	currentState = timerStates[stateInd];
	chrome.browserAction.setPopup({
		"popup": currentState.html
	});

	// We know it's a time period of some sort.
	if (currentState.hasOwnProperty("length")) {
		// Delay?
		if (isDelayed) {
			timeout	= setTimeout(startTimer, currentState.delay*1000);
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
			changeToNextState(false);
			sendResponse({message: "Timer started."});
		}
		else if (request.command == "endTimer" && stateInd != 0) {
			if (timer) clearInterval(timer);
			if (timeout) clearTimeout(timeout);
			timeout = null;
			timer = null;
			changeState(0, false); // Change to off state
			chrome.runtime.sendMessage({
				command: "timerEnded"
			});
		}
	});