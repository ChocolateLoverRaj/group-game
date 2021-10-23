import { createServer, Server } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import webSocketToIterator from '../common/webSocketToIterator'
import SocketHostService, { Connection } from './SocketHostService'

const getConnection = (socket: WebSocket): Connection => new Proxy(socket, {
  get: (target, p, receiver) => {
    switch (p) {
      case Symbol.asyncIterator:
        return () => webSocketToIterator(socket)[Symbol.asyncIterator]()
      case 'write':
        return (data: Uint8Array | string) => socket.send(data)
      case 'destroy':
        return socket.terminate.bind(socket)
      case 'end':
        return socket.close.bind(socket)
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
    new WebSocketServer({ server: this.server })
      .on('connection', socket => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.onConnection(getConnection(socket))
      })

    this._start()
  }
}

export default WsHostService
