const buffer = require('buffer')

const buf1 = Buffer.from('Hello ')
const buf2 = Buffer.from('World')
const buf3 = Buffer.concat([buf1, buf2])
console.log(buf3.toString())
// Output: Hello World
console.log(buf3.toString('utf-8'))
// Output: Hello World
console.log(buf3.toString('hex'))
// Output: 48656c6c6f20576f726c64
console.log(buf3.toString('base64'))
// Output: SGVsbG8gV29ybGQ=
console.log(buf3.length)
// Output: 11
const buf4 = Buffer.alloc(10)
console.log(buf4)
// Output: <Buffer 00 00 00 00 00 00 00 00 00 00>
buf4.fill('a')
console.log(buf4.toString())
// Output: aaaaaaaaaa
const buf5 = Buffer.allocUnsafe(10)
console.log(buf5)
