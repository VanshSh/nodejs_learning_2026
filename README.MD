```
Since this is kind of my learning notes of nodejs so make it small , but don;t remove important stuff. and return the reply as same in the README.md file format in one code widget

I am learning Node js and today i learnt this topic

Event Queue , Event Loop, Thread Pool

so can you please make learning notes and summary for this so that in future i can just go through those notes and recall in README.md file

```





# Nodejs Learning from Hiten Udemy Course

### Chapter 1 - Introduction
- To run file in watch mode: `node --watch script.js`


🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚

### Chapter 2 - Node.js modules, `require` and the module wrapper

This section explains how Node.js loads modules, what `require` does, the module wrapper function, the main module types (built-in, third-party, and custom), and how module caching works.

### What is `require()`?

- `require(moduleId)` is the CommonJS mechanism to load modules in Node.js. `moduleId` can be:
	- a core (built-in) module name (e.g., `fs`, `path`),
	- a relative or absolute path to a local file (`./utils.js`, `../lib/index.js`), or
	- a package name from `node_modules` (third-party).

- When you call `require`, Node resolves the identifier, loads the file (or native module), wraps it in a module scope, executes it, caches the exported value, and returns `module.exports`.

Example:

```js
// custom module (utils.js)
exports.sum = (a, b) => a + b;

// usage
const { sum } = require('./utils');
console.log(sum(2, 3)); // 5
```

### The module wrapper function

Internally Node wraps each module's source in a function before evaluating it. The wrapper looks roughly like this:

```js
(function (exports, require, module, __filename, __dirname) {
	// your module code here
});
```

- This creates a private scope for each module so top-level variables don't leak to other modules or the global scope.
- The parameters give you access to `exports` (a shorthand for `module.exports`), `require`, the `module` object, and file path values.

Example showing wrapper-related behavior:

```js
// inside a module file (example.js)
const x = 1; // not global
module.exports = { x };

// when required elsewhere, only exported values are visible
```

### Types of modules

- Built-in (core) modules: shipped with Node.js (e.g., `fs`, `http`, `path`). Require them by name: `require('fs')`.
- Third-party modules: packages installed into `node_modules` via npm/pnpm/yarn. Require by package name: `require('express')`.
- Custom (local) modules: your project's files. Require by relative path: `require('./lib/my-module')`.

Resolution details (short):
- For relative paths, Node loads the exact file if present, or tries appending `.js`, `.json`, `.node`, or looks for an `index.js` inside a directory.
- For package names, Node resolves into `node_modules` directories following the module resolution algorithm (walking up parent directories until found).

### Module caching

- After a module is loaded and executed once, Node caches the returned `module.exports` object. Subsequent `require` calls for the same resolved module return the cached object — the module code is not re-executed.
- Cache key: the resolved absolute filename for file modules, or an internal key for core modules.

Implications & examples:

```js
// counter.js
let count = 0;
module.exports = { inc: () => ++count, get: () => count };

// a.js
const c = require('./counter');
c.inc();

// b.js
const c2 = require('./counter');
console.log(c2.get()); // 1 -> same cached instance as in a.js
```

- If you need a fresh copy, you can delete the cache entry: `delete require.cache[require.resolve('./counter')]` and then `require` again.

### Small contract (inputs/outputs, error modes)

- Inputs: `require(moduleId)` where `moduleId` is a string.
- Output: the module's `module.exports` value.
- Errors: will throw if the module cannot be resolved, if syntax errors occur during execution, or if native bindings fail to load.

### Common edge cases & notes

- Circular dependencies: modules that require each other may get partially-initialized exports (Node returns whatever `module.exports` contains at that moment). Design to avoid heavy initialization in top-level scope.
- JSON modules: `require('./data.json')` returns the parsed object.
- Native add-ons: `.node` files are binary modules and require appropriate build/tooling.


🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚
### Chapter 3 — node_modules and package-lock.json

- node_modules
	- The `node_modules` folder contains the installed package code used at runtime (all files for each dependency).
	- It's created/managed by package managers (npm, yarn, pnpm) when you run `install` commands.
	- Do NOT commit `node_modules` to version control. Add it to `.gitignore` because it's large, platform-specific, and reproducible from `package.json` + lockfile.
	- Different package managers handle layout differently (npm creates a flat-ish tree, pnpm uses a centralized store + symlinks). Expect differences in disk layout and deduplication.

