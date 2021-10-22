import { createServer, Server } from 'net'
import SocketHostService from './SocketHostService'

class TcpHostService extends SocketHostService {
  readonly server: Server
  key = 'tcp'

  constructor (port: number) {
    super(port)

    this.server = createServer(socket => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.onConnection(socket)
    })

    this._start()
  }
}

export default TcpHostService
