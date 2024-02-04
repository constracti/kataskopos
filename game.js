const locationList = [
	//'Άγνωστη Τοποθεσία',
	'Αεροπλάνο',
	'Αστυνομικό Τμήμα',
	'Βιβλιοθήκη',
	'Γήπεδο',
	'Γυμναστήριο',
	'Διαστημικός Σταθμός',
	'Δικαστήριο',
	'Εκκλησία',
	'Εργοστάσιο',
	'Ερευνητικό Κέντρο',
	'Εστιατόριο',
	'Εταιρικό Πάρτι',
	'Ζωολογικός Κήπος',
	'Θέατρο',
	'Ίντερνετ Καφέ',
	'Καζίνο',
	'Λούνα Παρκ',
	'Μουσείο',
	'Νοσοκομείο',
	'Ξενοδοχείο',
	'Πανεπιστήμιο',
	'Παρέλαση',
	'Παραλία',
	'Πειρατικό Καράβι',
	'Πολικός Σταθμός',
	'Πρεσβεία',
	'Σαλούν',
	'Σαφάρι',
	'Σινεμά',
	'Σούπερ Μάρκετ',
	// 'Σπα',
	'Στοιχειωμένο Σπίτι',
	// 'Στούντιο Παραγωγή…'
	'Στρατιωτική Βάση',
	// 'Στρατός Σταυροφορ…'
	'Συναυλία',
	'Συνεργείο',
	'Σχολείο',
	'Σχολή Κατασκόπων',
	'Τόι Στόρι',
	'Τράπεζα',
	'Τρένο',
	'Τσίρκο',
	'Υπερωκεάνιο',
	'Υποβρύχιο',
	'Ψυχιατρική Κλινική',
];
window.addEventListener('load', function() {
	const ol = document.getElementById('location-list');
	ol.innerHTML = '';
	locationList.forEach(function(location) {
		const li = document.createElement('li');
		li.className = 'list-group-item';
		li.innerHTML = location;
		ol.appendChild(li);
	});
});

const spyText = 'ΚΑΤΑΣΚΟΠΟΣ';

document.getElementById('start').addEventListener('click', function() {
	// location
	const location = locationList[Math.floor(Math.random() * locationList.length)];
	// players
	const input = document.getElementById('player-count');
	const playerCount = parseInt(input.value);
	// spies
	const spySet = new Set();
	const spy1 = parseInt(Math.floor(Math.random() * playerCount));
	spySet.add(spy1);
	if (playerCount > 8) {
		let spy2 = parseInt(Math.floor(Math.random() * (playerCount - 1)));
		if (spy2 >= spy1)
			spy2++;
		spySet.add(spy2);
	}
	// roles
	const div = document.getElementById('role-list');
	div.innerHTML = '';
	[...Array(playerCount).keys()].forEach(function(player) {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'btn btn-secondary m-2 fs-3';
		button.innerHTML = player + 1;
		button.dataset.bsToggle = 'modal';
		button.dataset.bsTarget = '#modal';
		button.dataset.bsBody = spySet.has(player) ? spyText : location;
		div.appendChild(button);
	});
	const roleModal = document.getElementById('modal');
	const roleDiv = document.getElementById('role');
	roleModal.addEventListener('show.bs.modal', function(event) {
		const button = event.relatedTarget;
		roleDiv.innerHTML = button.dataset.bsBody;
	});
});