- package-lock.json
	- `package-lock.json` is auto-generated by npm (and similarly `yarn.lock` / `pnpm-lock.yaml` for other managers).
	- It records the exact dependency tree (exact versions, resolved URLs, and integrity hashes) so installs are deterministic across machines and CI.
	- Commit the lockfile to source control for applications so collaborators and CI get identical installs.
	- In libraries/packages, teams sometimes avoid committing the lockfile to allow downstream consumers to control resolved versions; follow your project's policy.
	- Use `npm ci` in CI for fast, reproducible installs that strictly follow the lockfile. `npm install` may update the lockfile if versions are changed.
	- Don't edit the lockfile manually; update it via package manager commands (`npm install <pkg>@<version>`, `npm update`, `npm audit fix`, etc.).

- Best practices / quick notes
	- Add `node_modules/` to `.gitignore`. Commit `package-lock.json` (for apps) to ensure reproducible installs.
	- Use `npm ci` in CI pipelines and for clean installs from a lockfile; use `npm install` when intentionally adding/updating deps locally.
	- If dependency state gets corrupted, remove `node_modules` and reinstall (`rm -rf node_modules && npm install` on Unix; use appropriate PowerShell commands on Windows).
	- Be mindful of native add-ons: their binaries may be platform-specific and can require rebuilds after reinstall.


🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚

### Chapter 4 — builtin modules: the `node:` prefix and the `fs` module

This chapter covers three focused topics: what the `node:` prefix means when importing built-in modules, the most important methods and usage patterns in the `fs` (file system) module, and what `{ recursive: true }` does in common `fs` operations.

- What is `node:` in (for example) `node:fs`?
	- `node:` is an explicit scheme/prefix used to reference Node.js core (built-in) modules. Using `require('node:fs')` or `import 'node:fs'` tells Node to resolve the module from the core runtime directly.
	- Why use it?
		- Disambiguation: it prevents accidental resolution of a same-named package in `node_modules`. For example, if a package named `fs` existed in `node_modules`, `require('node:fs')` still picks the core `fs` module.
		- Clarity: makes your code's dependency clearly a runtime builtin rather than a third-party package.
		- Works with both CommonJS (`require('node:fs')`) and ESM (`import fs from 'node:fs'` or `import 'node:fs'`).
	- Notes and compatibility:
		- Functionally, `require('node:fs')` behaves the same as `require('fs')` — the prefix is a resolution hint. It does not change the API surface.
		- Supported in modern Node.js releases; it's a best-practice for unambiguous imports in shared codebases.

- Important methods and usages of the `fs` module (practical summary)
	- Dual APIs: synchronous, callback-based asynchronous, and promise-based (`fs.promises`). Prefer `fs.promises` (async/await) for clarity in modern apps and streams for large files.
	- Reading files
		- `fs.readFile(path, [options], callback)` — reads the whole file into memory (async callback).
		- `fs.readFileSync(path, [options])` — synchronous (blocks event loop); fine for small scripts or startup code but avoid in request handlers.
		- `fs.createReadStream(path[, options])` — streaming large files efficiently; use with `pipeline` from `stream/promises` or `stream` to handle backpressure.
	- Writing files
		- `fs.writeFile(path, data, [options], callback)` — writes (creates or replaces) a file asynchronously.
		- `fs.writeFileSync(path, data, [options])` — synchronous version (blocks event loop).
		- `fs.createWriteStream(path[, options])` — for streaming writes (pipe readable into writable stream).
		- `fs.appendFile(path, data, [options], callback)` — append data to a file (creates if missing).
	- Directory operations
		- `fs.readdir(path, [options], callback)` / `fs.readdirSync` — list directory entries.
		- `fs.mkdir(path, { recursive: true })` — create directory and parents (see `{ recursive: true }` below).
		- `fs.rmdir` historically removed empty directories; prefer `fs.rm(path, { recursive: true })` to remove non-empty directories (API evolves across Node versions — check your Node.js docs).
	- Inspecting files and metadata
		- `fs.stat(path, callback)` / `fs.lstat` / `fs.fstat` — get file metadata (size, timestamps, type). Use `lstat` to detect symlinks.
	- Removing files
		- `fs.unlink(path, callback)` — remove a file.
		- `fs.rm(path, { recursive: true, force: true })` — remove files or directories recursively and force deletion when needed.
	- File descriptors & lower-level API
		- `fs.open`, `fs.read`, `fs.write`, `fs.close` — useful when you need precise control or performant repeated reads/writes without reopening files.
	- Watching files
		- `fs.watch` and `fs.watchFile` — monitor filesystem changes (cross-platform differences exist; use carefully, consider debouncing and platform-specific caveats).
	- Promise-based API
		- `fs.promises` provides promise-returning variants of most methods (e.g., `await fs.promises.readFile(path, 'utf8')`). This is the recommended modern approach for async code.
	- Options you'll commonly use
		- `encoding` — `'utf8'`, `'base64'`, or `null` for Buffer. Example: `fs.readFile(path, { encoding: 'utf8' }, cb)`.
		- `flag` — control how the file is opened: `'r'`, `'w'`, `'a'`, `'r+'`, etc.
		- `mode` — permission bits for newly created files (e.g., `0o644`).

	- Practical patterns & recommendations
		- For small files: `fs.promises.readFile` / `fs.promises.writeFile` with try/catch.
		- For large files: streams + `pipeline` to avoid high memory usage.
		- Avoid synchronous methods (`*Sync`) in servers or code paths that must remain non-blocking.
		- Always handle errors from fs ops (missing file, EACCES permission errors, ENOENT, EEXIST, etc.).

