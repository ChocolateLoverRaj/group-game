import { ClientService } from './Api'
import { action, flow, makeObservable, observable, runInAction } from 'mobx'
import { game } from './Game'
import NameStatusEnum from './NameStatusEnum'
import NameTakenError from './NameTakenError'
import readAsyncIterator from './readAsyncIterator'
import flattenAsyncIterable from './flattenAsyncIterator'
import { message } from 'antd'
import TcpEvents from './TcpEvents'
import { Duplex } from 'stream'
import SimpleEventEmitter from './SimpleEventEmitter'

export interface CommonSocket extends Pick<Duplex, 'readable' | 'writable' | 'destroy'> {
  [Symbol.asyncIterator]: Duplex[typeof Symbol.asyncIterator]
  closeEmitter: SimpleEventEmitter<[]>
  write: (data: Uint8Array | string) => Promise<void>
}

abstract class SocketClientService extends ClientService {
  readonly host: string
  readonly port: number
  socket?: CommonSocket = undefined
  readonly unexpectedCloseHandler: () => void

  constructor (host: string, port: number) {
    super()

    this.host = host
    this.port = port

    makeObservable(this, {
      _stop: flow,
      socket: observable,
      start: action,
      _afterJoin: action,
      onUnexpectedClose: action
    })

    this.unexpectedCloseHandler = this.onUnexpectedClose.bind(this)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get connected () {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return Boolean(this.socket?.readable && this.socket.writable)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  * _stop () {
    if (this.socket === undefined) {
      throw new Error('Cannot stop this service because it was never started')
    }
    this.socket.closeEmitter.off(this.unexpectedCloseHandler)
    this.socket.destroy()
    yield this.socket.closeEmitter.once()
    this.afterStopped()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  stop () {
    this._stop()
  }

  onUnexpectedClose (): void {
    game.playing = false
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    message.error('The connection to the server was closed')
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async _afterJoin (iterator: AsyncIterator<any>) {
    const numberOfPlayers = (await iterator.next()).value
    this.socket?.closeEmitter.on(this.unexpectedCloseHandler, true)
    for (let i = 0; i < numberOfPlayers; i++) {
      const nameLength = (await iterator.next()).value
      const name = new TextDecoder().decode(new Uint8Array(await readAsyncIterator(iterator, nameLength))).toString()
      runInAction(() => this.players.set(name, undefined))
    }
    while (true) {
      const { value: event, done: done0 } = (await iterator.next())
      if (done0 === true) break
      if (event === TcpEvents.STOP) return this.socket?.closeEmitter.emit()
      const { value: playerNameLength, done: done1 } = await iterator.next()
      if (done1 === true) break
      const playerName = new TextDecoder().decode(new Uint8Array(await readAsyncIterator(iterator, playerNameLength))).toString()
      if (playerName.length < playerNameLength) break
      runInAction(() => {
        if (event === TcpEvents.PLAYER_JOIN) this.players.set(playerName, undefined)
        else this.players.delete(playerName)
      })
    }
  }

  abstract connect (): Promise<CommonSocket>

  async start (): Promise<void> {
    this.socket = await this.connect()
    console.log('Connected')
    await this.socket.write(new Uint8Array([game.myName.length]))
    console.log('Wrote name length')
    await this.socket.write(game.myName)
    console.log('Wrote name')
    const iterator = flattenAsyncIterable<number>(this.socket)
    console.log('Waiting for name status')
    const nameStatus = (await iterator.next()).value
    console.log('Got name status')
    if (nameStatus === NameStatusEnum.CONFLICT) throw new NameTakenError()
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._afterJoin(iterator)
  }
}

export default SocketClientService
