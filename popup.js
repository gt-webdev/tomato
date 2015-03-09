function init() {
	var buttonGroups = document.getElementsByClassName("time-buttons-group")
	Array.prototype.forEach.call(buttonGroups, function(divElem) {

		Array.prototype.forEach.call(divElem.childNodes, function(elem) {
			elem.onclick = timeButtonOnClickHandler;
		});

	});

}

function timeButtonOnClickHandler(event) {
	var targetElem = event.target;
	var timeSelected = +targetElem.innerText;
	var settingKey = targetElem.parentNode.id;
	localStorage[settingKey] = timeSelected;
}

document.addEventListener('DOMContentLoaded', init);