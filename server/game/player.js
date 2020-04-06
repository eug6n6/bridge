const { Container } = require('./containers')

class Player extends Container {
    client = null
    online = false

    skip = 0
    cardsTaken = 0
    cardsPut = 0
    
    points = []
    winner = false

    constructor(name, id) {
        super()
        this.name = name
        this.id = id
    }

    getData() {
        return {
            id: this.id, 
            name: this.name, 
            online: this.online, 
            skip: this.skip, 
            winner: this.winner, 
            points: this.points
        }
    }
}

module.exports = Player
