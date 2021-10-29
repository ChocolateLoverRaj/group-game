import webSocketToIterator from './webSocketToIterator'
import SocketClientService, { CommonSocket } from './SocketClientService'
import SimpleEventEmitter from './SimpleEventEmitter'
import addEventListenerOnce from './addEventListenerOnce'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
class WebsocketConnection extends WebSocket implements CommonSocket {
  readonly closeEmitter = new SimpleEventEmitter<[]>()

  constructor (url: string) {
    super(url)

    this.addEventListener('close', () => this.closeEmitter.emit())
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  [Symbol.asyncIterator] () {
    return webSocketToIterator(this)
  }

  private get open (): boolean {
    return this.readyState === WebSocket.OPEN
  }

  get readable () {
    return this.open
  }

  get writable () {
    return this.open
  }

  async write (data: any) {
    this.send(data)
  }

  destroy () {
    this.close()
  }
}
/* eslint-enable @typescript-eslint/explicit-function-return-type */

class WsClientService extends SocketClientService {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async connect () {
    const connection = new WebsocketConnection(`ws://${this.host}:${this.port}`)
    await addEventListenerOnce(connection, 'open')
    return connection
  }
}

export default WsClientService
