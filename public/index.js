let opponentCards = []
let discardCards = []
let playerCards = []

const playerDeck = document.getElementById("player-deck");
const opponentDeck = document.getElementById("opponent-deck");
const discardPile = document.getElementById("discard-pile");
const opponentFace = document.getElementById("opponent-face");
const status = document.getElementById("status");

let suit;
for(var i=0; i<4; i++) {
    switch(i){
        case 0:
            suit = 'H'
        break;
        case 1:
            suit = 'D'
        break;
        case 2:
            suit = 'C'
        break;
        case 3:
            suit = 'S'
        break;
    }

    for(var j=0; j<13; j++){
        switch(j){
            case 0:
                discardCards.push("A"+suit)
            break;
            case 10:
                discardCards.push("J"+suit)
            break;
            case 11:
                discardCards.push("Q"+suit)
            break;
            case 12:
                discardCards.push("K"+suit)
            break;
            default:
                discardCards.push(j+suit)
        }
    }
}

// shuffling the whole deck
function shuffle(deck) {
    var currentCard = deck.length;
    let tempCard;
    let randomCard;
    
    while(currentCard !== 0){
        randomCard = Math.floor(Math.random()*currentCard);
        currentCard -= 1;

        tempCard = deck[currentCard]
        deck[currentCard] = deck[randomCard]
        deck[randomCard] = tempCard
    }
    return deck;
}

discardCards = shuffle(discardCards)

// splitting the cards between the two players
for(var k=0, u=discardCards.length; k<u; k++){
    if(k%2 === 0){
        playerCards.push(discardCards[k])
    }else{
        opponentCards.push(discardCards[k])
    }
}
discardCards = []

function playerTurn(event) {
    status.style.display = 'none';
    const target = event.target.id;
    discardPile.style.visibility = "visible";
    if(target === 'player-deck'){
        discardCards.push(playerCards[0])
        playerCards.splice(0,1)
    }else if(target === 'opponent-deck'){
        discardCards.push(opponentCards[0])
        opponentCards.splice(0,1)
    }

    // splitting the letter and symbol
    const currentCard = discardCards[discardCards.length-1]
    let currValue = currentCard.substring(0,1);
    const suit = currentCard.substring(1,2);

    // since for loop runs from 0-12, card numbers are incremented, so as to look form A,2-9,J,Q,K
    if(Number(currValue)){
        currValue = Number(currValue)+1
    }

    // setting the numbers on the displayCard Pile
    let cardNums = document.getElementsByClassName("card-number");
    discardPile.classList.remove('red')
    for (let i = 0; i < 2; i++) {
        switch(suit) {
            case 'H': {
                discardPile.classList.add("red");
                cardNums[i].innerText = currValue + "\n♥";
                suitSymbol = "♥";
            }
            break;
            case 'D': {
                discardPile.classList.add("red");
                cardNums[i].innerText = currValue + "\n♦";
                suitSymbol = "♦";
            }
            break;
            case 'S': {
                cardNums[i].innerText = currValue + "\n♠";
                suitSymbol = "♠";
            }
            break;
            case 'C': {
                cardNums[i].innerText = currValue + "\n♣";
                suitSymbol = "♣";
            }
            break;
            default:
                console.error(`No recognizable suit found`);
        }
    }

    const cardArt = document.getElementsByClassName('card-art')[0];
    while(cardArt.children[0]) {
        cardArt.children[0].remove();
    }
    cardArt.style.flexFlow = null;

    //setting the symbol in the middle of the card
    if(Number(currValue)){
        for(var k=0; k<currValue; k++){
            let suitSymbolContainer = document.createElement('div')
            suitSymbolContainer.textContent = suitSymbol
            cardArt.appendChild(suitSymbolContainer)
        }
        if(currValue < 4){
            cardArt.style.flexFlow = 'column wrap'
        }
    }else if(!Number(currValue)){
        switch(currValue){
            case 'J':
                suitSymbol = "🤵";
            break;
            case 'Q':
                suitSymbol = "👸";
            break;
            case 'K':
                suitSymbol = "🤴";
            break;
            default:
        }

        let suitSymbolContainer = document.createElement('div')
        suitSymbolContainer.textContent = suitSymbol;
        suitSymbolContainer.style.fontSize = `6vh`;
        cardArt.append(suitSymbolContainer);

        if(currValue !== 'A'){
            cardArt.style.flexFlow = `column wrap`;
            let flippedSuitSymbolContainer = document.createElement('div')
            flippedSuitSymbolContainer.textContent = suitSymbol;
            flippedSuitSymbolContainer.style.fontSize = `6vh`;
            flippedSuitSymbolContainer.style.transform = 'rotate(180deg)'
            cardArt.append(flippedSuitSymbolContainer);
        }
    }
    getCurrentCards();
    opponentAI(target);
}

