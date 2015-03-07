function init() {
	var start = moment();
	setInterval(function() {
	    var difference = moment().diff(start, 'seconds');
	    var text = moment().startOf("day").seconds(difference).format("m:ss");
	    document.getElementById("current-time").innerText = text;
	}, 1000);
}

document.addEventListener('DOMContentLoaded', init);