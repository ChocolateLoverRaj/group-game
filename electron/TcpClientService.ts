import { connect } from 'net'
import SocketClientService from '../common/SocketClientService'

class TcpClientService extends SocketClientService {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  connect () {
    console.log('connecting')
    return connect(this.port, this.host)
  }
}

export default TcpClientService
