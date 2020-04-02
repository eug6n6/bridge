
// BUGS
// First move - rules nor applied

const SUIT = {
    DIAMONDS: 'DIAMONDS', // ♦
    CLUBS: 'CLUBS', // ♣
    HEARTS: 'HEARTS', // ♥
    SPADES: 'SPADES' // ♠
}
const NAME = {
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10',
    JACK: 'JACK',
    QUEEN: 'QUEEN',
    KING: 'KING',
    ACE: 'ACE'
}
const RULES = {
    cardCanCover(card, pile, player) {
        const currentCard = pile.getLastCard()
        if (currentCard.name === NAME['6'] || player.cardsPut === 0)
            return card.name === currentCard.name
                || card.suit === currentCard.suit
                || card.name === NAME.JACK
        return card.name === currentCard.name
    },
    cardMakeSkip(card) {
        return [
            NAME.ACE, NAME[9]
        ].includes(card.name)
    },
    cardMakeTake(card) {
        if (card.name === NAME[9]) return 2
        if (card.name === NAME[1]) return 1
        if (card.name === NAME.KING && card.suit === SUIT.HEARTS) return 5
        return 0
    },
    canSkip(pile, player) {
        const currentCard = pile.getLastCard()
        return currentCard.name !== NAME['6'] 
            && (player.cardsTaken > 0 || player.cardsPut > 0)
    },
    canTake(pile, player) {
        return (player.cardsTaken < 1 && player.cardsPut === 0) 
            || pile.getLastCard().name === NAME['6']
    },
    canEnd(player, pile) {
        return player.cards.length === 0 && pile.getLastCard().name !== NAME['6']
    }
}

class Container {
    cards = []

    moveLastCardTo(container, number = 1) {
        while (number--) container.cards.push(this.cards.pop())
    }
    moveFirstCardTo(container, number = 1) {
        while (number--) container.cards.push(this.cards.shift())
    }

    moveCardTo(card, container) {
        if (!this.cards.includes(card))
            throw new Error('Unowned card')
        this.cards = this.cards.filter(_card => _card !== card)
        container.cards.push(card)
    }

    getLastCard() {
        return this.cards[this.cards.length - 1]
    }

    getCardById(id) {
        return this.cards.find(card => card.id === id)
    }
}

class Card {

    constructor(suit, name) {
        this.suit = suit
        this.name = name
        this.id = name + '_' + suit
    }

}

class Deck extends Container {
    fill() {
        this.cards = Object.keys(NAME).reduce(
            (cards, name) =>
                [...cards, ...Object.keys(SUIT).map(suit =>
                    new Card(suit, name)
                )],
            []
        )
        return this
    }
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = this.cards[i]
            this.cards[i] = this.cards[j]
            this.cards[j] = temp
        }
        return this
    }
}
class Pile extends Container {
    moveToDeck(deck) {
        this.moveFirstCardTo(deck, deck.cards.length - 4)
        deck.shuffle()
    }
 }

class Player extends Container {
    points = 0
    skip = 0
    cardsTaken = 0
    cardsPut = 0

    constructor(name) {
        super()
        this.name = name
        // TODO id
        this.id = name
    }
}

class Game {

    currentPlayer = null
    players = []

    playing = false
    playNumber = 0

    _lastSkipper = null

    constructor(playersNames) {
        this.players = playersNames.map(name => new Player(name))
    }

    start() {
        this.playing = true
        this.deck = new Deck().fill().shuffle()
        this.pile = new Pile()
        this.players.forEach(player =>
            this.deck.moveLastCardTo(player, 5)
        )
        this.players[0].moveLastCardTo(this.pile)
        this._nextPlayer()
        this.currentPlayer.cardsPut++
        this.currentPlayer.cardsTaken = 4
    }