- What is `{ recursive: true }`?
	- Context: used as an option in several directory-related APIs (most commonly `fs.mkdir(path, { recursive: true })` and directory removal methods like `fs.rm(path, { recursive: true })`).
	- For `fs.mkdir(path, { recursive: true })`:
		- Ensures parent directories are created as needed. Equivalent to `mkdir -p` on Unix.
		- If the directory already exists, the call will not throw an error (it behaves idempotently) — useful for safe initialization.
		- Example use-case: creating `./data/2026/01/07` in one call even if `./data` doesn't exist.
	- For removal (`fs.rm` / older `fs.rmdir`): `{ recursive: true }` instructs Node to recursively remove the directory and all its contents (files and subdirectories).
		- WARNING: recursive removal can delete a lot of data quickly. Use with extreme care and prefer to double-check paths or use safeguards (confirm path is inside expected workspace, avoid deleting root-like paths, or run a dry-run listing first).
	- Cross-version notes: exact method names/options have evolved across Node versions. `fs.rm` with `{ recursive: true }` is the modern recommended removal API. Historically `fs.rmdir(path, { recursive: true })` existed but was deprecated in some Node releases — check the docs for your Node version.

Small contract (inputs/outputs, error modes)
- Inputs: file or directory path (string or Buffer or URL), options objects with fields like `encoding`, `flag`, `recursive`, `mode`.
- Outputs: buffers, strings, file descriptors, lists of names, or nothing (for destructive ops). Promise-based APIs return promises that resolve with the result or reject with an Error.
- Errors: common error codes include `ENOENT` (not found), `EACCES` or `EPERM` (permission), `EEXIST` (exists), and `EBUSY` or `ENOTEMPTY` for certain removal operations.

Edge cases and gotchas
- Synchronous APIs block the event loop—don't use them in performance-sensitive server code.
- Race conditions: a file can be removed between a check (e.g., `stat`) and a subsequent operation (`open`). Use atomic patterns (e.g., `open` with flags) when possible.
- Permissions and platform differences: file modes and certain behaviors (like file watching granularity) vary between OSes.
- Large file handling: read whole-file APIs may cause out-of-memory for very large files; use streams instead.

Quick examples (conceptual):

- Using promises/async:

	- `const data = await fs.promises.readFile('./notes.txt', 'utf8');`

- Create nested dirs safely:

	- `await fs.promises.mkdir('./logs/2026/01/07', { recursive: true });`

- Remove directory tree (dangerous):

	- `await fs.promises.rm('./build', { recursive: true, force: true });`

🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚

### Chapter 5 — Event Loop, Event Queue, and Thread Pool


Node.js is **single-threaded** but still handles thousands of concurrent operations efficiently.
This is possible because of the **Event Loop**, **Event Queue**, and **Thread Pool**.

---

## 1️⃣ Event Queue

