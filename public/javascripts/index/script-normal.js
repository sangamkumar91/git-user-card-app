	var userDomArr = [];
	var userArr = [];
	var sortingType = 'name';
	var desc = false;
	var username = document.getElementById('username');
	var cardContainer = document.getElementById('card-container');
	var getUserDetails = function() {
		var userid = username.value;
		var url = 'https://api.github.com/users/' + userid;
		$.ajax({
			url: url,
			data: {
				format: 'json'
			},
			success: function(data) {
				for (var s = 0; s < userArr.length; s++) {
					if (data.id == userArr[s]) {
						alert('User has already been added!');
						return;
					}
				}
				userArr.push(data.id);
				var newCard = createCard(data);
				var cardContainerArr = cardContainer.children;
				var initialLength = cardContainerArr.length;
				for (var i = 0; i < cardContainerArr.length; i++) {
					var a1 = data[sortingType];
					var b1 = cardContainerArr[i].getAttribute('data-' + sortingType);
					if (sortingType === 'followers') {
						if (desc) {
							if (Number(a1) > Number(b1)) {
								cardContainer.insertBefore(newCard, cardContainerArr[i]);
								userDomArr.splice(i, 0, newCard);
								break;
							}
						} else {
							if (Number(a1) < Number(b1)) {
								cardContainer.insertBefore(newCard, cardContainerArr[i]);
								userDomArr.splice(i, 0, newCard);
								break;
							}
						}
					} else {
						var s1 = ((a1 === null || typeof a1 === 'undefined') ? '' : a1).toUpperCase();
						var s2 = ((b1 === null || typeof b1 === 'undefined') ? '' : b1).toUpperCase();
						if (desc) {
							if (s1 > s2) {
								cardContainer.insertBefore(newCard, cardContainerArr[i]);
								userDomArr.splice(i, 0, newCard);
								break;
							}
						} else {
							if (s1 < s2) {
								cardContainer.insertBefore(newCard, cardContainerArr[i]);
								userDomArr.splice(i, 0, newCard);
								break;
							}
						}
					}
				}
				if (cardContainer.children.length === initialLength) {
					cardContainer.appendChild(newCard);
					userDomArr.push(newCard);
				}
				username.value = '';
			},
			error: function() {
				alert('User not found!');
				console.log('Some Error has occured. Please Try Again Later.');
			},
			type: 'GET'
		});
	}
	var createCard = function(data) {
		var eachCard = document.createElement('div');
		eachCard.setAttribute('class', 'each-card');
		eachCard.setAttribute('data-name', (data.name === null) ? '' : data.name);
		eachCard.setAttribute('data-location', (data.location === null) ? '' : data.location);
		eachCard.setAttribute('data-followers', data.followers);
		var deleteButton = document.createElement('button');
		deleteButton.setAttribute('class', 'delete-button');
		deleteButton.setAttribute('onclick', 'deleteUser(this)');
		deleteButton.value = data.id;
		deleteButton.innerHTML = 'X';
		eachCard.appendChild(deleteButton);
		var htmlLink = document.createElement('a');
		htmlLink.href = data.html_url;
		htmlLink.target = '_blank';
		var imageWrapper = document.createElement('div');
		var image = document.createElement('img');
		image.setAttribute('alt', 'avatar');
		image.setAttribute('height', '240');
		image.setAttribute('width', '240');
		image.src = data.avatar_url;
		imageWrapper.appendChild(image);
		htmlLink.appendChild(imageWrapper);
		var cardContent = document.createElement('div');
		cardContent.setAttribute('class', 'card-content');
		var nameh3 = document.createElement('h3');
		nameh3.innerHTML = data.name;
		cardContent.appendChild(nameh3);
		cardContent.appendChild(createH5Spans('Location :  ', data.location));
		cardContent.appendChild(createH5Spans('Followers :  ', data.followers));
		htmlLink.appendChild(cardContent);
		eachCard.appendChild(htmlLink);
		return eachCard;
	}
	var createH5Spans = function(label, value) {
		var wrapper = document.createElement('div');
		var h5 = document.createElement('h5');
		var labelSpan = document.createElement('span');
		labelSpan.innerHTML = label;
		var valueSpan = document.createElement('span');
		valueSpan.innerHTML = value;
		valueSpan.style.fontWeight = 'normal';
		h5.appendChild(labelSpan);
		h5.appendChild(valueSpan);
		wrapper.appendChild(h5);
		return wrapper;
	}
	var deleteUser = function(el) {
		var id = Number(el.value);
		for (var s = 0; s < userArr.length; s++) {
			if (userArr[s] === id) {
				userArr.splice(s, 1);
			}
		}
		cardContainer.removeChild(el.parentNode);
	}
	var printUsers = function(el) {
		var sortBtns = el.parentNode.children;
		for (var i = 0; i < sortBtns.length; i++) {
			sortBtns[i].className = "sort-button";
		}
		var val = el.getAttribute('value');
		if (sortingType === val) {
			desc = !desc;
			if (desc) el.className = 'sort-button selected-desc';
			else el.className = 'sort-button selected-asc';
			userDomArr.reverse();
			appendCards(userDomArr);
			return;
		} else {
			desc = false;
			el.className = 'sort-button selected-asc';
		}
		sortingType = val;
		var sortArray = function(a, b) {
			var a1 = a.getAttribute('data-' + sortingType);
			var b1 = b.getAttribute('data-' + sortingType);
			if (sortingType === 'followers') {
				return Number(a1) - Number(b1);
			} else {
				var s1 = ((a1 === null || typeof a1 === 'undefined') ? '' : a1).toUpperCase();
				var s2 = ((b1 === null || typeof b1 === 'undefined') ? '' : b1).toUpperCase();
				return s1 > s2;
			}
		};
		userDomArr.sort(sortArray);
		if (desc) userDomArr.reverse();
		appendCards(userDomArr);
	};
	var appendCards = function(arr) {
		for (var i = arr.length - 1; i >= 0; i--) {
			cardContainer.insertBefore(arr[i], cardContainer.firstChild);
		}
	}