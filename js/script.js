

//class created to represent the whole memory game
let ImageGame = function () {

	//initialization of few variables
	let self = this;
	//first clicked card
	let firstImage = null;

	//second clicked card.
	let secondImage = null;

	//number of moves made in the game.
	let numOfMoves = 0;

	let totalScore = 0;

	let interval;

	//overlay that disables clicks
	let overlay = document.getElementById("overlay");

	//all images in the grid
	let imagePositions = [
		[0, 0],[0, 1],[0, 2],[0, 3],
		[1, 0],[1, 1],[1, 2],[1, 3],
		[2, 0],[2, 1],[2, 2],[2, 3],
		[3, 0],[3, 1],[3, 2],[3, 3],
	];

	//types of images
	let listOfImageTypes = [
		"fas fa-snowman",
		"fas fa-snowboarding",
		"fas fa-chess-knight",
		"fab fa-canadian-maple-leaf",
		"fas fa-birthday-cake",
		"fas fa-dragon",
		"fas fa-gifts",
		"fas fa-theater-masks"
	];

		//timer
		let currentTimeInSeconds = 0;
		let updateClock = function () {
			currentTimeInSeconds++;
	
			let seconds = currentTimeInSeconds % 60;
			if (seconds < 10)
				seconds = "0" + seconds;
	
			let minutes = Math.floor(currentTimeInSeconds / 60);
			if (minutes < 10)
				minutes = "0" + minutes;
			else if (minutes >= 60)
				minutes = minutes % 60;
	
			let hours = Math.floor(currentTimeInSeconds / 3600);
			if (hours < 10)
				hours = "0" + hours;
	
			document.getElementById("time").innerText = (hours + " : " + minutes + " : " + seconds);
		};
	
	//initializing the array this will be used in case of reset
	let initializeImageArrays = function () {
		imagePositions = [
			[0, 0],[0, 1],[0, 2],[0, 3],
			[1, 0],[1, 1],[1, 2],[1, 3],
			[2, 0],[2, 1],[2, 2],[2, 3],
			[3, 0],[3, 1],[3, 2],[3, 3],
		];
		listOfImageTypes = [
			"fas fa-snowman",
			"fas fa-snowboarding",
			"fas fa-chess-knight",
			"fab fa-canadian-maple-leaf",
			"fas fa-birthday-cake",
			"fas fa-dragon",
			"fas fa-gifts",
			"fas fa-theater-masks"
		];
	};

	//suffling the various images on the grid using random function
	let shuffle = function (array) {
		let currentIndex = array.length,
			temporaryValue, randomIndex;

		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};

	//array to hold all the images
	let arrayOfImages = new Array(new Array(), new Array(), new Array(), new Array());

	//to initialize the images on the screen
	let initArrayOfImages = function (imagePositions) {
		for (let i = 0, len = listOfImageTypes.length; i < len; i++) {
			let imageType = listOfImageTypes.pop();
			for (let j = 0, numOfImages = 2; j < numOfImages; j++) {
				let currImagePos = imagePositions.pop();
				let xPos = currImagePos[0];
				let yPos = currImagePos[1];
				let currImage = new Image(imageType, xPos, yPos);
				arrayOfImages[xPos].push(currImage);
			}
		}
	};

	//function to get the css and the position of the image
	let Image = function (cssClass, x, y) {
		this.imageClass = cssClass;
		this.xPos = x;
		this.yPos = y;
	};

	//display images on the screen
	let displayImages = function () {
		let imageHTML = "";
		for (let i = 0, len = arrayOfImages.length; i < len; i++) {
			let rowOfImages = arrayOfImages[i];
			for (let j = 0, len = rowOfImages.length; j < len; j++) {
				let cssClass = rowOfImages[j].imageClass;
				let imageId = "image_" + i + "_" + j;
				imageHTML += `<li id="${imageId}" data-row="${i}" data-col="${j}" class="flip-container" style="" 
				onclick="this.classList.add('flip');"><div class="flipper"><div class="front image"></div><div class="back image ${cssClass}" >
				</div></div></li>`;
			}
		}
		let imageList = document.getElementById("imageList");
		imageList.innerHTML = imageHTML;

		let imageArray = document.getElementsByTagName("li");
		for (let k = 0, len = imageArray.length; k < len; k++) {
			let image = imageArray[k];
			image.addEventListener('click', clickImage, false);
		}
	};

	//function when image is clicked
	//case - 1 : when no click is made: first image will be set in the variable
	//case-2:  when 2nd click is made: second image will be set in the variable
	//case - 3: no action take when 2 clicks for the image selection are already made
	let clickImage = function () {
		let imageItem = this;
		if (firstImage === null && secondImage === null) {
			firstImage = imageItem;
		} else if (firstImage !== null && secondImage === null) {
			secondImage = imageItem;
			if (firstImage === secondImage) {
				secondImage = null;
				return;
			}
			overlay.style.display = "block";

			window.setTimeout(function () {
				checkMatch(secondImage, firstImage);
			}, 500);
			updateMoves();
		} else {
			return;
		}

		imageItem.classList.add("show");

		if (currentTimeInSeconds === 0)
			 interval = setInterval(updateClock, 1000);
	};
	//frunction to check the match of an image
	let checkMatch = function (currClickedImage, prevClickedImage) {
		let imageClass = currClickedImage.children[0].children[1].classList.toString();
		let prevImageClass = prevClickedImage.children[0].children[1].classList.toString();
		
		if (imageClass === prevImageClass) {
			handleMatchedClasses(prevClickedImage, currClickedImage);
		} else {
			handleUnmatchedClasses(prevClickedImage, currClickedImage);
		}

		checkForWin();

		firstImage = null;
		secondImage = null;
	};

	let handleMatchedClasses = function (firstMatchedImage, secondMatchedImage) {
		totalScore++;
		firstMatchedImage.classList.add("rubberband", "animated", "match");
		secondMatchedImage.classList.add("rubberband", "animated", "match");
		window.setTimeout(function () {
			firstMatchedImage.classList.remove("rubberband", "animated");
			secondMatchedImage.classList.remove("rubberband", "animated");
			overlay.style.display = "none";

			let movesDisplay = document.getElementById("moves-counter");
			movesDisplay.innerText = totalScore;

			let totalDisplay = document.getElementById("total-score");
			totalDisplay.innerText = totalScore*10;


		}, 1000);
	};

	let handleUnmatchedClasses = function (firstMatchedImage, secondMatchedImage) {
		let cardChild1 = firstMatchedImage.children[0].children[1];
		let cardChild2 = secondMatchedImage.children[0].children[1];
		firstMatchedImage.classList.add("wobble", "animated");
		secondMatchedImage.classList.add("wobble", "animated");
		cardChild1.classList.add("failed-match");
		cardChild2.classList.add("failed-match");
		firstMatchedImage.classList.remove("flip");
		secondMatchedImage.classList.remove("flip");
		window.setTimeout(function () {
			firstMatchedImage.classList.remove("wobble", "animated", "failed-match");
			secondMatchedImage.classList.remove("wobble", "animated", "failed-match");
			cardChild1.classList.remove("failed-match");
			cardChild2.classList.remove("failed-match");
			overlay.style.display = "none";
		}, 1000);

	};

	let checkForWin = function () {
		let numberOfMatchedCards = document.getElementsByClassName("match").length;
		if (numberOfMatchedCards === 16) {
			alert("Congratulation! You have won");
			clearTimeout(interval);
		}

	};

	let updateMoves = function () {
		numOfMoves++;
		/*let movesDisplay = document.getElementById("moves-counter");
		movesDisplay.innerText = numOfMoves;*/
	};


	this.reset = function () {
		imagePositions = [
			[0, 0],[0, 1],[0, 2],[0, 3],
			[1, 0],[1, 1],[1, 2],[1, 3],
			[2, 0],[2, 1],[2, 2],[2, 3],
			[3, 0],[3, 1],[3, 2],[3, 3],
		];
		listOfImageTypes = [
			"fas fa-snowman",
			"fas fa-snowboarding",
			"fas fa-chess-knight",
			"fab fa-canadian-maple-leaf",
			"fas fa-birthday-cake",
			"fas fa-dragon",
			"fas fa-gifts",
			"fas fa-theater-masks"
		];
		arrayOfImages = new Array(new Array(), new Array(), new Array(), new Array());
		totalScore = 0;
		interval=0;
		let movesDisplay = document.getElementById("moves-counter");
		document.getElementById("time").innerHTML="00 : 00 : 00";
		document.getElementById("total-score").innerHTML = 0;
		movesDisplay.innerText = totalScore;
		initialize();
	};

	let initialize = function () {
		numOfMoves = 0;
		currentTimeInSeconds = 0;
		totalScore = 0;
		initializeImageArrays();
		let shuffledImagePositions = shuffle(imagePositions);
		initArrayOfImages(shuffledImagePositions);
		displayImages();
		updateMoves();
		let restartButton = document.getElementById("restart-button");
		restartButton.addEventListener("click", self.reset, false);
	};
	initialize();
};


let memoryGame = new ImageGame();