### What is it?
The **Event Queue** stores callbacks of **asynchronous operations** that are ready to be executed.

### Examples of tasks that go to Event Queue:
- `setTimeout`
- `setInterval`
- `setImmediate`
- Promise callbacks (`.then`)
- I/O callbacks (after completion)

### Key Point
👉 Tasks wait in queues **until the Event Loop picks them up**.

---

## 2️⃣ Event Loop

### What is it?
The **Event Loop** is the **heart of Node.js**.  
It continuously checks:
1. Is the Call Stack empty?
2. Is there any task waiting in queues?

If yes → it pushes the task to the Call Stack for execution.

---

### Event Loop Phases (simplified order)

1. **Timers Phase**
   - Executes `setTimeout`, `setInterval`

2. **I/O Callbacks Phase**
   - Network, file system callbacks

3. **Idle / Prepare**
   - Internal Node.js operations

4. **Poll Phase**
   - Fetch new I/O events
   - Executes I/O callbacks

5. **Check Phase**
   - Executes `setImmediate`

6. **Close Callbacks**
   - Cleanup like `socket.on('close')`

---

### Microtask Queue (High Priority)
Executed **after every phase**
- `process.nextTick()`
- Promise `.then()` / `.catch()`

⚠️ `process.nextTick()` runs **before Promises**

---

### Key Points
- Event Loop runs **continuously**
- Executes async code **without blocking**
- Microtasks have **higher priority** than normal callbacks

---

## 3️⃣ Thread Pool

### What is it?
Node.js uses a **Thread Pool (via libuv)** to handle **heavy or blocking operations**.

Default size: **4 threads**

---

### Operations handled by Thread Pool
- File system (`fs`)
- Crypto (`bcrypt`, hashing)
- Compression
- DNS lookup

These tasks run in **background threads**, not the main thread.

---

### Why Thread Pool is needed?
Node.js main thread must stay **free** to:
- Handle requests
- Execute callbacks
- Keep app responsive

---

## 4️⃣ How Everything Works Together

1. JS code runs on **Call Stack**
2. Async task is offloaded
   - I/O → OS
   - Heavy task → Thread Pool
3. Once done → callback enters **Event Queue**
4. Event Loop pushes it to **Call Stack**
5. Callback executes

---

## 5️⃣ Important Interview Points

- Node.js is **single-threaded but asynchronous**
- Event Loop enables **non-blocking I/O**
- Thread Pool handles **CPU-intensive tasks**
- Promises & `nextTick` run **before timers**
- Blocking the event loop = ❌ bad performance

---

## 6️⃣ One-Line Summary

> Node.js uses a **single-threaded event loop** with **queues and a thread pool** to handle async operations efficiently without blocking the main thread.

---

## 7️⃣ Mental Model (Easy Recall)

- **Call Stack** → executes JS
- **Thread Pool / OS** → does heavy work
- **Event Queue** → holds completed tasks
- **Event Loop** → traffic police 🚦

---

📌 Tip:
Never block the event loop with heavy synchronous code.

🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚

### Chapter-6 📦 Node.js EventEmitter – All-in-One Learning Widget

> Lightweight, event-driven communication system in Node.js  
> Used internally by Node (HTTP, Streams, FS) and widely in real-world apps


## 🔹 What is EventEmitter?

`EventEmitter` is a **core Node.js module** that enables different parts of an application to communicate using **events**.

- One part **emits** an event
- Other parts **listen** and **respond**

📌 Follows **Observer / Publish–Subscribe pattern**

---

## 🔹 Import & Create

```js
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()
````

---

## 🔹 Register Listeners

### `.on()` → Runs every time

```js
eventEmitter.on('greet', (name) => {
  console.log('😇 Hello Event Emitter', name)
})
```

### `.once()` → Runs only once

```js
eventEmitter.once('pushNotify', () => {
  console.log('😇 This will run only once')
})
```

---

## 🔹 Emit Events

```js
eventEmitter.emit('greet', 'Vansh')
eventEmitter.emit('greet', 'Anuj')

eventEmitter.emit('pushNotify')
eventEmitter.emit('pushNotify') // ❌ will not run again
```

---

## 🔹 Named Listener (Best Practice)

```js
const myListener = () => {
  console.log('😇 This is another test listener')
}

