import { once } from 'events'
import { connect } from 'net'
import SimpleEventEmitter from '../common/SimpleEventEmitter'
import SocketClientService, { CommonSocket } from '../common/SocketClientService'

class TcpClientService extends SocketClientService {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async connect () {
    const socket = connect(this.port, this.host)
    const commonSocket: CommonSocket = {
      closeEmitter: new SimpleEventEmitter<[]>(),
      get destroy () {
        return socket.destroy.bind(socket)
      },
      get readable () {
        return socket.readable
      },
      get writable () {
        return socket.writable
      },
      write: async data => {
        socket.write(data)
      },
      get [Symbol.asyncIterator] () {
        return socket[Symbol.asyncIterator].bind(socket)
      }
    }

    socket.on('close', () => commonSocket.closeEmitter.emit())

    await once(socket, 'connect')

    return commonSocket
  }
}

export default TcpClientService
