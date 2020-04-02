const uuid = require('uuid').v4
const rules = require('./rules')
const Player = require('./player')
const { Deck, Pile } = require('./containers')

class Game {

    currentPlayer = null
    players = []

    ended = false
    playNumber = 0

    _lastSkipper = null

    constructor(playersNames) {
        this.players = playersNames.map((name, i) => new Player(name, i + 1))
        this.id = uuid()
    }

    start() {
        this.deck = new Deck().fill().shuffle()
        this.pile = new Pile()
        this.players.forEach(player =>
            this.deck.moveLastCardTo(player, 5)
        )
        this._nextPlayer()
        this.attack(this.players[0].getLastCard().id, 'start')
    }

    attack(cardId, start = false) {
        const card = this.currentPlayer.getCardById(cardId)
        if (!start && !rules.cardCanCover(card, this.pile, this.currentPlayer))
            throw new Error('Invalid move')
        this.currentPlayer.moveCardTo(card, this.pile)
        let cardsToTake = rules.cardMakeTake(card)
        while (cardsToTake-- > 0) this.deck.moveLastCardTo(this.getNextPlayer())
        if (rules.cardMakeSkip(card))
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
        if (this.deck.cards.length < 2 ) {
            this.pile.moveToDeck(this.deck)
        }
        if (!rules.canTake(this.pile, this.currentPlayer))
            throw new Error('Tou cannot take')
        this.deck.moveLastCardTo(this.currentPlayer)
        this.currentPlayer.cardsTaken++
    }
    skip() {
        if (!rules.canSkip(this.pile, this.currentPlayer))
            throw new Error('You cannot skip')
        this._nextPlayer()
    }
    end() {
        if (!rules.canEnd(this.currentPlayer, this.pile))
            throw new Error('You cannot end')
        this.ended = true
        // TODO false on start
        this.currentPlayer.winner = true
        this.players.forEach(player => player.points += rules.getPoints(player.cards))
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
                online: player.online,
                skip: player.skip,
                cards: player.cards.map(card => card.id),
                current: false,
                winner: player.winner,
                points: player.points
            }
            if (player === this.currentPlayer) {
                _player.current = true
                _player.canEnd = rules.canEnd(this.currentPlayer, this.pile)
                _player.canSkip = rules.canSkip(this.pile, this.currentPlayer)
                _player.canTake = rules.canTake(this.pile, this.currentPlayer)
                _player.canCoverWith = _player.canEnd ? [] : this.currentPlayer.cards.filter(card =>
                    rules.cardCanCover(card, this.pile, this.currentPlayer)
                ).map(card => card.id)
            }
            return _player
        })
        return {
            id: this.id,
            players,
            deck: this.deck.cards.length,
            pile: this.pile.cards.map(card => card.id),
            ended: this.ended
        }
    }

}

module.exports = Game
