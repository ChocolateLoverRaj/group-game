import webSocketToIterator from './webSocketToIterator'
import SocketClientService, { CommonSocket } from './SocketClientService'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
class WebsocketConnection extends WebSocket implements CommonSocket {
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

  once (event: any, listener: any): any {
    if (event === 'connect') event = 'open'
    this.addEventListener(event, listener, { once: true })
    return this
  }

  off (event: any, listener: any): any {
    if (event === 'connect') event = 'open'
    this.removeEventListener(event, listener)
    return this
  }

  removeListener (event: any, listener: any): any {
    return this.off(event, listener)
  }

  write (data: any): boolean {
    this.send(data)
    // We don't know about any buffer limit
    return true
  }

  destroy () {
    this.close()
  }
}
/* eslint-enable @typescript-eslint/explicit-function-return-type */

class WsClientService extends SocketClientService {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  connect () {
    return new WebsocketConnection(`ws://${this.host}:${this.port}`)
  }
}

export default WsClientService
