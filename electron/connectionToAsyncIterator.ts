import { connection as Connection, Message } from 'websocket'
import { once } from 'events'

async function * connectionToAsyncIterator (connection: Connection): AsyncGenerator<Buffer> {
  while (true) {
    const [message] = await Promise.race([
      once(connection, 'message') as Promise<[Message]>,
      once(connection, 'close') as Promise<[number]>
    ])
    if (typeof message === 'number') return
    if (message.type === 'utf8') yield Buffer.from(message.utf8Data)
    else yield message.binaryData
  }
}

export default connectionToAsyncIterator
