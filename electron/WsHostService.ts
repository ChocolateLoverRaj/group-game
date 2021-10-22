import { createServer, Server } from 'http'
import type { connection as WsConnection, server as TWsServer } from 'websocket'
import connectionToAsyncIterator from './connectionToAsyncIterator'
import SocketHostService, { Connection } from './SocketHostService'

const { server: WsServer } = window.require('websocket') as { server: typeof TWsServer}

const getConnection = (connection: WsConnection): Connection => new Proxy(connection, {
  get: (target, p, receiver) => {
    switch (p) {
      case Symbol.asyncIterator:
        return () => connectionToAsyncIterator(connection)[Symbol.asyncIterator]()
      case 'write':
        return (data: Uint8Array | string) => connection.sendBytes(Buffer.from(data))
      case 'destroy':
        return connection.drop.bind(connection)
      case 'end':
        return connection.close.bind(connection)
    }
    return Reflect.get(target, p, receiver)
  }
}) as any

class WsHostService extends SocketHostService {
  readonly server: Server
  readonly key = 'ws'

  constructor (port: number) {
    super(port)

    this.server = createServer((_req, res) => {
      res.statusCode = 404
      res.end()
    })
    new WsServer({ httpServer: this.server })
      .on('request', request => {
        const connection = request.accept()
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.onConnection(getConnection(connection))
      })

    this._start()
  }
}

export default WsHostService