eventEmitter.on('test', myListener)
eventEmitter.emit('test')
```

✅ Use named functions to:

* remove listeners later
* avoid memory leaks

---

## 🔹 Remove Listener

```js
eventEmitter.removeListener('test', myListener)
eventEmitter.emit('test') // ❌ will not run
```

📌 Anonymous functions **cannot** be removed

---

## 🔹 Inspect Active Listeners

```js
console.log(eventEmitter.listeners('greet'))
```

* Returns array of listeners for the event
* Useful for debugging

---

## 🔹 Class-Based EventEmitter (Real-World Pattern)

```js
class Chat extends EventEmitter {
  sendMessage(message) {
    this.emit('messageReceived', message)
  }
}
```

### Usage

```js
const chat = new Chat()

chat.on('messageReceived', (msg) => {
  console.log('New Message:', msg)
})

chat.sendMessage('Hello! How are you?')
```

---

## 🔹 Execution Behavior (Important)

* EventEmitter is **synchronous**
* Listeners run in **registration order**
* Errors inside listeners can crash the app if unhandled

---

## 🔹 Common Use Cases

✅ Logging systems
✅ Notifications
✅ Chat / Messaging
✅ Background jobs
✅ Custom framework hooks

---

## 🔹 When NOT to Use

❌ Simple one-to-one function calls
❌ Async flow control → use **Promises / async-await**

---

## 🔹 Quick Mental Model 🧠

```
emit(event) ──▶ listeners react instantly
```

---

## 🔹 Interview Quick Hits ⭐

* Core module → `events`
* Pattern → Observer / Pub-Sub
* `.on()` vs `.once()`
* `.emit()` passes data
* `.removeListener()` needs same function reference

---

## 🔹 One-Line Summary

> **EventEmitter enables decoupled, event-driven communication inside Node.js applications.**

🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚

### Chapter 7 — 📢 Node.js EventEmitter – ChatRoom (Summary Notes)

## 🔹 What is EventEmitter?
`EventEmitter` is a core Node.js module that allows objects to **emit events** and other parts of the code to **listen and react** to those events.  
It follows the **event-driven (publish–subscribe) pattern**.

---

## 🔹 Why EventEmitter is Used Here
- To notify when a user **joins**, **sends a message**, or **leaves**
- To keep **business logic** and **event handling** separate
- To build a scalable, real-time–like system (chat simulation)

---

## 🔹 ChatRoom Class Overview
- `ChatRoom` **extends EventEmitter**
- Maintains users using a `Set` (prevents duplicates)
- Emits custom events instead of directly logging output

---

## 🔹 Custom Events
| Event     | Emitted When       | Data Passed         |
| --------- | ------------------ | ------------------- |
| `join`    | User joins chat    | `user`              |
| `message` | User sends message | `{ user, message }` |
| `leave`   | User leaves chat   | `user`              |

---

## 🔹 Important Methods
- `join(user)` → Adds user & emits `join`
- `sendMessage(user, message)` → Emits `message` if user exists
- `leave(user)` → Removes user & emits `leave`

---

## 🔹 Event Listeners
- `.on('event', callback)` listens continuously
- Each listener reacts **only when its event is emitted**
- Output logic lives outside the class

---

## 🔹 Key Concepts Demonstrated
- Event-driven architecture
- Class inheritance with `super()`
- Loose coupling between logic & effects
- Observer / Pub-Sub design pattern

---

## 🔹 Benefits of This Approach
✅ Clean & modular code  
✅ Easy to extend (add more events/listeners)  
✅ Ideal for real-time systems  
✅ Matches core Node.js design philosophy  

---

## 🔹 Real-World Use Cases
- Chat applications
- Notification systems
- Logging & analytics
- Streams, sockets, microservices

---

## 🔹 One-Line Takeaway
**EventEmitter helps build scalable, reactive systems by emitting events instead of tightly coupling logic and output.**


🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚

### Chapter 8 —📦 Node.js Buffer – Learning Notes (README)

## 🔹 What is a Buffer?
- A **Buffer** is a Node.js class used to handle **raw binary data**
- JavaScript strings are UTF-16, but Buffers work with **bytes**
- Buffers are fixed-size and allocated outside the V8 heap

### Common Use Cases
- File handling (`fs`)
- Streams
- Network data (TCP/HTTP)
- Encoding & decoding (UTF-8, Hex, Base64)

---

## 🔹 Importing Buffer
```js
const buffer = require('buffer')
````

