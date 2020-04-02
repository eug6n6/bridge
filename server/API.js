const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const Game = require('./game')
const { generateName } = require('./utils')


const GAMES = {}


const emitState = (client) => {
    if (!client.game) return
    client.game.players.filter(player => player.client).forEach(player => {
        player.client.emit('state', client.game.getState())
    })
}


const onAction = (client, action, data) => {
    try {
        switch (action) {
            case 'start':
                const names = Array.from(new Array(data)).map(() => generateName())
                const game = new Game(names)
                GAMES[game.id] = game
                game.start()
                return client.emit('started', game.getState())
            case 'skip':
                client.game.skip()
                return emitState(client)
            case 'take':
                client.game.takeCard()
                return emitState(client)
            case 'end':
                client.game.end()
                return emitState(client)
            case 'attack':
                client.game.attack(data)
                return emitState(client)
            default: return
        }
    } catch (error) { 
        console.error(error)
        client.emit('invalid', error.message) 
    }
}

io.on('connection', function (client) {

    const gameId = client.handshake.query.game
    const playerId = client.handshake.query.player

    if (gameId) client.game = GAMES[gameId]
    if (playerId) client.player = playerId
    if (client.game && client.player) {
        client.game.players[client.player - 1].client = client
    }

    console.log('Connected ' + gameId + '-' + playerId)

    try {
        if (client.game && !client.player)
            client.emit('state', client.game.getState())
        if (!client.game)
            client.on('start', data => onAction(client, 'start', data))
        if (client.game && client.player) {
            client.game.players[client.player - 1].online = true
            emitState(client)

            client.on('skip', data => onAction(client, 'skip', data))
            client.on('take', data => onAction(client, 'take', data))
            client.on('end', data => onAction(client, 'end', data))
            client.on('attack', data => onAction(client, 'attack', data))
        }
    } catch (error) {
        client.emit('error', error)
    }

    client.on('disconnect', () => {
        if (client.game && client.player) {
            const player = client.game.players[client.player - 1]
            player.online = false
            player.client = null
            emitState(client)
        }
            
    })

});

http.listen(4020, function () {
    console.log('listening on *:4020')
})


// app.get('/', function (req, res) {
//     res.send('<h1>Hello world</h1>');
// })