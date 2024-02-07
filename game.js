// variables

let gameState;
function gameStateSave() {
	localStorage.setItem('gameState', gameState);
}
function gameStateLoad() {
	gameState = localStorage.getItem('gameState') ?? 'location';
}
gameStateLoad();

let uncheckedLocations;
function uncheckedLocationsSave() {
	localStorage.setItem('uncheckedLocations', JSON.stringify([...uncheckedLocations]));
}
function uncheckedLocationsLoad() {
	uncheckedLocations = new Set(JSON.parse(localStorage.getItem('uncheckedLocations') ?? JSON.stringify([])));
}
uncheckedLocationsLoad();

let playerCount;
function playerCountSave() {
	localStorage.setItem('playerCount', playerCount);
}
function playerCountLoad() {
	playerCount = parseInt(localStorage.getItem('playerCount') ?? '10');
}
playerCountLoad();

let drawResult;
function drawResultSave() {
	if (drawResult !== null) {
		localStorage.setItem('drawResult', JSON.stringify({
			location: drawResult.location,
			spies: [...drawResult.spies],
		}));
	} else {
		localStorage.removeItem('drawResult');
	}
}
function drawResultLoad() {
	drawResult = JSON.parse(localStorage.getItem('drawResult'));
	if (drawResult !== null)
		drawResult.spies = new Set(drawResult.spies);
}
drawResultLoad();

let startTime;
function startTimeSave() {
	if (startTime !== null)
		localStorage.setItem('startTime', startTime);
	else
		localStorage.removeItem('startTime');
}
function startTimeLoad() {
	const t = localStorage.getItem('startTime');
	startTime = t !== null ? parseInt(t) : null;
}
startTimeLoad();

// sections

const locationSection = document.getElementById('location-section');
function locationSectionShow() {
	locationSection.classList.remove('d-none');
	const listGroup = document.getElementById('location-table');
	listGroup.classList.add('list-group');
	listGroup.innerHTML = '';
	locationSet.forEach(location => {
		const locationId = `location-${md5(location)}`;
		const listGroupItem = document.createElement('div');
		listGroupItem.classList.add('list-group-item');
		listGroup.appendChild(listGroupItem);
		const formCheck = document.createElement('div');
		formCheck.classList.add('form-check');
		listGroupItem.appendChild(formCheck);
		const formCheckInput = document.createElement('input');
		formCheckInput.id = locationId;
		formCheckInput.classList.add('form-check-input');
		formCheckInput.type = 'checkbox';
		formCheckInput.checked = !uncheckedLocations.has(location);
		formCheck.appendChild(formCheckInput);
		const formCheckLabel = document.createElement('label');
		formCheckLabel.htmlFor = locationId;
		formCheckLabel.classList.add('form-check-label');
		formCheckLabel.innerHTML = location;
		formCheck.appendChild(formCheckLabel);
	});
}

const playerSection = document.getElementById('player-section');
const playerRange = document.getElementById('player-range');
const playerRangeText = document.getElementById('player-range-text');
function playerSectionShow() {
	playerSection.classList.remove('d-none');
	playerRange.value = playerCount;
	playerRangeText.innerHTML = playerCount;
}

const roleSection = document.getElementById('role-section');
function roleSectionShow() {
	roleSection.classList.remove('d-none');
	const row = document.getElementById('role-table');
	row.innerHTML = '';
	[...Array(playerCount).keys()].forEach(function(player) {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'btn btn-secondary m-2 fs-3';
		button.innerHTML = player + 1;
		button.dataset.bsToggle = 'modal';
		button.dataset.bsTarget = '#role-modal';
		button.dataset.bsBody = drawResult.spies.has(player) ? spyText : drawResult.location;
		row.appendChild(button);
	});
	const roleModal = document.getElementById('role-modal');
	const roleText = document.getElementById('role-text');
	roleModal.addEventListener('show.bs.modal', function(event) {
		const button = event.relatedTarget;
		roleText.innerHTML = button.dataset.bsBody;
	});
}

const timerCount = document.getElementById('timer-count');
let timerInterval = null;
let timerCallback = () => {
	const currentTime = (new Date()).getTime();
	const duration = Math.round((currentTime - startTime) / 1000);
	const mins = Math.floor(duration / 60);
	const secs = duration - mins * 60;
	const secsStr = secs.toString().padStart(2, '0');
	timerCount.innerHTML = `${mins}:${secsStr}`;
};

