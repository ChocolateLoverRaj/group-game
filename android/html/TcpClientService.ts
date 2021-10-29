import SimpleEventEmitter from '../../common/SimpleEventEmitter'
import SocketClientService, { CommonSocket } from '../../common/SocketClientService'
import setupAndroidPromise from './setupAndroidPromise'

class TcpClientService extends SocketClientService {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async connect () {
    const socket: CommonSocket = {
      destroy () {
        const promise = setupAndroidPromise<[]>()
        Android.socketClose(promise.thenId, promise.catchId)
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        promise.then(() => {
          this.closeEmitter.emit()
        })
      },
      closeEmitter: new SimpleEventEmitter<[]>(),
      readable: false,
      writable: false,
      write: async data => {
        const promise = setupAndroidPromise<[]>()
        Android.socketWrite(promise.thenId, promise.catchId,
          typeof data === 'string' ? new TextEncoder().encode(data).slice() : data)
        await promise
      },
      [Symbol.asyncIterator]: async function * () {
        while (true) {
          const promise = setupAndroidPromise<[number]>()
          Android.socketRead(promise.thenId, promise.catchId)
          console.log('reading socket')
          yield promise
          console.log('read socket')
        }
      }
    }

    const promise = setupAndroidPromise<[]>()

    Android.joinTcp(promise.thenId, promise.catchId, this.host, this.port)

    await promise

    return socket
  }
}

export default TcpClientService
