/**
 * Initially called when extension page loads. Sets up a bunch of stuff.
 */
function init() {
	addOnClick();
	addMessageListeners();
	startTimer();
}

/**
 * Sends a message to background page to start the timer.
 */
function startTimer() {
	chrome.runtime.sendMessage({
		"command": "startTimer"
	}, function(response) {
		console.log(response.message);
	});
}

/**
 * Adds listeners so it knows how to handle the messages from the background page.
 */
function addMessageListeners() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		switch(request.command) {
			case "updateTime":
				document.getElementById("current-time").innerText = request.time;
				break;
			case "timerEnded":
				console.log("Timer ended.");
				break;
		}
	});
}

/**
 * Adds onclick listener to the stop button.
 */
function addOnClick() {
	document.getElementById("stop").onclick = function() {
		chrome.runtime.sendMessage({
			"command": "endTimer"
		});
		document.location = chrome.runtime.getURL("popup.html");
		chrome.browserAction.setBadgeText({"text" : ""});
	}
}

document.addEventListener('DOMContentLoaded', init);
