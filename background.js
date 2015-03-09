/**
 * Global Variables
 */
var timerStates = [
	{"state": "off", "html": "popup.html"},
	new PomodoroState(),
	new BreakState()],
	stateInd = 0,
	currentState = timerStates[stateInd],
	timer,
	timeout;

/**
 * Executed Initially
 */

// Sets initial popup page when icon is clicked.
chrome.browserAction.setPopup({
	"popup": currentState.html
});

// Add message listeners for messages from timer.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		// Only start timer if timer was initially off. No delay.
		if (request.command == "startTimer" && stateInd == 0) {
			changeToNextState(false);
			sendResponse({message: "Timer started."});
		}
		// Only clear timers if timer is not off.
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

/**
 * Helper Functions
 */

/**
 * Function to start a timer and send updates to timer.html every second or so.
 */
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

/**
 * Given the difference in seconds between the start time and current time,
 * formats it into m:ss (ex. 0:55) and sends a message to timer.js, so it can
 * update the UI.
 */
function sendUpdatedTime(difference) {
	var time = moment().startOf("day").seconds(difference).format("m:ss");
	chrome.runtime.sendMessage({
		"command": "updateTime",
		"time": time
	});
}

/**
 * Called when period is over. Stops the running timer and notifies the user
 * that the period is over.
 */
function stopTimer() {
	clearInterval(timer);
	timer = null;
	notifyUser();
	changeToNextState(true);
	chrome.runtime.sendMessage({
		command: "timerEnded"
	});
}

/**
 * Notifies the user when a period has ended.
 */
function notifyUser() {
	var idBase = currentState.notificationBaseId;
	var id = idBase + (new Date()).getTime();
	chrome.notifications.create(id, currentState.opt, function() {
		console.log(idBase + " notification created.");
	}); // Callback function as 3rd parameter is required.
}

/**
 * Called during a change of state during usual flow.
 */
function changeToNextState(isDelayed) {
	nextStateInd = currentState.nextState || (stateInd + 1) % timerStates.length;
	changeState(nextStateInd, isDelayed);
}

/**
 * Called when we want to change to a specific state. isDelayed parameter allows
 * us to introduce a delay for before the next timer is started (ex. 10 seconds
 * between the pomodoro period is over and the break begins to give user time to
 * wrap up.).
 */
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