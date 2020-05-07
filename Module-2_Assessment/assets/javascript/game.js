const maxGuesses = 12;

const game = {
    wordSpan: document.querySelector('#word'),
    winMessageSpan: document.querySelector('#win-message'),
    winCountH4: document.querySelector('#win-count'),
    guessesSpan: document.querySelector('#guesses'),
    lettersSpan: document.querySelector('#letters-guessed'),
    dispImg: document.querySelector('#disp-img'),
    cleverAudio: document.querySelector('#clever-audio'),
    findWayAudio: document.querySelector('#find-way-audio'),
    guesses: 12,
    lettersGuessed: [],
    lettersKnown: [],
    wins: 0,
    winMessage: '',
    word: '',
    topic: {},
    topics: [
        {
            word: "Aragorn",
            pic: "aragorn.jpg",
            msg: "Aragorn, heir of Isildur"
        },
        {
            word: "Minas Tirith",
            pic: "minastirith.jpg",
            msg: "Minas Tirith, capitol of Gondor"
        },
        {
            word: "Gollum",
            pic: "gollum.jpg",
            msg: "Gollum, lover of the Precious"
        },
        {
            word: "Legolas",
            pic: "legolas.jpg",
            msg: "Legolas Greenleaf"
        },
        {
            word: "Gimli",
            pic: "gimli.jpg",
            msg: "Gimli, son of Glóin"
        },
    ],
    usedTopics: [],

    // Resets the game for a new round
    newRound: function () {
        this.guesses = maxGuesses;
        this.lettersGuessed = [];
        this.lettersKnown = [];
        this.selectNextWord();
        this.updateDOM();
    },

    // selects the next topic at random, and moves it into the used topics list and sets it as active
    // Will recycle the used topics if no new ones are left
    selectNextWord: function () {
        // Reset available topics if all have been used
        if (this.topics.length <= 0) {
            this.topics = this.usedTopics;
            this.usedTopics = [];
        }

        const index = Math.floor(Math.random() * this.topics.length);
        this.topic = this.topics[index];
        this.topics[index] = this.topics[this.topics.length-1];
        this.topics.pop();
        this.usedTopics.push(this.topic);
        this.word = this.topic.word;
    },

    // Handles key presses as part of the game
    // Ignores non-letters and previously guessed letters
    // determines whether the letter has been guessed or not and takes the appropriate response
    handleInput: function (event) {
        const key = event.key.toUpperCase();

        if (!game.lettersGuessed.includes(key) && !game.lettersKnown.includes(key) && game.isLetter(key)) {
            if (game.word.toUpperCase().includes(key)) {
                game.lettersKnown.push(key);
                game.checkWin();
                game.updateWord();
            }
            else {
                game.lettersGuessed.push(key);
                game.guessWrong();
                game.updateLetters();
            }
        }
    },

    // Determines whether or not you have won
    checkWin: function () {
        for (let i = 0; i < this.word.length; i++) {
            const ltr = this.word.charAt(i).toUpperCase();
            if (!this.lettersKnown.includes(ltr) && this.isLetter(ltr)) {
                return;
            }
        }
        this.wins++;
        this.winMessage = this.topic.msg;
        this.dispImg.src = `assets/images/${this.topic.pic}`;
        this.cleverAudio.play();
        this.newRound();
    },

    // Determines whether or not you have lost
    guessWrong: function () {
        this.guesses--;
        if (this.guesses <= 0) {
            this.findWayAudio.play();
            this.newRound();
        }
    },

    // returns true if ch is a (single) letter A-Z or a-z
    isLetter(ch) {
        return ch.length === 1 && (ch.toUpperCase() != ch.toLowerCase());
    },

    // Updates the number of guesses and previously guessed letters elements on the page
    updateLetters: function () {
        game.lettersSpan.innerText = this.lettersGuessed.join();
        game.guessesSpan.innerText = this.guesses;
    },

    // Creates and display the partial word based on known letters and displays it
    updateWord: function () {
        let disp = '';
        const wordUpper = this.word.toUpperCase();
        for (let i = 0; i < this.word.length; i++) {
            const letter = wordUpper.charAt(i);
            if (this.lettersKnown.includes(letter) || !this.isLetter(letter)) {
                disp += letter;
            } else {
                disp += ' _ ';
            }
        }
        this.wordSpan.innerText = disp;
    },

    // Updates every changeable part of the document
    updateDOM: function () {
        this.updateLetters();
        this.updateWord();
        game.winCountH4.innerText = this.wins;
        game.winMessageSpan.innerText = this.winMessage;
    },
}

game.newRound();
document.addEventListener('keyup', game.handleInput);

