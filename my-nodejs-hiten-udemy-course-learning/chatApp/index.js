const ChatRoom = require('./chatRoom')
const chatRoom = require('./chatRoom')

const chat = new ChatRoom()

chat.on('join', (user) => {
  console.log(`🟢 ${user} has joined the chat.`)
})

chat.on('message', ({ user, message }) => {
  console.log(`💬 ${user}: ${message}`)
})

chat.on('leave', (user) => {
  console.log(`🔴 ${user} has left the chat.`)
})

// Simulating chat room activity
chat.join('Alice')
chat.sendMessage('Alice', 'Hello everyone!')
chat.join('Bob')
chat.sendMessage('Bob', 'Hi Alice!')
chat.leave('Alice')
chat.sendMessage('Alice', 'Goodbye!') // This should show that Alice is not in the chat room
