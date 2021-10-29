import { createServer, Server } from 'net'
import SocketHostService from './SocketHostService'
import write from 'stream-write'

class TcpHostService extends SocketHostService {
  readonly server: Server
  key = 'tcp'

  constructor (port: number) {
    super(port)

    this.server = createServer(socket => {
      console.log('COnnection')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.onConnection(new Proxy(socket, {
        get: (target, p, receiver) => {
          if (p === 'write') {
            return async (data: string | Uint8Array): Promise<void> => {
              await write(target, data)
            }
          }
          if (p === Symbol.asyncIterator) return socket[Symbol.asyncIterator].bind(socket)
          return Reflect.get(target, p, receiver)
        }
      }) as any)
    })

    this._start()
  }
}

export default TcpHostService