const timerSection = document.getElementById('timer-section');
function timerSectionShow() {
	timerSection.classList.remove('d-none');
	document.getElementById('citizen-count').innerHTML = playerCount - drawResult.spies.size;
	document.getElementById('spy-count').innerHTML = drawResult.spies.size;
	if (timerInterval === null) {
		timerCallback();
		timerInterval = setInterval(timerCallback, 1000);
	}
	const listGroup = document.getElementById('location-list');
	listGroup.classList.add('list-group');
	listGroup.innerHTML = '';
	locationSet.forEach(location => {
		if (uncheckedLocations.has(location))
			return;
		const listGroupItem = document.createElement('div');
		listGroupItem.classList.add('list-group-item');
		listGroupItem.innerHTML = location;
		listGroup.appendChild(listGroupItem);
	});
}

function ui() {
	switch (gameState) {
		case 'location':
			locationSectionShow();
			break;
		case 'player':
			playerSectionShow();
			break;
		case 'role':
			roleSectionShow();
			break;
		case 'timer':
			timerSectionShow();
			break;
	}
}

// listeners

window.addEventListener('load', ui);

document.getElementById('location-next').addEventListener('click', () => {
	locationSection.classList.add('d-none');
	locationSet.forEach(location => {
		const locationId = `location-${md5(location)}`;
		const formCheckInput = document.getElementById(locationId);
		if (formCheckInput.checked)
			uncheckedLocations.delete(location);
		else
			uncheckedLocations.add(location);
	});
	uncheckedLocationsSave();
	gameState = 'player';
	gameStateSave();
	ui();
});

function playerRangeListener(event) {
	playerRangeText.innerHTML = event.target.value;
}
['mousemove', 'mouseup', 'touchmove', 'touchend'].forEach(event => {
	playerRange.addEventListener(event, playerRangeListener);
});

function draw() {
	const locationList = [...locationSet].filter(location => !uncheckedLocations.has(location));
	const location = locationList[Math.floor(Math.random() * locationList.length)];
	const spySet = new Set();
	const spy1 = parseInt(Math.floor(Math.random() * playerCount));
	spySet.add(spy1);
	if (playerCount > 8) {
		let spy2 = parseInt(Math.floor(Math.random() * (playerCount - 1)));
		if (spy2 >= spy1)
			spy2++;
		spySet.add(spy2);
	}
	return {
		location: location,
		spies: spySet,
	};
}

document.getElementById('player-prev').addEventListener('click', () => {
	playerSection.classList.add('d-none');
	gameState = 'location';
	gameStateSave();
	ui();
});

document.getElementById('player-next').addEventListener('click', () => {
	playerSection.classList.add('d-none');
	playerCount = parseInt(playerRange.value);
	playerCountSave();
	drawResult = draw();
	drawResultSave();
	gameState = 'role';
	gameStateSave();
	ui();
});

document.getElementById('role-prev').addEventListener('click', event => {
	document.getElementById('confirm-modal-question').innerHTML = event.target.dataset.confirm;
	document.getElementById('confirm-modal-accept').onclick = () => {
		modal.hide();
		roleSection.classList.add('d-none');
		drawResult = null;
		drawResultSave();
		startTime = null;
		startTimeSave();
		gameState = 'player';
		gameStateSave();
		ui();
	};
	const modal = new bootstrap.Modal(document.getElementById('confirm-modal'));
	modal.show();
});


document.getElementById('role-next').addEventListener('click', () => {
	roleSection.classList.add('d-none');
	if (startTime === null) {
		startTime = (new Date()).getTime();
		startTimeSave();
	}
	gameState = 'timer';
	gameStateSave();
	ui();
});

document.getElementById('timer-prev').addEventListener('click', () => {
	timerSection.classList.add('d-none');
	if (timerInterval !== null) {
		clearInterval(timerInterval);
		timerInterval = null;
	}
	gameState = 'role';
	gameStateSave();
	ui();
});

document.getElementById('timer-next').addEventListener('click', event => {
	document.getElementById('confirm-modal-question').innerHTML = event.target.dataset.confirm;
	document.getElementById('confirm-modal-accept').onclick = () => {
		modal.hide();
		timerSection.classList.add('d-none');
		drawResult = null;
		drawResultSave();
		startTime = null;
		startTimeSave();
		if (timerInterval !== null) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
		gameState = 'location';
		gameStateSave();
		ui();
	};
	const modal = new bootstrap.Modal(document.getElementById('confirm-modal'));
	modal.show();
});