    attack(cardId) {
        const card = this.currentPlayer.getCardById(cardId)
        if (!RULES.cardCanCover(card, this.pile, this.currentPlayer))
            throw new Error('Invalid move')
        this.currentPlayer.moveCardTo(card, this.pile)
        let cardsToTake = RULES.cardMakeTake(card)
        while (cardsToTake-- > 0) this.deck.moveLastCardTo(this.getNextPlayer())
        if (RULES.cardMakeSkip(card))
            this._applySkip()
        this.currentPlayer.cardsPut++
    }
    _applySkip() {
        const next = (player) => {
            let nextIndex = this.players.indexOf(player) + 1
            if (nextIndex >= this.players.length) nextIndex = 0
            if (this.players[nextIndex] === this.currentPlayer)
                return next(this.currentPlayer)
            return this.players[nextIndex]
        }
        const player = next(this._lastSkipper || this.currentPlayer)
        player.skip++
        this._lastSkipper = player
    }
    takeCard() {
        // TODO if deck empty
        if (this.deck.cards.length === 0) {
            this.pile.moveToDeck(this.deck)
        }
        if (!RULES.canTake(this.pile, this.currentPlayer))
            throw new Error('Tou cannot take')
        this.deck.moveLastCardTo(this.currentPlayer)
        this.currentPlayer.cardsTaken++
    }
    skip() {
        if (!RULES.canSkip(this.pile, this.currentPlayer))
            throw new Error('You cannot skip')
        this._nextPlayer()
    }
    end() {
        if (!RULES.canEnd(this.currentPlayer, this.pile))
            throw new Error('You cannot end')
        // TODO points...
        this.playing = false
    }

    getNextPlayer() {
        if (!this.currentPlayer) return this.players[0]
        let nextPlayerIndex = this.players.indexOf(this.currentPlayer) + 1
        if (nextPlayerIndex >= this.players.length)
            nextPlayerIndex = 0
        return this.players[nextPlayerIndex]
    }

    _nextPlayer() {
        this.currentPlayer = this.getNextPlayer()
        while (this.currentPlayer.skip > 0) {
            this.currentPlayer.skip--
            this.currentPlayer = this.getNextPlayer()
        }
        this.currentPlayer.cardsTaken = 0
        this.currentPlayer.cardsPut = 0
    }

    getState() {
        const players = this.players.map(player => {
            const _player = {
                id: player.id,
                name: player.name,
                skip: player.skip,
                cards: player.cards.map(card => card.id),
                current: false
            }
            if (player === this.currentPlayer) {
                _player.current = true
                _player.canEnd = RULES.canEnd(this.pile, this.currentPlayer)
                _player.canSkip = _player.canEnd ? false : RULES.canSkip(this.pile, this.currentPlayer)
                _player.canTake = _player.canEnd ? false : RULES.canTake(this.pile, this.currentPlayer)
                _player.canCoverWith = _player.canEnd ? [] : this.currentPlayer.cards.filter(card =>
                    RULES.cardCanCover(card, this.pile, this.currentPlayer)
                ).map(card => card.id)
            }
            return _player
        })
        return {
            players,
            deck: this.deck.cards.map(card => card.id),
            pile: this.pile.cards.map(card => card.id),
        }
    }

}



const game = new Game(['Zheka', 'Vika', 'Tema'])
game.start()
console.log(game.getState())

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
})

io.on('connection', function (socket) {
    socket.emit('state', game.getState())
    console.log('connected')

    try {
        socket.on('skip', () => {
            try {
                game.skip()
                socket.emit('state', game.getState())
            } catch (error) { socket.emit('invalid', error.message) }
        })
        socket.on('take', () => {
            try {
                game.takeCard()
                socket.emit('state', game.getState())
            } catch (error) { socket.emit('invalid', error.message) }
        })
        socket.on('end', () => {
            try {
                game.end()
                socket.emit('state', game.getState())
            } catch (error) { socket.emit('invalid', error.message) }
        })
        socket.on('attack', cardId => {
            try {
                game.attack(cardId)
                socket.emit('state', game.getState())
            } catch (error) { socket.emit('invalid', error.message) }
        })
    } catch (error) {
        socket.emit('error', error)
    }
    
});

http.listen(4020, function () {
    console.log('listening on *:4020')
})