> ℹ️ In modern Node.js, `Buffer` is global, so this import is optional.

---

## 🔹 Creating Buffers from Strings

```js
const buf1 = Buffer.from('Hello ')
const buf2 = Buffer.from('World')
```

* `Buffer.from()` converts strings into binary data
* Default encoding is **UTF-8**

---

## 🔹 Concatenating Buffers

```js
const buf3 = Buffer.concat([buf1, buf2])
```

* Combines multiple buffers into a single buffer
* Useful when handling **chunked or streamed data**

---

## 🔹 Converting Buffer to String

### Default Encoding (UTF-8)

```js
console.log(buf3.toString())
// Output: Hello World
```

### Explicit UTF-8

```js
console.log(buf3.toString('utf-8'))
// Output: Hello World
```

### Hex Encoding

```js
console.log(buf3.toString('hex'))
// Output: 48656c6c6f20576f726c64
```

* Each byte is shown as **two hexadecimal characters**
* Useful for debugging binary data

### Base64 Encoding

```js
console.log(buf3.toString('base64'))
// Output: SGVsbG8gV29ybGQ=
```

* Commonly used in:

  * JWT tokens
  * Image encoding
  * Emails

---

## 🔹 Buffer Length

```js
console.log(buf3.length)
// Output: 11
```

* Length is measured in **bytes**
* `"Hello World"` → 11 bytes

---

## 🔹 Allocating a Buffer (Safe)

```js
const buf4 = Buffer.alloc(10)
console.log(buf4)
// Output: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

* `Buffer.alloc()` initializes memory with zeros
* **Safe and recommended**

---

## 🔹 Filling a Buffer

```js
buf4.fill('a')
console.log(buf4.toString())
// Output: aaaaaaaaaa
```

* Fills the entire buffer with the given value
* `'a'` → ASCII value is written repeatedly

---

## 🔹 Allocating a Buffer (Unsafe)

```js
const buf5 = Buffer.allocUnsafe(10)
console.log(buf5)
```

* Memory is **not initialized**
* May contain **old or random data**
* Faster, but **must be overwritten before use**

⚠️ Use `allocUnsafe()` only when performance is critical and you overwrite immediately.

---

## 🔹 Key Takeaways

* Buffers store **raw binary data**
* Strings ≠ Buffers
* Use:

  * `Buffer.from()` → string to buffer
  * `Buffer.concat()` → combine buffers
  * `Buffer.alloc()` → safe memory
  * `Buffer.allocUnsafe()` → fast but risky
* Encoding matters (`utf-8`, `hex`, `base64`)


🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚
### Chapter 9- Basic HTTP Server in Node.js

```
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

```


🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚


### Chapter 10 — Sementic Versioning (SemVer) in Node.js
- Semantic Versioning (SemVer) is a versioning scheme for software that conveys meaning about the underlying changes.
- A version number is in the format: `MAJOR.MINOR.PATCH` (e.g., `1.4.2`).
- Each part has a specific meaning:
  - **MAJOR** version: Incremented for incompatible API changes.
  - **MINOR** version: Incremented for adding functionality in a backward-compatible manner.
  - **PATCH** version: Incremented for backward-compatible bug fixes.
  - Pre-release versions and build metadata can be added after the PATCH version (e.g., `1.0.0-alpha`, `1.0.0+build2012`).
  - Semantic Versioning helps developers understand the impact of updating dependencies and manage compatibility in their projects.
  - X.X.X => Major Minor Patch
  - ~4.21.1 => Patch updates allowed (4.21.x)
  - ^**4**.21.1 => Minor, and Patch updates allowed (4.x.x)
  - 

🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚🔚


### Chapter 11 — MVC
- MVC stands for Model-View-Controller, a software architectural pattern that separates an application into three main components:
  - **Model**: Represents the data and business logic of the application. It manages the data, rules, and logic of the application.
  - **View**: Represents the user interface and presentation layer. It displays data from the model to the user and sends user commands to the controller.
  - **Controller**: Acts as an intermediary between the Model and View. It processes user input, interacts with the model to retrieve or update data, and determines which view to display.
  - 