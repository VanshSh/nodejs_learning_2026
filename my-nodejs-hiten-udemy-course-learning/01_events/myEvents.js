const EventEmitter = require('events')
console.log('😇 L-1 in myEvents.js=> ', EventEmitter)

const eventEmitter = new EventEmitter()

eventEmitter.on('greet', (name) => {
  console.log('😇 Hello Event Emitter', name)
})

eventEmitter.once('pushNotify', () => {
  console.log('😇 This will run only once ')
})

const myListener = () => {
  console.log('😇 This is another test listener ')
}

eventEmitter.on('test', myListener)

// Emit the event
eventEmitter.emit('greet', 'Vansh')
eventEmitter.emit('greet', 'Anuj')
eventEmitter.emit('pushNotify')
eventEmitter.emit('pushNotify') // it will not run
eventEmitter.emit('test')
eventEmitter.removeListener('test', myListener)
eventEmitter.emit('test') // it will not run
console.log('😇 L-26 in myEvents.js=> ')
console.log(eventEmitter.listeners('greet'))

// Class Approach

class Chat extends EventEmitter {
  sendMessage(message) {
    this.emit('messageReceived', message)
  }
}

const chat = new Chat()
chat.on('messageReceived', (msg) => {
  console.log('New Message: ', msg)
})

chat.sendMessage('Hello! How are you?')
