const maxGuesses = 12;

const game = {
    wordSpan: document.querySelector('#word'),
    winMessageSpan: document.querySelector('#win-message'),
    winCountH4: document.querySelector('#win-count'),
    guessesSpan: document.querySelector('#guesses'),
    lettersSpan: document.querySelector('#letters-guessed'),
    guesses: 12,
    lettersGuessed: [],
    lettersKnown: [],
    wins: 0,
    word: "Test",

    // Resets the game for a new round
    newRound: function () {
        this.guesses = maxGuesses;
        this.lettersGuessed = [];
        this.lettersKnown = [];
        this.word = 'Test';
        this.wins = 0;
        this.updateDOM();
    },

    // Handles key presses as part of the game
    // Ignores non-letters and previously guessed letters
    // determines whether the letter has been guessed or not and takes the appropriate response
    handleInput: function (event) {
        const key = event.key.toUpperCase();
        console.log(key);

        if(!game.lettersGuessed.includes(key) && !game.lettersKnown.includes(key) && game.isLetter(key)){
            if(game.word.toUpperCase().includes(key)){
                game.lettersKnown.push(key);
                game.checkWin();
                game.updateWord();
            } 
            else{
                game.lettersGuessed.push(key);
                game.guessWrong();
                game.updateLetters();
            }
        }
    },

    checkWin: function(){
        for(let i = 0; i < this.word.length; i++){
            const ltr = this.word.charAt(i).toUpperCase();
            if(!this.lettersKnown.includes(ltr)){
                return;
            }
        }
        this.wins++;
        this.newRound();
    },

    guessWrong: function(){
        this.guesses--;
        if(this.guesses <= 0){
            this.newRound();
        }
    },

    // returns true if ch is a (single) letter A-Z or a-z
    isLetter(ch){
        return ch.length === 1 && (ch.toUpperCase() != ch.toLowerCase());
    },

    // Updates the number of guesses and previously guessed letters elements on the page
    updateLetters: function() {
        game.lettersSpan.innerText = this.lettersGuessed.join();
        game.guessesSpan.innerText = this.guesses;
    },

    // Creates and display the partial word based on known letters and displays it
    updateWord: function(){
        let disp = '';
        const wordUpper = this.word.toUpperCase();
        for(let i = 0; i < this.word.length; i++){
            const letter = wordUpper.charAt(i);
            if(this.lettersKnown.includes(letter) || !this.isLetter(letter)){
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
    },
}

game.newRound();
document.addEventListener('keyup', game.handleInput);

