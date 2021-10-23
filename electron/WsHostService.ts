import { createServer, Server } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import webSocketToIterator from '../common/webSocketToIterator'
import SocketHostService, { Connection } from './SocketHostService'
import { createReadStream } from 'fs'
import { join } from 'path'

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

const isProduction = process.env.npm_package_version === undefined

class WsHostService extends SocketHostService {
  readonly server: Server
  readonly key = 'ws'

  constructor (port: number) {
    super(port)

    this.server = createServer((_req, res) => {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html')
      createReadStream(join(
        isProduction ? process.resourcesPath : process.cwd(), 'webSocketHttp.html')).pipe(res)
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
