const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const Game = require('./game')


const GAMES = {}
setInterval(() => {
    Object.keys(GAMES).filter(id => {
        const d = new Date()
        d.setMinutes(d.getMinutes() - 10)
        return GAMES[id].createdAt < d
    }).filter(id => 
        !GAMES[id].players.some(player => player.online)
    ).forEach(id => delete GAMES[id])
}, 20000)


const emitState = (client) => {
    if (!client.game) return
    client.game.players.forEach(player => {
        player.online =  client.game.clients.some(client => client.playerId === player.id)
    })
    client.game.clients.forEach(client => {
        client.emit('state', client.game.getState(client.playerId))
    })
}
const emitNotification = (game, text) => {
    game.clients.forEach(client => {
        client.emit('notification', text)
    })
}


const onAction = (client, action, data) => {
    try {
        switch (action) {
            case 'start':
                const game = new Game(data)
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
    try {
        const gameId = client.handshake.query.game
        const playerId = +client.handshake.query.player || null

        if (!gameId) {
            if (playerId)
                return client.emit('req_error', 'player not found')
            client.on('start', data => onAction(client, 'start', data))
        } else {
            const game = GAMES[gameId]
            if (!game)
                return client.emit('req_error', 'game not found')
            
            client.gameId = game.id
            client.game = game
            game.clients.push(client)
            const player = game.players.find(player => player.id === playerId)
            client.on('disconnect', () => {
                game.clients.splice(game.clients.indexOf(client), 1)
                if (player && !game.clients.some(client => client.gameId === game.id))
                    player.online = false
                emitState(client)
            })
            if (playerId && !player)
                return client.emit('req_error', 'player not found')
    
            if (!playerId) {
                client.emit('state', game.getState())
                client.on('username', username => {
                    const player = game.players.find(player => !player.name)
                    if (!player) return client.emit('req_error', 'player not found')
                    player.name = username
                    client.emit('redirect_to_game', { gameId: game.id, playerId: player.id })
                })
                return
            }
    
            client.playerId = player.id
            player.online = true

            client.on('restart', () => {
                game.start()
                emitState(client)
            })

            emitState(client)
    
            client.on('skip', data => onAction(client, 'skip', data))
            client.on('take', data => onAction(client, 'take', data))
            client.on('end', data => onAction(client, 'end', data))
            client.on('attack', data => onAction(client, 'attack', data))
            client.on('notification', data => emitNotification(game, data))
        }

    } catch (error) {
        client.emit('error', error)
    }
})



// });

app.use(express.static('build'))
app.get('/', (req, res) => res.sendfile('./build/index.html'))
app.use('/public', express.static(__dirname + '/public'))

http.listen(4020, function () {
    console.log('listening on *:4020')
})

