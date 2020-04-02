const { Container } = require('./containers')

class Player extends Container {
    client = null
    online = false

    points = 0
    skip = 0
    cardsTaken = 0
    cardsPut = 0

    constructor(name, id) {
        super()
        this.name = name
        this.id = id
    }
}

module.exports = Player
