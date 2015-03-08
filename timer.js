function init() {
	addOnClick();
	addMessageListeners();
	startTimer();
}

function startTimer() {
	chrome.runtime.sendMessage({
		"command": "startTimer"
	}, function(response) {
		console.log(response.message);
	});
}

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

function addOnClick() {
	document.getElementById("stop").onclick = function() {
		chrome.runtime.sendMessage({
			"command": "endTimer"
		});
	}
}

document.addEventListener('DOMContentLoaded', init);