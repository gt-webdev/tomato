function startTimer(start) {
	setInterval(function() {
	    var difference = moment().diff(start, 'seconds');
	    var time = moment().startOf("day").seconds(difference).format("m:ss");
	    chrome.runtime.sendMessage({
	    	"command": "updateTime",
	    	"time": time
	    });
	}, 1000);
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.command == "startTimer") {
			var start = moment();
			startTimer(start);
			sendResponse({message: "Timer started."});
		}

	});