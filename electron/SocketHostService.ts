import { once } from 'events'
import { Server } from 'net'
import { HostService } from '../common/Api'
import { action, flow, makeObservable, observable, runInAction } from 'mobx'
import flattenAsyncIterable from '../common/flattenAsyncIterator'
import readAsyncIterator from '../common/readAsyncIterator'
import { game } from '../common/Game'
import NameStatusEnum from '../common/NameStatusEnum'
import TcpEvents from '../common/TcpEvents'
import { Duplex } from 'stream'

export interface Connection extends Pick<Duplex, 'destroy' | 'end' | 'write'> {
  [Symbol.asyncIterator]: Duplex[typeof Symbol.asyncIterator]
  once: (event: string, handler: (...args: any[]) => void) => void
}

/**
 * Abstract HostService for tcp-like host services
 */
abstract class SocketHostService extends HostService {
  abstract readonly server: Server
  readonly port: number
  readonly connections: Set<Connection> = new Set()
  readonly _players: Map<string, Connection> = new Map()

  async onConnection (connection: Connection): Promise<void> {
    this.connections.add(connection)
    connection.once('close', action(() => this.connections.delete(connection)))
    const iterable = flattenAsyncIterable<number>(connection)
    const nameLength = (await iterable.next()).value
    const name = Buffer.from(await readAsyncIterator(iterable, nameLength)).toString()
    const nameTaken = game.players.has(name)
    connection.write(new Uint8Array([
      !nameTaken ? NameStatusEnum.OK : NameStatusEnum.CONFLICT
    ]))
    if (nameTaken) return connection.end()
    runInAction(() => {
      this._players.set(name, connection)
      game.onPlayerJoin(name)
    })
    connection.once('close', action(() => {
      this._players.delete(name)
      game.onPlayerLeave(name)
    }))
    connection.write(new Uint8Array([game.players.size]))
    for (const player of game.players.keys()) {
      connection.write(new Uint8Array([player.length]))
      connection.write(player)
    }
  }

  constructor (port: number) {
    super()

    this.port = port

    makeObservable(this, {
      _stop: flow,
      _start: flow,
      _players: observable,
      onConnection: action
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get players () {
    return new Map([...this._players.keys()].map(name => [name, undefined]))
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  * _start () {
    this.server.listen(this.port)
    yield once(this.server, 'listening')
    this.afterStarted()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  * _stop () {
    this.server.close()
    for (const connection of this.connections) connection.destroy()
    yield once(this.server, 'close')
    this.afterStopped()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async stop () {
    this._stop()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onPlayerJoin (name: string) {
    ;[...this._players]
      .filter(([currentName]) => currentName !== name)
      .map(async ([, socket]) => {
        socket.write(new Uint8Array([TcpEvents.PLAYER_JOIN]))
        socket.write(new Uint8Array([name.length]))
        socket.write(name)
      })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onPlayerLeave (name: string) {
    ;[...this._players]
      .filter(([currentName]) => currentName !== name)
      .map(async ([, socket]) => {
        socket.write(new Uint8Array([TcpEvents.PLAYER_LEAVE]))
        socket.write(new Uint8Array([name.length]))
        socket.write(name)
      })
  }
}

export default SocketHostService