let reaction;
function opponentAI(lastPlayer) {
    const reactionTime = Math.floor(Math.random() * (1400 - 900)) + (900);
    window.clearTimeout(reaction);
    reaction = window.setTimeout(function() {
        const discardCardsLength = discardCards.length;
        if (discardCardsLength > 0 && discardCards[discardCardsLength - 1].includes('J')) {
            console.log('Slap!');
            slap();
        } else if (lastPlayer === "player-deck") {
            let event = new Object;
            event.target = new Object;
            event.target.id = "opponent-deck";
            playerTurn(event);
        }
    },reactionTime);
}

function slap(event) {
    const discardCardsLength = discardCards.length;
    let currentPlayer;
    if (event !== undefined) {
        currentPlayer = 'player';
    } else {
        currentPlayer = 'opponent';
        if (discardCardsLength === 0) {
            changeOpponentFace('disappointed');
            return;
        }
    }

    if(discardCardsLength > 0 && discardCards[discardCardsLength-1].includes('J')) {
        discardPile.style.visibility = 'hidden';
        if (currentPlayer === 'player') {
            playerCards = playerCards.concat(shuffle(discardCards));
            changeOpponentFace('disappointed');
            window.clearTimeout(reaction);
        } else if (currentPlayer === 'opponent') {
            opponentCards = opponentCards.concat(shuffle(discardCards));
            changeOpponentFace('happy');
            opponentAI('player-deck');
        }
        discardCards = [];
        getCurrentCards();
    }
}

let expression;
function changeOpponentFace(mood) {
    if (mood === 'happy') {
        opponentFace.textContent = '😁';
        status.style.display = 'block';
        status.textContent = 'Computer Won!!'
    } else if (mood === 'disappointed') {
        opponentFace.textContent = '😣';
        status.style.display = 'block';
        status.textContent = 'You won, start again by clicking your card deck!!'
    }
    const expressionTime = Math.floor(Math.random() * (1000-500)) + (500);
    window.clearTimeout(expression);
    expression = window.setTimeout(function() {
		opponentFace.textContent = '🙂';
	},expressionTime);
}

function getCurrentCards() {
    if (playerCards.length === 0) {
		playerDeck.removeEventListener('click', playerTurn, false);
		playerDeck.style.visibility = 'hidden';
		window.clearTimeout(reaction);
		document.getElementById('win-lose-status').textContent = 'DECK IS EMPTY, YOU LOSE!';
		document.getElementById('play-again-wrapper').style.display = 'flex';
	} else if (opponentCards.length === 0) {
		opponentFace.textContent = '😣';
		opponentDeck.style.visibility = 'hidden';
		window.clearTimeout(reaction);
		document.getElementById('win-lose-status').textContent = 'YOU WIN!';
		document.getElementById('play-again-wrapper').style.display = 'flex';
	}
}

playerDeck.addEventListener('click', playerTurn, false)
discardPile.addEventListener('click', slap, false);