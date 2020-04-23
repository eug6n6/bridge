const { Container } = require('./containers')

class Player extends Container {
    client = null
    online = false

    skip = 0
    cardsTaken = 0
    cardsPut = 0
    
    _points = []
    winner = false

    constructor(name, id) {
        super()
        this.name = name
        this.id = id
    }

    set lastGamePoints(points) {
        this._points.push(points)
    }
    get lastGamePoints() {
        return this._points[this._points.length - 1] || 0
    }
    get points() {
        return this._points
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
