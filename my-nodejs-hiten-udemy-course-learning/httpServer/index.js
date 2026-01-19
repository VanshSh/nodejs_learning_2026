const http = require('http')

// Simple data storage (array of items)
let items = [
  { id: 1, name: 'Apple', color: 'Red' },
  { id: 2, name: 'Banana', color: 'Yellow' },
]

let nextId = 3

// Helper function to parse request body
function parseBody(req, callback) {
  let body = ''

  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', () => {
    try {
      const data = JSON.parse(body)
      callback(data)
    } catch (err) {
      callback(null)
    }
  })
}

// Helper function to send response
function sendResponse(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(message, null, 2))
}

// Create server
const server = http.createServer((req, res) => {
  const method = req.method
  const url = req.url

  console.log(`${method} ${url}`)

  // GET all items
  if (url === '/items' && method === 'GET') {
    sendResponse(res, 200, items)
    return
  }

  // GET single item by ID
  if (url.startsWith('/items/') && method === 'GET') {
    const id = parseInt(url.split('/')[2])
    const item = items.find((item) => item.id === id)

    if (item) {
      sendResponse(res, 200, item)
    } else {
      sendResponse(res, 404, { error: 'Item not found' })
    }
    return
  }

  // CREATE new item
  if (url === '/items' && method === 'POST') {
    parseBody(req, (data) => {
      if (!data || !data.name) {
        sendResponse(res, 400, { error: 'Name is required' })
        return
      }

      const newItem = {
        id: nextId,
        name: data.name,
        color: data.color || 'Unknown',
      }

      items.push(newItem)
      nextId++

      sendResponse(res, 201, newItem)
    })
    return
  }

  // UPDATE item
  if (url.startsWith('/items/') && method === 'PUT') {
    const id = parseInt(url.split('/')[2])
    const item = items.find((item) => item.id === id)

    if (!item) {
      sendResponse(res, 404, { error: 'Item not found' })
      return
    }

    parseBody(req, (data) => {
      if (data.name) item.name = data.name
      if (data.color) item.color = data.color

      sendResponse(res, 200, item)
    })
    return
  }

  // DELETE item
  if (url.startsWith('/items/') && method === 'DELETE') {
    const id = parseInt(url.split('/')[2])
    const index = items.findIndex((item) => item.id === id)

    if (index === -1) {
      sendResponse(res, 404, { error: 'Item not found' })
      return
    }

    const deletedItem = items.splice(index, 1)[0]
    sendResponse(res, 200, { message: 'Item deleted', item: deletedItem })
    return
  }

  // 404 - Route not found
  sendResponse(res, 404, { error: 'Route not found' })
})

// Start server
const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
