const SUIT = {
    DIAMONDS: 'DIAMONDS', // ♦
    CLUBS: 'CLUBS', // ♣
    HEARTS: 'HEARTS', // ♥
    SPADES: 'SPADES' // ♠
}
const NAME = {
    // '6': '6',
    '7': '7',
    // '8': '8',
    // '9': '9',
    '10': '10',
    // JACK: 'JACK',
    // QUEEN: 'QUEEN',
    // KING: 'KING',
    ACE: 'ACE'
}

class Card {

    constructor(suit, name) {
        this.suit = suit
        this.name = name
        this.id = name + '_' + suit
    }

}

module.exports = { NAME, SUIT, Card }
