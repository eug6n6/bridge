const id = require('shortid')
const rules = require('./rules')
const Player = require('./player')
const { Deck, Pile } = require('./containers')

class Game {

    currentPlayer = null
    players = []
    clients = []

    ended = false
    playNumber = 0

    // _lastSkipper = null

    constructor(playersNumber) {
        this.createdAt = new Date()
        this.players = Array.from(new Array(playersNumber))
                            .map((_, i) => new Player('', i + 1))
        this.id = id.generate()
    }

    start() {
        this.deck = new Deck().fill().shuffle()
        this.pile = new Pile()
        this.playNumber++
        this.ended = false
        this.currentPlayer = null
        this.players.forEach(player => {
            player.cards = []
            this.deck.moveLastCardTo(player, 5)
            player.winner = false
            player.skip = 0
            player.cardsTaken = 0
            player.cardsPut = 0
        })
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
            return this.players[nextIndex]
        }
        let player = next(this.currentPlayer)
        while (player !== this.currentPlayer) {
            if (!player.skip) {
                player.skip = 1
                break
            }
            player = next(player)
        }
    }
    takeCard() {
        if (this.deck.cards.length < 5) {
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
        this.currentPlayer.winner = true
        this.players.forEach(player => player.points.push(rules.getPoints(player.cards)))
        const winner = this.players.reduce((winner, player) => 
            player.points[player.points.length -1] < winner.points[winner.points.length - 1]
                ? player : winner, 
            this.players[0]
        )
        winner.winner = true
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
            this.currentPlayer.skip = 0
            this.currentPlayer = this.getNextPlayer()
        }
        this.currentPlayer.cardsTaken = 0
        this.currentPlayer.cardsPut = 0
    }

    getState(playerId) {
        const gameState = {
            id: this.id,
            deck: this.deck.cards.length,
            pile: this.pile.cards.map(card => card.id),
            ended: this.ended,
            players: this.players.map(player => {
                return {
                    ...player.getData(),
                    current: player === this.currentPlayer,
                    cards: player.cards.length,
                }
            })
        }

        const player = this.players.find(player => player.id === playerId)
        if (player) {
            const _player = {
                ...player.getData(),
                current: player === this.currentPlayer,
                cards: player.cards.filter(card => card).map(card => card.id)
            }
            if (_player.current) {
                _player.canEnd = rules.canEnd(this.currentPlayer, this.pile)
                _player.canSkip = rules.canSkip(this.pile, this.currentPlayer)
                _player.canTake = rules.canTake(this.pile, this.currentPlayer)
                _player.canCoverWith = this.currentPlayer.cards.filter(card =>
                    rules.cardCanCover(card, this.pile, this.currentPlayer)
                ).map(card => card.id)
            }
            gameState.player = _player
        }

        return gameState
    }

}

module.exports = Game
