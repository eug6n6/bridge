const { Card, NAME, SUIT } = require('./card')


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
    canEnd() {
        const last4 = this.cards.slice(this.cards.length - 4, this.cards.length)
        if (!last4.length) return false
        const name = last4[0].name
        return last4.filter(card => card.name === name).length === 4
    }
 }


module.exports = { Container, Deck, Pile }
