const maxGuesses = 12;

const game = {
    wordSpan: document.querySelector('#word'),
    winMessageSpan: document.querySelector('#win-message'),
    winCountSpan: document.querySelector('#win-count'),
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
        {
            word: "Isengard",
            pic: "isengard.jpg",
            msg: "Isengard, Saruman's fortress"
        },
        {
            word: "Eye of Sauron",
            pic: "eyeofsauron.jpg",
            msg: "The Eye of Sauron"
        },
        {
            word: "Galadriel",
            pic: "galadriel.jpg",
            msg: "Galadriel, Lady of the woods of Lothlorien"
        },
        {
            word: "Sting",
            pic: "sting.jpg",
            msg: "Sting, Frodo's blade"
        },
        {
            word: "Samwise Gamgee",
            pic: "samwisegamgee.jpg",
            msg: "Samwise Gamgee, loyal friend"
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
        this.topics[index] = this.topics[this.topics.length - 1];
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

    // Creates and displays the partial word based on known letters and displays it
    updateWord: function () {
        let wordHTML = '';
        for (let i = 0; i < this.word.length; i++) {
            const letter = this.word.charAt(i);
            if (this.lettersKnown.includes(letter.toUpperCase()) || !this.isLetter(letter)) {
                if (letter === ' ') {
                    wordHTML += '&emsp;';
                } else {
                    wordHTML += letter;
                }
            } else {
                wordHTML += ' _ ';
            }
        }
        this.wordSpan.innerHTML = wordHTML;
    },

    // Updates every changeable part of the document
    updateDOM: function () {
        this.updateLetters();
        this.updateWord();
        game.winCountSpan.innerText = this.wins;
        game.winMessageSpan.innerText = this.winMessage;
    },
}

game.newRound();
document.addEventListener('keyup', game.handleInput);

