import { ClientService } from '../common/Api'
import { Socket, connect } from 'net'
import { action, flow, makeObservable, observable, runInAction } from 'mobx'
import { once } from 'events'
import { game } from '../common/Game'
import NameStatusEnum from '../common/NameStatusEnum'
import NameTakenError from '../common/NameTakenError'
import readAsyncIterator from '../common/readAsyncIterator'
import flattenAsyncIterable from '../common/flattenAsyncIterator'
import { message } from 'antd'
import TcpEvents from '../common/TcpEvents'

class TcpClientService extends ClientService {
  readonly address: string
  readonly port: number
  socket?: Socket = undefined
  _connected = true
  readonly unexpectedCloseHandler: () => void

  constructor (address: string, port: number) {
    super()

    this.address = address
    this.port = port

    makeObservable(this, {
      _connected: observable,
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
    return this._connected
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  * _stop () {
    if (this.socket === undefined) {
      throw new Error('Cannot stop this service because it was never started')
    }
    this.socket.off('close', this.unexpectedCloseHandler)
    this.socket.destroy()
    yield once(this.socket, 'close')
    this._connected = false
    this.afterStopped()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  stop () {
    this._stop()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get host () {
    return 'Idk'
  }

  onUnexpectedClose (): void {
    game.playing = false
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    message.error('The connection to the server was closed')
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async _afterJoin (iterator: AsyncIterator<any>) {
    const numberOfPlayers = (await iterator.next()).value
    this.socket?.once('close', this.unexpectedCloseHandler)
    for (let i = 0; i < numberOfPlayers; i++) {
      const nameLength = (await iterator.next()).value
      const name = Buffer.from(await readAsyncIterator(iterator, nameLength)).toString()
      runInAction(() => this.players.set(name, undefined))
    }
    while (true) {
      const { value: event, done: done0 } = (await iterator.next())
      if (done0 === true) break
      const { value: playerNameLength, done: done1 } = await iterator.next()
      if (done1 === true) break
      const playerName = Buffer.from(await readAsyncIterator(iterator, playerNameLength)).toString()
      if (playerName.length < playerNameLength) break
      runInAction(() => {
        if (event === TcpEvents.PLAYER_JOIN) this.players.set(playerName, undefined)
        else this.players.delete(playerName)
      })
    }
  }

  async start (): Promise<void> {
    this.socket = connect(this.port, this.address)
    await once(this.socket, 'connect')
    this.socket.write(new Uint8Array([game.myName.length]))
    this.socket.write(game.myName)
    const iterator = flattenAsyncIterable(this.socket)
    const nameStatus = (await iterator.next()).value
    if (nameStatus === NameStatusEnum.CONFLICT) throw new NameTakenError()
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._afterJoin(iterator)
  }
}

export default TcpClientService
