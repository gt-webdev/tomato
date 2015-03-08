function init() {
	addOnClick();
	addMessageListeners();
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
	document.getElementById("start").onclick = function() {
		startTimer();
	}
}

document.addEventListener('DOMContentLoaded', init);