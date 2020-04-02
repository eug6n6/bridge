
const { NAME, SUIT } = require('./card')

module.exports = {

    /**
     * Return true if player's card can cover current
     * @param {Card} card 
     * @param {Pile} pile 
     * @param {Player} player 
     * @returns {Boolean}
     */
    cardCanCover(card, pile, player) {
        const currentCard = pile.getLastCard()
        if (currentCard.name === NAME['6'] || player.cardsPut === 0)
            return card.name === currentCard.name
                || card.suit === currentCard.suit
                || card.name === NAME.JACK
        return card.name === currentCard.name
    },

    /**
     * Card make next player skip their turn
     * @param {Card} card 
     * @returns {Boolean}
     */
    cardMakeSkip(card) {
        return [
            NAME.ACE, NAME[9]
        ].includes(card.name)
    },

    /**
     * Return number of cards next player has to take
     * @param {Card} card 
     * @returns {Number}
     */
    cardMakeTake(card) {
        if (card.name === NAME[9]) return 2
        if (card.name === NAME[1]) return 1
        if (card.name === NAME.KING && card.suit === SUIT.HEARTS) return 5
        return 0
    },

    /**
     * Return true if player can skip their turn
     * @param {Pile} pile 
     * @param {Player} player 
     * @returns {Boolean}
     */
    canSkip(pile, player) {
        const currentCard = pile.getLastCard()
        return currentCard.name !== NAME['6'] 
            && (player.cardsTaken > 0 || player.cardsPut > 0)
    },

    /**
     * Returns true if player can take a card
     * @param {Pile} pile 
     * @param {Player} player 
     * @returns {Boolean}
     */
    canTake(pile, player) {
        return (player.cardsTaken < 1 && player.cardsPut === 0) 
            || pile.getLastCard().name === NAME['6']
    },

    /**
     * Return true if player can end the game
     * @param {Player} player 
     * @param {Pile} pile 
     * @returns {Boolean}
     */
    canEnd(player, pile) {
        return pile.getLastCard().name !== NAME['6'] && (
            !player.cards.length || pile.canEnd()
        )
    },

    getPoints(cards) {
        const POINTS = {
            [NAME[10]]: 10,
            [NAME.QUEEN]: 10,
            [NAME.KING]: 10,
            [NAME.ACE]: 15,
            [NAME.JACK]: 20
        }
        return cards.reduce((points, card) =>
            points + (POINTS[card.name] || 0)
        , 0) 
    }
}
