$(document).ready(function() {

	console.log("Oh you fancy, huh?")

	/// MAIN VARIABLES ///
	const freshDeck = createDeck();
	var playersHand = [];
	var dealersHand = [];
	var theDeck = freshDeck.slice();
	var activeHand = true;


	/// DEAL BUTTON - Event Handler///
	$('.deal-button').click(function(){

		// shuffleDeck();
		reset();

		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());

		placeCard('player', 1, playersHand[0]);
		placeCard('player', 2, playersHand[1]);

		placeCard('dealer', 1, dealersHand[0]);
		placeCard('dealer', 2, 'deck');

		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer')
	

		if(calculateTotal(playersHand, 'player') == 21) {
			dealerFlip();
			checkWin();
		}
	});



	/// HIT BUTTON - Event Handler ///
	$('.hit-button').click(function(){

		if(calculateTotal(playersHand, 'player') < 21) {
			playersHand.push(theDeck.shift());
			var lastCardIndex = playersHand.length - 1;
			var cardSlot = playersHand.length;
			placeCard('player', cardSlot, playersHand[lastCardIndex]);
			calculateTotal(playersHand, 'player');
		} 

		if(calculateTotal(playersHand, 'player') >= 21) {
			dealerFlip();
			checkWin();
		}
	});



	/// STAND BUTTON - Event Handler ///
	$('.stand-button').click(function(){
		dealerFlip();
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		while((dealerTotal < 17) && (activeHand == true)) {
			dealersHand.push(theDeck.shift());
			var lastCardIndex = dealersHand.length - 1;
			var cardSlot = dealersHand.length;
			placeCard('dealer', cardSlot, dealersHand[lastCardIndex]);
			dealerTotal = calculateTotal(dealersHand, 'dealer');
		}
		checkWin();
	});



	/// CREATE DECK - Utility Function ///
	function createDeck() {
		var newDeck = [];
		var suits = ['h', 's', 'd', 'c'];
		for(let suit = 0; suit < suits.length; suit++) {
			for(let card = 1; card <= 13; card++) {
					newDeck.push(card + suits[suit]);
			}
		}
		return newDeck;
	}



	/// SHUFFLE DECK - Utility Function ///
	function shuffleDeck() {
		for(let i = 0; i < 14000; i++) {
			var random1 = Math.floor(Math.random() * 52);
			var random2 = Math.floor(Math.random() * 52);
			var temp = theDeck[random1];
			theDeck[random1] = theDeck[random2];
			theDeck[random2] = temp;
		}
	}



	/// PLACE CARD - Utility Function ///
	function placeCard(who, where, what) {
			var cardSlot = '.' + who + '-cards .card-' + where;
			imageTag = '<img src="images/' + what + '.png">';
			$(cardSlot).html(imageTag);
	}



	/// CALCULATE TOTAL - Utility Function ///
	function calculateTotal(hand, who){
		var totalHandValue = 0;
		var thisCardValue = 0;
		var dealerDisplay = 0;
		var hasAce = false;
		var totalAces = 0;

		for(let i = 0; i < hand.length; i++) {

			thisCardValue = Number(hand[i].slice(0, -1));

			if(thisCardValue >= 10) {
				thisCardValue = 10;
			} else if(thisCardValue == 1) {
				hasAce = true;
				totalAces++;
				thisCardValue = 11;
			}

			totalHandValue += thisCardValue;

			if((who == 'dealer') && (i == 0)) {
				dealerDisplay += thisCardValue;
			}
		}

		for (let i = 0; i < totalAces; i++) {
			if(totalHandValue > 21) {
				totalHandValue -= 10
			}
		}

		var totalToUpdate = '.' + who + '-total-number';
		var totalToDisplay = totalHandValue;
		if ((who == 'dealer') && (activeHand == true)) {
			totalToDisplay = dealerDisplay;
		}
		$(totalToUpdate).text(totalToDisplay);
		return totalHandValue;
	}



	/// DEALER FLIP - Utility Function ///
	function dealerFlip() {
		placeCard('dealer', 2, dealersHand[1]);
	}



	/// CHECK WIN - Utility Function ///

	function checkWin() {
		activeHand = false;
		var playerTotal = calculateTotal(playersHand, 'player');
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		var winMessage = "";
		if(playerTotal > 21) {
			winMessage = "Player has busted. Dealer wins.";
			playerBust();
		} else if (playerTotal == 21) {
			winMessage = "Blackjack! You win!"
			playerWin();
		} else if (dealerTotal > 21) {
			winMessage = "Dealer has busted. You win!";
			dealerBust();
		} else {
			if(playerTotal > dealerTotal) {
				winMessage = "You beat the dealer!";
				playerWin();
			} else if(playerTotal < dealerTotal) {
				winMessage = "The dealer has bested you. We get your money.";
			} else {
				winMessage = "It's a push!";
			}
		}
		$('.message').text(winMessage);
	}


	/// PLAYER WIN - Utility Function ///
	function playerWin() {
		$('.player-total-number, .table, .player-hr, .player-cards .card').addClass("win");
		// $('.player-total-number').addClass('big-number')
	}


	/// PLAYER BUST - Utility Function ///
	function playerBust() {
		$('.player-total-number, .table, .player-hr, .player-cards .card').addClass("bust");
		// $('.player-total-number').addClass('big-number')
	}


	/// DEALER WIN - Utility Function ///
	function dealerWin() {
		$('.player-total-number, .table, .player-hr, .player-cards .card').addClass("bust");
	}


	/// DEALER BUST - Utility Function ///
	function dealerBust() {
		$('.dealer-total-number').addClass("bust");
		$('.player-total-number, .table, .player-hr, .player-cards .card').addClass("win");
	}





	/// RESET - Utility Function ///
	function reset() {
		theDeck = freshDeck.slice();
		shuffleDeck();
		playersHand = [];
		dealersHand = [];
		$('.card').html('');
		$('.dealer-total-number').html('0');
		$('.player-total-number').html('0');
		$('.message').text('');
		$('.win').removeClass('win');
		$('.bust').removeClass('bust');
		activeHand = true;

	}


});