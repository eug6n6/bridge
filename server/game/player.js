const { Container } = require('./containers')

class Player extends Container {
    client = null
    online = false

    skip = 0
    cardsTaken = 0
    cardsPut = 0
    
    points = 0
    winner = false

    constructor(name, id) {
        super()
        this.name = name
        this.id = id
    }
}

module.exports = Player
